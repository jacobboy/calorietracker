import * as uuid from 'uuid';
import { ReportNutrient, Report } from './ndbapi/classes';
import { scaleQuantity, round } from './transforms';
import {
  saveIngredient,
  saveRecipe,
  getIngredientKey,
  getNdbKey,
  getRecipeKey,
  getMealKey,
  getDateKey
} from './storage';

export enum MACROS {
  'fat' = 'fat',
  'carbs' = 'carbs',
  'protein' = 'protein'
}

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

function ingredientId() { return getIngredientKey(uuid.v4()); }
function ndbnoId(ndbno: string) { return getNdbKey(ndbno); }
function recipeId() { return getRecipeKey(uuid.v4()); }
function mealId() { return getMealKey(uuid.v4()); }
/* function dateId(date: string) { return getDateKey(date); } */

export enum FOOD_UNIT {
  'g' = 'g',
  'ml' = 'ml'
}

export interface Named {
  readonly name: string;
}

export interface UIDed {
  readonly uid: string;
}

export interface NDBed {
  readonly ndbno: string;
}

export abstract class Nutritional {
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;

  get fatPct() {
    return round(this.fat * 9 / this.calories, .01);
  }
  get carbsPct() {
    return round(this.carbs * 4 / this.calories, .01);
  }
  get proteinPct() {
    return round(this.protein * 4 / this.calories, .01);
  }
}

class NutritionalImpl extends Nutritional {
  constructor(
    readonly fat: number,
    readonly carbs: number,
    readonly protein: number,
    readonly calories: number
  ) { super(); }
}

export interface Quantifiable extends Named {
  readonly amount: number;
  readonly unit: string;
}

export abstract class Ingredient extends Nutritional implements Quantifiable, UIDed {
  readonly name: string;
  readonly amount: number;
  readonly unit: string;
  readonly uid: string;
}

export interface FoodCombo extends Nutritional {
  readonly foods: Ingredient[];
  withFood(Ingredient: Ingredient): FoodCombo;
  withoutFood(Ingredient: Ingredient): FoodCombo;
}

/*
 * Why is this separate from Recipe?
 */
export interface Meal extends FoodCombo, UIDed {
  foods: Ingredient[];  // TODO Shouldn't actually expose this
  withFood(food: Ingredient): Meal;
  withoutFood(food: Ingredient): Meal;
}

class NDBIngredient extends Ingredient implements NDBed {
  readonly ndbno: string;
  readonly name: string;
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;
  readonly amount: number;
  readonly unit: FOOD_UNIT;
  readonly uid: string;

  static fromReport(report: Report): NDBIngredient {
    const ndbno = report.food.ndbno;
    const name = report.food.name;
    const calories = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, CALORIES_ID)
    );
    const protein = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, PROTEIN_ID)
    );
    const fat = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, FAT_ID)
    );
    const carbs = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, CARB_ID)
    );
    const amount = 100;  // pretty sure it's always 100?
    const unit = FOOD_UNIT[report.food.ru];
    return new NDBIngredient(ndbno, name, fat, carbs, protein, calories, amount, unit);
  }

  static fromJson(jsonStr: string): NDBIngredient {
    const {
      ndbno, name, fat, carbs, protein, calories, amount, unit
    } = JSON.parse(jsonStr);
    return new NDBIngredient(
      ndbno, name, fat, carbs, protein, calories, amount, unit
    );
  }

  private static findNutrient(nutrients: ReportNutrient[], nutrientId: string): string {
    return nutrients.filter(function(nutrient: ReportNutrient) {
      return nutrient.nutrient_id === nutrientId;
    })[0].value;
  }

  private constructor(
    ndbno: string, name: string, fat: number, carbs: number,
    protein: number, calories: number, amount: number, unit: FOOD_UNIT
  ) {
    super();
    this.ndbno = ndbno;
    this.name = name;
    this.fat = fat;
    this.carbs = carbs;
    this.protein = protein;
    this.calories = calories;
    this.amount = amount;
    this.unit = unit;
    this.uid = ndbnoId(this.ndbno);
  }
}

class CustomIngredient extends Ingredient {
  static new(
    name: string, fat: number, carbs: number, protein: number,
    calories: number, amount: number, unit: FOOD_UNIT
  ): CustomIngredient {
    return new CustomIngredient(
      ingredientId(), name, fat, carbs, protein, calories, amount, unit
    );
  }

  static fromJson(jsonStr: string): CustomIngredient {
    const {
      uid, name, fat, carbs, protein, calories, amount, unit
    } = JSON.parse(jsonStr);
    return new CustomIngredient(
      uid, name, fat, carbs, protein, calories, amount, unit
    );
  }

  private constructor(
    readonly uid: string,
    readonly name: string,
    readonly fat: number,
    readonly carbs: number,
    readonly protein: number,
    readonly calories: number,
    readonly amount: number,
    readonly unit: FOOD_UNIT,
  ) { super(); }
}

class ScaledFood extends Ingredient {
  readonly uid: string;
  readonly food: Nutritional & Quantifiable;
  readonly amount: number;
  readonly unit: string;
  readonly name: string;
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;

  constructor(food: Nutritional & Quantifiable, amount: number) {
    super();
    this.uid = uuid.v4();
    this.food = food;
    this.amount = amount;
    this.unit = this.food.unit;
    this.name = this.food.name;
    this.fat = scaleQuantity(this.food.fat, this.food.amount, this.amount);
    this.carbs = scaleQuantity(this.food.carbs, this.food.amount, this.amount);
    this.protein = scaleQuantity(this.food.protein, this.food.amount, this.amount);
    this.calories = scaleQuantity(this.food.calories, this.food.amount, this.amount);
  }
}

class MealImpl extends Ingredient implements Meal {
  readonly uid: string;
  readonly foods: Ingredient[];

  constructor(foods: Ingredient[]) {
    super();
    this.uid = mealId();
    this.foods = foods;
  }

  get calories() { return this.foods.reduce((l, r) => l + r.calories, 0); }
  get protein() { return this.foods.reduce((l, r) => l + r.protein, 0); }
  get fat() { return this.foods.reduce((l, r) => l + r.fat, 0); }
  get carbs() { return this.foods.reduce((l, r) => l + r.carbs, 0); }
  withFood(food: Ingredient): Meal { return new MealImpl([...this.foods, food]); }
  withoutFood(food: Ingredient): Meal {
    if (this.foods.find((f) => f === food) !== undefined) {
      return new MealImpl(this.foods.filter(f => f !== food));
    } else {
      console.log(`Food not found: ${JSON.stringify(food)} in ${this.foods.map(f => f.uid)}`);
      return this;
    }
  }
}

export class Recipe extends Ingredient {

  static copy(recipe: Recipe) {
    const uid = recipeId();
    return new Recipe(
      uid, `${recipe.name}'s Bitchin' Copy` , recipe.foods, recipe.fat,
      recipe.carbs, recipe.protein, recipe.calories, recipe.amount,
      recipe.unit, recipe.portionRatio
    );
  }

  static new(name: string, foods: Ingredient[], portionSize: number, totalSize?: number, unit?: string) {
    if (unit === undefined) {
      const units = new Set(foods.map(f => f.unit));
      if (units.size !== 1) {
        // TODO propery way to handle this?
        throw `Food units must be the same if unit not provided, found ${Array.from(units).join(', ')}`;
      }
      unit = foods[0].unit;
    }
    if (totalSize === undefined) {
      totalSize = foods.reduce((l, r) => l + r.amount, 0);
    }
    const portionRatio = portionSize / totalSize;

    const calories = foods.reduce((l, r) => l + r.calories, 0) * portionRatio;
    const protein = foods.reduce((l, r) => l + r.protein, 0) * portionRatio;
    const fat = foods.reduce((l, r) => l + r.fat, 0) * portionRatio;
    const carbs = foods.reduce((l, r) => l + r.carbs, 0) * portionRatio;

    const uid = recipeId();
    return new Recipe(
      uid, name, foods, fat, carbs, protein,
      calories, portionSize, unit, portionRatio
    );
  }

  static fromJson(jsonStr: string): Recipe {
    const {
      uid, name, foods, fat, carbs, protein, calories, amount, unit, portionRatio
    } = JSON.parse(jsonStr);
    return new Recipe(
      uid, name, foods, fat, carbs, protein, calories, amount, unit, portionRatio
    );
  }

  private constructor(
    readonly uid: string,
    readonly name: string,
    readonly foods: Ingredient[],
    readonly fat: number,
    readonly carbs: number,
    readonly protein: number,
    readonly calories: number,
    readonly amount: number,
    readonly unit: string,
    readonly portionRatio: number,
  ) { super(); }
}

export class MealDate {
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;

  static today() {
    return new MealDate(new Date());
  }

  constructor(date: Date) {
    this.year = date.getUTCFullYear();
    this.month = date.getUTCMonth();
    this.day = date.getUTCDay();
   }

   get id() {
     return getDateKey(`${this.year}_${this.month}_${this.day}`);
   }
}

export const ingredientFromJson = CustomIngredient.fromJson;

export function scaleFoodTo(
  ingredient: Nutritional & Quantifiable, amount: number
): Ingredient {
  return new ScaledFood(ingredient, amount);
}

export function scaleFoodBy(
  ingredient: Nutritional & Quantifiable, ratio: number
): Ingredient {
  const amount = ingredient.amount * ratio;
  return new ScaledFood(ingredient, amount);
}

export function makeIngredient(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  unit: FOOD_UNIT,
  persist: boolean = true
) {
  return makeScaledIngredient(name, fat, carbs, protein, calories, amount, amount, unit, persist);
}

export function makeScaledIngredient(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  convertAmount: number,
  unit: FOOD_UNIT,
  persist: boolean = true
) {
  const [sFat, sCarbs, sProtein, sCalories] = [fat, carbs, protein, calories].map(
    (m) => scaleQuantity(m, amount, convertAmount)
  );
  const ingred = CustomIngredient.new(name, sFat, sCarbs, sProtein, sCalories, convertAmount, unit);
  if (persist) {
    saveIngredient(ingred);
  }
  return ingred;
}

export function ingredientFromReport(report: Report): Ingredient {
  return NDBIngredient.fromReport(report);
}

export function makeRecipe(
  name: string, foods: Ingredient[], portionSize: number, totalSize?: number, unit?: string
): Recipe {
  const recipe = Recipe.new(name, foods, portionSize, totalSize, unit);
  saveRecipe(recipe);
  return recipe;
}

export function meal(foods: Ingredient[]): Meal {
  return new MealImpl(foods);
}

export function macrosFromFoods<T extends Nutritional>(foods: T[]): Nutritional {
  const calories = foods.reduce((l, r) => l + r.calories, 0);
  const fat = foods.reduce((l, r) => l + r.fat, 0);
  const carbs = foods.reduce((l, r) => l + r.carbs, 0);
  const protein = foods.reduce((l, r) => l + r.protein, 0);
  return new NutritionalImpl(fat, carbs, protein, calories);
}
import * as uuid from 'uuid';
import { ReportNutrient, Report } from './ndbapi/classes';
import { scaleQuantity } from './transforms';
import { saveIngredient, saveRecipe, getIngredientKey, getNdbKey, getRecipeKey, getMealKey } from './storage';

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

function ingredientId() { return getIngredientKey(uuid.v4()); }
function ndbnoId(ndbno: string) { return getNdbKey(ndbno); }
function recipeId() { return getRecipeKey(uuid.v4()); }
function mealId() { return getMealKey(uuid.v4()); }

export enum FOOD_UNIT {
  'g' = 'g'
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

export interface Nutritional {
  readonly protein: number;
  readonly fat: number;
  readonly carbs: number;
  readonly calories: number;
}

export interface Quantifiable extends Named {
  readonly amount: number;
  readonly unit: FOOD_UNIT;
}

export interface Ingredient extends Nutritional, Quantifiable, UIDed { }

interface FoodCombo extends Nutritional {
  readonly foods: Ingredient[];
  withFood(Ingredient: Ingredient): FoodCombo;
  withoutFood(Ingredient: Ingredient): FoodCombo;
}

/*
 * Like Recipe, but can't be subdivided
 */
export interface Meal extends FoodCombo, UIDed {
  withFood(food: Ingredient): Meal;
  withoutFood(food: Ingredient): Meal;
}

class NDBIngredient implements NDBed, Ingredient {
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

export class CustomIngredient implements Ingredient {
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
  ) { /* noop */ }
}

class ScaledFood implements Ingredient {
  readonly uid: string;
  readonly food: Nutritional & Quantifiable;
  readonly amount: number;
  readonly unit: FOOD_UNIT;
  readonly name: string;
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;

  constructor(food: Nutritional & Quantifiable, amount: number) {
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

class MealImpl implements Meal {
  readonly uid: string;
  readonly foods: Ingredient[];

  constructor(foods: Ingredient[]) {
    this.uid = mealId();
    this.foods = foods;
  }

  get calories() { return this.foods.reduce((l, r) => l + r.calories, 0); }
  get protein() { return this.foods.reduce((l, r) => l + r.protein, 0); }
  get fat() { return this.foods.reduce((l, r) => l + r.fat, 0); }
  get carbs() { return this.foods.reduce((l, r) => l + r.carbs, 0); }
  withFood(food: Ingredient): Meal { return new MealImpl([...this.foods, food]); }
  withoutFood(food: Ingredient): Meal {
    return new MealImpl(this.foods.filter(f => f !== food));
  }
}

export class Recipe implements FoodCombo, Quantifiable, UIDed {

  static new(name: string, foods: Ingredient[], amount?: number, unit?: FOOD_UNIT) {
    const uid = recipeId();
    const calories = foods.reduce((l, r) => l + r.calories, 0);
    const protein = foods.reduce((l, r) => l + r.protein, 0);
    const fat = foods.reduce((l, r) => l + r.fat, 0);
    const carbs = foods.reduce((l, r) => l + r.carbs, 0);
    if (amount === undefined) {
      amount = foods.reduce((l, r) => l + r.amount, 0);
    }
    if (unit === undefined) {
      const units: Set<FOOD_UNIT> = new Set(foods.map(f => f.unit));
      if (units.size !== 1) {
        // TODO propery way to handle this?
        throw 'Not all foods are the same unit, unit must be provided';
      }
    }
    return new Recipe(
      uid, name, foods, fat, carbs, protein,
      calories, amount, unit || foods[0].unit
    );
  }

  static fromJson(jsonStr: string): Recipe {
    const {
      uid, name, foods, fat, carbs, protein, calories, amount, unit
    } = JSON.parse(jsonStr);
    return new Recipe(
      uid, name, foods, fat, carbs, protein, calories, amount, unit
    );
  }

  withFood(food: Ingredient): Recipe {
    return Recipe.new(this.name, [...this.foods, food]);
  }
  withoutFood(food: Ingredient): Recipe {
    return Recipe.new(this.name, this.foods.filter(f => f !== food));
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
    readonly unit: FOOD_UNIT
  ) { /* noop */ }
}

export function scaleFood(
  ingredient: Nutritional & Quantifiable, amount: number
): Ingredient {
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
  const ingred = CustomIngredient.new(name, fat, carbs, protein, calories, amount, unit);
  if (persist) {
    saveIngredient(ingred);
  }
  return ingred;
}

export function ingredientFromReport(report: Report): Ingredient {
  return NDBIngredient.fromReport(report);
}

export function makeRecipe(
  name: string, foods: Ingredient[], amount?: number, unit?: FOOD_UNIT
): Recipe {
  const recipe = Recipe.new(name, foods, amount, unit);
  saveRecipe(recipe);
  return recipe;
}

export function meal(foods: Ingredient[]): Meal {
  return new MealImpl(foods);
}

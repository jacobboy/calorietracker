import * as uuid from 'uuid';
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
import { Report } from './ndbapi/classes';

export enum MACROS {
  'fat' = 'fat',
  'carbs' = 'carbs',
  'protein' = 'protein'
}

function ingredientId() { return getIngredientKey(uuid.v4()); }
function ndbnoId(ndbno: string) { return getNdbKey(ndbno); }
function recipeId() { return getRecipeKey(uuid.v4()); }
function mealId() { return getMealKey(uuid.v4()); }
/* function dateId(date: string) { return getDateKey(date); } */

export enum FOOD_UNIT {
  'g' = 'g',
  'ml' = 'ml'
}

export interface Nutritional {
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;
  readonly fatPct: number;
  readonly carbsPct: number;
  readonly proteinPct: number;
}

abstract class AbstractNutritional {
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

class NutritionalImpl extends AbstractNutritional {
  constructor(
    readonly fat: number,
    readonly carbs: number,
    readonly protein: number,
    readonly calories: number
  ) { super(); }
}

export interface Named { readonly name: string; }

export interface UIDed { readonly uid: string; }

export interface NDBed { readonly ndbno: string; }

export interface Quantifiable extends Named {
  readonly amount: number;
  readonly unit: string;
}

export interface Ingredient extends Nutritional, Quantifiable, UIDed { }

/* export class Ingredient extends AbstractNutritional implements BaseIngredient {
  readonly uid: string;
  protected readonly baseFood: (CustomIngredient | NDBIngredient);
  protected readonly macros: Nutritional;
  readonly amount: number;
  readonly unit: string;

  constructor(
    baseFood: (CustomIngredient | NDBIngredient),
    amount: number,
    unit: string
  ) {
    super();
    this.baseFood = baseFood;
    this.amount = amount;
    this.unit = unit;
    const scaler = (amt: number) => scaleQuantity(amt, this.amount, amount);
    this.macros = new NutritionalImpl(
      scaler(baseFood.fat),
      scaler(baseFood.carbs),
      scaler(baseFood.protein),
      scaler(baseFood.calories)
    );
    this.uid = ingredientId();
  }

  get name() { return this.baseFood.name; }
  get fat() { return this.macros.fat; }
  get carbs() { return this.macros.carbs; }
  get protein() { return this.macros.protein; }
  get calories() { return this.macros.calories; }

  scaleTo(amount: number, unit: string): Ingredient {
    return new Ingredient(this.baseFood, this.amount, this.unit);
  }
} */

export interface Recipe extends Ingredient { readonly foods: Ingredient[]; }

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

class NDBIngredient extends AbstractNutritional implements NDBed {
  readonly ndbno: string;
  readonly name: string;
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;
  readonly amount: number;
  readonly unit: string;
  readonly uid: string;

  static fromReport(report: Report): NDBIngredient {
    console.log(report);
    const ndbno = report.food.ndbno;
    const name = report.food.name;
    const fat = report.fat;
    const carbs = report.carbs;
    const protein = report.protein;
    const calories = report.calories;
    const amount = report.amount;
    const unit = FOOD_UNIT[report.unit];
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

  private constructor(
    ndbno: string, name: string, fat: number, carbs: number,
    protein: number, calories: number, amount: number, unit: string
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

class CustomIngredient extends AbstractNutritional {
  static new(
    name: string,
    fat: number,
    carbs: number,
    protein: number,
    calories: number,
    amount: number,
    unit: string
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
    readonly unit: string,
  ) { super(); }
}

class MealImpl extends AbstractNutritional implements Meal {
  fatPct: number;
  carbsPct: number;
  proteinPct: number;
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

class RecipeImpl extends AbstractNutritional implements Recipe {
  fatPct: number;
  carbsPct: number;
  proteinPct: number;

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
    return new RecipeImpl(
      uid, name, foods, fat, carbs, protein,
      calories, portionSize, unit, portionRatio
    );
  }

  static fromJson(jsonStr: string): Recipe {
    const {
      uid, name, foods, fat, carbs, protein, calories, amount, unit, portionRatio
    } = JSON.parse(jsonStr);
    return new RecipeImpl(
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
  ingredient: Ingredient, amount: number
): Ingredient {
  // TODO should I be passing around objects that are an ingredient + an amount?
  // then i won't need to be careful about scaling foods to 0, can always just
  // take the original food
  return makeScaledIngredient(
    ingredient.name,
    ingredient.fat,
    ingredient.carbs,
    ingredient.protein,
    ingredient.calories,
    ingredient.amount,
    amount,
    ingredient.unit,
    false
  );
}

export function makeIngredient(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  unit: string,
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
  unit: string,
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

export const ingredientFromReport = NDBIngredient.fromReport;

export function makeRecipe(
  name: string, foods: Ingredient[], portionSize: number, totalSize?: number, unit?: string
): Recipe {
  const recipe = RecipeImpl.new(name, foods, portionSize, totalSize, unit);
  saveRecipe(recipe);
  return recipe;
}

export const recipeFromJson = RecipeImpl.fromJson;

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
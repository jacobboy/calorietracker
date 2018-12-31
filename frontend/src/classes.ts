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

abstract class AbstractNutritional implements Nutritional {
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

export interface AmountOf<T extends Ingredient> extends Ingredient {
  baseFood: T;
  scaleTo(amount: number): AmountOf<T>;
}

class ScalableIngredientImpl<T extends Ingredient> extends AbstractNutritional implements AmountOf<T> {

  get name() { return this.baseFood.name; }
  get fat() { return this.macros.fat; }
  get carbs() { return this.macros.carbs; }
  get protein() { return this.macros.protein; }
  get calories() { return this.macros.calories; }
  get unit() { return this.baseFood.unit; }
  readonly uid: string;
  readonly baseFood: T;
  protected readonly macros: Nutritional;
  readonly amount: number;

  static new<U extends Ingredient>(baseFood: U, amount: number) {
    return new ScalableIngredientImpl(baseFood, amount);
  }

  protected constructor(
    baseFood: T,
    amount: number,
  ) {
    super();
    this.baseFood = baseFood;
    this.amount = amount;
    const scaler = (amt: number) => scaleQuantity(amt, this.baseFood.amount, this.amount);
    this.macros = new NutritionalImpl(
      scaler(baseFood.fat),
      scaler(baseFood.carbs),
      scaler(baseFood.protein),
      scaler(baseFood.calories)
    );
    this.uid = ingredientId();
  }

  scaleTo(amount: number): AmountOf<T> {
    return new ScalableIngredientImpl(this.baseFood, amount);
  }
}

export interface Recipe extends Ingredient { readonly foods: AmountOf<Ingredient>[]; }

export interface FoodCombo extends Nutritional {
  readonly foods: Ingredient[];
  withFood(Ingredient: Ingredient): FoodCombo;
  withoutFood(Ingredient: Ingredient): FoodCombo;
}

/*
 * Why is this separate from Recipe?
 */
export interface Meal extends FoodCombo, UIDed {
  foods: AmountOf<Ingredient>[];  // TODO Shouldn't actually expose this
  withFood(food: AmountOf<Ingredient>): Meal;
  withoutFood(food: AmountOf<Ingredient>): Meal;
}

class NDBIngredient extends AbstractNutritional implements Ingredient, NDBed {
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
    const ndbno = report.food.ndbno;
    const uid = ndbnoId(ndbno);
    const name = report.food.name;
    const fat = report.fat;
    const carbs = report.carbs;
    const protein = report.protein;
    const calories = report.calories;
    const amount = report.amount;
    const unit = FOOD_UNIT[report.unit];
    return new NDBIngredient(uid, ndbno, name, fat, carbs, protein, calories, amount, unit);
  }

  static fromObj(obj: NDBIngredient): NDBIngredient {
    // Not totally sure what i want to do here
    return new NDBIngredient(
      obj.uid, obj.ndbno, obj.name,
      obj.fat, obj.carbs, obj.protein, obj.calories,
      obj.amount, obj.unit);
  }

  private constructor(
    uid: string, ndbno: string, name: string, fat: number, carbs: number,
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

class CustomIngredient extends AbstractNutritional implements Ingredient {
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
  readonly uid: string;
  readonly foods: AmountOf<Ingredient>[];

  constructor(foods: AmountOf<Ingredient>[]) {
    super();
    this.uid = mealId();
    this.foods = foods;
  }

  get calories() { return this.foods.reduce((l, r) => l + r.calories, 0); }
  get protein() { return this.foods.reduce((l, r) => l + r.protein, 0); }
  get fat() { return this.foods.reduce((l, r) => l + r.fat, 0); }
  get carbs() { return this.foods.reduce((l, r) => l + r.carbs, 0); }
  withFood(food: AmountOf<Ingredient>): Meal {
    return new MealImpl([...this.foods, food]);
  }
  withoutFood(food: AmountOf<Ingredient>): Meal {
    if (this.foods.find((f) => f === food) !== undefined) {
      return new MealImpl(this.foods.filter(f => f !== food));
    } else {
      throw new Error(`Food not found: ${JSON.stringify(food)} in ${this.foods.map(f => f.uid)}`);
    }
  }
}

class RecipeImpl extends AbstractNutritional implements Ingredient, Recipe {

  static new(name: string, foods: AmountOf<Ingredient>[], portionAmount: number, totalAmount?: number, unit?: string) {
    if (unit === undefined) {
      const units = new Set(foods.map(f => f.unit));
      if (units.size !== 1) {
        // TODO propery way to handle this?
        throw `Food units must be the same if unit not provided, found ${Array.from(units).join(', ')}`;
      }
      unit = foods[0].unit;
    }
    if (totalAmount === undefined) {
      totalAmount = foods.reduce((l, r) => l + r.amount, 0);
    }

    const calories = foods.reduce((l, r) => l + r.calories, 0);
    const protein = foods.reduce((l, r) => l + r.protein, 0);
    const fat = foods.reduce((l, r) => l + r.fat, 0);
    const carbs = foods.reduce((l, r) => l + r.carbs, 0);

    const uid = recipeId();
    return new RecipeImpl(
      uid, name, foods, fat, carbs, protein,
      calories, portionAmount, totalAmount, unit
    );
  }

  static fromObject(uid: string,
                    name: string,
                    foods: AmountOf<Ingredient>[],
                    totalFat: number,
                    totalCarbs: number,
                    totalProtein: number,
                    totalCalories: number,
                    portionAmount: number,
                    totalAmount: number,
                    unit: string, ) {
      return new RecipeImpl(
        uid, name, foods, totalFat, totalCarbs, totalProtein,
        totalCalories, portionAmount, totalAmount, unit
      );
    }

  private constructor(
    readonly uid: string,
    readonly name: string,
    readonly foods: AmountOf<Ingredient>[],
    readonly totalFat: number,
    readonly totalCarbs: number,
    readonly totalProtein: number,
    readonly totalCalories: number,
    readonly portionAmount: number,
    readonly totalAmount: number,
    readonly unit: string,
  ) { super(); }

  get fat() { return scaleQuantity(this.totalFat, this.totalAmount, this.portionAmount); }
  get carbs() { return scaleQuantity(this.totalCarbs, this.totalAmount, this.portionAmount); }
  get protein() { return scaleQuantity(this.totalProtein, this.totalAmount, this.portionAmount); }
  get calories() { return scaleQuantity(this.totalCalories, this.totalAmount, this.portionAmount); }
  get amount() { return this.portionAmount; }
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

export function ingredientFromJson(jsonStr: string): AmountOf<Ingredient> {
  const baseIngred = CustomIngredient.fromJson(jsonStr);
  return ScalableIngredientImpl.new(baseIngred, baseIngred.amount);
}

export function scaleFoodTo<T extends Ingredient>(
  ingredient: AmountOf<T>, amount: number
): AmountOf<T> {
  return ingredient.scaleTo(amount);
}

export function amountOf(ingredient: Ingredient, amount?: number) {
  amount = amount || ingredient.amount;
  // TODO uhhh this is double plus bad, fix this
  if (ingredient instanceof ScalableIngredientImpl) {
    return scaleFoodTo(ingredient, amount);
  } else {
    return ScalableIngredientImpl.new(ingredient, amount);
  }
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
): AmountOf<Ingredient> {
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
): AmountOf<Ingredient> {
  const [sFat, sCarbs, sProtein, sCalories] = [fat, carbs, protein, calories].map(
    (m) => scaleQuantity(m, amount, convertAmount)
  );
  const ingred = CustomIngredient.new(name, sFat, sCarbs, sProtein, sCalories, convertAmount, unit);
  if (persist) {
    saveIngredient(ingred);
  }
  return ScalableIngredientImpl.new(ingred, ingred.amount);
}

export const ingredientFromReport = NDBIngredient.fromReport;

export function makeRecipe(
  name: string, foods: AmountOf<Ingredient>[], portionSize: number, totalSize?: number, unit?: string
): Recipe {
  const recipe = RecipeImpl.new(name, foods, portionSize, totalSize, unit);
  saveRecipe(recipe);
  return recipe;
}

// tslint:disable-next-line:no-any
function amountOfFromObj(amountOfObj: {amount: number, baseFood: any}): AmountOf<Ingredient> {
  let { amount, baseFood } = amountOfObj;
  if (baseFood.ndbno !== undefined) {
    baseFood = NDBIngredient.fromObj(baseFood);
  } else {
    baseFood = CustomIngredient.fromJson(JSON.stringify(baseFood));
  }
  return amountOf(baseFood, amount);
}

export function recipeFromJson (jsonStr: string): Recipe {
  let {
    uid, name, foods, fat, carbs, protein, calories, portionAmount, totalAmount, unit
  } = JSON.parse(jsonStr);
  foods = foods.map(amountOfFromObj);
  return RecipeImpl.fromObject(
    uid, name, foods, fat, carbs, protein, calories, portionAmount, totalAmount, unit
  );
}

export function meal(foods: AmountOf<Ingredient>[]): Meal {
  return new MealImpl(foods);
}

export function macrosFromFoods<T extends Nutritional>(foods: T[]): Nutritional {
  const calories = foods.reduce((l, r) => l + r.calories, 0);
  const fat = foods.reduce((l, r) => l + r.fat, 0);
  const carbs = foods.reduce((l, r) => l + r.carbs, 0);
  const protein = foods.reduce((l, r) => l + r.protein, 0);
  return new NutritionalImpl(fat, carbs, protein, calories);
}
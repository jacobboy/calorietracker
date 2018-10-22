import * as uuid from 'uuid';
import { ReportNutrient, Report } from './ndbapi/classes';
import { scaleQuantity } from './transforms';
import { saveIngredient, saveRecipe } from './storage';

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

function ingredientId() { return 'ingredient::' + uuid.v4(); }
function ndbnoId(ndbno: string) { return 'ndbno::' + ndbno; }
function recipeId() { return 'recipe::' + uuid.v4(); }
function mealId() { return 'meal::' + uuid.v4(); }

export enum FOOD_UNIT {
  'g'
}

export interface Named {
  readonly name: string;
}

export interface UIDed {
  readonly uid: string;
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

/**
 * Ingredient ids for food in the NDB are a function of the ndbno
 */
export abstract class NDBable implements UIDed {
  constructor(public ndbno: string) { /* noop */ }
  get uid() { return ndbnoId(this.ndbno); }
}

// similar to Food, but should be allowed to be reused
// in Java the difference would be that Ingredient would override equals
// so that identical Ingredients evaluated as equal
export interface Ingredient extends Nutritional, Quantifiable, UIDed { }

// similar to Ingredient, but identical Foods should not necessarily be
// allowed to be shared
export interface Food extends Nutritional, Quantifiable {
  uid: string;
}

export interface FoodCombo extends Nutritional {
  readonly foods: Food[];
  withFood(food: Food): FoodCombo;
  withoutFood(food: Food): FoodCombo;
}

/*
 * Like Recipe, but can't be subdivided
 */
export interface Meal extends FoodCombo, UIDed {
  withFood(food: Food): Meal;
  withoutFood(food: Food): Meal;
}

export class NDBIngredient extends NDBable implements Ingredient {
  readonly ndbno: string;
  readonly name: string;
  readonly fat: number;
  readonly carbs: number;
  readonly protein: number;
  readonly calories: number;
  readonly amount: number;
  readonly unit: FOOD_UNIT;

  static fromReport(report: Report) {
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

  static fromJson(jsonStr: string) {
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
    super(ndbno);
    this.name = name;
    this.fat = fat;
    this.carbs = carbs;
    this.protein = protein;
    this.calories = calories;
    this.amount = amount;
    this.unit = unit;
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

// class ScaledFood implements Food {
//   readonly uid: string;
//   readonly food: Nutritional & Quantifiable;
//   readonly amount: number;

//   constructor(food: Nutritional & Quantifiable, amount: number) {
//     this.uid = uuid.v4();
//     this.food = food;
//     this.amount = amount;
//   }

//   get name() { return this.food.name; }

//   get unit() { return this.food.unit; }

//   get calories(): number {
//     return scaleQuantity(
//       this.food.calories, this.food.amount, this.amount
//     );
//   }

//   get protein() {
//     return scaleQuantity(
//       this.food.protein, this.food.amount, this.amount
//     );
//   }

//   get fat() {
//     return scaleQuantity(
//       this.food.fat, this.food.amount, this.amount
//     );
//   }

//   get carbs() {
//     return scaleQuantity(
//       this.food.carbs, this.food.amount, this.amount
//     );
//   }
// }

class ScaledFood implements Food {
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

class MealImpl implements FoodCombo, UIDed {
  readonly uid: string;
  readonly foods: Food[];

  constructor(foods: Food[]) {
    this.uid = mealId();
    this.foods = foods;
  }

  get calories() { return this.foods.reduce((l, r) => l + r.calories, 0); }
  get protein() { return this.foods.reduce((l, r) => l + r.protein, 0); }
  get fat() { return this.foods.reduce((l, r) => l + r.fat, 0); }
  get carbs() { return this.foods.reduce((l, r) => l + r.carbs, 0); }
  withFood(food: Food): Meal { return new MealImpl([...this.foods, food]); }
  withoutFood(food: Food): Meal {
    return new MealImpl(this.foods.filter(f => f !== food));
  }
}

export class Recipe implements Meal, Quantifiable {

  static new(name: string, foods: Food[], amount?: number, unit?: FOOD_UNIT) {
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

  withFood(food: Food): Recipe {
    return Recipe.new(this.name, [...this.foods, food]);
  }
  withoutFood(food: Food): Recipe {
    return Recipe.new(this.name, this.foods.filter(f => f !== food));
  }

  private constructor(
    readonly uid: string,
    readonly name: string,
    readonly foods: Food[],
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
): Food {
  return new ScaledFood(ingredient, amount);
}

export function makeIngredient(
  name: string,
  fat: number,
  carbs: number,
  protein: number,
  calories: number,
  amount: number,
  unit: FOOD_UNIT
) {
  const ingred = CustomIngredient.new(name, fat, carbs, protein, calories, amount, unit);
  saveIngredient(ingred);
  return ingred;
}

export function ingredientFromReport(report: Report): Ingredient {
  return NDBIngredient.fromReport(report);
}

export function makeRecipe(
  name: string, foods: Food[], amount?: number, unit?: FOOD_UNIT
): Recipe {
  const recipe = Recipe.new(name, foods, amount, unit);
  saveRecipe(recipe);
  return recipe;
}

export function meal(foods: Food[]): Meal {
  return new MealImpl(foods);
}

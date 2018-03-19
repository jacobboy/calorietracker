import * as uuid from 'uuid';
import { ReportNutrient, Report } from './ndbapi/classes';
import { scaleQuantity } from './transforms';

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

export interface Nutritional {
  readonly calories: number;
  readonly protein: number;
  readonly fat: number;
  readonly carbs: number;
}

export interface Quantifiable {
  readonly name: string;
  readonly amount: number;
  readonly unit: string;
}

export interface NDBable {
  readonly ndbno: string;
}

// similar to Food, but should be allowed to be reused
// in Java the difference would be that Ingredient would override equals
// so that identical Ingredients evaluated as equal
export interface Ingredient extends Nutritional, Quantifiable {
  ingredientId: string;
}

// similar to Ingredient, but identical Foods should not necessarily be
// allowed to be shared
export interface Food extends Nutritional, Quantifiable {
  readonly id: string;
}

export interface FoodCombo extends Nutritional {
  readonly id: string;
  readonly foods: Food[];
}

export interface Meal extends FoodCombo {
  withFood(food: Food): Meal;
  withoutFood(food: Food): Meal;
}

// TODO It may end up actually being nicer to just use report responses
class NDBIngredient implements Ingredient, NDBable {
  readonly ndbno: string;
  readonly name: string;
  readonly calories: number;
  readonly protein: number;
  readonly fat: number;
  readonly carbs: number;
  readonly amount: number;
  readonly unit: string;

  static findNutrient(nutrients: ReportNutrient[], nutrientId: string): string {
    return nutrients.filter(function(nutrient: ReportNutrient) {
      return nutrient.nutrient_id === nutrientId;
    })[0].value;
  }

  constructor(report: Report) {
    this.ndbno = report.food.ndbno;
    this.name = report.food.name;
    this.calories = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, CALORIES_ID)
    );
    this.protein = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, PROTEIN_ID)
    );
    this.fat = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, FAT_ID)
    );
    this.carbs = parseFloat(
      NDBIngredient.findNutrient(report.food.nutrients, CARB_ID)
    );
    this.amount = 100;  // pretty sure it's always 100?
    this.unit = report.food.ru;
  }

  get ingredientId() { return this.ndbno; }
}

class ScaledFood implements Food {
  readonly id: string;
  readonly food: Nutritional & Quantifiable;
  readonly amount: number;

  constructor(food: Nutritional & Quantifiable, amount: number) {
    this.id = uuid.v4();
    this.food = food;
    this.amount = amount;
  }

  get name() { return this.food.name; }

  get unit() { return this.food.unit; }

  get calories(): number {
    return scaleQuantity(
      this.food.calories, this.food.amount, this.amount
    );
  }

  get protein() {
    return scaleQuantity(
      this.food.protein, this.food.amount, this.amount
    );
  }

  get fat() {
    return scaleQuantity(
      this.food.fat, this.food.amount, this.amount
    );
  }

  get carbs() {
    return scaleQuantity(
      this.food.carbs, this.food.amount, this.amount
    );
  }
}

export class MealImpl implements Meal {
  readonly id: string;
  readonly foods: Food[];

  constructor(foods: Food[]) {
    this.id = uuid.v4();
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

export class Recipe implements FoodCombo, Quantifiable {
  readonly id: string;
  readonly name: string;
  readonly foods: Food[];
  readonly calories: number;
  readonly protein: number;
  readonly fat: number;
  readonly carbs: number;
  readonly amount: number;
  readonly unit: string;

  constructor(name: string, foods: Food[], amount?: number, unit?: string) {
    this.id = uuid.v4();
    this.name = name;
    this.foods = foods;
    this.calories = foods.reduce((l, r) => l + r.calories, 0);
    this.protein = foods.reduce((l, r) => l + r.protein, 0);
    this.fat = foods.reduce((l, r) => l + r.fat, 0);
    this.carbs = foods.reduce((l, r) => l + r.carbs, 0);
    if (amount === undefined) {
      amount = foods.reduce((l, r) => l + r.amount, 0);
    }
    this.amount = amount;
    if (this.unit === undefined) {
      const units: Set<string> = new Set(foods.map(f => f.unit));
      if (units.size !== 1) {
        // TODO propery way to handle this?
        throw 'Not all foods are the same unit, unit must be provided';
      }
    }
    this.unit = this.foods[0].unit;
  }
}

export function scaleFood(
  ingredient: Nutritional & Quantifiable, amount: number
): Food {
  return new ScaledFood(ingredient, amount);
}

export function ingredientFromReport(report: Report): Ingredient {
  return new NDBIngredient(report);
}

export function recipe(name: string, foods: Food[]): Recipe {
  return new Recipe(name, foods);
}

export function meal(foods: Food[]): Meal {
  return new MealImpl(foods);
}

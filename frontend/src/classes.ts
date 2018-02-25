const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

export class Ingredient {
  ndbno: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;

  // tslint:disable-next-line: no-any
  static findNutrient(nutrients: any, nutrientId: string): string {
    // tslint:disable-next-line: no-any
    return nutrients.filter(function(nutrient: any) {
      return nutrient.nutrient_id === nutrientId;
    })[0].value;
  }

  // tslint:disable-next-line: no-any
  constructor(report: any) {
    this.ndbno = report.food.ndbo;
    this.name = report.food.name;
    this.calories = parseFloat(Ingredient.findNutrient(report.food.nutrients, CALORIES_ID));
    this.protein = parseFloat(Ingredient.findNutrient(report.food.nutrients, PROTEIN_ID));
    this.fat = parseFloat(Ingredient.findNutrient(report.food.nutrients, FAT_ID));
    this.carbs = parseFloat(Ingredient.findNutrient(report.food.nutrients, CARB_ID));
  }
}

export class Recipe {
  name: string;
  ingredients: Ingredient[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;

  constructor(name: string, ingredients: Ingredient[]) {
    this.name = name;
    this.ingredients = ingredients;
    this.calories = ingredients.reduce((l, r) => l + r.calories, 0);
    this.protein = ingredients.reduce((l, r) => l + r.protein, 0);
    this.fat = ingredients.reduce((l, r) => l + r.fat, 0);
    this.carbs = ingredients.reduce((l, r) => l + r.carbs, 0);
  }
}

export class ReportResponse {
  // tslint:disable-next-line: no-any
  report: any;
  // tslint:disable-next-line: no-any
  constructor(report: any) {
    this.report = report;
  }

}

/* class Measure {
 *   label: string;
 *   eqv: number;
 *   eunit: string;
 *   qty: number;
 *   value: string;
 * }
 *
 * class Nutrient {
 *   static CALORIES_ID: '208';
 *   static PROTEIN_ID: '203';
 *   static FAT_ID: '204';
 *   static CARB_ID: '205';
 *
 *   nutrient_id: string;
 *   name: string;
 *   derivation: string;
 *   group: string;
 *   unit: string;
 *   value: string;
 *   measures: Measure[];
 * }
 *
 * class Food {
 *   ndbno: string;
 *   name: string;
 *   ds: string;
 *   manu: string;
 *   ru: string;
 *   nutrients: Nutrient[];
 * }
 *
 * class Report {
 *   sr: string;
 *   type: string;
 *   food: Food;
 *   footnotes: string[];
 * }
 *
 */

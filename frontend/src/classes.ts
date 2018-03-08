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

  static findNutrient(nutrients: Nutrient[], nutrientId: string): string {
    return nutrients.filter(function(nutrient: Nutrient) {
      return nutrient.nutrient_id === nutrientId;
    })[0].value;
  }

  constructor(report: Report) {
    this.ndbno = report.food.ndbno;
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

export class SearchListItem {
  offset: number;
  group: string;
  name: string;
  ndbno: string;
  ds: string;
}

// TODO not a fan of making everything optional in case of no response
export class SearchList {
  q?: string;
  sr?: string;
  ds?: string;
  start?: number;
  end?: number;
  total?: number;
  group?: string;
  sort?: string;
  item: SearchListItem[];
}

export class SearchResponse {
  list: SearchList;
}

class Measure {
  label: string;
  eqv: number;
  eunit: string;
  qty: number;
  value: string;
}

class Nutrient {
  static CALORIES_ID: '208';
  static PROTEIN_ID: '203';
  static FAT_ID: '204';
  static CARB_ID: '205';

  // tslint:disable-next-line:variable-name
  nutrient_id: string;
  name: string;
  derivation: string;
  group: string;
  unit: string;
  value: string;
  measures: Measure[];
}

class Food {
  ndbno: string;
  name: string;
  ds: string;
  manu: string;
  ru: string;
  nutrients: Nutrient[];
}

export class Report {
  sr: string;
  type: string;
  food: Food;
  footnotes: string[];
}

export class ReportResponse {
  report: Report;
}

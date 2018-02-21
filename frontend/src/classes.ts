class Measure {
  label: string;
  eqv: number;
  eunit: string;
  qty: number;
  value: string;
}

class Nutrient {
  static CALORIES_ID: "208";
  static PROTEIN_ID: "203";
  static FAT_ID: "204";
  static CARB_ID: "205"

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

class Report {
  sr: string;
  type: string;
  food: Food;
  footnotes: string[];
}

export class ReportResponse {
  report: Report
}

export class Ingredient {
  name: string
  calories: number
  protein: number;
  fat: number;
  carbs: number;

  constructor(report: Report) {
    this.name = report.food.name;
    this.calories = parseFloat(findNutrient(report, Nutrient.CALORIES_ID));
    this.protein = parseFloat(findNutrient(report, Nutrient.PROTEIN_ID));
    this.fat = parseFloat(findNutrient(report, Nutrient.FAT_ID));
    this.carbs = parseFloat(findNutrient(report, Nutrient.CARB_ID));
  }
}

function findNutrient(report: Report, nutrientId: string): string {
  return report.food.nutrients.filter(function(nutrient) {
    return nutrient.nutrient_id === nutrientId;
  })[0].value
}

import { Named, NDBed } from '../classes';

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

export class IngredientSearchItem implements Named, NDBed {
  static fromSearchListItem(item: SearchListItem) {
    return new IngredientSearchItem(
      item.ndbno,
      item.offset,
      item.group,
      item.name,
      item.ds
    );
  }

  constructor(
    readonly ndbno: string,
    readonly offset: number,
    readonly group: string,
    readonly name: string,
    readonly ds: string
  ) {
    /*noop*/
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

class ReportMeasure {
  label: string;
  eqv: number;
  eunit: string;
  qty: number;
  value: string;
}

export class ReportNutrient {
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
  measures: ReportMeasure[];
}

class ReportFood {
  ndbno: string;
  name: string;
  ds: string;
  manu: string;
  ru: string;
  nutrients: ReportNutrient[];
}

export class Report {
  static new(reportObj: {
    sr: string;
    type: string;
    food: ReportFood;
    footnotes: string[];
  }) {
    return new Report(
      reportObj.sr,
      reportObj.type,
      reportObj.food,
      reportObj.footnotes
    );
  }

  private constructor(
    readonly sr: string,
    readonly type: string,
    readonly food: ReportFood,
    readonly footnotes: string[]
  ) {}

  get fat() {
    return this.findNutrient(FAT_ID);
  }

  get carbs() {
    return this.findNutrient(CARB_ID);
  }

  get protein() {
    return this.findNutrient(PROTEIN_ID);
  }

  get calories() {
    return this.findNutrient(CALORIES_ID);
  }

  get unit() {
    return this.food.ru;
  }

  get amount() {
    return 100; // TODO pretty sure it's always 100?
  }

  private findNutrient(nutrientId: string): number {
    return parseFloat(
      this.food.nutrients.filter(function(nutrient: ReportNutrient) {
        return nutrient.nutrient_id === nutrientId;
      })[0].value
    );
  }
}

export class ReportResponse {
  readonly report: {
    sr: string;
    type: string;
    food: ReportFood;
    footnotes: string[];
  };
}

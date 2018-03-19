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
  sr: string;
  type: string;
  food: ReportFood;
  footnotes: string[];
}

export class ReportResponse {
  report: Report;
}

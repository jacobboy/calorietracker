import { GOV_API_KEY } from '../apikey';
import { ingredientFromReport, Ingredient } from '../classes';
import { SearchList, Report, IngredientSearchItem } from './classes';

export enum DataSource {
  SR = 'SR',
  BL = 'BL',
  Any = 'Any'
}

function reportUrl() {
  return 'https://api.nal.usda.gov/ndb/reports/V2?api_key=' + GOV_API_KEY;
}

function searchUrl() {
  return 'https://api.nal.usda.gov/ndb/search/?api_key=' + GOV_API_KEY;
}

function getIngredientKey(ndbno: string) {
  return 'ingredient_' + ndbno;
}

function queryReport(ndbno: string) {
  console.log('Getting ' + ndbno + 'from ndb api');

  return fetch(
    reportUrl(), {
      method: 'POST',
      body: JSON.stringify({ 'ndbno': ndbno, 'type': 'b' }),
      headers: new Headers({ 'Content-type': 'application/json' }),
      credentials: 'omit'
      // mode: 'Coors'
    }).then((response) => response.json())
    .then((response) => response.report);
}

function getReport(ndbno: string): Promise<Report> {
  const ingredientKey = getIngredientKey(ndbno);
  let localReport = window.localStorage.getItem(ingredientKey);
  if (localReport !== null) {
    console.log('Getting ' + ndbno + ' from window storage');
    // TODO why can't I inline this in Promise creation?
    const report: Report = JSON.parse(localReport);
    return new Promise((resolve, reject) => resolve(report));
  } else {
    return queryReport(ndbno).then((report) => {
      window.localStorage.setItem(ingredientKey, JSON.stringify(report));
      return report;
    });
  }
}

export function getIngredient(ndbno: string): Promise<Ingredient> {
  return getReport(ndbno).then(
    (report) => {
      console.log('Ingredientizing report for ' + report.food.name);
      return ingredientFromReport(report);
    });
}

function fetchSearch(searchString: string, dataSource: DataSource): Promise<SearchList> {
  const body: { q: string, ds?: string, max?: string, offset?: string } = {
    'q': searchString,
  };
  if (dataSource !== DataSource.Any) {
    body.ds = dataSource === DataSource.SR ? 'Standard Reference' : 'Branded Food Products';
  }

  return fetch(
    searchUrl(), {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({ 'Content-type': 'application/json' }),
      credentials: 'omit'
    })
    .then((response) => response.json())
    .then((response) => {
      if (response.errors) {
        return { item: [] };
      } else {
        return response.list;
      }
    });
  // searchUrl();
  // return new Promise<SearchResponse>(
  //   (resolve, reject) => resolve(mockSearchResp)
  // ).then((response) => response.list);
}

export function searchFood(
  searchString: string,
  dataSource: DataSource): Promise<IngredientSearchItem[]> {
  return fetchSearch(
    searchString,
    dataSource
  ).then(
    (searchList) => searchList.item.map((sli) => IngredientSearchItem.fromSearchListItem(sli))
  );
}

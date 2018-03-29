import { GOV_API_KEY } from '../apikey';
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

function fetchSearch(searchString: string, dataSource: DataSource): Promise<SearchList> {
  const body: { q: string, ds?: string, max?: string, offset?: string } = {
    'q': searchString,
  };
  if (dataSource !== DataSource.Any) {
    body.ds = dataSource === DataSource.SR ? 'Standard Reference' : 'Branded Food Products';
  }
  const bodyStr = JSON.stringify(body);
  console.log('Searching for\n' + bodyStr);
  return fetch(
    searchUrl(), {
      method: 'POST',
      body: bodyStr,
      headers: new Headers({ 'Content-type': 'application/json' }),
      credentials: 'omit'
    })
    .then((response) => {
      console.log('Got response\n' + JSON.stringify(response));
      return response.json();
    })
    .then((response) => {
      console.log('Got response\n' + JSON.stringify(response));
      if (response.errors) {
        return { item: [] };
      } else {
        return response.list;
      }
    });
}

export function queryReport(ndbno: string): Promise<Report> {
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

export function searchFood(
  searchString: string,
  dataSource: DataSource): Promise<IngredientSearchItem[]> {
  console.log('In searchFood');
  return fetchSearch(
    searchString,
    dataSource
  ).then(
    (searchList) => searchList.item.map(
      (sli) => {
        console.log('Got search');
        return IngredientSearchItem.fromSearchListItem(sli);
      }
    ));
}

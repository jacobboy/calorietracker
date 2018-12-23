import { GOV_API_KEY } from '../apikey';
import { SearchList, IngredientSearchItem, Report } from './classes';

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
  // console.log('Searching for\n' + bodyStr);
  return fetch(
    searchUrl(), {
      method: 'POST',
      body: bodyStr,
      headers: new Headers({ 'Content-type': 'application/json' }),
      credentials: 'omit'
    })
    .then((response) => {
      // console.log('Got response\n' + JSON.stringify(response));
      return response.json();
    })
    .then((response) => {
      // console.log('Got response\n' + JSON.stringify(response));
      if (response.errors) {
        return { item: [] };
      } else {
        // TODO Filter these for only responses containing all macros?
        return response.list;
      }
    });
}

export function queryReport(ndbno: string): Promise<Report> {
  const url = reportUrl();
  const body = JSON.stringify({ 'ndbno': ndbno, 'type': 'b' });
  // console.log('Getting ' + ndbno + ' from ' + url);
  // console.log(body);
  return fetch(
    url, {
      method: 'POST',
      body: body,
      headers: new Headers({ 'Content-type': 'application/json' }),
      credentials: 'omit',
      mode: 'cors'
    }).then((response) => response.json())
    .then((response) => response.report);
}

export function searchFood(
  searchString: string,
  dataSource: DataSource): Promise<IngredientSearchItem[]> {
  return fetchSearch(
    searchString,
    dataSource
  ).then(
    (searchList) => searchList.item.map(
      (sli) => {
        // console.log('Got search');
        return IngredientSearchItem.fromSearchListItem(sli);
      }
    ));
}

import { GOV_API_KEY } from './apikey';
import { Ingredient } from './classes';

export function ndbUrl() {
  return 'http://api.nal.usda.gov/ndb/reports/V2?api_key=' + GOV_API_KEY;
}

function queryReport(ndbno: string) {
  console.log('Getting from ndb api');

  return fetch(
    ndbUrl(), {
      method: 'POST',
      body: JSON.stringify({ 'ndbno': ndbno, 'type': 'b' }),
      headers: new Headers({ 'Content-type': 'application/json' }),
      credentials: 'omit'
      // mode: 'cors'
    }).then((response) => response.json())
    .then((response) => response.report);

  // const xhttp = new XMLHttpRequest();
  // // TODO set api_key using the correct method, async request
  // xhttp.open('POST', ndbUrl(), false);

  // xhttp.setRequestHeader('Content-type', 'application/json');
  // xhttp.send();
  // const respText = xhttp.responseText;
  // const resp = JSON.parse(respText);
  // return resp.report;
}

// tslint:disable-next-line: no-any
function getReport(ndbno: string): Promise<any> {
  let localReport = window.localStorage.getItem(ndbno);
  if (localReport !== null) {
    let report = JSON.parse(localReport);
    console.log('Getting from window storage');
    return new Promise(
      (resolve, reject) => { resolve(report); }
    );
  } else {
    return queryReport(ndbno).then((report) => {
      window.localStorage.setItem(ndbno, JSON.stringify(report));
      return report;
    });
  }

}

export function getIngredient(ndbno: string): Promise<Ingredient> {
  return getReport(ndbno).then(
    (report) => {
      console.log('Ingredientizing report for ' + report.food.name);
      return new Ingredient(report);
    });
}

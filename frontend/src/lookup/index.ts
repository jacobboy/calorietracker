import { Ingredient, ingredientFromReport, NDBed } from '../classes';
import { queryReport } from '../ndbapi';
import { Report } from '../ndbapi/classes';
import { loadReport, saveReport } from '../storage';

function getReport(ndbno: string): Promise<Report> {
  const localReport: Report | null = loadReport(ndbno);
  if (localReport !== null) {
    return new Promise((resolve, reject) => resolve(localReport));
  } else {
    return queryReport(ndbno).then((report) => {
      saveReport(ndbno, report);
      return report;
    });
  }
}

export function getIngredient(ingredientable: NDBed): Promise<Ingredient> {
  console.log('Getting ingredient\n' + JSON.stringify(ingredientable));
  // haha gross
  const ndbable = <NDBed> ingredientable;
  return getReport(ndbable.ndbno).then((report) => ingredientFromReport(report));
}

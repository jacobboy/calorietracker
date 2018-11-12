import { Ingredient, ingredientFromReport, NDBed } from '../classes';
import { queryReport } from '../ndbapi';
import { Report } from '../ndbapi/classes';
import { loadReport, saveReport } from '../storage';

function getReport(ndbno: string, persist: boolean = true): Promise<Report> {
  const localReport: Report | null = loadReport(ndbno);
  if (localReport !== null) {
    return new Promise((resolve, reject) => resolve(localReport));
  } else {
    return queryReport(ndbno).then((report) => {
      if (persist) {
        saveReport(report);
      }
      return report;
    });
  }
}

export function getIngredient(ingredientable: NDBed, persist: boolean = true): Promise<Ingredient> {
  console.log('Getting ingredient\n' + JSON.stringify(ingredientable));
  // haha gross
  const ndbable = <NDBed> ingredientable;
  return getReport(ndbable.ndbno, persist).then((report) => ingredientFromReport(report));
}

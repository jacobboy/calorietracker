import { ingredientFromReport, Ingredient, UIDed } from '../classes';
import { saveReport, loadReport, loadIngredient } from '../storage';
import { queryReport } from '../ndbapi';
import { Report } from '../ndbapi/classes';

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

export function getIngredient(ingredientable: UIDed): Promise<Ingredient> {
  console.log('Getting ingredient\n' + JSON.stringify(ingredientable));
  // TODO figure out how to actually distinguish how to search for them.  DAO?
  if (ingredientable.uid.length > 10) {
    return new Promise((resolve, reject) => resolve(
      loadIngredient(ingredientable.uid))
    );
  } else {
    return getReport(ingredientable.uid).then(
      (report) => ingredientFromReport(report));
  }
}

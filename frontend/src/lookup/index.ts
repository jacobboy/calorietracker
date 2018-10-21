import { Ingredient, ingredientFromReport, UIDed, NDBable } from '../classes';
import { queryReport } from '../ndbapi';
import { Report } from '../ndbapi/classes';
import { isIngredientKey, loadIngredient, loadReport, saveReport } from '../storage';

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
  // TODO figure out how to actually distinguish how to search for them.  
  // DAO?  Dependency injection?
  if (isIngredientKey(ingredientable.uid)) {
    return new Promise((resolve, reject) => resolve(
      loadIngredient(ingredientable.uid))
    );
  } else {
    // haha gross
    const ndbable = <NDBable> ingredientable;
    return getReport(ndbable.ndbno).then(
      (report) => ingredientFromReport(report));
  }
}

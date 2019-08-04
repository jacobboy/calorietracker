import { GOV_API_KEY } from '../apikey';
import { SearchItem, DefaultApi, Nutrients, FoodFood } from 'src/usdaclient';
import { NamedMacros } from 'src/client';

export enum DataSource {
  SR = 'SR',
  BL = 'BL',
  Any = 'Any'
}

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

// TODO temporary hack where the client knows how the server creates a Usda NamedMacro
export function getNamedMacrosFromSearchItem(
  searchItem: SearchItem
): Promise<NamedMacros> {
  return new DefaultApi().reports(
    { apiKey: GOV_API_KEY, ndbno: [searchItem.ndbno] }
  ).then(
    (report) => macrosFromFood(report.foods[0].food)
  );
}

function macrosFromFood(food: FoodFood): NamedMacros {
  const ndbno = food.desc.ndbno;
  return {
    uid: `ndbno::v1::${ndbno}`,
    name: food.desc.name,
    protein: findNutrient(food, PROTEIN_ID),
    fat: findNutrient(food, FAT_ID),
    carbs: findNutrient(food, CARB_ID),
    calories: findNutrient(food, CALORIES_ID),
    // https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORTV2.md
    // states that values are expressed in amount per 100g
    amount: 100,
    unit: food.desc.ru
  };
}

function findNutrient(food: FoodFood, nutrientId: string): number {
  return parseFloat(
    food.nutrients.filter(function (nutrient: Nutrients) {
      return nutrient.nutrientId === nutrientId;
    })[0].value
  );
}
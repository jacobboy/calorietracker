import { GOV_API_KEY } from '../apikey';
import { SearchItem, DefaultApi, Nutrients, FoodFood } from 'src/usdaclient';
import { Macros } from 'src/client';

export enum DataSource {
  SR = 'SR',
  BL = 'BL',
  Any = 'Any'
}

const CALORIES_ID = '208';
const PROTEIN_ID = '203';
const FAT_ID = '204';
const CARB_ID = '205';

export function getMacrosFromSearchItem(searchItem: SearchItem): Promise<{
  ndbNo: string, macros: Macros, amount: number, unit: string
}> {
  return new DefaultApi().reports(
    {apiKey: GOV_API_KEY, ndbno: [searchItem.ndbno]}
    ).then(
      (report) => macrosFromFood(report.foods[0].food)
    );
  }

function macrosFromFood(food: FoodFood): {ndbNo: string, macros: Macros, amount: number, unit: string} {
    return {
      ndbNo: food.desc.ndbno,
      macros: {
        protein: findNutrient(food, PROTEIN_ID),
        fat: findNutrient(food, FAT_ID),
        carbs: findNutrient(food, CARB_ID),
        calories: findNutrient(food, CALORIES_ID)
      },
      // https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORTV2.md
      // states that values are expressed in amount per 100g
      amount: 100,
      unit: food.desc.ru
    };
  }

function findNutrient(food: FoodFood, nutrientId: string): number {
  return parseFloat(
    food.nutrients.filter(function(nutrient: Nutrients) {
      return nutrient.nutrientId === nutrientId;
    })[0].value
  );
}
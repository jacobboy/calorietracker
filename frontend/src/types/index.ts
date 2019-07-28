import { DataSource } from '../ndbapi';
import {
  getAllCustomIngredients,
  getAllRecipes,
 } from '../storage';
import { AmountOfNamedMacros, NamedMacros, Meal } from 'src/client';

export interface SavedState {
  ingredients: NamedMacros[];
  recipes: NamedMacros[];
}

export interface SearchState {
  searchString: string;
  dataSource: string;
  items: NamedMacros[];
}

export interface TrackingState {
  mealIdx?: number;
  ingredient?: NamedMacros;
}

export enum TopBitDisplay {
  MEALS, CREATE_INGREDIENT, CREATE_RECIPE
}

export enum Modals {
  NONE, TRACKING, INGREDIENT, RECIPE
}

export class TopBitState {
  display: TopBitDisplay;
  recipe: {
    foods: AmountOfNamedMacros[],
    /* amount: number,
    unit: FOOD_UNIT */
  };
}

export interface StoreState {
  topbit: TopBitState;
  search: SearchState;
  tracking: TrackingState;
  today: Meal[];
  saved: SavedState;
}

export const emptyState: StoreState = {
  topbit: {
    display: TopBitDisplay.MEALS,
    recipe: {
      foods: [],
      /* amount: 100,
      unit: FOOD_UNIT.g */
    }
  },
  search: {
    searchString: '',
    dataSource: DataSource.SR,
    items: []
  },
  tracking: {
    mealIdx: undefined,
    ingredient: undefined
  },
  today: [],
  saved: {
    ingredients: [],
    recipes: []
  }
};

export const initialState: StoreState = {
  ...emptyState,
  saved: {
    ...emptyState.saved,
    ingredients: getAllCustomIngredients(),
    recipes: getAllRecipes()
  }
};

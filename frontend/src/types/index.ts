import { Meal, Ingredient, Recipe, Named, NDBed } from '../classes';
import { DataSource } from '../ndbapi';
import {
  getAllCustomIngredients,
  getAllStoredIngredients,
  getAllRecipes,
 } from '../storage';

export interface SavedState {
  ndbs: Ingredient[];
  ingredients: Ingredient[];
  recipes: Recipe[];
}

export interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: (NDBed & Named)[];
}

export interface TrackingState {
  mealIdx?: number;
  ingredient?: Ingredient;
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
    foods: Ingredient[],
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
    ndbs: [],
    ingredients: [],
    recipes: []
  }
};

export const initialState: StoreState = {
  ...emptyState,
  saved: {
    ...emptyState.saved,
    ndbs: getAllStoredIngredients(),
    ingredients: getAllCustomIngredients(),
    recipes: getAllRecipes()
  }
};

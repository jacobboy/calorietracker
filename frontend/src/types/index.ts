import { Meal, Ingredient, Recipe, Named, NDBed } from '../classes';
import { DataSource } from '../ndbapi';
import { 
  getAllCustomIngredients, 
  getAllStoredIngredients, 
  getAllRecipes,
 } from '../storage';

interface SavedState {
  ndbs: Ingredient[];
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: (NDBed & Named)[];
}

interface TrackingState {
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
  recipe: Ingredient[];
}

export interface StoreState {
  topbit: TopBitState;
  search: SearchState;
  tracking: TrackingState;
  today: Meal[];
  saved: SavedState;
}

export const initialState: StoreState = {
  topbit: { 
    display: TopBitDisplay.MEALS,
    recipe: []
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
    ndbs: getAllStoredIngredients(),
    ingredients: getAllCustomIngredients(),
    recipes: getAllRecipes()
  }
};

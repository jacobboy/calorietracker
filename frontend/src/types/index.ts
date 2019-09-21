import { DataSource } from '../ndbapi';
import { AmountOfNamedMacros, NamedMacros, Meal } from '../client';
import { SearchItem } from 'src/usdaclient';

export interface SavedState {
  recentIngredients: NamedMacros[];
  recentRecipes: NamedMacros[];
  searchIngredients: NamedMacros[];
  searchRecipes: NamedMacros[];
}

export interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: SearchItem[];
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
  today: [],
  saved: {
    recentIngredients: [],
    recentRecipes: [],
    searchIngredients: [],
    searchRecipes: []
  }
};

export const initialState: StoreState = {
  ...emptyState,
  saved: {
    ...emptyState.saved,
    recentIngredients: [],
    recentRecipes: []
  }
};

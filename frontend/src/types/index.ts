import { Meal, Ingredient, Recipe } from '../classes';
import { DataSource } from '../ndbapi';
import { SearchListItem } from '../ndbapi/classes';

interface CreatedState {
  ingredients: Ingredient[];
  recipes: Recipe[];
}

interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: SearchListItem[];
}

interface TrackingState {
  showModal: boolean;
  mealIdx?: number;
  ingredientId?: string;
}

export interface StoreState {
  search: SearchState;
  tracking: TrackingState;
  today: Meal[];
  created: CreatedState;
}

export const initialState: StoreState = {
  search: {
    searchString: '',
    dataSource: DataSource.SR,
    items: []
  },
  tracking: {
    showModal: false,
    mealIdx: undefined,
    ingredientId: undefined
  },
  today: [],
  created: {
    ingredients: [],
    recipes: []
  }
};

import * as constants from '../constants';
import { DataSource } from '../ndbapi';
import { SearchListItem } from '../classes';

export interface SelectDataSource {
  type: constants.SELECT_DATASOURCE;
  dataSource: DataSource;
}

export interface FoodSearchInput {
  type: constants.FOODSEARCH_INPUT;
  searchString: string;
}

export interface FoodSearchSubmit {
  type: constants.FOODSEARCH_SUBMIT;
  items: SearchListItem[];
}

export interface FoodDetailsClick {
  type: constants.FOODDETAILS_CLICK;
  ndbno: string;
}

export interface FoodTrackClick {
  type: constants.FOODTRACK_CLICK;
  ndbno: string;
}

export interface AddIngredient {
  type: constants.ADD_INGREDIENT;
  // name: string;
}

export interface AddRecipe {
  type: constants.ADD_RECIPE;
  // name: string;
}

export type AddAction =
  | AddIngredient
  | AddRecipe
  | SelectDataSource
  | FoodSearchInput
  | FoodSearchSubmit
  | FoodDetailsClick
  | FoodTrackClick;

export function selectDataSource(ds: DataSource): SelectDataSource {
  return {
    type: constants.SELECT_DATASOURCE,
    dataSource: ds
  };
}

export function foodSearchInput(searchString: string): FoodSearchInput {
  return {
    type: constants.FOODSEARCH_INPUT,
    searchString
  };
}

export function foodSearchSubmit(items: SearchListItem[]): FoodSearchSubmit {
  return {
    type: constants.FOODSEARCH_SUBMIT,
    items
  };
}

export function foodDetailsClick(ndbno: string): FoodDetailsClick {
  return {
    type: constants.FOODDETAILS_CLICK,
    ndbno
  };
}

export function foodTrackClick(ndbno: string): FoodTrackClick {
  return {
    type: constants.FOODTRACK_CLICK,
    ndbno
  };
}

export function addIngredient(): AddIngredient {
  return {
    type: constants.ADD_INGREDIENT
  };
}

export function addRecipe(): AddRecipe {
  return {
    type: constants.ADD_RECIPE
  };
}

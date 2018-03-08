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
  | FoodSearchSubmit;

export function selectDataSource(ds: DataSource): SelectDataSource {
  return {
    type: constants.SELECT_DATASOURCE,
    dataSource: ds
  };
}

export function foodSearchInput(searchString: string) {
  return {
    type: constants.FOODSEARCH_INPUT,
    searchString
  };
}

export function foodSearchSubmit(items: SearchListItem[]) {
  return {
    type: constants.FOODSEARCH_SUBMIT,
    items
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

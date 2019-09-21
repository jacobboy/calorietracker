import { Actions } from '../actions';
import { StoreState, TopBitDisplay } from '../types/index';
import {
  CREATE_INGREDIENT_SUCCEEDED,
  CREATE_INGREDIENT_TOGGLE,
  CREATE_RECIPE_OPEN,
  CREATE_RECIPE_SUCCEEDED,
  ADD_FOOD_TO_RECIPE,
  REMOVE_FOOD_FROM_RECIPE,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  ADD_MEAL,
  REMOVE_MEAL,
  CHANGE_DAY,
  REPLACE_FOOD_IN_RECIPE,
  REPLACE_FOOD_IN_MEAL,
  ADD_FOODS_TO_RECIPE,
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_RECIPES_SUCCESS,
  SAVE_SEARCH_ITEM_SUCCEEDED,
  MACROMACRO_FOODSEARCH_SUCCESS,
  USDA_FOODSEARCH_SUCCESS,
  USDA_FOODSEARCH_FAILED,
  MACROMACRO_FOODSEARCH_FAILED
} from '../constants/index';
import { dropIndex, replaceElement, replaceObject } from '../datautil';
import { AmountOfNamedMacros, Meal } from '../client';
import { actionChannel } from 'redux-saga/effects';

function mealIdxOrLast(state: StoreState, mealIdx?: number) {
  return mealIdx === undefined ? state.today.length - 1 : mealIdx;
}

function addFoodToMeal(
  state: StoreState,
  payload: { mealIdx?: number; food: AmountOfNamedMacros }
): StoreState {
  const idx = mealIdxOrLast(state, payload.mealIdx);
  const currentMeal = state.today[idx];
  const newMeal: Meal = {uid: currentMeal.uid, foods: [...state.today[idx].foods, payload.food]};
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

function removeFoodFromMeal(
  state: StoreState,
  payload: { mealIdx: number; food: AmountOfNamedMacros }
) {
  const idx = mealIdxOrLast(state, payload.mealIdx);
  const currentMeal = state.today[idx];
  // console.log(`removing food ${JSON.stringify(payload.food)} from meal ${idx}`);
  const newMeal = {uid: currentMeal.uid, foods: state.today[idx].foods.filter(f => f !== payload.food)};
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

export function reducer(state: StoreState, action: Actions): StoreState {
  // console.log('Handling: ' + action.type);
  switch (action.type) {
    case LOAD_INGREDIENTS_SUCCESS:
      return {
        ...state,
        saved: {
          ...state.saved,
          recentIngredients: action.payload
        }
      };
    case LOAD_RECIPES_SUCCESS:
      return {
        ...state,
        saved: {
          ...state.saved,
          recentRecipes: action.payload
        }
      };
    case SELECT_DATASOURCE:
      return {
        ...state,
        search: {
          ...state.search,
          dataSource: action.payload
        }
      };
    case FOODSEARCH_INPUT:
      return {
        ...state,
        search: {
          ...state.search,
          searchString: action.payload
        }
      };
    case USDA_FOODSEARCH_SUCCESS:
      return {
        ...state,
        search: {
          ...state.search,
          items: action.payload
        }
      };
    case USDA_FOODSEARCH_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          items: []
        }
      };
    case MACROMACRO_FOODSEARCH_SUCCESS:
      return {
        ...state,
        saved: {
          ...state.saved,
          searchIngredients: action.payload.ingredients,
          searchRecipes: action.payload.recipes
        }
      };
    case MACROMACRO_FOODSEARCH_FAILED:
      return {
        ...state,
        saved: {
          ...state.saved,
          searchIngredients: []
        }
      };
      case ADD_MEAL:
      return {
        ...state,
        // TODO lol
        today: [...state.today, {uid: '12', foods: []}]
      };
    case REMOVE_MEAL:
      return {
        ...state,
        today: dropIndex(state.today, action.payload)
      };
    case REPLACE_FOOD_IN_MEAL:
      // TODO implement this in order to alter meal ingredient amounts
      // is that even something valuable?
      return {
        ...state
      };
    case ADD_FOOD_TO_MEAL:
      return addFoodToMeal(state, action.payload);
    case REMOVE_FOOD_FROM_MEAL:
      return removeFoodFromMeal(state, action.payload);
    case CREATE_INGREDIENT_TOGGLE:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          display: action.payload
        }
      };
    case CREATE_INGREDIENT_SUCCEEDED:
      return {
        ...state,
        saved: {
          ...state.saved,
          recentIngredients: [...state.saved.recentIngredients, action.payload].sort(
            (l, r) => (l.name < r.name ? -1 : 1)
          )
        }
      };
    case CREATE_RECIPE_OPEN:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          display: TopBitDisplay.CREATE_RECIPE
        }
      };
    case REPLACE_FOOD_IN_RECIPE:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          recipe: {
            ...state.topbit.recipe,
            foods: replaceObject(
              state.topbit.recipe.foods,
              action.payload.from,
              action.payload.to
            )
          }
        }
      };
    case ADD_FOOD_TO_RECIPE:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          recipe: {
            ...state.topbit.recipe,
            foods: [...state.topbit.recipe.foods, action.payload]
          }
        }
      };
    case ADD_FOODS_TO_RECIPE:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          recipe: {
            ...state.topbit.recipe,
            // TODO copy total amount and all that if current recipe is empty
            foods: [...state.topbit.recipe.foods, ...action.payload.foods]
          }
        }
      };
    case REMOVE_FOOD_FROM_RECIPE:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          recipe: {
            ...state.topbit.recipe,
            foods: state.topbit.recipe.foods.filter(f => f !== action.payload)
          }
        }
      };
    case CREATE_RECIPE_SUCCEEDED:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          recipe: { ...state.topbit.recipe, foods: [] }
        },
        saved: {
          ...state.saved,
          recentRecipes: [...state.saved.recentRecipes, action.payload]
        }
      };
    case SAVE_SEARCH_ITEM_SUCCEEDED:
      return {
        ...state,
        saved: {
          ...state.saved,
          recentIngredients: [...state.saved.recentIngredients, action.payload]
        }
      };
    case CHANGE_DAY:
      return state;
    default:
      return state;
  }
}

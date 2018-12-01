import { Actions } from '../actions';
import { StoreState, TopBitDisplay } from '../types/index';
import {
  CREATE_INGREDIENT_TOGGLE,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_OPEN,
  ADD_FOOD_TO_RECIPE,
  REMOVE_FOOD_FROM_RECIPE,
  CREATE_RECIPE_SUBMIT,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  ADD_MEAL,
  REMOVE_MEAL,
  CHANGE_DAY,
  SAVE_INGREDIENT,
  REPLACE_FOOD_IN_RECIPE,
  REPLACE_FOOD_IN_MEAL,
  ADD_FOODS_TO_RECIPE
} from '../constants/index';
import { dropIndex, replaceElement, replaceObject } from '../datautil';
import { meal, Ingredient, Meal } from '../classes';

function mealIdxOrLast(state: StoreState, mealIdx?: number) {
  return mealIdx === undefined ? state.today.length - 1 : mealIdx;
}

function addFoodToMeal(
  state: StoreState,
  payload: { mealIdx?: number; food: Ingredient }
): StoreState {
  const idx = mealIdxOrLast(state, payload.mealIdx);
  const newMeal: Meal = state.today[idx].withFood(payload.food);
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

function removeFoodFromMeal(
  state: StoreState,
  payload: { mealIdx: number; food: Ingredient }
) {
  const idx = mealIdxOrLast(state, payload.mealIdx);
  // console.log(`removing food ${JSON.stringify(payload.food)} from meal ${idx}`);
  const newMeal = state.today[idx].withoutFood(payload.food);
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

export function reducer(state: StoreState, action: Actions): StoreState {
  // console.log('Handling: ' + action.type);
  switch (action.type) {
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
    case FOODSEARCH_SUBMIT:
      return {
        ...state,
        search: {
          ...state.search,
          items: action.payload
        }
      };
    case ADD_MEAL:
      return {
        ...state,
        today: [...state.today, meal([])]
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
    case CREATE_INGREDIENT_SUBMIT:
      return {
        ...state,
        saved: {
          ...state.saved,
          ingredients: [...state.saved.ingredients, action.payload].sort(
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
            foods: [...state.topbit.recipe.foods, ...action.payload]
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
    case CREATE_RECIPE_SUBMIT:
      return {
        ...state,
        topbit: {
          ...state.topbit,
          recipe: { ...state.topbit.recipe, foods: [] }
        },
        saved: {
          ...state.saved,
          recipes: [...state.saved.recipes, action.payload]
        }
      };
    case SAVE_INGREDIENT:
      return {
        ...state,
        saved: {
          ...state.saved,
          ndbs: [...state.saved.ndbs, action.payload]
        }
      };
    case CHANGE_DAY:
      return state;
    default:
      return state;
  }
}

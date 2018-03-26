import { Actions } from '../actions';
import { StoreState } from '../types/index';
import {
  CREATE_INGREDIENT_OPEN,
  CREATE_INGREDIENT_SUBMIT,
  CREATE_RECIPE_SUBMIT,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  FOODDETAILS_CLICK,
  FOODTRACK_CLICK,
  CLOSE_MODAL,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  ADD_MEAL,
  REMOVE_MEAL,
  CHANGE_DAY
} from '../constants/index';
import { dropElement, replaceElement } from '../datautil';
import { meal, Food } from '../classes';

function mealIdxOrLast(state: StoreState, mealIdx?: number) {
  return mealIdx || (state.today.length - 1);
}

function addFoodToMeal(
  state: StoreState,
  payload: { mealIdx: number, food: Food }
) {
  const idx = mealIdxOrLast(state, payload.mealIdx);
  const newMeal = state.today[idx].withFood(payload.food);
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

function removeFoodFromMeal(
  state: StoreState,
  payload: { mealIdx: number, food: Food }
) {
  const idx = mealIdxOrLast(state, payload.mealIdx);
  const newMeal = state.today[idx].withoutFood(payload.food);
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

export function reducer(state: StoreState, action: Actions): StoreState {
  function mealIdx(payload?: number) {
    return mealIdxOrLast(state, payload);
  }

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
    case FOODDETAILS_CLICK:
      return { ...state };
    case FOODTRACK_CLICK:
      return {
        ...state,
        tracking: {
          ...state.tracking,
          ingredient: action.payload.ingredient,
          mealIdx: mealIdx(action.payload.mealIdx),
        },
        modals: state.modals.openTrackingModal()
      };
    case CLOSE_MODAL:
      return {
        ...state,
        tracking: {
          ...state.tracking,
          ingredient: undefined,
          mealIdx: undefined,
        },
        modals: state.modals.close()
      };
    case ADD_MEAL:
      return {
        ...state,
        today: [...state.today, meal([])]
      };
    case REMOVE_MEAL:
      return {
        ...state,
        today: dropElement(state.today, action.payload)
      };
    case ADD_FOOD_TO_MEAL:
      return addFoodToMeal(state, action.payload);
    case REMOVE_FOOD_FROM_MEAL:
      return removeFoodFromMeal(state, action.payload);
    case CREATE_INGREDIENT_OPEN:
      return {
        ...state,
        modals: state.modals.openIngredientModal(),
        search: {
          ...state.search,
          items: [...state.search.items]
        }
      };
    case CREATE_INGREDIENT_SUBMIT:
      return {
        ...state,
        created: {
          ...state.created,
          ingredients: state.created.ingredients.concat(action.payload)
        }
      };
    case CREATE_RECIPE_SUBMIT:
      return {
        ...state,
        created: {
          ...state.created,
          // recipes: state.created.recipes.concat(action.payload)
        }
      };
    case CHANGE_DAY:
      return state;
    default:
      return state;
  }
}

import { Actions } from '../actions';
import { StoreState } from '../types/index';
import {
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  FOODDETAILS_CLICK,
  FOODTRACK_CLICK,
  CLOSE_TRACKING_MODAL,
  ADD_FOOD_TO_MEAL,
  REMOVE_FOOD_FROM_MEAL,
  CREATE_INGREDIENT,
  CREATE_RECIPE,
  ADD_MEAL,
  REMOVE_MEAL
} from '../constants/index';
import { dropElement, replaceElement } from '../datautil';
import { meal, Food } from '../classes';

function mealIdxFromState(state: StoreState, mealIdx?: number) {
  return mealIdx || (state.today.length - 1);
}

function addFoodToMeal(
  state: StoreState,
  payload: { mealIdx: number, food: Food }
) {
  const idx = mealIdxFromState(state, payload.mealIdx);
  const newMeal = state.today[idx].withFood(payload.food);
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

function removeFoodFromMeal(
  state: StoreState,
  payload: { mealIdx: number, food: Food }
) {
  const idx = mealIdxFromState(state, payload.mealIdx);
  const newMeal = state.today[idx].withoutFood(payload.food);
  const today = replaceElement(state.today, idx, newMeal);
  return { ...state, today };
}

export function reducer(state: StoreState, action: Actions): StoreState {
  function mealIdx(payload?: number) {
    return mealIdxFromState(state, payload);
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
          ingredientId: action.payload.ingredientId,
          mealIdx: mealIdx(action.payload.mealIdx),
          showModal: true
        }
      };
    case CLOSE_TRACKING_MODAL:
      return {
        ...state,
        tracking: {
          ...state.tracking,
          ingredientId: undefined,
          mealIdx: undefined,
          showModal: false
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
        today: dropElement(state.today, action.payload)
      };
    case ADD_FOOD_TO_MEAL:
      return addFoodToMeal(state, action.payload);
    case REMOVE_FOOD_FROM_MEAL:
      return removeFoodFromMeal(state, action.payload);
    case CREATE_INGREDIENT:
      return {
        ...state,
        search: {
          ...state.search,
          items: [...state.search.items]
        }
      };
    case CREATE_RECIPE:
      return {
        ...state,
        search: {
          ...state.search,
          items: [...state.search.items]
        }
      };
    default:
      return state;
  }
}

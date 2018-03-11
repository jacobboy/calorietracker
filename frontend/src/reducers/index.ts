import { Actions } from '../actions';
import { StoreState } from '../types/index';
import {
  ADD_INGREDIENT,
  ADD_RECIPE,
  SELECT_DATASOURCE,
  FOODSEARCH_INPUT,
  FOODSEARCH_SUBMIT,
  FOODDETAILS_CLICK,
  FOODTRACK_CLICK
} from '../constants/index';

export function reducer(state: StoreState, action: Actions): StoreState {
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
      return { ...state };
    case ADD_INGREDIENT:
      return {
        ...state,
        search: {
          ...state.search,
          items: [...state.search.items]
        }
      };
    case ADD_RECIPE:
      return {
        ...state,
        search: {
          ...state.search,
          items: [...state.search.items]
        }
      };
    default:
      console.log('No handler for:\n' + JSON.stringify(action));
      return state;
  }
}

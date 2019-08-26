import { loadInitialIngredients, loadInitialRecipes, searchFood } from './sagas';
import {
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_INGREDIENTS_FAILED,
  LOAD_RECIPES_SUCCESS,
  LOAD_RECIPES_FAILED,
  FOODSEARCH_SUCCESS,
  FOODSEARCH_FAILED
} from './constants';
import { put } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { DataSource } from './ndbapi';
import { actions } from './actions';

describe('The load ingredients saga', () => {
  const gen = cloneableGenerator(loadInitialIngredients)();
  gen.next();
/*   it('calls MacroMacroFp.findIngredients', () => {
    // TODO how am i supposed to assert this?
    expect(gen.next().value).toEqual(call(MacroMacroFp().findIngredients()));
  }); */
  it('puts a LOAD_INGREDIENT_SUCCESS on success', () => {
    expect(gen.clone().next([]).value).toEqual(put({ type: LOAD_INGREDIENTS_SUCCESS, payload: [] }));
  });

  it('puts a LOAD_INGREDIENT_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({message: 'sup'}).value).toEqual(put({ type: LOAD_INGREDIENTS_FAILED, payload: 'sup' }));
    } else {
      throw('clone not throwable');
    }
  });
});

describe('The load recipes saga', () => {
  const gen = cloneableGenerator(loadInitialRecipes)();
  gen.next();
/*   it('calls MacroMacroFp.findIngredients', () => {
    // TODO how am i supposed to assert this?
    expect(gen.next().value).toEqual(call(MacroMacroFp().findIngredients()));
  }); */
  it('puts a LOAD_RECIPES_SUCCESS on success', () => {
    expect(gen.clone().next(['resp']).value)
    .toEqual(put({ type: LOAD_RECIPES_SUCCESS, payload: ['resp'] }));
  });

  it('puts a LOAD_RECIPES_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({message: 'sup'}).value)
      .toEqual(put({ type: LOAD_RECIPES_FAILED, payload: 'sup' }));
    } else {
      throw('clone not throwable');
    }

  });
});

describe('The search food saga', () => {
  const action = actions.foodSearchSubmit('searchString', DataSource.BL);
  const gen = cloneableGenerator(searchFood)(action);
  gen.next();
  // TODO how do i assert it uses the datasource?
  it('puts a FOODSEARCH_SUCCESS on success', () => {
    expect(gen.clone().next({list: {item: ['resp']}}).value)
    .toEqual(put({ type: FOODSEARCH_SUCCESS, payload: {'searchResults': ['resp'] }}));
  });

  it('puts a FOODSEARCH_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({'message': 'sup'}).value)
      .toEqual(put({ type: FOODSEARCH_FAILED }));
    } else {
      throw('clone not throwable');
    }

  });
});
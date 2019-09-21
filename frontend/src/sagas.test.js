import {
  loadInitialIngredients,
  loadInitialRecipes,
  searchMacroMacroForFood,
  searchUsdaForFood,
  saveRecipe
} from './sagas';
import {
  LOAD_INGREDIENTS_SUCCESS,
  LOAD_INGREDIENTS_FAILED,
  LOAD_RECIPES_SUCCESS,
  LOAD_RECIPES_FAILED,
  MACROMACRO_FOODSEARCH_SUCCESS,
  MACROMACRO_FOODSEARCH_FAILED,
  USDA_FOODSEARCH_SUCCESS,
  USDA_FOODSEARCH_FAILED,
  CREATE_RECIPE_SUCCEEDED
} from './constants';
import { put } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';
import { DataSource } from './ndbapi';
import { actions } from './actions';
import { FOOD_UNIT } from './classes';
import { NamedMacros } from './client';

describe('The load ingredients saga', () => {
  const gen = cloneableGenerator(loadInitialIngredients)();
  gen.next();
  /*   it('calls MacroMacroFp.findIngredients', () => {
      // TODO how am i supposed to assert this?
      expect(gen.next().value).toEqual(call(MacroMacroFp().findIngredients()));
    }); */
  const foundMacros: NamedMacros[] = [];
  it('puts a LOAD_INGREDIENT_SUCCESS on success', () => {
    expect(gen.clone().next(foundMacros).value).toEqual(put({ type: LOAD_INGREDIENTS_SUCCESS, payload: foundMacros }));
  });

  it('puts a LOAD_INGREDIENT_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({ message: 'sup' }).value).toEqual(put({ type: LOAD_INGREDIENTS_FAILED, payload: 'sup' }));
    } else {
      throw ('clone not throwable');
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
      expect(clone.throw({ message: 'sup' }).value)
        .toEqual(put({ type: LOAD_RECIPES_FAILED, payload: 'sup' }));
    } else {
      throw ('clone not throwable');
    }
  });
});

describe('The MacroMacro search food saga', () => {
  const action = actions.foodSearchSubmit('searchString', DataSource.BL);
  const gen = cloneableGenerator(searchMacroMacroForFood)(action);
  gen.next();
  // TODO how do i assert it uses the datasource?
  it('puts a FOODSEARCH_SUCCESS on success', () => {
    expect(gen.clone().next(['resp']).value)
      .toEqual(put({ type: MACROMACRO_FOODSEARCH_SUCCESS, payload: ['resp'] }));
  });

  it('puts a FOODSEARCH_FAILED on failure', () => {
    const clone = gen.clone();
    if (clone.throw) {
      expect(clone.throw({ 'message': 'sup' }).value)
        .toEqual(put({ type: MACROMACRO_FOODSEARCH_FAILED }));
    } else {
      throw ('clone not throwable');
    }
  });
});

describe('The create recipe saga', () => {
  const action = actions.saveRecipe('name', [], 12, 13, FOOD_UNIT.g);
  const gen = cloneableGenerator(saveRecipe)(action);
  gen.next();
  // TODO how do i assert it uses the datasource?
  it('puts a CREATE_RECIPE_SUCCEEDED on success', () => {
    expect(gen.clone().next('recipe').value)
      .toEqual(put({ type: CREATE_RECIPE_SUCCEEDED, payload: 'recipe' }));
  });
});
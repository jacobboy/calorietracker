import * as React from 'react';
import * as enzyme from 'enzyme';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { SearchState, SavedState } from '../types';
import SearchComponent from '../containers/search';
import { DataSource } from '../ndbapi';
import { SearchItem } from '../usdaclient';
import { actions } from '../actions';

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  // TODO tests work, but how do pros test connected components in typescript?
  let store: {
    getState: () => {
      search:  SearchState,
      saved: SavedState
     },
    // tslint:disable-next-line:no-any
    dispatch: any,
    // tslint:disable-next-line:no-any
    subscribe: any,
    // tslint:disable-next-line:no-any
    replaceReducer: any
  };
  let dispatch: () => null;

  beforeEach(() => {
    const searchString = 'butter';
    const dataSource = DataSource.Any;
    const items: SearchItem[] = [];
    const searchState = {
      search: { searchString, dataSource, items },
      saved: { recentRecipes: [], recentIngredients: [], searchRecipes: [], searchIngredients: [] }
    };
    dispatch = jest.fn();
    store = {
      getState: () => searchState,
      dispatch,
      subscribe: jest.fn(),
      replaceReducer: jest.fn()
    };

    wrapper = mount(
      <Provider store={store}>
          <SearchComponent/>
      </Provider>
    );
  });

  it(`creates a FOODSEARCH_SUBMIT action on search`, () => {
    const searchString = 'butter';
    wrapper.find('#globalSearchInput').simulate('change', searchString);
    // TODO testing select change is a bit more complicated than I feel like dealing with rn
    // wrapper.find('#globalSearchDataSourceSelect').simulate('change', { target: { value: DataSource.BL } });
    wrapper.find('#globalSearchForm').simulate('submit');
    expect(dispatch).toHaveBeenCalledWith(actions.foodSearchSubmit(searchString, DataSource.Any));
  });
});

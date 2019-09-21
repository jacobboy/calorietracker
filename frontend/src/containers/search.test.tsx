import * as React from 'react';
import * as enzyme from 'enzyme';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import SearchComponent from '../containers/search';
import { DataSource } from '../ndbapi';
import { SearchItem } from '../usdaclient';
import { actions } from '../actions';
import { Store, createStore } from 'redux';

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: enzyme.ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  // TODO tests work, but how do pros test connected components in typescript?

  // tslint:disable-next-line:no-any
  let store: Store<{}, any>;
  // tslint:disable-next-line:no-any
  let createdActions: any[];

  beforeEach(() => {
    const searchString = 'butter';
    const dataSource = DataSource.Any;
    const items: SearchItem[] = [];
    const searchState = {
      search: { searchString, dataSource, items },
      saved: { recentRecipes: [], recentIngredients: [], searchRecipes: [], searchIngredients: [] }
    };
    createdActions = [];
    store = createStore(
      (state, a) => { createdActions.push(a); return state; },
      searchState
    );

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
    expect(createdActions).toContainEqual(actions.foodSearchSubmit(searchString, DataSource.Any));
  });
});

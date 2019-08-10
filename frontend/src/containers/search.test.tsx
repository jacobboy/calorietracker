import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { createStore, Store, AnyAction, Reducer } from 'redux';
import { Provider } from 'react-redux';
import { SearchState } from '../types';
import SearchComponent from '../containers/search';
import { DataSource } from '../ndbapi';
import { SearchItem } from '../usdaclient';
import { reducer } from '../reducers';
import { actions } from '../actions';

describe('When the track food button is clicked', () => {
  // tslint:disable-next-line:no-any
  let wrapper: ReactWrapper<any, Readonly<{}>, React.Component<{}, {}, any>>;
  let store: Store<{search: SearchState}, AnyAction>;
  let searchState: SearchState;

  beforeEach(() => {
    const searchString = 'butter';
    const dataSource = DataSource.Any;
    const items: SearchItem[] = [];
    searchState = { searchString, dataSource, items };
    // tslint:disable-next-line:no-any
    const reducer: Reducer<SearchState, any> = jest.fn();
    store = createStore(reducer, searchState);
    wrapper = mount(
      <Provider store={store}>
          <SearchComponent/>
      </Provider>
    );
  });

  it(`creates a FOODSEARCH_SUBMIT action on search`, () => {
    wrapper.find('#globalSearchInput').simulate('click');
    expect(reducer).toBeCalledWith(
      searchState, actions.foodSearchSubmit('butter', DataSource.Any)
    );
  });
};

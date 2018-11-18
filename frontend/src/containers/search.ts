import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { actions, Actions } from '../actions/';
import { SearchComponent } from '../components/search';
import { DataSource, searchFood } from '../ndbapi';
import { StoreState } from '../types/index';

function mapStateToProps(state: StoreState) {
  return {
    ...state.search,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onDataSourceSelect: (ds: DataSource) => {
      dispatch(actions.selectDataSource(ds));
    },
    onFoodSearchInput: (searchString: string) => {
      dispatch(actions.foodSearchInput(searchString));
    },
    onFoodSearchSubmit: (searchString: string, ds: DataSource) => {
      console.log('Searching food ' + searchString);
      searchFood(searchString, ds).then(
        (searchListItems) => dispatch(
          actions.foodSearchSubmit(searchListItems)
        ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { actions, Actions } from '../actions/';
import { SearchComponent } from '../components/search';
import { StoreState } from '../types/index';

function mapStateToProps(state: StoreState) {
  return {
    ...state.search,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onDataSourceSelect: (ds: string) => {
      dispatch(actions.selectDataSource(ds));
    },
    onFoodSearchInput: (searchString: string) => {
      dispatch(actions.foodSearchInput(searchString));
    },
    onFoodSearchSubmit: (searchString: string, ds: String) => {
      console.log('Searching food ' + searchString);
      actions.foodSearchSubmit(searchString, ds);
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);

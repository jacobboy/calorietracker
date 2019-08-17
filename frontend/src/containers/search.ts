import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { actions, Actions, sagaActions } from '../actions/';
import { SearchComponent } from '../components/search';
import { StoreState } from '../types/index';
import { DataSource } from 'src/ndbapi';

function mapStateToProps(state: StoreState) {
  return {
    ...state.search,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onLoad: () => {
      dispatch(sagaActions.loadIngredientsAndRecipes());
    },
    onDataSourceSelect: (ds: DataSource) => {
      dispatch(actions.selectDataSource(ds));
    },
    onFoodSearchInput: (searchString: string) => {
      dispatch(actions.foodSearchInput(searchString));
    },
    onFoodSearchSubmit: (searchString: string, ds: DataSource) => {
      dispatch(sagaActions.foodSearchSubmit(searchString, ds));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);

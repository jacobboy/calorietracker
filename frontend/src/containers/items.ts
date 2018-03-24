import { connect, Dispatch } from 'react-redux';
import { actions, Actions } from '../actions/';
import { ItemsComponent } from '../components/items';
import { DataSource, searchFood } from '../ndbapi';
import { SearchList } from '../ndbapi/classes';
import { StoreState } from '../types/index';

function mapStateToProps(state: StoreState) {
  return {
    ...state.search,
    ingredients: state.created.ingredients,
    recipes: state.created.recipes
  };
  // return {
  //   value: state.search.value,
  //   dataSource: state.search.dataSource,
  //   items: state.search.items
  // };
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
      searchFood(searchString, ds).then(
        (searchList: SearchList) => searchList.item
      ).then((foods) => dispatch(actions.foodSearchSubmit(foods)));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsComponent);

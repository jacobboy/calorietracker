import { ItemsComponent } from '../components/items';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import { DataSource, searchFood } from '../ndbapi';
import { SearchList } from '../classes';

function mapStateToProps(state: StoreState) {
  return state.search;
  // return {
  //   value: state.search.value,
  //   dataSource: state.search.dataSource,
  //   items: state.search.items
  // };
}

function mapDispatchToProps(dispatch: Dispatch<actions.AddIngredient>) {
  return {
    onDataSourceSelect: (ds: DataSource) => {
      dispatch(actions.selectDataSource(ds));
    },
    onFoodSearchInput: (searchString: string) => {
      dispatch(actions.foodSearchInput(searchString));
    },
    onFoodSearchSubmit: (searchString: string, ds: DataSource) => {
      console.log(searchString);
      console.log(ds);
      searchFood(searchString, ds).then(
        (searchList: SearchList) => searchList.item
      ).then((foods) => dispatch(actions.foodSearchSubmit(foods)));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsComponent);

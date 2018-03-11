import { ItemComponent } from '../components/item';
import * as actions from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<actions.AddIngredient>) {
  return {
    onDetailsClick: (ndbno: string) => {
      console.log(ndbno);
    },
    onTrackClick: (ndbno: string) => {
      console.log(ndbno);
    }
    // onFoodSearchSubmit: (searchString: string, ds: DataSource) => {
    //   searchFood(searchString, ds).then(
    //     (searchList: SearchList) => searchList.item
    //   ).then((foods) => dispatch(actions.foodSearchSubmit(foods)));
    // }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemComponent);

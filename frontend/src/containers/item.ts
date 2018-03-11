import { ItemComponent } from '../components/item';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onDetailsClick: (ndbno: string) => {
      console.log(ndbno);
      actions.foodDetailsClick(ndbno);
    },
    onTrackClick: (ndbno: string) => {
      console.log(ndbno);
      actions.foodTrackClick(ndbno);
    }
    // onFoodSearchSubmit: (searchString: string, ds: DataSource) => {
    //   searchFood(searchString, ds).then(
    //     (searchList: SearchList) => searchList.item
    //   ).then((foods) => dispatch(actions.foodSearchSubmit(foods)));
    // }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemComponent);

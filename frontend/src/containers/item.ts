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
      dispatch(actions.foodDetailsClick(ndbno));
    },
    onTrackClick: (ingredientId: string) => {
      dispatch(actions.foodTrackClick(ingredientId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemComponent);

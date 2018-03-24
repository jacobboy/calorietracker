import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import { TrackingModal } from '../components/tracking';
import { Food } from '../classes';

function mapStateToProps(state: StoreState) {
  return { ...state.tracking, showModal: state.modals.tracking };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onCloseClick: () => { dispatch(actions.closeTrackingModal()); },
    onTrackSubmit: (mealIdx: number, food: Food) => {
      dispatch(actions.addFoodToMeal(mealIdx, food));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackingModal);

import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TrackFoodInput } from '../components/trackfoodinput';
import { Food } from '../classes';

function mapStateToProps(state: StoreState) {
  // TODO the type system isn't catching that mealIdx isn't
  //      guaranteed to be defined
  return { ...state.tracking };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onTrackSubmit: (mealIdx: number, food: Food) => {
      dispatch(actions.addFoodToMeal(mealIdx, food));
      dispatch(actions.closeModal());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackFoodInput);

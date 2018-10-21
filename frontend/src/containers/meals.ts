import { connect } from 'react-redux';
import { StoreState } from '../types';
import { MealsComponent } from '../components/meals';
import { actions, Actions } from '../actions';
import { Food } from '../classes';
import { Dispatch } from 'redux';

function mapStateToProps(state: StoreState) {
  return { today: state.today };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleAddMealClick: () => { dispatch(actions.addMeal()); },
    handleDeleteMealClick: (mealIdx: number) => {
      dispatch(actions.removeMeal(mealIdx));
    },
    handleRemoveFoodClick: (mealIdx: number, food: Food) => {
      dispatch(actions.removeFoodFromMeal(mealIdx, food));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MealsComponent);

import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../types';
import { MealsComponent } from '../components/meals';
import { actions, Actions } from '../actions';

function mapStateToProps(state: StoreState) {
  return { today: state.today };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleAddMeal: () => { dispatch(actions.addMeal()); },
    handleDeleteMeal: (mealIdx: number) => {
      const action = actions.removeMeal(mealIdx);
      console.log('Created action' + JSON.stringify(action));
      dispatch(action);
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MealsComponent);

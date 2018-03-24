import { connect, Dispatch } from 'react-redux';
import { StoreState } from '../types';
import { MealsComponent } from '../components/meals';
import { actions, Actions } from '../actions';
import { Food } from '../classes';

function mapStateToProps(state: StoreState) {
  return { today: state.today };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleAddMealClick: () => { dispatch(actions.addMeal()); },
    handleDeleteMealClick: (mealIdx: number) => {
      const action = actions.removeMeal(mealIdx);
      console.log('Created action' + JSON.stringify(action));
      dispatch(action);
    },
    handleRemoveFoodClick: (mealIdx: number, food: Food) => {
      dispatch(actions.removeFoodFromMeal(mealIdx, food));
    },
    handleCreateIngredientClick: () => {
      dispatch(actions.createIngredientOpen());
    },
    handleCreateRecipeClick: () => { dispatch(actions.createRecipeOpen()); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MealsComponent);

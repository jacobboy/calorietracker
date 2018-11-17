import { connect } from 'react-redux';
import { StoreState } from '../types';
import { MealsComponent } from '../components/meals';
import { actions, Actions } from '../actions';
import { Ingredient } from '../classes';
import { Dispatch } from 'redux';

function mapStateToProps(state: StoreState) {
  return { today: state.today };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    /* handleFoodAmountChange: (mealIdx: number, food: Ingredient, newAmount: number) => {
      dispatch(actions.changeMealFoodAmount(mealIdx, food, newAmount));
    }, */
    handleFoodAmountChange: (mealIdx: number, food: Ingredient, newAmount: number) => {
      dispatch(actions.changeMealFoodAmount(mealIdx, food, newAmount));
    },
    handleAddMealClick: () => { dispatch(actions.addMeal()); },
    handleDeleteMealClick: (mealIdx: number) => {
      dispatch(actions.removeMeal(mealIdx));
    },
    handleRemoveFoodClick: (mealIdx: number, food: Ingredient) => {
      dispatch(actions.removeFoodFromMeal(mealIdx, food));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MealsComponent);

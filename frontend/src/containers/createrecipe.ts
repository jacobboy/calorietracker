import { CreateRecipeInput } from '../components/createrecipe';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { FOOD_UNIT, Ingredient } from '../classes';

function mapStateToProps(state: StoreState) {
  return {
    foods: state.topbit.recipe.foods
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleRemoveFoodClick: (food: Ingredient) => {
      dispatch(actions.removeFoodFromRecipe(food));
    },
    handleSaveRecipeClick: (name: string, foods: Ingredient[], amount?: number, unit?: FOOD_UNIT) => {
        dispatch(actions.saveRecipe(name, foods, amount, unit));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipeInput);

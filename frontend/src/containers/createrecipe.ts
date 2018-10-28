import { CreateRecipeInput } from '../components/createrecipe';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { FOOD_UNIT, Ingredient } from '../classes';

function mapStateToProps(state: StoreState) {
  return {
    recipe: state.topbit.recipe
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleRemoveFoodClick: (foodIdx: number) => {
      dispatch(actions.removeFoodFromRecipe(foodIdx));
    },
    handleSaveRecipeClick: (name: string, foods: Ingredient[], amount?: number, unit?: FOOD_UNIT) => {
        dispatch(actions.createRecipeSubmit(name, foods, amount, unit));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipeInput);

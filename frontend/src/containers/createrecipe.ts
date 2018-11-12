import { CreateRecipeInput } from '../components/createrecipe';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Ingredient } from '../classes';

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
    handleSaveRecipeClick: (
      name: string, foods: Ingredient[], portionSize: number, totalSize: number, unit: string
    ) => {
        dispatch(actions.saveRecipe(name, foods, portionSize, totalSize, unit));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipeInput);

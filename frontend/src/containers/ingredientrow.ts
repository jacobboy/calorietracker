import { IngredientRow } from '../components/ingredientrow';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Ingredient } from '../classes';

function mapStateToProps(state: StoreState) {
  return {
    topbitDisplay: state.topbit.display
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onTrackClick: (ingredient: Ingredient) => {
      dispatch(actions.addFoodToMeal(ingredient));
    },
    onAddToRecipeClick: (ingredient: Ingredient) => {
      dispatch(actions.addFoodToRecipe(ingredient));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IngredientRow);

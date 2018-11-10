import { IngredientRow } from '../components/ingredientrow';
import { actions, Actions } from '../actions/';
import { StoreState, TopBitDisplay } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Ingredient } from '../classes';

function mapStateToProps(state: StoreState) {
  return {
    topbitDisplay: state.topbit.display,
    buttonText: state.topbit.display === TopBitDisplay.CREATE_RECIPE ? 'Add to recipe' : 'Add to meal'
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    // TODO: What is the approved react/redux way to condition
    //       the dispatch on state?
    //       Or should it be the same action, and the reducer handles it differently?
    onTrackClick: (ingredient: Ingredient, topbitDisplay: TopBitDisplay) => {
      if (topbitDisplay === TopBitDisplay.CREATE_RECIPE) {
        dispatch(actions.addFoodToRecipe(ingredient));
      } else if (topbitDisplay === TopBitDisplay.MEALS) {
        dispatch(actions.addFoodToMeal(ingredient));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IngredientRow);

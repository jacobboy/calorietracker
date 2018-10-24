import { IngredientRow } from '../components/ingredientrow';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Ingredient } from '../classes';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onTrackClick: (ingredient: Ingredient) => {
      dispatch(actions.addFoodToMeal(ingredient));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IngredientRow);

import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { actions, Actions } from '../actions';
import { Recipe } from '../classes';
import { StoredRecipes } from '../components/storedrecipes';
import { StoreState } from '../types/index';

function mapStateToProps(state: StoreState) {
  return {
    recipes: state.saved.recipes
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onCopyRecipeClick: (recipe: Recipe) => {
      dispatch(actions.addFoodsToRecipe(recipe.foods));
      dispatch(actions.createRecipeOpen());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredRecipes);

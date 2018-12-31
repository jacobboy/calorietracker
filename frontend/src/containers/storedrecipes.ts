import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { actions, Actions } from '../actions';
import { Ingredient } from '../classes';
import { StoredRecipes } from '../components/storedrecipes';
import { StoreState } from '../types/index';

function mapStateToProps(state: StoreState) {
  return {
    recipes: state.saved.recipes
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onCopyRecipeClick: (recipe: Ingredient) => {
      dispatch(actions.addFoodsToRecipe(recipe));
      dispatch(actions.createRecipeOpen());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredRecipes);

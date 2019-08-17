import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { actions, Actions, sagaActions } from '../actions';
import { StoredRecipes } from '../components/storedrecipes';
import { StoreState } from '../types/index';
import { NamedMacros } from 'src/client';

function mapStateToProps(state: StoreState) {
  return {
    recipes: state.saved.recipes
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onCopyRecipeClick: (recipe: NamedMacros) => {
      dispatch(sagaActions.copyRecipe(recipe.uid));
      dispatch(actions.createRecipeOpen());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredRecipes);

import { CreateRecipeInput } from '../components/createrecipe';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

function mapStateToProps(state: StoreState) {
  return {
    recipe: state.topbit.recipe
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleRemoveFoodClick: (foodIdx: number) => {
      dispatch(actions.removeFoodFromRecipe(foodIdx));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRecipeInput);

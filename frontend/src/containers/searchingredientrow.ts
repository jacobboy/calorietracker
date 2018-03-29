import { SearchIngredientRow } from '../components/searchingredientrow';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import { getIngredient } from '../lookup';
import { UIDed } from '../classes';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onTrackClick: (ingredientable: UIDed) => {
      getIngredient(ingredientable).then(
        (ingredient) => dispatch(actions.trackFood(ingredient)));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchIngredientRow);

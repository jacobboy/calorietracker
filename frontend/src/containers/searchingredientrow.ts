import { SearchIngredientRow } from '../components/searchingredientrow';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import { getIngredient } from '../ndbapi';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onDetailsClick: (ingredientId: string) => {
      dispatch(actions.foodDetailsClick(ingredientId));
    },
    onTrackClick: (ingredientId: string) => {
      getIngredient(ingredientId).then(
        (ingredient) => dispatch(actions.foodTrackClick(ingredient)));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchIngredientRow);

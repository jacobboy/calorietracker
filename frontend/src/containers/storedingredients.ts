import { connect } from 'react-redux';
/* import { Dispatch } from 'redux';
import { actions, Actions } from '../actions';
import { Ingredient } from '../classes'; */
import { StoredIngredients } from '../components/storedingredients';
import { StoreState } from '../types/index';

function mapStateToProps(state: StoreState) {
  return {
    ingredients: state.saved.ingredients
  };
}

export default connect(mapStateToProps)(StoredIngredients);

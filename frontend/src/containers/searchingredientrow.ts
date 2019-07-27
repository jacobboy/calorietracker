import { SearchIngredientRow } from '../components/searchingredientrow';
import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { NamedMacros } from 'src/client';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onSaveClick: (namedMacros: NamedMacros) => dispatch(actions.saveIngredient(namedMacros))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchIngredientRow);
import { connect } from 'react-redux';
import { actions, Actions } from '../actions/';
import { CreateIngredientInput } from '../components/createingredientinput';
import { StoreState } from '../types/index';
import { Dispatch } from 'redux';

function mapStateToProps(state: StoreState) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    handleSubmit: (
      name: string,
      fat: number,
      carbs: number,
      protein: number,
      calories: number,
      amount: number,
      unit: string
    ) => {
      dispatch(actions.createIngredientSubmit(
        name, fat, carbs, protein, calories, amount, unit
      ));
      dispatch(actions.closeModal());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateIngredientInput);

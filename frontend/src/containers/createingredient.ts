import { connect, Dispatch } from 'react-redux';
import { actions, Actions } from '../actions/';
import { CreateIngredientInput } from '../components/createingredient';
import { StoreState } from '../types/index';

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
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateIngredientInput);

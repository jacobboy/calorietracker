import { connect } from 'react-redux';
import { actions, Actions } from '../actions/';
import { CreateIngredientInput } from '../components/createingredientinput';
import { StoreState, TopBitDisplay } from '../types/index';
import { Dispatch } from 'redux';
import { FOOD_UNIT } from '../classes';

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
      convertAmount: number,
      unit: FOOD_UNIT
    ) => {
      dispatch(actions.createIngredientSubmit(
        name, fat, carbs, protein, calories, amount, convertAmount, unit
      ));
      dispatch(actions.createIngredientToggle(TopBitDisplay.MEALS));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateIngredientInput);

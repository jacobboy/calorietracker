import { StoredIngredientRow } from '../components/storedingredientrow';
import { actions, Actions } from '../actions';
import { StoreState, TopBitDisplay } from '../types/index';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { AmountOfNamedMacros } from 'src/client';

function mapStateToProps(state: StoreState) {
  let foodComboNames: string[];
  if (state.topbit.display === TopBitDisplay.CREATE_RECIPE) {
    foodComboNames = ['recipe'];
  } else {
    foodComboNames = state.today.map((meal, idx) => `meal ${idx}`);
  }

  return {
    topbitDisplay: state.topbit.display,
    foodComboNames
  };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    // TODO: What is the approved react/redux way to condition
    //       the dispatch on state?
    //       Or should it be the same action, and the reducer handles it differently?
    onTrackClick: (
      ingredient: AmountOfNamedMacros,
      topbitDisplay: TopBitDisplay,
      foodComboIdx: number
    ) => {
      if (topbitDisplay === TopBitDisplay.CREATE_RECIPE) {
        dispatch(actions.addFoodToRecipe(ingredient));
      } else if (topbitDisplay === TopBitDisplay.MEALS) {
        dispatch(actions.addFoodToMeal(ingredient, foodComboIdx));
      }
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredIngredientRow);

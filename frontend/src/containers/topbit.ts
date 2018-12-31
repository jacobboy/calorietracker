import { connect } from 'react-redux';
import { StoreState, TopBitDisplay } from '../types';
import { Actions, actions } from '../actions';
import { Dispatch } from 'redux';
import { TopBitComponent } from '../components/topbit';

function mapStateToProps(state: StoreState) {
  return { display: state.topbit.display };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onIngredientToggle: (destination: TopBitDisplay) => {
      dispatch(actions.createIngredientToggle(destination));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopBitComponent);

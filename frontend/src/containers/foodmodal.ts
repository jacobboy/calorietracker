import { connect } from 'react-redux';
import { actions, Actions } from '../actions/';
import { FoodModal } from '../components/foodmodal';
import { StoreState } from '../types/index';
import { Dispatch } from 'redux';

function mapStateToProps(state: StoreState) {
  return { modalState: state.modals };
}

function mapDispatchToProps(dispatch: Dispatch<Actions>) {
  return {
    onAfterOpen: () => { /* pass */ },
    handleCloseClick: () => { dispatch(actions.closeModal()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FoodModal);

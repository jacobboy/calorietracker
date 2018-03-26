import { actions, Actions } from '../actions/';
import { StoreState } from '../types/index';
import { connect, Dispatch } from 'react-redux';
import { FoodModal } from '../components/foodmodal';

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

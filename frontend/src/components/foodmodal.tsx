import * as React from 'react';
import * as Modal from 'react-modal';

import TrackFoodInput from '../containers/trackfoodinput';
import CreateIngredientInput from '../containers/createingredientinput';
import { ModalState } from '../types';

interface TrackingModalProps {
  modalState: ModalState;
  onAfterOpen: () => void;
  handleCloseClick: () => void;
}

interface TrackingModalState { }

export class FoodModal extends React.Component<
  TrackingModalProps, TrackingModalState
  > {
  constructor(props: TrackingModalProps) { super(props); }

  renderContents() {
    if (this.props.modalState.isTracking) {
      return <TrackFoodInput />;
    } else if (this.props.modalState.isIngredient) {
      return <CreateIngredientInput />;
    } else {
      return null;
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalState.isOpen}
        onAfterOpen={() => this.props.onAfterOpen()}
        onRequestClose={() => this.props.handleCloseClick()}
        // TODO the whole one modal pattern makes this weird?
        contentLabel="Food Modal?"
      >
        {this.renderContents()}
        <button onClick={() => this.props.handleCloseClick()}>
          Close
        </button>
      </Modal >
    );
  }
}

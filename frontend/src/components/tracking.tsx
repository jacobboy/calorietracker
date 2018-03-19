import * as React from 'react';
import * as Modal from 'react-modal';
import { Food, ingredientFromReport, scaleFood, Ingredient } from '../classes';
import { getIngredient } from '../ndbapi';
import { CheddarCheese } from '../mocks';

interface TrackingModalProps {
  showModal: boolean;
  mealIdx: number;
  ingredientId: string;
  onTrackSubmit: (mealIdx: number, food: Food) => void;
  onCloseClick: () => void;
}

interface TrackingModalState {
  item: Ingredient;
  amount: number;
}

export class TrackingModal extends React.Component<
  TrackingModalProps, TrackingModalState
  > {

  constructor(props: TrackingModalProps) {
    super(props);
    this.state = {
      item: ingredientFromReport(CheddarCheese.report), // TODO placeholder
      amount: 100
    };
  }

  handleOpenModal() {
    getIngredient(this.props.ingredientId).then(
      (ingredient) => this.setState({
        item: ingredient,
        amount: ingredient.amount
      })
    );
  }

  handleAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    if (!isNaN(amount)) {
      this.setState({ amount });
    }
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const food = scaleFood(this.state.item, this.state.amount);
    this.props.onTrackSubmit(this.props.mealIdx, food);
    this.handleCloseModal();
  }

  handleCloseModal() {
    this.props.onCloseClick();
  }

  render() {
    const ingred = scaleFood(this.state.item, this.state.amount);
    return (
      <Modal
        isOpen={this.props.showModal}
        onAfterOpen={() => this.handleOpenModal()}
        onRequestClose={() => this.handleCloseModal()}
        contentLabel="Track Food"
      >
        {this.state.item.name}
        <table>
          <tbody>
            <tr>
              <td>Fat</td>
              <td>{ingred.fat}</td>
            </tr>
            <tr>
              <td>Protein</td>
              <td>{ingred.protein}</td>
            </tr>
            <tr>
              <td>Carbs</td>
              <td>{ingred.carbs}</td>
            </tr>
            <tr>
              <td>Calories</td>
              <td>{ingred.calories}</td>
            </tr>
          </tbody>
        </table>
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Amount:
            <input
              type="text"
              value={this.state.amount}
              onChange={(e) => this.handleAmount(e)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <button onClick={() => this.handleCloseModal()}>Close</button>
      </Modal >
    );
  }
}

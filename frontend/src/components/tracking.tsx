import * as React from 'react';
import * as Modal from 'react-modal';
import { Food, ingredientFromReport, scaleFood, Ingredient } from '../classes';
import { getIngredient } from '../ndbapi';
import { CheddarCheese } from '../mocks';

function TrackFoodInput(props: {
  item: Ingredient,
  amount: number,
  handleAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

}) {
  const ingred = scaleFood(props.item, props.amount);
  return (
    <div>
      {props.item.name}
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
      <form onSubmit={(e) => props.handleSubmit(e)}>
        <label>
          Amount:
          <input
            type="text"
            value={props.amount}
            onChange={(e) => props.handleAmount(e)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

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

  renderContents() {

    return (
      <TrackFoodInput
        item={this.state.item}
        amount={this.state.amount}
        handleAmount={(e) => this.handleAmount(e)}
        handleSubmit={(e) => this.handleSubmit(e)}
      />
    );
  }

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        onAfterOpen={() => this.handleOpenModal()}
        onRequestClose={() => this.handleCloseModal()}
        contentLabel="Track Food"
      >
        {this.renderContents()}
        <button onClick={() => this.handleCloseModal()}>Close</button>
      </Modal >
    );
  }
}

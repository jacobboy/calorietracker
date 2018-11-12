import * as React from 'react';
import { Ingredient, scaleFoodTo } from '../classes';
import { TopBitDisplay } from '../types';

interface IngredientRowProps {
  item: Ingredient;
  topbitDisplay: TopBitDisplay;
  buttonText: String;
  onTrackClick: (ingredient: Ingredient, topbitDisplay: TopBitDisplay) => void;
}

interface IngredientRowState {
  scaledIngredient: Ingredient;
}

export class IngredientRow extends React.Component<
  IngredientRowProps, IngredientRowState
  > {

  constructor(props: IngredientRowProps) {
    super(props);
    this.state = {
      scaledIngredient: this.props.item
    };
  }

  handleAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    if (!isNaN(amount)) {
      this.setState(
        {scaledIngredient: scaleFoodTo(this.props.item, amount)}
      );
    }
  }

  handleTrackClick() {
    // scale again here to get around hitting submit twice putting same key in meals list
    const ingred = scaleFoodTo(this.props.item, this.state.scaledIngredient.amount);
    this.props.onTrackClick(ingred, this.props.topbitDisplay);
    this.setState({ scaledIngredient: this.props.item });
  }

  render() {
    return (
      <tr key={this.props.item.uid}>
        <td key="name">{this.state.scaledIngredient.name}</td>
        <td key="fat">{this.state.scaledIngredient.fat}</td>
        <td key="carbs">{this.state.scaledIngredient.carbs}</td>
        <td key="protein">{this.state.scaledIngredient.protein}</td>
        <td key="calories">{this.state.scaledIngredient.calories}</td>
        <td key="amount">
          <input
            id="trackFoodAmountInput"
            type="number"
            value={this.state.scaledIngredient.amount}
            onChange={(e) => this.handleAmount(e)}
          />
        </td>
        <td key="unit">{this.state.scaledIngredient.unit}</td>
        <td key="submit">
          <button id="trackFoodSubmit" onClick={() => this.handleTrackClick()}>
            {this.props.buttonText}
          </button>
        </td>
      </tr >
    );
  }
}

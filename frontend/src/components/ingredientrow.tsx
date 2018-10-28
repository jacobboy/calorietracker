import * as React from 'react';
import { Ingredient, scaleFood } from '../classes';
import { TopBitDisplay } from '../types';

interface IngredientRowProps {
  item: Ingredient;
  topbitDisplay: TopBitDisplay;
  onTrackClick: (ingredientable: Ingredient) => void;
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
      scaledIngredient: scaleFood(this.props.item, this.props.item.amount)
    };
  }

  handleAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    if (!isNaN(amount)) {
      this.setState(
        {scaledIngredient: scaleFood(this.props.item, amount)}
      );  
    } 
  }     

  handleTrackClick() {
    // hack to get around submitting the same twice putting same key in meals list
    const ingred = scaleFood(this.state.scaledIngredient, this.state.scaledIngredient.amount);
    this.props.onTrackClick(ingred);
  }

  render() {
    return (
      <tr>
        <td>{this.state.scaledIngredient.name}</td>
        <td>{this.state.scaledIngredient.fat}</td>
        <td>{this.state.scaledIngredient.carbs}</td>
        <td>{this.state.scaledIngredient.protein}</td>
        <td>{this.state.scaledIngredient.calories}</td>
        <td>
          <input type="number" value={this.state.scaledIngredient.amount} onChange={(e) => this.handleAmount(e)} />
        </td>
        <td>{this.state.scaledIngredient.unit}</td>
        <td>
          <button onClick={() => this.handleTrackClick()}>
            Track
          </button>
        </td>
      </tr >
    );
  }
}

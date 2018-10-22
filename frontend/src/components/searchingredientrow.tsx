import * as React from 'react';
import { Ingredient, scaleFood } from '../classes';

interface SearchIngredientRowProps {
  item: Ingredient;
  onTrackClick: (ingredientable: Ingredient) => void;
}

interface SearchIngredientRowState { 
  scaledIngredient: Ingredient;
}

export class SearchIngredientRow extends React.Component<
  SearchIngredientRowProps, SearchIngredientRowState
  > {

  constructor(props: SearchIngredientRowProps) {
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
    this.props.onTrackClick(this.props.item);
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
        <td>{this.props.item.unit}</td>
        <td>
          <button onClick={() => this.handleTrackClick()}>
            Track
          </button>
        </td>
      </tr >
    );
  }
}

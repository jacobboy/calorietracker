import * as React from 'react';
import { Ingredient, scaleFood } from '../classes';
import { TopBitDisplay } from '../types';

interface IngredientRowProps {
  item: Ingredient;
  topbitDisplay: TopBitDisplay;
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
      scaledIngredient: scaleFood(this.props.item, this.props.item.amount)
    };
  }

  buttonText() {
    // TODO probably should be determined here
    return this.props.topbitDisplay === TopBitDisplay.CREATE_RECIPE ? 'Add to recipe' : 'Add to meal';
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
    this.props.onTrackClick(ingred, this.props.topbitDisplay);
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
          <input type="number" value={this.state.scaledIngredient.amount} onChange={(e) => this.handleAmount(e)} />
        </td>
        <td key="unit">{this.state.scaledIngredient.unit}</td>
        <td key="button">
          <button onClick={() => this.handleTrackClick()}>
            {this.buttonText()}
          </button>
        </td>
      </tr >
    );
  }
}

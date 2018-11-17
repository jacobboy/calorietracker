import * as React from 'react';
import { Ingredient, scaleFoodTo } from '../classes';
import { TopBitDisplay } from '../types';
import { tdStyle } from 'src/style';

interface IngredientRowProps {
  item: Ingredient;
  topbitDisplay: TopBitDisplay;
  buttonText: String;
  onTrackClick: (ingredient: Ingredient, topbitDisplay: TopBitDisplay) => void;
}

interface IngredientRowState {
  scaledIngredient: Ingredient;
}

export class StoredIngredientRow extends React.Component<
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
        {ingredientCell(this.state.scaledIngredient.name)}
        {ingredientCell(this.state.scaledIngredient.fat.toFixed())}
        {ingredientCell(this.state.scaledIngredient.carbs.toFixed())}
        {ingredientCell(this.state.scaledIngredient.protein.toFixed())}
        {ingredientCell(this.state.scaledIngredient.calories.toFixed())}
        {ingredientCell((
          <input
            id="trackFoodAmountInput"
            type="number"
            value={this.state.scaledIngredient.amount}
            onChange={(e) => this.handleAmount(e)}
          />
         ))}
        {ingredientCell(this.state.scaledIngredient.unit)}
        {ingredientCell((
          <button id="trackFoodSubmit" onClick={() => this.handleTrackClick()}>
            {this.props.buttonText}
          </button>
         ))}
      </tr>
    );
  }
}

function ingredientCell(contents: string | number | JSX.Element) {
  return <td title={contents.toString()} style={tdStyle}>{contents}</td>;
}
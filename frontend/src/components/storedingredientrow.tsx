import * as React from 'react';
import { Ingredient, scaleFoodTo } from '../classes';
import { TopBitDisplay } from '../types';
import { tdStyle } from '../style';

interface IngredientRowProps<T extends Ingredient> {
  item: T;
  topbitDisplay: TopBitDisplay;
  buttonText: String;
  onTrackClick: (ingredient: Ingredient, topbitDisplay: TopBitDisplay) => void;
  onCopyClick?: (item: T) => void;
}

interface IngredientRowState {
  scaledIngredient: Ingredient;
}

export class StoredIngredientRow<T extends Ingredient> extends React.Component<
  IngredientRowProps<T>, IngredientRowState
  > {

  constructor(props: IngredientRowProps<T>) {
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

  handleCopyClick() {
    if (this.props.onCopyClick) {
      this.props.onCopyClick(this.props.item);
    }
  }

  render() {
    let copyCell: JSX.Element | null;
    if (this.props.onCopyClick !== undefined) {
      copyCell = ingredientCell(
        <button
          id={`copy_${this.props.item.uid}`}
          onClick={() => this.handleCopyClick()}
        >
          Copy
        </button>
      );
    } else {
      copyCell = null;  // this has gotta be bad form, right?
    }
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
         {copyCell}
      </tr>
    );
  }
}

function ingredientCell(contents: string | number | JSX.Element) {
  const opts = { title: contents.toString(), style: tdStyle};
  return <td {...opts}>{contents}</td>;
}
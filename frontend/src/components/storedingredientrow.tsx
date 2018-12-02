import * as React from 'react';
import { Ingredient, scaleFoodTo } from '../classes';
import { TopBitDisplay } from '../types';
import { tdStyle, thStyle } from '../style';
import { toTitleCase } from '../datautil';
import { MathInput } from './MathCell';

export const Header = (
  <tr style={thStyle}>
    <th style={thStyle}>Name</th>
    <th style={thStyle}>Amount</th>
    <th style={thStyle}>Unit</th>
    <th style={thStyle}>Fat</th>
    <th style={thStyle}>Fat%</th>
    <th style={thStyle}>Carbs</th>
    <th style={thStyle}>Carbs%</th>
    <th style={thStyle}>Protein</th>
    <th style={thStyle}>Protein%</th>
    <th style={thStyle}>Calories</th>
  </tr>
);

interface IngredientRowProps<T extends Ingredient> {
  item: T;
  topbitDisplay: TopBitDisplay;
  // TODO This is a weird approach - sending in a list of display names of recipes/meals,
  // and passing the index of that to the track handler to determine which recipe/meal to
  // add an ingredient to
  foodComboNames: string[];
  onTrackClick: (
    ingredient: Ingredient,
    topbitDisplay: TopBitDisplay,
    foodComboIdx: number
  ) => void;
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

  handleAmount(amount: number) {
    /* if (!isNaN(amount)) { */
    this.setState(
      {scaledIngredient: scaleFoodTo(this.props.item, amount)}
    );
    /* } */
  }

  handleTrackFood(foodComboIdx: number, e?: React.FormEvent<HTMLFormElement>) {
    // scale again here to get around hitting submit twice putting same key in meals list
    const ingred = scaleFoodTo(this.props.item, this.state.scaledIngredient.amount);
    this.props.onTrackClick(
      ingred,
      this.props.topbitDisplay,
      foodComboIdx
    );
    this.setState({ scaledIngredient: this.props.item });
    if (e) { e.preventDefault(); }
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
        {ingredientCell(toTitleCase(this.state.scaledIngredient.name))}
        {ingredientCell((
          <form
            id="trackFoodAmountForm"
            onSubmit={
              (e) => this.handleTrackFood(this.props.foodComboNames.length - 1, e)
            }
          >
            <MathInput
              id="trackFoodAmountInput"
              amountOverride={
                this.state.scaledIngredient.amount === this.props.item.amount
                ? this.state.scaledIngredient.amount.toString()
                : undefined
              }
              onChange={(e) => this.handleAmount(e)}
            />
          </form>
         ))}
        {ingredientCell(this.state.scaledIngredient.unit)}
        {ingredientCell(this.state.scaledIngredient.fat.toFixed())}
        {ingredientCell(this.state.scaledIngredient.fatPct)}
        {ingredientCell(this.state.scaledIngredient.carbs.toFixed())}
        {ingredientCell(this.state.scaledIngredient.carbsPct)}
        {ingredientCell(this.state.scaledIngredient.protein.toFixed())}
        {ingredientCell(this.state.scaledIngredient.proteinPct)}
        {ingredientCell(this.state.scaledIngredient.calories.toFixed())}
        <td title="Add to" style={tdStyle}>
          Add to
          {this.props.foodComboNames.map(
              (name, idx) => trackButton(name, () => this.handleTrackFood(idx))
            )
          }
        </td>
        {copyCell}
      </tr>
    );
  }
}

function trackButton(foodComboName: string, onClick: () => void) {
  const id = foodComboName.replace(' ', '');
  return (
    <button
      key={`trackFoodSubmit_${id}`}
      id={`trackFoodSubmit_${id}`}
      tabIndex={-1}
      onClick={onClick}
    >
      {foodComboName}
    </button>
   );
}

function ingredientCell(contents: string | number | JSX.Element | JSX.Element[]) {
  const opts = { title: contents.toString(), style: tdStyle};
  return <td {...opts}>{contents}</td>;
}
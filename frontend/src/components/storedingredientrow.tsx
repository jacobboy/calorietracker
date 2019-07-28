
import * as React from 'react';
import { TopBitDisplay } from '../types';
import { tdStyle, thStyle } from '../style';
import { toTitleCase } from '../datautil';
import { MathInput } from './mathinput';
import { AmountOfNamedMacros, NamedMacros } from 'src/client';
import { round } from 'src/transforms';

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

interface IngredientRowProps {
  item: NamedMacros;
  topbitDisplay: TopBitDisplay;
  // TODO This is a weird approach - sending in a list of display names of recipes/meals,
  // and passing the index of that to the track handler to determine which recipe/meal to
  // add an ingredient to
  foodComboNames: string[];
  onTrackClick: (
    ingredient: AmountOfNamedMacros,
    topbitDisplay: TopBitDisplay,
    foodComboIdx: number
  ) => void;
  onCopyClick?: (item: NamedMacros) => void;
  focusRef: React.RefObject<HTMLElement>;
}

interface IngredientRowState {
  scaledIngredient: AmountOfNamedMacros;
}

export class StoredIngredientRow extends React.Component<
  IngredientRowProps,
  IngredientRowState
> {
  constructor(props: IngredientRowProps) {
    super(props);
    this.state = {
      scaledIngredient: {amount: this.props.item.amount, namedMacros: this.props.item}
    };
  }

  handleAmount(amount: number) {
    this.setState({ scaledIngredient: {amount: amount, namedMacros: this.props.item}});
  }

  handleTrackFood(foodComboIdx: number, e?: React.FormEvent<HTMLFormElement>) {
    this.props.onTrackClick(this.state.scaledIngredient, this.props.topbitDisplay, foodComboIdx);
    this.setState({ scaledIngredient: {amount: this.props.item.amount, namedMacros: this.props.item }});
    if (e) {
      e.preventDefault();
    }
    if (this.props.focusRef.current) {
      this.props.focusRef.current.focus();
    }
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
      copyCell = null; // this has gotta be bad form, right?
    }
    const calcedCalories = (
      this.state.scaledIngredient.namedMacros.protein * 4 +
      this.state.scaledIngredient.namedMacros.fat * 9 +
      this.state.scaledIngredient.namedMacros.carbs * 4
    );
    return (
      <tr key={this.props.item.uid}>
        {ingredientCell(toTitleCase(this.state.scaledIngredient.namedMacros.name))}
        {ingredientCell(
          <form
            id={`trackFoodAmountForm_${this.props.item.uid}`}
            onSubmit={e =>
              this.handleTrackFood(this.props.foodComboNames.length - 1, e)
            }
          >
            <MathInput
              id={`trackFoodAmountInput_${this.props.item.uid}`}
              amount={this.props.item.amount}
              onChange={e => this.handleAmount(e)}
            />
          </form>,
          'Amount input'
        )}
        {ingredientCell(this.state.scaledIngredient.namedMacros.unit)}
        {ingredientCell(this.state.scaledIngredient.namedMacros.fat.toFixed())}
        {ingredientCell(round(this.state.scaledIngredient.namedMacros.fat * 9 / calcedCalories, 1))}
        {ingredientCell(this.state.scaledIngredient.namedMacros.carbs.toFixed())}
        {ingredientCell(round(this.state.scaledIngredient.namedMacros.carbs * 4 / calcedCalories, 1))}
        {ingredientCell(this.state.scaledIngredient.namedMacros.protein.toFixed())}
        {ingredientCell(round(this.state.scaledIngredient.namedMacros.protein * 4 / calcedCalories, 1))}
        {ingredientCell(this.state.scaledIngredient.namedMacros.calories.toFixed())}
        <td title="Add to" style={tdStyle}>
          Add to
          {this.props.foodComboNames.map((name, idx) =>
            trackButton(name, () => this.handleTrackFood(idx))
          )}
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

function ingredientCell(
  contents: string | number | JSX.Element | JSX.Element[],
  title?: string
) {
  title = title === undefined ? contents.toString() : title;
  const opts = { title: title, style: tdStyle };
  return <td {...opts}>{contents}</td>;
}

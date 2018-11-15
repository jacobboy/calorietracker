import { Ingredient, FOOD_UNIT } from '../classes';
import * as React from 'react';
import { tdStyle, thStyle } from '../style';

interface IngredientsTableProps {
  foods: Ingredient[];
  handleRemoveClick: (food: Ingredient) => void;
  handleDeleteClick: () => void;
  handleAmountInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  amount?: number;
  handleUnitInput?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  unit?: FOOD_UNIT;
}

export function ingredientCell(text: string | number, key?: string, id?: string) {
  const opts: {key?: string, id?: string} = {};
  if (key) {
    opts.key = key;
  }
  if (id) {
    opts.id = id;
  }
  return <td {...opts} style={tdStyle}>{text}</td>;
}

export function mealCell(text: string | number | JSX.Element, key?: string, id?: string) {
  const opts: {key?: string, id?: string} = {};
  if (key) {
    opts.key = key;
  }
  if (id) {
    opts.id = id;
  }
  return <th {...opts} style={thStyle}>{text}</th>;
}

export class IngredientsTable extends React.Component<
  IngredientsTableProps, {}
  > {

  constructor(props: IngredientsTableProps) {
    super(props);
  }

  makeFoodRow(food: Ingredient) {
    return (
      <tr key={food.uid} id={'food_' + food.uid}>
        {ingredientCell(food.name, 'name')}
        {ingredientCell(food.amount, 'amount')}
        {ingredientCell(food.unit, 'unit')}
        {ingredientCell(food.fat, 'fat')}
        {ingredientCell(food.carbs, 'carbs')}
        {ingredientCell(food.protein, 'protein')}
        {ingredientCell(food.calories, 'calories')}
        <td style={tdStyle}>
          <button
            id={'removeFood_' + food.uid}
            onClick={() => this.props.handleRemoveClick(food)}
          >
            Remove
          </button>
        </td>
      </tr>

    );
  }

  makeTotalRow(foods: Ingredient[]) {
    let amountCell;
    let unitCell;
    // TODO need to verify amount/unit is passed in if the handlers are
    // really this whole thing is a mess, i'm not sure making this a reusable
    // component works, between meals and recipes
    if (this.props.handleAmountInput !== undefined) {
      // otherwise TS thinks this might be undefined, probably because
      const handleAmountInput = this.props.handleAmountInput;
      amountCell = (
        <input
          id="recipeAmountInput"
          type="number"
          value={this.props.amount}
          onChange={(e) => handleAmountInput(e)}
        />
      );
    } else {
      amountCell = '';
    }
    if (this.props.handleUnitInput !== undefined) {
      // otherwise TS thinks this might be undefined, probably because
      const handleUnitInput = this.props.handleUnitInput;
      unitCell = (
        <select
          id="recipeUnitInput"
          value={this.props.unit}
          onChange={(e) => handleUnitInput(e)}
        >
          {Object.keys(FOOD_UNIT).map((unit) => (<option key={unit}>{unit}</option>))}
        </select >
      );
    } else {
      unitCell = '';
    }
    return (
      <tr key="total">
        {mealCell('Total', 'total')}
        {mealCell(amountCell, 'amount')}
        {mealCell(unitCell, 'unit')}
        {mealCell(foods.reduce((l, r) => l + r.fat, 0).toFixed(), 'fat')}
        {mealCell(foods.reduce((l, r) => l + r.carbs, 0).toFixed(), 'carbs')}
        {mealCell(foods.reduce((l, r) => l + r.protein, 0).toFixed(), 'protein')}
        {mealCell(foods.reduce((l, r) => l + r.calories, 0).toFixed(), 'calories')}
        <th key="button">
          <button id={'deleteMeal'} onClick={() => this.props.handleDeleteClick()}>
            Remove
          </button>
        </th>
      </tr>
    );
  }

  renderRows() {
    const rows = [];
    for (let food of this.props.foods) {
      rows.push(this.makeFoodRow(food));
    }
    rows.push(this.makeTotalRow(this.props.foods));
    return rows;
  }

  render() {
    return (
      this.renderRows()
    );
  }
}
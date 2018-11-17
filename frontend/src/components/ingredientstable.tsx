import { Ingredient, FOOD_UNIT } from '../classes';
import * as React from 'react';
import { tdStyle, thStyle } from '../style';

export function ingredientCell(text: string | number | JSX.Element, key?: string, id?: string) {
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

interface IngredientRowProps {
  idx: number;
  food: Ingredient;
  handleFoodAmountChange: (food: Ingredient, newAmount: number) => void;
  handleRemoveFoodClick: (food: Ingredient) => void;
}

class IngredientRow extends React.Component<IngredientRowProps, {amount: number}> {
  constructor(props: IngredientRowProps) {
    super(props);
    this.state = {amount: this.props.food.amount};
  }

  handleFoodAmountChange(food: Ingredient, event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    if (amount) {
      this.setState({ amount });
      this.props.handleFoodAmountChange(food, amount);
    } else {
      this.setState({ amount });
    }
  }

  render() {
    const amountElement = (
      <input
        id={`foodAmountInput_${this.props.food.uid}`}
        type="number"
        value={this.state.amount || ''}
        onChange={(e) => this.handleFoodAmountChange(this.props.food, e)}
      />
    );
    return (
      <tr key={`food_${this.props.idx}`} id={'food'}>
        {ingredientCell(this.props.food.name, 'name')}
        {ingredientCell(amountElement, `amount`, 'amount')}
        {ingredientCell(this.props.food.unit, 'unit')}
        {ingredientCell(this.props.food.fat, 'fat')}
        {ingredientCell(this.props.food.carbs, 'carbs')}
        {ingredientCell(this.props.food.protein, 'protein')}
        {ingredientCell(this.props.food.calories, 'calories')}
        <td key={`button`} style={tdStyle}>
          <button
            id={`removeFood_${this.props.food.uid}`}
            onClick={() => this.props.handleRemoveFoodClick(this.props.food)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  }
}

interface IngredientsTableProps {
  foods: Ingredient[];
  handleFoodAmountChange: (food: Ingredient, newAmount: number) => void;
  handleRemoveFoodClick: (food: Ingredient) => void;
  handleDeleteAllClick: () => void;
  handleAmountAllInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  amount?: number;
  handleUnitAllInput?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  unit?: FOOD_UNIT;
}

export class IngredientsTable extends React.Component<
  IngredientsTableProps, {}
  > {

  constructor(props: IngredientsTableProps) {
    super(props);
  }

  makeTotalRow(foods: Ingredient[]) {
    let amountCell;
    let unitCell;
    // TODO need to verify amount/unit is passed in if the handlers are
    // really this whole thing is a mess, i'm not sure making this a reusable
    // component works, between meals and recipes
    if (this.props.handleAmountAllInput !== undefined) {
      // otherwise TS thinks this might be undefined, probably because
      const handleAmountInput = this.props.handleAmountAllInput;
      amountCell = (
        <input
          id="recipeAmountInput"
          type="number"
          value={this.props.amount || ''}
          onChange={(e) => handleAmountInput(e)}
        />
      );
    } else {
      amountCell = '';
    }
    if (this.props.handleUnitAllInput !== undefined) {
      // otherwise TS thinks this might be undefined, probably because
      const handleUnitInput = this.props.handleUnitAllInput;
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
      <tr key="totalRow">
        {mealCell('Total', 'total')}
        {mealCell(amountCell, 'amount')}
        {mealCell(unitCell, 'unit')}
        {mealCell(foods.reduce((l, r) => l + r.fat, 0).toFixed(), 'fat')}
        {mealCell(foods.reduce((l, r) => l + r.carbs, 0).toFixed(), 'carbs')}
        {mealCell(foods.reduce((l, r) => l + r.protein, 0).toFixed(), 'protein')}
        {mealCell(foods.reduce((l, r) => l + r.calories, 0).toFixed(), 'calories')}
        <th key="button">
          <button id={'deleteAll'} onClick={() => this.props.handleDeleteAllClick()}>
            Remove
          </button>
        </th>
      </tr>
    );
  }

  renderRows() {
    const rows = [];
    for (let i = 0; i < this.props.foods.length; i++) {
      let food = this.props.foods[i];
      rows.push((
      <IngredientRow
        key={'ingred_' + i.toString()}
        food={food}
        handleFoodAmountChange={this.props.handleFoodAmountChange}
        handleRemoveFoodClick={this.props.handleRemoveFoodClick}
        idx={i}
      />));
      /* rows.push(React.createElement(IngredientRow, {
        food: food,
        handleFoodAmountChange: this.props.handleFoodAmountChange,
        handleRemoveFoodClick: this.props.handleRemoveFoodClick,
        idx: i
      })); */
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
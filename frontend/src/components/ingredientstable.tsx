import { Ingredient, FOOD_UNIT, macrosFromFoods } from '../classes';
import * as React from 'react';
import { tdStyle, thStyle } from '../style';
import { toTitleCase } from '../datautil';

export function headerCell(text: string) {
  return <th title={text.toString()} style={thStyle}>{text}</th>;
}

export function ingredientCell(text: string | number | JSX.Element, key?: string, id?: string) {
  const opts: {key?: string, id?: string} = {};
  if (key) {
    opts.key = key;
  }
  if (id) {
    opts.id = id;
  }
  return <td {...opts} title={text.toString()} style={tdStyle}>{text}</td>;
}

export function mealCell(text: string | number | JSX.Element, key?: string, id?: string) {
  const opts: {key?: string, id?: string} = {};
  if (key) {
    opts.key = key;
  }
  if (id) {
    opts.id = id;
  }
  return <th {...opts} title={text.toString()} style={thStyle}>{text}</th>;
}

interface IngredientRowProps {
  idx: number;
  food: Ingredient;
  handleRemoveFoodClick: (food: Ingredient) => void;
  handleFoodAmountChange?: (food: Ingredient, newAmount: number) => void;
}

interface IngredientRowState {
  amount: number;
  handleFoodAmountChange: (food: Ingredient, newAmount: number) => void;
}

class IngredientRow extends React.Component<IngredientRowProps, IngredientRowState> {
  constructor(props: IngredientRowProps) {
    super(props);

    // having this amount handling function in state is a weird hack to get around
    // my being undecided about whether or not to implement ingredient amount editing
    // in meals, so meals don't provide that function
    let handleFoodAmountChange;
    if (this.props.handleFoodAmountChange) {
      handleFoodAmountChange = this.props.handleFoodAmountChange;
    } else {
      handleFoodAmountChange = (food: Ingredient, newAmount: number) => {/*  */};
    }
    this.state = {
      amount: this.props.food.amount,
      handleFoodAmountChange
    };
  }

  handleFoodAmountChange(food: Ingredient, event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    if (amount) {
      this.setState({ amount });
      this.state.handleFoodAmountChange(food, amount);
    } else {
      this.setState({ amount });
    }
  }

  render() {
    let amountElement;
    if (this.props.handleFoodAmountChange) {
      amountElement = (
        <input
          id={`foodAmountInput_${this.props.food.uid}`}
          type="number"
          value={this.state.amount || ''}
          onChange={(e) => this.handleFoodAmountChange(this.props.food, e)}
        />
      );
    } else {
      amountElement = this.state.amount;
    }
    return (
      <tr key={`food_${this.props.idx}`} id={'food'}>
        {ingredientCell(toTitleCase(this.props.food.name), 'name')}
        {ingredientCell(amountElement, `amount`, 'amount')}
        {ingredientCell(this.props.food.unit, 'unit')}
        {ingredientCell(this.props.food.fat, 'fat')}
        {ingredientCell(this.props.food.fatPct, 'fatPct')}
        {ingredientCell(this.props.food.carbs, 'carbs')}
        {ingredientCell(this.props.food.carbsPct, 'carbsPct')}
        {ingredientCell(this.props.food.protein, 'protein')}
        {ingredientCell(this.props.food.proteinPct, 'proteinPct')}
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
  handleFoodAmountChange?: (food: Ingredient, newAmount: number) => void;
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

  static headerRow() {
    return (
      <tr>
        {headerCell('')}
        {headerCell('Amount')}
        {headerCell('Unit')}
        {headerCell('Fat')}
        {headerCell('%Fat')}
        {headerCell('Carbs')}
        {headerCell('%Carbs')}
        {headerCell('Protein')}
        {headerCell('%Protein')}
        {headerCell('Calories')}
        {headerCell('')}
      </tr>
    );
  }

  constructor(props: IngredientsTableProps) {
    super(props);
  }

  makeTotalRow(foods: Ingredient[]) {
    let amountCell;
    let unitCell;
    // TODO need to verify amount/unit is passed in if their respective handlers are.
    // really this whole thing is a mess, the fact that Meals doesn't pass in these handlers
    // makes me doubt the viability of IngredientsTable as a reuseable component
    if (this.props.handleAmountAllInput !== undefined) {
      // otherwise TS thinks this might be undefined
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

    const macros = macrosFromFoods(foods);

    return (
      <tr key="totalRow">
        {mealCell('Total', 'total')}
        {mealCell(amountCell, 'amount')}
        {mealCell(unitCell, 'unit')}
        {mealCell(macros.fat.toFixed(), 'fat')}
        {mealCell(macros.fatPct, 'fatPct')}
        {mealCell(macros.carbs.toFixed(), 'carbs')}
        {mealCell(macros.carbsPct, 'carbsPct')}
        {mealCell(macros.protein.toFixed(), 'protein')}
        {mealCell(macros.proteinPct, 'proteinPct')}
        {mealCell(macros.calories.toFixed(), 'calories')}
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
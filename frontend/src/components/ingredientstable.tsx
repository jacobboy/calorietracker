import { FOOD_UNIT } from '../classes';
import * as React from 'react';
import { tdStyle, thStyle } from '../style';
import { toTitleCase } from '../datautil';
import { MathInput } from './mathinput';
import { AmountOfNamedMacros } from 'src/client';
import { macrosFromFoods, macrosFromAmountOfNamedMacros } from 'src/transforms';

export function headerCell(text: string) {
  return <th title={text.toString()} style={thStyle}>{text}</th>;
}

export function ingredientCell(text: string | number | JSX.Element, key?: string, id?: string) {
  const opts: { key?: string, id?: string } = {};
  if (key) {
    opts.key = key;
  }
  if (id) {
    opts.id = id;
  }
  return <td {...opts} title={text.toString()} style={tdStyle}>{text}</td>;
}

export function mealCell(text: string | number | JSX.Element, key?: string, id?: string) {
  const opts: { key?: string, id?: string } = {};
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
  // TODO don't like the row being aware of the table, this is a testing hack
  //      that I should learn to do better
  tableIdx: number;
  food: AmountOfNamedMacros;
  handleRemoveFoodClick: (food: AmountOfNamedMacros) => void;
  handleFoodAmountChange?: (food: AmountOfNamedMacros, newAmount: number) => void;
}

interface IngredientRowState {
  amount: number;
  handleFoodAmountChange: (food: AmountOfNamedMacros, newAmount: number) => void;
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
      handleFoodAmountChange = (food: AmountOfNamedMacros, newAmount: number) => {/*  */ };
    }
    this.state = {
      amount: this.props.food.amount,
      handleFoodAmountChange
    };
  }

  handleFoodAmountChange(food: AmountOfNamedMacros, amount: number) {
    if (amount > 0) {
      this.setState({ amount });
      this.state.handleFoodAmountChange(food, amount);
    }
    /*  else {
      this.setState({ amount });
    } */
  }

  render() {
    let amountElement;
    if (this.props.handleFoodAmountChange) {
      amountElement = (
        <MathInput
          id={`foodAmountInput${this.props.tableIdx}${this.props.idx}`}
          amount={this.state.amount}
          onChange={amount => this.handleFoodAmountChange(this.props.food, amount)}
        />
      );
    } else {
      amountElement = this.state.amount;
    }

    const macros = macrosFromAmountOfNamedMacros(this.props.food);
    return (
      <tr key={`food_${this.props.idx}`} id={'food'}>
        {ingredientCell(toTitleCase(this.props.food.namedMacros.name), 'name')}
        {ingredientCell(amountElement, `amount`, 'amount')}
        {ingredientCell(this.props.food.namedMacros.unit, 'unit')}
        {ingredientCell(macros.fat, 'fat')}
        {ingredientCell(macros.fatPct, 'fatPct')}
        {ingredientCell(macros.carbs, 'carbs')}
        {ingredientCell(macros.carbsPct, 'carbsPct')}
        {ingredientCell(macros.protein, 'protein')}
        {ingredientCell(macros.proteinPct, 'proteinPct')}
        {ingredientCell(macros.calories, 'calories')}
        <td key={`button`} style={tdStyle}>
          <button
            // id for testing
            id={`removeFood_${this.props.tableIdx}_${this.props.idx}`}
            onClick={() => this.props.handleRemoveFoodClick(this.props.food)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  }
}

interface IngredientsTableProps<T extends AmountOfNamedMacros> {
  foods: AmountOfNamedMacros[];
  idx: number;
  handleFoodAmountChange?: (food: T, newAmount: number) => void;
  handleRemoveFoodClick: (food: T) => void;
  handleDeleteAllClick: () => void;
  handleAmountAllInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  amount?: number;
  handleUnitAllInput?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  unit?: FOOD_UNIT;
}

export class IngredientsTable<T extends AmountOfNamedMacros> extends React.Component<
  IngredientsTableProps<T>, {}
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

  constructor(props: IngredientsTableProps<T>) {
    super(props);
  }

  makeTotalRow(foods: AmountOfNamedMacros[]) {
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
    const specificMacroIndexes = new Map();
    for (let i = 0; i < this.props.foods.length; i++) {
      let food = this.props.foods[i];

      // keep track of how many times we've seen this uid so we can create a stable key
      const thisMacroIndex = specificMacroIndexes.get(food.namedMacros.uid) || 0;
      specificMacroIndexes.set(food.namedMacros.uid, thisMacroIndex + 1);

      rows.push((
        <IngredientRow
          // use length in the key to avoid bugs on addition/removal
          key={`ingred_${food.namedMacros.uid}_${thisMacroIndex}_${this.props.foods.length}_${i}`}
          food={food}
          handleFoodAmountChange={this.props.handleFoodAmountChange}
          handleRemoveFoodClick={this.props.handleRemoveFoodClick}
          tableIdx={this.props.idx}
          idx={i}
        />
      ));
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
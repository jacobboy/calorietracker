import * as React from 'react';
import { thStyle, tableStyle } from '../style';
import { IngredientsTable } from './ingredientstable';
import { macrosFromFoods } from 'src/transforms';
import { Meal, AmountOfNamedMacros } from 'src/client';

interface MealsComponentProps {
  today: Meal[];
  handleFoodAmountChange: (
    mealIdx: number,
    food: AmountOfNamedMacros,
    newAmount: number
  ) => void;
  handleAddMealClick: () => void;
  handleDeleteMealClick: (mealIdx: number) => void;
  handleRemoveFoodClick: (mealIdx: number, food: AmountOfNamedMacros) => void;
}

export class MealsComponent extends React.Component<MealsComponentProps, {}> {
  constructor(props: MealsComponentProps) {
    super(props);
  }

  ensureAtLeastOneMeal(today: Meal[]) {
    if (today.length === 0) {
      this.props.handleAddMealClick();
    }
  }

  componentDidMount() {
    this.ensureAtLeastOneMeal(this.props.today);
  }

  componentDidUpdate(prevProps: MealsComponentProps) {
    this.ensureAtLeastOneMeal(this.props.today);
  }

  /* handleFoodAmountChange(mealIdx: number) {
    return (food: Ingredient, newAmount: number)  => {
      return this.props.handleFoodAmountChange(mealIdx, food, newAmount);
    };
  } */

  renderRows() {
    const rows = [];
    for (let mealIdx = 0; mealIdx < this.props.today.length; mealIdx++) {
      const meal: Meal = this.props.today[mealIdx];
      const removeHandler = (food: AmountOfNamedMacros) => {
        this.props.handleRemoveFoodClick(mealIdx, food);
      };
      const deleteHandler = () => {
        this.props.handleDeleteMealClick(mealIdx);
      };
      let row = (
        <IngredientsTable
          key={'meal_table_' + meal.uid}
          foods={meal.foods}
          handleRemoveFoodClick={removeHandler}
          handleDeleteAllClick={deleteHandler}
          idx={mealIdx}
        />
      );
      rows.push(row);
    }
    return rows;
  }

  totalRow() {
    const allFoods: AmountOfNamedMacros[][] = this.props.today.map((meal) => meal.foods);
    const macros = macrosFromFoods([].concat.apply([], allFoods));
    return (
      <tr>
        <th style={thStyle}>Day Total</th>
        <th style={thStyle} />
        <th style={thStyle} />
        <th style={thStyle}> {macros.fat.toFixed()} </th>
        <th style={thStyle}> {macros.fatPct} </th>
        <th style={thStyle}> {macros.carbs.toFixed()} </th>
        <th style={thStyle}> {macros.carbsPct} </th>
        <th style={thStyle}> {macros.protein.toFixed()} </th>
        <th style={thStyle}> {macros.proteinPct} </th>
        <th style={thStyle}> {macros.calories.toFixed()} </th>
      </tr>
    );
  }

  render() {
    return (
      <div>
        <table style={tableStyle}>
          <tbody>
            {IngredientsTable.headerRow()}
            {this.renderRows()}
            {this.totalRow()}
          </tbody>
        </table>
        <button id="addMeal" onClick={() => this.props.handleAddMealClick()}>
          Add Meal
        </button>
      </div>
    );
  }
}

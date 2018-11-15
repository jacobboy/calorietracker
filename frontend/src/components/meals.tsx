import { Ingredient, Meal } from '../classes';
import * as React from 'react';
import { thStyle, tableStyle } from '../style';
import { IngredientsTable } from './ingredientstable';

interface MealsComponentProps {
  today: Meal[];
  handleAddMealClick: () => void;
  handleDeleteMealClick: (mealIdx: number) => void;
  handleRemoveFoodClick: (mealIdx: number, food: Ingredient) => void;
}

export class MealsComponent extends React.Component<
  MealsComponentProps, {}
  > {
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

  componentWillReceiveProps(nextProps: MealsComponentProps) {
    this.ensureAtLeastOneMeal(nextProps.today);
  }

  renderRows() {
    const rows = [];
    for (let mealIdx = 0; mealIdx < this.props.today.length; mealIdx++) {
      const meal: Meal = this.props.today[mealIdx];
      const removeHandler = (food: Ingredient) => {
        this.props.handleRemoveFoodClick(mealIdx, food);
      };
      const deleteHandler = () => {
        this.props.handleDeleteMealClick(mealIdx);
      };
      let row = (
        <IngredientsTable
          key={'meal_table_' + meal.uid}
          foods={meal.foods}
          handleRemoveClick={removeHandler}
          handleDeleteClick={deleteHandler}
        />
      );
      rows.push(row);
    }
    return rows;
  }

  headerCell(text: string) {
    return <th style={thStyle}>{text}</th>;
  }

  headerRow() {
    return (
      <tr>
        {this.headerCell('')}
        {this.headerCell('Amount')}
        {this.headerCell('Unit')}
        {this.headerCell('Fat')}
        {this.headerCell('Carbs')}
        {this.headerCell('Protein')}
        {this.headerCell('Calories')}
        {this.headerCell('')}
      </tr>
    );
  }

  render() {
    return (
      <div>
        <table style={tableStyle}>
          <tbody>
            {this.headerRow()}
            {this.renderRows()}
            <tr>
              <th style={thStyle}>Day Total</th>
              <th style={thStyle} />
              <th style={thStyle} />
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.fat, 0).toFixed()}
              </th>
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.carbs, 0).toFixed()}
              </th>
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.protein, 0).toFixed()}
              </th>
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.calories, 0).toFixed()}
              </th>
            </tr>
          </tbody>
        </table>
        <button
          id="addMeal"
          onClick={() => this.props.handleAddMealClick()}
        >
          Add Meal
        </button>
      </div>
    );
  }
}

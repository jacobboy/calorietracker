
import { Ingredient, Meal } from '../classes';
import * as React from 'react';
import { thStyle, tdStyle, tableStyle } from '../style';

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

  mealCell(text: string | number) {
    return <th style={thStyle}>{text}</th>;
  }

  ingredientCell(text: string | number) {
    return <td style={tdStyle}>{text}</td>;
  }

  makeMealRow(meal: Meal, mealIdx: number) {
    return (
      <tr key={meal.uid}>
        {this.mealCell('Total')}
        {this.mealCell('')}
        {this.mealCell(meal.fat)}
        {this.mealCell(meal.carbs)}
        {this.mealCell(meal.protein)}
        {this.mealCell(meal.calories)}
        <th>
          <button onClick={() => this.props.handleDeleteMealClick(mealIdx)}>
            Delete Meal
          </button>
        </th>
      </tr>
    );
  }

  makeFoodRow(food: Ingredient, mealIdx: number) {
    return (
      <tr key={food.uid}>
        {this.ingredientCell(food.name)}
        {this.ingredientCell(food.amount)}
        {this.ingredientCell(food.fat)}
        {this.ingredientCell(food.carbs)}
        {this.ingredientCell(food.protein)}
        {this.ingredientCell(food.calories)}
        <td style={tdStyle}>
          <button onClick={() => this.props.handleRemoveFoodClick(mealIdx, food)}>
            Remove
          </button>
        </td>
      </tr>

    );
  }

  renderRows() {
    const rows = [];
    for (let mealIdx = 0; mealIdx < this.props.today.length; mealIdx++) {
      let meal: Meal = this.props.today[mealIdx];
      for (let food of meal.foods) {
        rows.push(this.makeFoodRow(food, mealIdx));

      }
      rows.push(this.makeMealRow(meal, mealIdx));
    }
    return rows;
  }

  render() {
    return (
      <div>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th style={thStyle} />
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Fat</th>
              <th style={thStyle}>Carbs</th>
              <th style={thStyle}>Protein</th>
              <th style={thStyle}>Calories</th>
              <th style={thStyle} />
            </tr>
            {this.renderRows()}
            <tr>
              <th style={thStyle}>Day Total</th>
              <th style={thStyle} />
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.fat, 0)}
              </th>
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.carbs, 0)}
              </th>
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.protein, 0)}
              </th>
              <th style={thStyle}>
                {this.props.today.reduce((l, r) => l + r.calories, 0)}
              </th>
            </tr>
          </tbody>
        </table>
        <button
          onClick={() => this.props.handleAddMealClick()}
        >
          Add Meal
        </button>
      </div>
    );
  }
}

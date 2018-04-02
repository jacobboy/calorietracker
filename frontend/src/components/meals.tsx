import { Food, Meal } from '../classes';
import * as React from 'react';
/* import TrackedFood from '../containers/trackedfood';*/

/* interface MealComponentProps {
 *   meal: Meal;
 *   idx: number;
 *   handleDeleteMeal: () => void;
 *   thStyle: React.CSSProperties;
 * }*/

/* function MealComponent(props: MealComponentProps) {
 *   return (
 *     <div>
 *       <th style={props.thStyle}>Total</th>
 *       <th style={props.thStyle}>{props.meal.fat}</th>
 *       <th style={props.thStyle}>{props.meal.protein}</th>
 *       <th style={props.thStyle}>{props.meal.carbs}</th>
 *       <th style={props.thStyle}>{props.meal.calories}</th>
 *       <th><button onClick={props.handleDeleteMeal}>Delete Meal</button></th>
 *
 *       {
 *         props.meal.foods.map((food: Food, mealIdx: number) => {
 *           return <TrackedFood key={food.id} food={food} mealIdx={mealIdx} />;
 *         })
 *       }
 *     </div>
 *   );
 * }*/

interface MealsComponentProps {
  today: Meal[];
  handleAddMealClick: () => void;
  handleDeleteMealClick: (mealIdx: number) => void;
  handleRemoveFoodClick: (mealIdx: number, food: Food) => void;
}

export class MealsComponent extends React.Component<
  MealsComponentProps, {}
  > {
  tableStyle: React.CSSProperties = {
    'borderCollapse': 'collapse',
    'border': '1px solid black'
  };

  thStyle: React.CSSProperties = {
    'border': '1px solid black'
  };

  tdStyle: React.CSSProperties = {
    'border': '1px solid black'
  };

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

  /* renderMeal(meal: Meal, idx: number) {
   *   return (
   *     <MealComponent
   *       key={meal.id}
   *       meal={meal}
   *       idx={idx}
   *       handleDeleteMeal={() => this.props.handleDeleteMeal(idx)}
   *       thStyle={this.thStyle}
   *     />
   *   );
   * }*/

  makeMealRow(meal: Meal, mealIdx: number) {
    return (
      <tr key={meal.uid}>
        <th style={this.thStyle}>Total</th>
        <th style={this.thStyle} />
        <th style={this.thStyle}>{meal.fat}</th>
        <th style={this.thStyle}>{meal.carbs}</th>
        <th style={this.thStyle}>{meal.protein}</th>
        <th style={this.thStyle}>{meal.calories}</th>
        <th>
          <button onClick={() => this.props.handleDeleteMealClick(mealIdx)}>
            Delete Meal
          </button>
        </th>
      </tr>
    );
  }

  makeFoodRow(food: Food, mealIdx: number) {
    return (
      <tr key={food.uid}>
        <td style={this.tdStyle}>{food.name}</td>
        <td style={this.tdStyle}>{food.amount}</td>
        <td style={this.tdStyle}>{food.fat}</td>
        <td style={this.tdStyle}>{food.carbs}</td>
        <td style={this.tdStyle}>{food.protein}</td>
        <td style={this.tdStyle}>{food.calories}</td>
        <td style={this.tdStyle}>
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
        <table style={this.tableStyle}>
          <tbody>
            <tr>
              <th style={this.thStyle} />
              <th style={this.thStyle}>Amount</th>
              <th style={this.thStyle}>Fat</th>
              <th style={this.thStyle}>Carbs</th>
              <th style={this.thStyle}>Protein</th>
              <th style={this.thStyle}>Calories</th>
              <th style={this.thStyle} />
            </tr>
            {this.renderRows()}
            <tr>
              <th style={this.thStyle}>Day Total</th>
              <th style={this.thStyle} />
              <th style={this.thStyle}>
                {this.props.today.reduce((l, r) => l + r.fat, 0)}
              </th>
              <th style={this.thStyle}>
                {this.props.today.reduce((l, r) => l + r.carbs, 0)}
              </th>
              <th style={this.thStyle}>
                {this.props.today.reduce((l, r) => l + r.protein, 0)}
              </th>
              <th style={this.thStyle}>
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

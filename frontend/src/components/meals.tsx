import { Food, Meal } from '../classes';
import * as React from 'react';
import TrackedFood from '../containers/trackedfood';

function MealComponent(props: { meal: Meal, handleDeleteMeal: () => void }) {
  return (
    <div>
      <table>
        <tbody>
          {
            props.meal.foods.map((food: Food, mealIdx: number) => {
              return <TrackedFood key={food.id} food={food} mealIdx={mealIdx} />;
            })
          }
          <tr>
            <td>{props.meal.id}</td>
            <td>{props.meal.fat}</td>
            <td>{props.meal.protein}</td>
            <td>{props.meal.carbs}</td>
            <td>{props.meal.calories}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={props.handleDeleteMeal}>Delete Meal</button>
    </div>
  );
}

interface MealsComponentProps {
  today: Meal[];
  handleAddMeal: () => void;
  handleDeleteMeal: (mealIdx: number) => void;
}

export class MealsComponent extends React.Component<
  MealsComponentProps, {}
  > {
  constructor(props: MealsComponentProps) {
    super(props);
  }

  ensureOneMeal(today: Meal[]) {
    if (today.length === 0) {
      this.props.handleAddMeal();
    }
  }

  componentDidMount() {
    this.ensureOneMeal(this.props.today);
  }

  componentWillReceiveProps(nextProps: MealsComponentProps) {
    this.ensureOneMeal(nextProps.today);
  }

  renderMeal(meal: Meal, idx: number) {
    return (
      <MealComponent
        key={meal.id}
        meal={meal}
        handleDeleteMeal={() => this.props.handleDeleteMeal(idx)}
      />
    );
  }

  render() {
    return (
      <div>
        {this.props.today.map((meal, idx) => this.renderMeal(meal, idx))}
        <button onClick={() => this.props.handleAddMeal()}>Add Meal</button>
      </div>
    );
  }
}

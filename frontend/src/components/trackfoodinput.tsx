import * as React from 'react';
import { Ingredient, scaleFood, Food } from '../classes';

interface TrackFoodInputProps {
  mealIdx: number;
  ingredient: Ingredient;
  onTrackSubmit: (mealIdx: number, food: Food) => void;
}

interface TrackFoodInputState {
  newIngredient: Food;
}

export class TrackFoodInput extends React.Component<
  TrackFoodInputProps, TrackFoodInputState
  > {
  constructor(props: TrackFoodInputProps) {
    super(props);
    this.state = {
      newIngredient: scaleFood(
        this.props.ingredient, this.props.ingredient.amount
      )
    };
  }

  handleAmount(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    if (!isNaN(amount)) {
      this.setState({
        newIngredient: scaleFood(
          this.props.ingredient, amount
        )
      });
    }
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.onTrackSubmit(this.props.mealIdx, this.state.newIngredient);
  }

  render() {
    return (
      <div>
        {this.state.newIngredient.name}
        < table >
          <tbody>
            <tr>
              <td>Fat</td>
              <td>{this.state.newIngredient.fat}</td>
            </tr>
            <tr>
              <td>Carbs</td>
              <td>{this.state.newIngredient.carbs}</td>
            </tr>
            <tr>
              <td>Protein</td>
              <td>{this.state.newIngredient.protein}</td>
            </tr>
            <tr>
              <td>Calories</td>
              <td>{this.state.newIngredient.calories}</td>
            </tr>
          </tbody>
        </table >
        <form onSubmit={(e) => this.handleSubmit(e)}>
          <label>
            Amount:
            <input
              type="number"
              value={this.state.newIngredient.amount}
              onChange={(e) => this.handleAmount(e)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div >
    );
  }
}

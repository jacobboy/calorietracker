import * as React from 'react';
import { FOOD_UNIT } from '../classes';

interface CreateIngredientInputProps {
  handleSubmit: (
    name: string,
    fat: number,
    carbs: number,
    protein: number,
    calories: number,
    amount: number,
    unit: FOOD_UNIT
  ) => void;
}

interface CreateIngredientInputState {
  name: string;
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
  amount: number;
  unit: FOOD_UNIT;
  useCalculatedCalories: boolean;
}

export class CreateIngredientInput extends React.Component<
  CreateIngredientInputProps, CreateIngredientInputState
  > {

  constructor(props: CreateIngredientInputProps) {
    super(props);
    this.state = {
      name: '',
      fat: 0,
      carbs: 0,
      protein: 0,
      calories: 0,
      amount: 100,
      unit: FOOD_UNIT.g,
      useCalculatedCalories: true
    };
  }

  handleNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.target.value });
    /* this.props.handleNameInput(event.target.value);*/
  }

  // TODO figure out how to do these macronutrient handlers programmatically
  /* handleInput(macronutrient: ('fat' | 'carbs' | 'protein')) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      const newState = { ...this.state, macronutrient: value };
      this.setState(newState);
      if (this.state.useCalculatedCalories) {
        const calories = this.state.fat * 9 + this.state.carbs * 4 + this.state.protein * 4;
        this.setState({ calories });
      }
    };
  } */

  updateCalories(state: CreateIngredientInputState) {
    if (this.state.useCalculatedCalories) {
      const calories = state.fat * 9 + state.carbs * 4 + state.protein * 4;
      this.setState({ calories });
    }
  }

  handleFatInput(event: React.ChangeEvent<HTMLInputElement>) {
    const fat = Number(event.target.value);
    this.setState({ fat });
    this.updateCalories({ ...this.state, fat });
  }

  handleCarbsInput(event: React.ChangeEvent<HTMLInputElement>) {
    const carbs = Number(event.target.value);
    this.setState({ carbs });
    this.updateCalories({ ...this.state, carbs });
  }

  handleProteinInput(event: React.ChangeEvent<HTMLInputElement>) {
    const protein = Number(event.target.value);
    this.setState({ protein });
    this.updateCalories({ ...this.state, protein });
  }

  handleCaloriesInput(event: React.ChangeEvent<HTMLInputElement>) {
    const calories = Number(event.target.value);
    this.setState({ calories });
  }

  handleAmountInput(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    this.setState({ amount });
  }

  handleUnitInput(event: React.ChangeEvent<HTMLSelectElement>) {
    const unit = FOOD_UNIT[event.target.value];
    this.setState({ unit });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();
    const { name, fat, carbs, protein, calories, amount, unit } = this.state;
    this.props.handleSubmit(name, fat, carbs, protein, calories, amount, unit);
  }

  render() {
    return (
      <form id="ingredientForm" onSubmit={(e) => this.handleSubmit(e)}>
        <ul>
          <li key="name">
            <label>
              Name:
              <input
                id="nameInput"
                type="text"
                value={this.state.name || ''}
                onChange={(e) => this.handleNameInput(e)}
              />
            </label>
          </li>
          <li key="fat">
            <label>
              Fat:
              <input
                id="fatInput"
                type="number"
                value={this.state.fat || ''}
                onChange={(e) => this.handleFatInput(e)}
              />
            </label>
          </li>
          <li key="carbs">
            <label>
              Carbs:
              <input
                id="carbsInput"
                type="number"
                value={this.state.carbs || ''}
                onChange={(e) => this.handleCarbsInput(e)}
              />
            </label>
          </li>
          <li key="protein">
            <label>
              Protein:
              <input
                id="proteinInput"
                type="number"
                value={this.state.protein || ''}
                onChange={(e) => this.handleProteinInput(e)}
              />
            </label>
          </li>
          <li key="calories">
            <label>
              Calories:
              <input
                id="caloriesInput"
                type="number"
                value={this.state.calories || ''}
                onChange={(e) => this.handleCaloriesInput(e)}
              />
            </label>
          </li>
          <li key="amount">
            <label>
              Amount:
              <input
                id="createIngredientAmountInput"
                type="number"
                value={this.state.amount}
                onChange={(e) => this.handleAmountInput(e)}
              />
            </label>
          </li>
          <li key="unit">
            <label>
              Unit:
              <select
                id="unitInput"
                value={this.state.unit}
                onChange={(e) => this.handleUnitInput(e)}
              >
                {Object.keys(FOOD_UNIT).map((unit) => (<option key={unit}>unit</option>))}
              </select>
            </label>
          </li>
          <li key="submit">
            <input id="submitIngredient" type="submit" value="Submit" />
          </li>
        </ul>
      </form>
    );
  }
}

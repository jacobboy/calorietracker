import * as React from 'react';

interface CreateIngredientInputProps {
  handleSubmit: (
    name: string,
    fat: number,
    carbs: number,
    protein: number,
    calories: number,
    amount: number,
    unit: string
  ) => void;
}

interface CreateIngredientInputState {
  name: string;
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
  amount: number;
  unit: string;
  useCalculatedCalories: boolean;
}

export class CreateIngredientInput extends React.Component<
  CreateIngredientInputProps, CreateIngredientInputState
  > {

  constructor(props: CreateIngredientInputProps) {
    super(props);
    this.setState({});
  }

  handleNameInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.target.value });
    /* this.props.handleNameInput(event.target.value);*/
  }

  /* handleMacroInput(macro: string, event: React.ChangeEvent<HTMLInputElement>) {
   *   this.setState({ [event.target.name]: event.target.value });
   * }*/

  updateCalories() {
    if (this.state.useCalculatedCalories) {
      const calories = this.state.fat * 9 + this.state.carbs * 4 + this.state.protein * 4;
      this.setState({ calories });
    }
  }

  handleFatInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ fat: Number(event.target.value) });
    this.updateCalories();
  }

  handleCarbsInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ carbs: Number(event.target.value) });
    this.updateCalories();
  }

  handleProteinInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ protein: Number(event.target.value) });
    this.updateCalories();
  }

  handleCaloriesInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      /* useCalculatedCalories: false,*/
      calories: Number(event.target.value)
    });
  }

  handleAmountInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      amount: Number(event.target.value)
    });
  }

  handleUnitInput(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      unit: event.target.value
    });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { name, fat, carbs, protein, calories, amount, unit } = this.state;
    this.props.handleSubmit(name, fat, carbs, protein, calories, amount, unit);
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)}>
        <label>
          Name:
          <input
            type="text"
            value={this.state.name || ''}
            onChange={(e) => this.handleNameInput(e)}
          />
        </label>
        <label>
          Fat:
          <input
            type="number"
            value={this.state.fat || ''}
            onChange={(e) => this.handleFatInput(e)}
          />
        </label>
        <label>
          Carbs:
          <input
            type="number"
            value={this.state.carbs || ''}
            onChange={(e) => this.handleCarbsInput(e)}
          />
        </label>
        <label>
          Protein:
          <input
            type="number"
            value={this.state.protein || ''}
            onChange={(e) => this.handleProteinInput(e)}
          />
        </label>
        <label>
          Calories:
          <input
            type="number"
            value={this.state.fat || ''}
            onChange={(e) => this.handleCaloriesInput(e)}
          />
        </label>
        <label>
          Amount:
          <input
            type="text"
            value={this.state.amount}
            onChange={(e) => this.handleAmountInput(e)}
          />
        </label>
        <label>
          Unit:
          <input
            type="text"
            value={this.state.unit}
            onChange={(e) => this.handleUnitInput(e)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

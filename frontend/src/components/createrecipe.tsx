import { Ingredient, FOOD_UNIT } from '../classes';
import * as React from 'react';
import { thStyle, tableStyle } from '../style';
import { IngredientsTable } from './ingredientstable';

interface CreateRecipeInputProps {
  foods: Ingredient[];
  handleRemoveFoodClick: (food: Ingredient) => void;
  handleSaveRecipeClick: (name: string, foods: Ingredient[], amount?: number, unit?: FOOD_UNIT) => void;
}

interface CreateRecipeInputState {
    name: string;
    amount: number;
    unit: FOOD_UNIT;
}

export class CreateRecipeInput extends React.Component<
  CreateRecipeInputProps, CreateRecipeInputState
  > {

  constructor(props: CreateRecipeInputProps) {
    super(props);
    this.state = {
        name: 'My Bitchin\' Recipe',
        amount: 100,
        unit: FOOD_UNIT.g
    };
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

  onSaveRecipeClick() {
      if (this.props.foods.length > 0) {
        this.props.handleSaveRecipeClick(
            this.state.name, this.props.foods, this.state.amount, this.state.unit
        );
      }
  }

  handleAmountInput(event: React.ChangeEvent<HTMLInputElement>) {
    const amount = Number(event.target.value);
    this.setState({ amount });
  }

  handleUnitInput(event: React.ChangeEvent<HTMLSelectElement>) {
    const unit = FOOD_UNIT[event.target.value];
    if (unit !== undefined) {
      this.setState({ unit });
    }
  }

  render() {
    return (
      <div>
        <table style={tableStyle}>
          <tbody>
            {this.headerRow()}
            <IngredientsTable
               foods={this.props.foods}
               handleRemoveClick={this.props.handleRemoveFoodClick}
               handleDeleteClick={() => null}
               handleAmountInput={(e) => this.handleAmountInput(e)}
               amount={this.state.amount}
               handleUnitInput={(e) => this.handleUnitInput(e)}
               unit={this.state.unit}
            />
          </tbody>
        </table>
        <button id="saveRecipe" onClick={() => this.onSaveRecipeClick()} >
          Save Recipe
        </button>
      </div>
    );
  }
}
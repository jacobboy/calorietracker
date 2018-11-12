import { Ingredient, FOOD_UNIT } from '../classes';
import * as React from 'react';
import { thStyle, tableStyle } from '../style';
import { IngredientsTable } from './ingredientstable';

interface CreateRecipeInputProps {
  foods: Ingredient[];
  handleRemoveFoodClick: (food: Ingredient) => void;
  handleSaveRecipeClick: (name: string,
                          foods: Ingredient[],
                          portionSize: number,
                          totalSize: number,
                          unit: string) => void;
}

interface CreateRecipeInputState {
    name: string;
    unit: FOOD_UNIT;
    useCalculatedAmount: boolean;
    totalSize?: number;
}

export class CreateRecipeInput extends React.Component<
  CreateRecipeInputProps, CreateRecipeInputState
  > {

  constructor(props: CreateRecipeInputProps) {
    super(props);
    this.state = {
        name: `${currentDate()} Bitchin\' Recipe`,
        totalSize: undefined,
        unit: FOOD_UNIT.g,
        useCalculatedAmount: true
    };
  }

  getTotalSize(allowZero: boolean) {
    if (allowZero) {
      if (this.state.totalSize !== undefined) {
        return Number(this.state.totalSize);
      } else {
        return Number(this.props.foods.reduce((l, r) => l + r.amount, 0));
      }
    } else {
      return Number(this.state.totalSize || this.props.foods.reduce((l, r) => l + r.amount, 0));
    }
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
            this.state.name, this.props.foods, 100, this.getTotalSize(false), this.state.unit
        );
      }
  }

  handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: event.target.value });
  }

  handleAmountInput(event: React.ChangeEvent<HTMLInputElement>) {
    const totalSize = Number(event.target.value);
    this.setState({ totalSize, useCalculatedAmount: false });
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
               amount={this.getTotalSize(true)}
               handleUnitInput={(e) => this.handleUnitInput(e)}
               unit={this.state.unit}
            />
          </tbody>
        </table>
        <label>
            Name:
            <input
              id="recipeNameInput"
              type="text"
              placeholder="Recipe name"
              value={this.state.name || ''}
              onChange={(e) => this.handleNameChange(e)}
            />
          </label>
        <button id="saveRecipe" onClick={() => this.onSaveRecipeClick()} >
          Save Recipe
        </button>
      </div>
    );
  }
}

function currentDate() {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
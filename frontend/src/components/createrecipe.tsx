import { Ingredient, FOOD_UNIT } from '../classes';
import * as React from 'react';
import { thStyle, tableStyle } from '../style';
import { IngredientsTable } from './ingredientstable';

interface CreateRecipeInputProps {
  recipe: Ingredient[];
  handleRemoveFoodClick: (foodIdx: number) => void;
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
        {this.headerCell('Fat')}
        {this.headerCell('Carbs')}
        {this.headerCell('Protein')}
        {this.headerCell('Calories')}
        {this.headerCell('')}
      </tr>
    );
  }

  onSaveRecipeClick() {
      if (this.props.recipe.length > 0) {
        this.props.handleSaveRecipeClick(
            this.state.name, this.props.recipe, this.state.amount, this.state.unit
        );
      }
  }

  render() {
    return (
        <div>
          <table style={tableStyle}>
            <tbody>
              {this.headerRow()}
              <IngredientsTable 
                 foods={this.props.recipe}
                 handleRemoveClick={this.props.handleRemoveFoodClick}
                 handleDeleteClick={() => null}
              />
            </tbody>
          </table>
          <button onClick={() => this.onSaveRecipeClick()} >
            Save Recipe
          </button>
        </div>
      );
    }  
}
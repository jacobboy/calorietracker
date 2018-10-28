import { Ingredient } from '../classes';
import * as React from 'react';
import { tdStyle, thStyle } from '../style';

interface CreateRecipeInputProps {
  recipe: Ingredient[];
  handleRemoveFoodClick: (foodIdx: number) => void;
}

export class CreateRecipeInput extends React.Component<
  CreateRecipeInputProps, {}
  > {

  constructor(props: CreateRecipeInputProps) {
    super(props);
  }

  ingredientCell(text: string | number) {
    return <td style={tdStyle}>{text}</td>;
  }  

  makeFoodRow(food: Ingredient, foodIdx: number) {
    return (
      <tr key={food.uid}>
        {this.ingredientCell(food.name)}
        {this.ingredientCell(food.amount)}
        {this.ingredientCell(food.fat)}
        {this.ingredientCell(food.carbs)}
        {this.ingredientCell(food.protein)}
        {this.ingredientCell(food.calories)}
        <td style={tdStyle}>
          <button onClick={() => this.props.handleRemoveFoodClick(foodIdx)}>
            Remove
          </button>
        </td>
      </tr>

    );
  }

  mealCell(text: string | number) {
    return <th style={thStyle}>{text}</th>;
  }

  makeTotalRow(recipe: Ingredient[]) {
    return (
      <tr>
        {this.mealCell('Total')}
        {this.mealCell('')}
        {this.mealCell(recipe.reduce((l, r) => l + r.fat, 0))}
        {this.mealCell(recipe.reduce((l, r) => l + r.carbs, 0))}
        {this.mealCell(recipe.reduce((l, r) => l + r.protein, 0))}
        {this.mealCell(recipe.reduce((l, r) => l + r.calories, 0))}
        <th/>
      </tr>
    );
  }  

  renderRows() {
    const rows = [];
    for (let foodIdx = 0; foodIdx < this.props.recipe.length; foodIdx++) {
      let food = this.props.recipe[foodIdx];      
      rows.push(this.makeFoodRow(food, foodIdx));

    }
    rows.push(this.makeTotalRow(this.props.recipe));
    return rows;
  }  

  render() {
    return (
      this.renderRows()
    );
  }
}
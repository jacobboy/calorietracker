import { Ingredient } from '../classes';
import * as React from 'react';
import { tdStyle, thStyle } from '../style';

interface IngredientsTableProps {
  foods: Ingredient[];
  handleRemoveClick: (foodIdx: number) => void;
  handleDeleteClick: () => void;
}

export class IngredientsTable extends React.Component<
  IngredientsTableProps, {}
  > {

  constructor(props: IngredientsTableProps) {
    super(props);
  }

  ingredientCell(text: string | number) {
    return <td style={tdStyle}>{text}</td>;
  }  

  makeFoodRow(food: Ingredient, foodIdx: number) {
    return (
      <tr key={food.uid} id={'food_' + food.uid}>
        {this.ingredientCell(food.name)}
        {this.ingredientCell(food.amount)}
        {this.ingredientCell(food.fat)}
        {this.ingredientCell(food.carbs)}
        {this.ingredientCell(food.protein)}
        {this.ingredientCell(food.calories)}
        <td style={tdStyle}>
          <button 
            id={'removeFood_' + food.uid}
            onClick={() => this.props.handleRemoveClick(foodIdx)}
          >
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
      <tr key="total">
        {this.mealCell('Total')}
        {this.mealCell('')}
        {this.mealCell(recipe.reduce((l, r) => l + r.fat, 0))}
        {this.mealCell(recipe.reduce((l, r) => l + r.carbs, 0))}
        {this.mealCell(recipe.reduce((l, r) => l + r.protein, 0))}
        {this.mealCell(recipe.reduce((l, r) => l + r.calories, 0))}
        <th>
          <button 
            id={'deleteMeal'}
            onClick={() => this.props.handleDeleteClick()}
          >
            Remove
          </button>
        </th>
      </tr>
    );
  }  

  renderRows() {
    const rows = [];
    for (let foodIdx = 0; foodIdx < this.props.foods.length; foodIdx++) {
      let food = this.props.foods[foodIdx];      
      rows.push(this.makeFoodRow(food, foodIdx));

    }
    rows.push(this.makeTotalRow(this.props.foods));
    return rows;
  }  

  render() {
    return (
      this.renderRows()
    );
  }
}
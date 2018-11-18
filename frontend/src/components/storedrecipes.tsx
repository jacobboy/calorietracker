import * as React from 'react';
import { Recipe } from '../classes';
import { thStyle, tableStyle } from '../style';
import StoredIngredientRow from '../containers/storedingredientrow';

type StoredRecipesProps = {
  recipes: Recipe[];
  onCopyRecipeClick: (recipe: Recipe) => void;
};

export function StoredRecipes(props: StoredRecipesProps) {
  return (
    <div>
    Recipes:
    <table style={tableStyle}>
      <tbody>
        <tr style={thStyle}>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Fat</th>
          <th style={thStyle}>Carbs</th>
          <th style={thStyle}>Protein</th>
          <th style={thStyle}>Calories</th>
          <th style={thStyle}>Amount</th>
          <th style={thStyle}>Unit</th>
        </tr >
        {props.recipes.map(
          (item) => <StoredIngredientRow key={item.uid} item={item} onCopyClick={props.onCopyRecipeClick} />
        )}
      </tbody >
    </table >
    </div>
  );
}
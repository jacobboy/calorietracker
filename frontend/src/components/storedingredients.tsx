import * as React from 'react';
import { Ingredient } from '../classes';
import { thStyle, tableStyle } from '../style';
import StoredIngredientRow from '../containers/storedingredientrow';

type StoredIngredientsProps = {
  ingredients: Ingredient[];
  ndbs: Ingredient[];
};

export function StoredIngredients(props: StoredIngredientsProps) {
  return (
    <div>
      Ingredients:
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
          </tr>
          {props.ingredients.map(
            (item) => <StoredIngredientRow key={item.uid} item={item} />
          )}
          {props.ndbs.map(
            (item) => <StoredIngredientRow key={item.uid} item={item} />
          )}
        </tbody>
      </table>
    </div>
  );
}
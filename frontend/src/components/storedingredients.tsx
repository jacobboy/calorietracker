import * as React from 'react';
import { Ingredient } from '../classes';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { StoredIngredientRow } from '../components/storedingredientrow';
import StoredIngredientRowContainer from '../containers/storedingredientrow';

type StoredIngredientsProps = {
  ingredients: Ingredient[];
  ndbs: Ingredient[];
  searchText: string;
};

function findIngredients(ingredients: Ingredient[], searchText: string) {
  if (searchText) {
    return ingredients.filter((ingred) => ingred.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
  } else {
    return ingredients;
  }
}

export function StoredIngredients(props: StoredIngredientsProps) {
  return (
    <div>
      Ingredients:
      <table style={tableStyle}>
        <tbody>
          {StoredIngredientRow.HEADER}
          {findIngredients(props.ingredients, props.searchText).map(
            (item) => <StoredIngredientRowContainer key={item.uid} item={item} />
          )}
          {findIngredients(props.ndbs, props.searchText).map(
            (item) => <StoredIngredientRowContainer key={item.uid} item={item} />
          )}
        </tbody>
      </table>
    </div>
  );
}
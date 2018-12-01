import * as React from 'react';
import { Ingredient } from '../classes';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { Header } from '../components/storedingredientrow';
import StoredIngredientRow from '../containers/storedingredientrow';
import { nameMatches } from 'src/datautil';

type StoredIngredientsProps = {
  ingredients: Ingredient[];
  ndbs: Ingredient[];
  searchText: string;
};

function findIngredients(ingredients: Ingredient[], searchText: string) {
  return nameMatches(ingredients, searchText);
}

export function StoredIngredients(props: StoredIngredientsProps) {
  return (
    <div>
      Ingredients:
      <table style={tableStyle}>
        <tbody>
          {Header}
          {findIngredients(props.ingredients, props.searchText).map(
            item => <StoredIngredientRow key={item.uid} item={item} />
          )}
          {findIngredients(props.ndbs, props.searchText).map(
            item => <StoredIngredientRow key={item.uid} item={item} />
          )}
        </tbody>
      </table>
    </div>
  );
}
import * as React from 'react';
import { Ingredient } from '../classes';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { Header } from '../components/storedingredientrow';
import StoredIngredientRow from '../containers/storedingredientrow';
import { nameMatches } from '../datautil';

type StoredRecipesProps = {
  recipes: Ingredient[];
  onCopyRecipeClick: (recipeIngredient: Ingredient) => void;
  searchText: string;
  focusRef: React.RefObject<HTMLElement>;
};

function findRecipes(recipes: Ingredient[], searchText: string) {
  return nameMatches(recipes, searchText);
}

export function StoredRecipes(props: StoredRecipesProps) {
  return (
    <div>
      Recipes:
      <table style={tableStyle}>
        <tbody>
          {Header}
          {findRecipes(props.recipes, props.searchText).map(
            item => (
              <StoredIngredientRow
                key={item.uid}
                item={item}
                onCopyClick={props.onCopyRecipeClick}
                focusRef={props.focusRef}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}

import * as React from 'react';
import { Recipe } from '../classes';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { StoredIngredientRow } from '../components/storedingredientrow';
import StoredIngredientRowContainer from '../containers/storedingredientrow';

type StoredRecipesProps = {
  recipes: Recipe[];
  onCopyRecipeClick: (recipe: Recipe) => void;
  searchText: string;
};

function findRecipes(recipes: Recipe[], searchText: string) {
  if (searchText) {
    return recipes.filter((recipe) => recipe.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
  } else {
    return recipes;
  }
}

export function StoredRecipes(props: StoredRecipesProps) {
  return (
    <div>
    Recipes:
    <table style={tableStyle}>
      <tbody>
        {StoredIngredientRow.HEADER}
        {findRecipes(props.recipes, props.searchText).map(
          (item) => <StoredIngredientRowContainer key={item.uid} item={item} onCopyClick={props.onCopyRecipeClick} />
        )}
      </tbody >
    </table >
    </div>
  );
}
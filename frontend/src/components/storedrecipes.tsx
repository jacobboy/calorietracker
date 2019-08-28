import * as React from 'react';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { Header } from '../components/storedingredientrow';
import StoredIngredientRow from '../containers/storedingredientrow';
import { nameMatches } from '../datautil';
import { NamedMacros } from 'src/client';

type StoredRecipesProps = {
  recentRecipes: NamedMacros[];
  searchRecipes: NamedMacros[];
  onCopyRecipeClick: (recipe: NamedMacros) => void;
  searchText: string;
  focusRef: React.RefObject<HTMLElement>;
};

function findRecipes(recipes: NamedMacros[], searchText: string) {
  return nameMatches(recipes, searchText);
}

export function StoredRecipes(props: StoredRecipesProps) {
  return (
    <div>
      Recipes:
      <table style={tableStyle}>
        <tbody>
          {Header}
          {findRecipes(props.recentRecipes, props.searchText).map(
            item => (
              <StoredIngredientRow
                key={item.uid}
                item={item}
                onCopyClick={props.onCopyRecipeClick}
                focusRef={props.focusRef}
              />
            ))}
          {props.searchRecipes.map(
            item => (
              <StoredIngredientRow
                key={'search_' + item.uid}
                item={item}
                focusRef={props.focusRef}
              />
            )
          )}

        </tbody>
      </table>
    </div>
  );
}

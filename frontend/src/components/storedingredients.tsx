import * as React from 'react';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { Header } from '../components/storedingredientrow';
import StoredIngredientRow from '../containers/storedingredientrow';
import { nameMatches } from 'src/datautil';
import { NamedMacros } from 'src/client';

type StoredIngredientsProps = {
  ingredients: NamedMacros[];
  searchText: string;
  focusRef: React.RefObject<HTMLElement>;
};

function findIngredients(ingredients: NamedMacros[], searchText: string) {
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
            item => (
              <StoredIngredientRow
                key={item.uid}
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
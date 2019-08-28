import * as React from 'react';
import { tableStyle } from '../style';
/* TODO pretty sure the below is definitely not how to import both */
import { Header } from '../components/storedingredientrow';
import StoredIngredientRow from '../containers/storedingredientrow';
import { nameMatches } from 'src/datautil';
import { NamedMacros } from 'src/client';

type StoredIngredientsProps = {
  recentIngredients: NamedMacros[];
  searchIngredients: NamedMacros[];
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
          {findIngredients(props.recentIngredients, props.searchText).map(
            item => (
              <StoredIngredientRow
                key={'recent_' + item.uid}
                item={item}
                focusRef={props.focusRef}
              />
            )
          )}
          {props.searchIngredients.map(
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
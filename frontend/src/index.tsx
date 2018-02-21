import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import * as React from 'react';
import { Ingredient, ReportResponse } from './classes';
import { CheddarCheese, FetaCheese } from './mocks';

export interface IngredientsProps {
  things: string;
}

export interface RecipeProps {
  stuff: string;
}

function Buttons() {
  let buttonStyle: React.CSSProperties = {
    flexDirection: 'column',
    display: 'flex'
  };

  return (
    <div
      className="buttons"
      style={buttonStyle}
    >
      <button>"Create ingredient"</button>
      <button>"Create recipe"</button>
      <button>"Track food"</button>
    </div>
  );
}

function Ingredients(ingredients: Ingredient[]) {
  return (
    <li className="ingredients">
      <ul></ul>
    </li>
  );
}

function Recipes({ stuff = 'hi' }: RecipeProps) {
  return (
    <li className="recipes">
      <ul>{stuff}</ul>
    </li>
  );
}

function App() {
  return (
    <div>
      <Buttons />
      <Ingredients ingredients=[CheddarCheese, FetaCheese] />
        <Recipes stuff="Stuff" />
    </div>
  );
}

//
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

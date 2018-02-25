import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import * as React from 'react';
import { Ingredient } from './classes';
import { getIngredient } from './ndbapi';

function Buttons() {
  let buttonStyle: React.CSSProperties = {
    flexDirection: 'column',
    display: 'flex'
  };

  return (
    <div className="buttons" style={buttonStyle}>
      <button>"Create ingredient"</button>
      <button>"Create recipe"</button>
      <button>"Track food"</button>
    </div>
  );
}

interface IngredientComponentProps {
  ingredient: Ingredient;
}

/* interface IngredientComponentState {
 *   ingredient: Ingredient;
 * }*/

/* class IngredientComponent extends React.Component<IngredientComponentProps, IngredientComponentState> {
 *   constructor(props: IngredientComponentProps) {
 *     super(props);
 *     this.state = { ingredient: props.ingredient };
 *   }
 * 
 *   render() {
 *     return (
 *       <li>{this.state.ingredient.name}</li>
 *     );
 *   }
 * }*/

function IngredientItem(props: IngredientComponentProps) {
  return <li>{props.ingredient.name}</li>;
}

interface IngredientsProps {
  ndbnos: string[];
}

interface IngredientsState {
  /* error: ExceptionInformation;*/
  ndbnos: string[];
  ingredients: Ingredient[];
}

class Ingredients extends React.Component<IngredientsProps, IngredientsState> {
  constructor(props: IngredientsProps) {
    super(props);
    this.state = {
      /* error: null,*/
      ndbnos: this.props.ndbnos,
      ingredients: []
    };
  }

  componentDidMount() {
    this.state.ndbnos.map(
      (ndbno) => getIngredient(ndbno).then(
        (ingredient) => this.setState({ ingredients: this.state.ingredients.concat([ingredient]) })
        /* , (error) => this.setState({ isLoaded: true, error })*/
      ));
  }

  render() {
    return (
      <ul className="ingredients">
        {this.state.ingredients.map(
          (ingredient) => <IngredientItem key={ingredient.ndbno} ingredient={ingredient} />
        )}
      </ul>
    );
  }
}

interface RecipeProps {
  stuff: string;
}

function Recipes(props: RecipeProps) {
  return (
    <ul className="recipes">
      <li>{props.stuff}</li>
    </ul>
  );
}

function App() {
  return (
    <div>
      <Buttons />
      < Ingredients ndbnos={['01009', '01011']} />
      < Recipes stuff="Stuff" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

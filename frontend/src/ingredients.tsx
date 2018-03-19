import * as React from 'react';
import { Ingredient } from './classes';
import { getIngredient } from './ndbapi';

function IngredientComponent(props: { ingredient: Ingredient }) {
  return <li>{props.ingredient.name}</li>;
}

interface IngredientsComponentProps {
  ndbnos: string[];
}

interface IngredientsComponentState {
  /* error: ExceptionInformation;*/
  ingredients: Ingredient[];
}

export class IngredientsComponent extends React.Component<
  IngredientsComponentProps, IngredientsComponentState
  > {
  constructor(props: IngredientsComponentProps) {
    super(props);
    this.state = {
      /* error: null,*/
      ingredients: []
    };
  }

  componentDidMount() {
    this.props.ndbnos.map(
      (ndbno) => getIngredient(ndbno).then(
        (ingredient) => this.setState({
          ingredients: this.state.ingredients.concat([ingredient])
        })
        /* , (error) => this.setState({ isLoaded: true, error })*/
      ));
  }

  render() {
    return (
      <ul className="ingredients">
        {this.state.ingredients.map(
          (ingredient) => (
            <IngredientComponent
              key={ingredient.ingredientId}
              ingredient={ingredient}
            />
          )
        )}
      </ul>
    );
  }
}

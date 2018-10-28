import { Ingredient } from '../classes';
import * as React from 'react';

interface CreateRecipeInputProps {
  recipe: Ingredient[];
  handleRemoveFoodClick: (foodIdx: number) => void;
}

export class CreateRecipeInput extends React.Component<
  CreateRecipeInputProps, {}
  > {

  constructor(props: CreateRecipeInputProps) {
    super(props);
  }

  render() {
    return (
      <div>
        Hi
      </div>
    );
  }
}
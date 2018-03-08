import * as React from 'react';

interface RecipesProps { }

interface RecipesState { }

export class RecipesComponent extends React.Component<RecipesProps, RecipesState> {
  constructor(props: RecipesProps) {
    super(props);
  }

  render() {
    return (
      <ul className="recipes" />
    );
  }
}

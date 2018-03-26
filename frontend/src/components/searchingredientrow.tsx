import * as React from 'react';
import { Ingredientable, Named } from '../classes';

interface SearchIngredientRowProps {
  item: Ingredientable & Named;
  onDetailsClick: (ingredientId: string) => void;
  onTrackClick: (ingredientId: string) => void;
}

interface SearchIngredientRowState { }

export class SearchIngredientRow extends React.Component<
  SearchIngredientRowProps, SearchIngredientRowState
  > {

  constructor(props: SearchIngredientRowProps) {
    super(props);
  }

  handleDetailsClick() {
    this.props.onDetailsClick(this.props.item.ingredientId);
  }

  handleTrackClick() {
    this.props.onTrackClick(this.props.item.ingredientId);
  }

  render() {
    return (
      <tr>
        <td>{this.props.item.name}</td>
        <td>
          <button onClick={() => this.handleDetailsClick()}>
            Details
          </button>
        </td>
        <td>
          <button onClick={() => this.handleTrackClick()}>
            Track
          </button>
        </td>
      </tr >
    );
  }
}

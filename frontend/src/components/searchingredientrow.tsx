import * as React from 'react';
import { UIDed, Named } from '../classes';

interface SearchIngredientRowProps {
  item: UIDed & Named;
  onTrackClick: (ingredientable: UIDed) => void;
}

interface SearchIngredientRowState { }

export class SearchIngredientRow extends React.Component<
  SearchIngredientRowProps, SearchIngredientRowState
  > {

  constructor(props: SearchIngredientRowProps) {
    super(props);
  }

  handleTrackClick() {
    this.props.onTrackClick(this.props.item);
  }

  render() {
    return (
      <tr>
        <td>{this.props.item.name}</td>
        <td>
          <button onClick={() => this.handleTrackClick()}>
            Track
          </button>
        </td>
      </tr >
    );
  }
}

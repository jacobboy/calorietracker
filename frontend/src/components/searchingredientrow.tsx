import * as React from 'react';
import { Named, NDBed, Ingredient } from '../classes';
import { getNDBIngredient } from '../lookup';

interface SearchIngredientRowProps {
  item: NDBed & Named;
  onSaveClick: (ingredientable: NDBed) => void;
}

interface SearchIngredientRowState {
  ingred?: Ingredient;
 }

export class SearchIngredientRow extends React.Component<
  SearchIngredientRowProps, SearchIngredientRowState
  > {

  constructor(props: SearchIngredientRowProps) {
    super(props);
    this.state = {};
  }

  handleDetailsClick() {
    getNDBIngredient(this.props.item).then((ingred) => this.setState({ingred}));
  }

  render() {
    if (this.state.ingred === undefined) {
      return (
        <tr>
          <td>{this.props.item.name}</td>
          <td>
            <button onClick={() => this.handleDetailsClick()}>
              Show Details
            </button>
          </td>
          <td>
            <button onClick={() => this.props.onSaveClick(this.props.item)}>
              Save
            </button>
          </td>
        </tr >
      );
    } else {
      return (
        <tr>
          <td>{this.props.item.name}</td>
          <td>{this.state.ingred.fat}</td>
          <td>{this.state.ingred.carbs}</td>
          <td>{this.state.ingred.protein}</td>
          <td>{this.state.ingred.calories}</td>
          <td>{this.state.ingred.amount}</td>
          <td>{this.state.ingred.unit}</td>
          <td>
            <button onClick={() => this.props.onSaveClick(this.props.item)}>
              Track
            </button>
          </td>
        </tr >
      );
    }    
  }
}

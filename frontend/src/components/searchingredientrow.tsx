import * as React from 'react';
import { Named, NDBed, Ingredient } from '../classes';
import { getIngredient } from '../lookup';
import { tdStyle } from 'src/style';
import { toTitleCase } from 'src/datautil';

function ingredientCell(contents: string | number) {
  return <td title={contents.toString()} style={tdStyle}>{contents}</td>;
}

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
    getIngredient(this.props.item, false).then((ingred) => this.setState({ ingred }));
  }

  render() {
    if (this.state.ingred === undefined) {
      return (
        <tr>
          {ingredientCell(toTitleCase(this.props.item.name))}
          {ingredientCell('')}
          {ingredientCell('')}
          {ingredientCell('')}
          {ingredientCell('')}
          {ingredientCell('')}
          {ingredientCell('')}
          <td style={tdStyle}>
            <button onClick={() => this.handleDetailsClick()}>
              Show Details
            </button>
          </td>
          <td style={tdStyle}>
            <button onClick={() => this.props.onSaveClick(this.props.item)}>
              Save
            </button>
          </td>
        </tr >
      );
    } else {
      return (
        <tr>
          {ingredientCell(toTitleCase(this.props.item.name))}
          {ingredientCell(this.state.ingred.fat)}
          {ingredientCell(this.state.ingred.carbs)}
          {ingredientCell(this.state.ingred.protein)}
          {ingredientCell(this.state.ingred.calories)}
          {ingredientCell(this.state.ingred.amount)}
          {ingredientCell(this.state.ingred.unit)}
          <td style={tdStyle}/>
          <td style={tdStyle}>
            <button onClick={() => this.props.onSaveClick(this.props.item)}>
              Save
            </button>
          </td>
        </tr >
      );
    }
  }
}

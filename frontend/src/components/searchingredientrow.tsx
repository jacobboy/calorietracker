import * as React from 'react';
import { Named, NDBed, Ingredient } from '../classes';
import { getIngredient } from '../lookup';
import { tdStyle, thStyle } from 'src/style';
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

    static HEADER = (
      <tr style={thStyle}>
        <th style={thStyle}>Name</th>
        <th style={thStyle}>Amount</th>
        <th style={thStyle}>Unit</th>
        <th style={thStyle}>Fat</th>
        <th style={thStyle}>Fat%</th>
        <th style={thStyle}>Carbs</th>
        <th style={thStyle}>Carbs%</th>
        <th style={thStyle}>Protein</th>
        <th style={thStyle}>Protein%</th>
        <th style={thStyle}>Calories</th>
      </tr>
    );

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
          {ingredientCell(this.state.ingred.amount)}
          {ingredientCell(this.state.ingred.unit)}
          {ingredientCell(this.state.ingred.fat.toFixed())}
          {ingredientCell(this.state.ingred.fatPct)}
          {ingredientCell(this.state.ingred.carbs.toFixed())}
          {ingredientCell(this.state.ingred.carbsPct)}
          {ingredientCell(this.state.ingred.protein.toFixed())}
          {ingredientCell(this.state.ingred.proteinPct)}
          {ingredientCell(this.state.ingred.calories)}
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

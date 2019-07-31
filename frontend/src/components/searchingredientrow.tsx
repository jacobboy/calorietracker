import * as React from 'react';
import { tdStyle, thStyle, searchLinkStyle } from 'src/style';
import { toTitleCase } from 'src/datautil';
import { SearchItem } from 'src/usdaclient';
import { Macros } from 'src/client';
import { getMacrosFromSearchItem } from 'src/ndbapi';

function ingredientCell(contents: string | number | JSX.Element, title?: string) {
  title = title || contents.toString();
  return <td title={title} style={tdStyle}>{contents}</td>;
}

interface SearchIngredientRowProps {
  item: SearchItem;
  onSaveClick: (searchItem: SearchItem) => void;
}

interface SearchIngredientRowState {
  ndbNoAndMacros?: {ndbNo: string, macros: Macros};
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
    getMacrosFromSearchItem(this.props.item).then((ingred) => this.setState({ndbNoAndMacros: ingred}));
  }

  render() {
    const link = (
    <a
      href={'https://ndb.nal.usda.gov/ndb/foods/show/' + this.props.item.ndbno}
      style={searchLinkStyle}
      target="_blank"
    >
      {toTitleCase(this.props.item.name)}
    </a>);
    if (this.state.ndbNoAndMacros === undefined) {
      return (
        <tr>
          {ingredientCell(link, this.props.item.name)}
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
      const macros = this.state.ndbNoAndMacros.macros;
      const thisMacroPercents = macrosFromAmountOf(this.state.scaledIngredient);
      return (
        <tr>
          {ingredientCell(link, this.props.item.name)}
          {ingredientCell(macros.amount)}
          {ingredientCell(macros.unit)}
          {ingredientCell(macros.fat.toFixed())}
          {ingredientCell(macros.fatPct)}
          {ingredientCell(macros.carbs.toFixed())}
          {ingredientCell(macros.carbsPct)}
          {ingredientCell(macros.protein.toFixed())}
          {ingredientCell(macros.proteinPct)}
          {ingredientCell(macros.calories)}
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

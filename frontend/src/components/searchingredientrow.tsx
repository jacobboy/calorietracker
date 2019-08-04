import * as React from 'react';
import { tdStyle, thStyle, searchLinkStyle } from 'src/style';
import { toTitleCase } from 'src/datautil';
import { SearchItem } from 'src/usdaclient';
import { NamedMacros } from 'src/client';
import { getNamedMacrosFromSearchItem } from 'src/ndbapi';
import { macrosFromAmountOf } from 'src/transforms';

function ingredientCell(contents: string | number | JSX.Element, title?: string) {
  title = title || contents.toString();
  return <td title={title} style={tdStyle}>{contents}</td>;
}

interface SearchIngredientRowProps {
  item: SearchItem;
  onSaveClick: (namedMacros: NamedMacros) => void;
}

interface SearchIngredientRowState {
  // TODO temporary hack where the client knows how the server creates a Usda NamedMacro
  namedMacros?: NamedMacros;
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
    getNamedMacrosFromSearchItem(this.props.item).then((namedMacros) => this.setState({namedMacros}));
  }

  saveSearchItem() {
    if (this.state.namedMacros === undefined) {
      getNamedMacrosFromSearchItem(this.props.item).then((namedMacros) => this.props.onSaveClick(namedMacros));
    } else {
      this.props.onSaveClick(this.state.namedMacros);
    }

  }

  render() {
    const link = (
    <a
      href={`https://ndb.nal.usda.gov/ndb/foods/show/${this.props.item.ndbno}`}
      style={searchLinkStyle}
      target="_blank"
    >
      {toTitleCase(this.props.item.name)}
    </a>);
    if (this.state.namedMacros === undefined) {
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
            <button onClick={() => this.saveSearchItem()}>
              Save
            </button>
          </td>
        </tr >
      );
    } else {
      const macroPercents = macrosFromAmountOf(
        this.state.namedMacros, 1, 1
      );
      return (
        <tr>
          {ingredientCell(link, this.props.item.name)}
          {ingredientCell(this.state.namedMacros.amount)}
          {ingredientCell(this.state.namedMacros.unit)}
          {ingredientCell(this.state.namedMacros.fat.toFixed())}
          {ingredientCell(macroPercents.fatPct)}
          {ingredientCell(this.state.namedMacros.carbs.toFixed())}
          {ingredientCell(macroPercents.carbsPct)}
          {ingredientCell(this.state.namedMacros.protein.toFixed())}
          {ingredientCell(macroPercents.proteinPct)}
          {ingredientCell(this.state.namedMacros.calories)}
          <td style={tdStyle}/>
          <td style={tdStyle}>
            <button onClick={() => this.saveSearchItem()}>
              Save
            </button>
          </td>
        </tr >
      );
    }
  }
}

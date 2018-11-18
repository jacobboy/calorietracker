import * as React from 'react';
import { Named, NDBed } from '../classes';
import SearchIngredientRow from '../containers/searchingredientrow';
import { DataSource } from '../ndbapi';
import StoredIngredients from '../containers/storedingredients';
import StoredRecipes from '../containers/storedrecipes';
import { tableStyle, thStyle } from 'src/style';

interface SearchComponentProps {
  searchString: string;
  dataSource: DataSource;
  items: (NDBed & Named)[];
  onDataSourceSelect: (ds: DataSource) => void;
  onFoodSearchInput: (searchString: string) => void;
  onFoodSearchSubmit: (searchString: string, ds: DataSource) => void;
}

export interface SearchComponentState {
  createIngredientOn: boolean;
}

export class SearchComponent extends React.Component<
  SearchComponentProps, SearchComponentState
  > {

  constructor(props: SearchComponentProps) {
    super(props);
    this.state = { createIngredientOn: false };
  }

  handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.props.onDataSourceSelect(DataSource[event.target.value]);
  }

  handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onFoodSearchInput(event.target.value);
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (this.props.searchString.length > 0) {
      this.props.onFoodSearchSubmit(
        this.props.searchString, this.props.dataSource
      );
    }
  }

  render() {
    return (
      <div>
        <StoredIngredients />
        <StoredRecipes />
        <form onSubmit={(e) => this.handleSubmit(e)} >
          <label>
            Search:
            <input
              type="text"
              placeholder="Search USDA Database"
              value={this.props.searchString || ''}
              onChange={(e) => this.handleSearchChange(e)}
            />
          </label>
          <label>
            Datasource:
            <select
              value={this.props.dataSource}
              onChange={(e) => this.handleSelectChange(e)}
            >
              <option value={DataSource.SR}>Non-branded</option>
              <option value={DataSource.BL}>Branded</option>
              <option value={DataSource.Any}>All</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Fat</th>
              <th style={thStyle}>Carbs</th>
              <th style={thStyle}>Protein</th>
              <th style={thStyle}>Calories</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Unit</th>
            </tr>
            {this.props.items.map(
              (item) => <SearchIngredientRow key={item.ndbno} item={item} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

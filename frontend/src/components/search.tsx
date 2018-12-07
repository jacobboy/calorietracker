import * as React from 'react';
import { Named, NDBed } from '../classes';
import { SearchIngredientRow } from '../components/searchingredientrow';
import SearchIngredientRowContainer from '../containers/searchingredientrow';
import { DataSource } from '../ndbapi';
import StoredIngredients from '../containers/storedingredients';
import StoredRecipes from '../containers/storedrecipes';
import { tableStyle } from 'src/style';

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
  searchRef: React.RefObject<HTMLInputElement>;

  constructor(props: SearchComponentProps) {
    super(props);
    this.state = {
      createIngredientOn: false
    };
    this.searchRef = React.createRef();
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
        <form onSubmit={(e) => this.handleSubmit(e)} >
          <label>
            Search:
            <input
              id="globalSearchInput"
              ref={this.searchRef}
              type="text"
              placeholder="Search USDA Database"
              autoFocus={true}
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
        <StoredRecipes
          searchText={this.props.searchString || ''}
          focusRef={this.searchRef}
        />
        <StoredIngredients
          searchText={this.props.searchString || ''}
          focusRef={this.searchRef}
        />
        USDA:
        <table style={tableStyle}>
          <tbody>
            {SearchIngredientRow.HEADER}
            {this.props.items.map(
              (item) => <SearchIngredientRowContainer key={item.ndbno} item={item} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

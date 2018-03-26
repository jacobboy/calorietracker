import * as React from 'react';
import { Ingredient, Recipe, Ingredientable, Named } from '../classes';
import SearchIngredientRow from '../containers/searchingredientrow';
import { DataSource } from '../ndbapi';

interface SearchComponentProps {
  searchString: string;
  dataSource: DataSource;
  items: (Ingredientable & Named)[];
  created: { ingredients: Ingredient[], recipes: Recipe[] };
  onDataSourceSelect: (ds: DataSource) => void;
  onFoodSearchInput: (searchString: string) => void;
  onFoodSearchSubmit: (searchString: string, ds: DataSource) => void;
}

export interface SearchComponentState { }

export class SearchComponent extends React.Component<
  SearchComponentProps, SearchComponentState
  > {

  constructor(props: SearchComponentProps) {
    super(props);
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
          <select
            value={this.props.dataSource}
            onChange={(e) => this.handleSelectChange(e)}
          >
            <option value={DataSource.SR}>{DataSource[DataSource.SR]}</option>
            <option value={DataSource.BL}>{DataSource[DataSource.BL]}</option>
            <option value={DataSource.Any}>{DataSource[DataSource.Any]}</option>
          </select>
          <label>
            Name:
            <input
              type="text"
              value={this.props.searchString || ''}
              onChange={(e) => this.handleSearchChange(e)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <table>
          <tbody>
            {this.props.created.ingredients.map(
              (item) => <SearchIngredientRow key={item.ingredientId} item={item} />
            )}
          </tbody>
        </table>
        <table>
          <tbody>
            {this.props.items.map(
              (item) => <SearchIngredientRow key={item.ingredientId} item={item} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

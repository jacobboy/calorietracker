import * as React from 'react';
import { Ingredient, Recipe, Named, NDBed } from '../classes';
import SearchIngredientRow from '../containers/searchingredientrow';
import { DataSource } from '../ndbapi';
import IngredientRow from '../containers/ingredientrow';

interface SearchComponentProps {
  searchString: string;
  dataSource: DataSource;
  items: (NDBed & Named)[];
  saved: { ndbs: Ingredient[], ingredients: Ingredient[], recipes: Recipe[] };
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
        Ingredients:
        <table>
          <tbody>
            <tr>
              <td>Name</td>              
              <td>Fat</td>
              <td>Carbs</td>
              <td>Protein</td>
              <td>Calories</td>
              <td>Amount</td>
              <td>Unit</td>
            </tr>
            {this.props.saved.ingredients.map(
              (item) => <IngredientRow key={item.uid} item={item} />
            )}
            {this.props.saved.ndbs.map(
              (item) => <IngredientRow key={item.uid} item={item} />
            )}
          </tbody>
        </table>
        Recipes:
        <table>
          <tbody>
            {this.props.saved.recipes.map(
              (item) => <IngredientRow key={item.uid} item={item} />
            )}
          </tbody>
        </table>
        Search:
        <table>
          <tbody>
            {this.props.items.map(
              (item) => <SearchIngredientRow key={item.ndbno} item={item} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

import * as React from 'react';
import { Ingredient, Recipe, UIDed, Named } from '../classes';
import SearchIngredientRow from '../containers/searchingredientrow';
import { DataSource } from '../ndbapi';
/* import CreateIngredientInput from '../containers/createingredientinput';*/

interface SearchComponentProps {
  searchString: string;
  dataSource: DataSource;
  items: (UIDed & Named)[];
  saved: { ndbs: Ingredient[], ingredients: Ingredient[], recipes: Recipe[] };
  handleCreateIngredientClick: () => void;
  handleCreateRecipeClick: () => void;
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
        {/* onClick={() => this.props.handleCreateIngredientClick()} */}
        <button
          onClick={() => this.setState({ createIngredientOn: true })}
        >
          Create Ingredient
        </button>
        <table>
          <tbody>
            {/* {this.state.createIngredientOn ?
                  <CreateIngredientRow /> : null} */}
            {this.props.saved.ingredients.map(
              (item) => <SearchIngredientRow key={item.uid} item={item} />
            )}
          </tbody>
        </table>
        Recipes:
        <button
          onClick={() => this.props.handleCreateRecipeClick()}
        >
          Create Recipe
        </button>
        <table>
          <tbody>
            {this.props.saved.recipes.map(
              (item) => <SearchIngredientRow key={item.uid} item={item} />
            )}
          </tbody>
        </table>
        Search:
        <table>
          <tbody>
            {this.props.items.map(
              (item) => <SearchIngredientRow key={item.uid} item={item} />
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

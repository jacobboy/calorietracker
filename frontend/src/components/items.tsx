
import * as React from 'react';
import { SearchListItem } from '../classes';
import { DataSource } from '../ndbapi';
import ItemComponent from '../containers/item';

interface ItemsComponentProps {
  searchString: string;
  dataSource: DataSource;
  items: SearchListItem[];
  onDataSourceSelect: (ds: DataSource) => void;
  onFoodSearchInput: (searchString: string) => void;
  onFoodSearchSubmit: (searchString: string, ds: DataSource) => void;
}

export interface ItemsComponentState { }

export class ItemsComponent extends React.Component<ItemsComponentProps, ItemsComponentState> {
  constructor(props: ItemsComponentProps) {
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
    this.props.onFoodSearchSubmit(this.props.searchString, this.props.dataSource);
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)} >
          <select value={this.props.dataSource} onChange={(e) => this.handleSelectChange(e)}>
            <option value={DataSource.SR}>{DataSource[DataSource.SR]}</option>
            <option value={DataSource.BL}>{DataSource[DataSource.BL]}</option>
            <option value={DataSource.Any}>{DataSource[DataSource.Any]}</option>
          </select>
          <label>
            Name:
            <input
              type="text"
              value={this.props.searchString}
              onChange={(e) => this.handleSearchChange(e)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <table>
          <tbody>
            {this.props.items.map((item) => <ItemComponent key={item.ndbno} item={item} />)}
          </tbody>
        </table>
      </div>
    );
  }
}

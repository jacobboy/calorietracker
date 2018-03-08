import * as React from 'react';
import { DataSource, searchFood } from './ndbapi';
import { SearchListItem } from './classes';

interface SearchFormComponentProps {
  handleSubmit: (value: SearchFormComponentState) => void;
}

interface SearchFormComponentState {
  value: string;
  dataSource: DataSource;
}

class SearchFormComponent extends React.Component<SearchFormComponentProps, SearchFormComponentState> {
  constructor(props: SearchFormComponentProps) {
    super(props);
    this.state = {
      value: '',
      dataSource: DataSource.SR
    };
  }

  handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ dataSource: DataSource[event.target.value] });
  }

  handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.handleSubmit(this.state);
  }

  render() {
    return (
      <form onSubmit={(e) => this.handleSubmit(e)} >
        <select value={this.state.dataSource} onChange={(e) => this.handleSelectChange(e)}>
          <option value={DataSource.SR}>{DataSource[DataSource.SR]}</option>
          <option value={DataSource.BL}>{DataSource[DataSource.BL]}</option>
          <option value={DataSource.Any}>{DataSource[DataSource.Any]}</option>
        </select>
        <label>
          Name:
        <input type="text" value={this.state.value} onChange={(e) => this.handleSearchChange(e)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

interface SearchListComponentProps {
  items: SearchListItem[];
}

interface SearchListComponentState { }

class SearchListComponent extends React.Component<SearchListComponentProps, SearchListComponentState> {

  renderItem(item: SearchListItem) {
    return (
      <li key={item.ndbno}>{item.name}</li>
    );
  }

  render() {
    return (
      <ul>
        {this.props.items.map((item) => this.renderItem(item))}
      </ul>
    );
  }
}

interface SearchComponentProps { }

interface SearchComponentState {
  items: SearchListItem[];
}

export class SearchComponent extends React.Component<SearchComponentProps, SearchComponentState> {
  constructor(props: SearchComponentProps) {
    super(props);
    this.state = { items: [] };
  }

  handleFormSubmit(formState: SearchFormComponentState) {
    searchFood(formState.value, formState.dataSource).then(
      (list) => {
        console.log('Handling ' + formState.value);
        this.setState({ items: list.item });
      }
    );
  }

  render() {
    return (
      <div>
        < SearchFormComponent
          handleSubmit={(formState) => this.handleFormSubmit(formState)}
        />
        < SearchListComponent items={this.state.items} />
      </div>
    );
  }
}

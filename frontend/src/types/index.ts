import { SearchListItem } from '../classes';
import { DataSource } from '../ndbapi';

export interface SearchState {
  searchString: string;
  dataSource: DataSource;
  items: SearchListItem[];
}

export interface StoreState {
  search: SearchState;
}

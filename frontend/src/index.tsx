import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers/index';
import { StoreState } from './types/index';
import ItemsComponent from './containers/items';
import { DataSource } from './ndbapi';
/* import { FetaCheese } from './mocks';*/
/* import { Ingredient } from './classes';*/

/* 
 * function Buttons() {
 *   let buttonStyle: React.CSSProperties = {
 *     flexDirection: 'column',
 *     display: 'flex'
 *   };
 * 
 *   return (
 *     <div className="buttons" style={buttonStyle}>
 *       <button>"Create ingredient"</button>
 *       <button>"Create recipe"</button>
 *       <button>"Track food"</button>
 *     </div>
 *   );
 * }
 */

const initialState: StoreState = {
  search: {
    searchString: '',
    dataSource: DataSource.SR,
    items: []
  }
};

const store = createStore<StoreState>(reducer, initialState);

/* function App() {
 *   return (
 *     <ItemsComponent />
 *   );
 * }*/

ReactDOM.render(
  <Provider store={store}>
    <ItemsComponent />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

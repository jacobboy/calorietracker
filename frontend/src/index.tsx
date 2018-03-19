import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './reducers/index';
import { initialState, StoreState } from './types/index';
import ItemsComponent from './containers/items';
import MealsComponent from './containers/meals';
import * as ReactModal from 'react-modal';

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

const store = createStore<StoreState>(reducer, initialState);

ReactModal.setAppElement('#root');

function App() {
  return (
    <div>
      <MealsComponent />
      <ItemsComponent />
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

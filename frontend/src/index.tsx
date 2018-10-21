import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactModal from 'react-modal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { reducer } from './reducers/index';
import { initialState } from './types/index';
import FoodModal from './containers/foodmodal';
import SearchComponent from './containers/search';
import MealsComponent from './containers/meals';

function App() {
  return (
    <div>
      <FoodModal />
      <MealsComponent />
      <SearchComponent />
    </div>
  );
}

const store = createStore(reducer, initialState);
ReactModal.setAppElement('#root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactModal from 'react-modal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { reducer } from './reducers/index';
import { initialState, StoreState } from './types/index';
import TrackingModal from './containers/tracking';
import ItemsComponent from './containers/items';
import MealsComponent from './containers/meals';

function App() {
  return (
    <div>
      <TrackingModal />
      {/* <CreateIngredientModal /> */}
      {/* <CreateRecipeModal /> */}
      <MealsComponent />
      <ItemsComponent />
    </div>
  );
}

const store = createStore<StoreState>(reducer, initialState);
ReactModal.setAppElement('#root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();

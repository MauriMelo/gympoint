import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import './config/ReactotronConfig';

import { Router } from 'react-router-dom';
import Routes from './routes';

import GlobalStyles from '~/styles';

import { store, persistor } from '~/store';
import history from '~/services/history';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Router history={history}>
          <Routes />
        </Router>
        <GlobalStyles />
        <ToastContainer />
      </PersistGate>
    </Provider>
  );
}

export default App;

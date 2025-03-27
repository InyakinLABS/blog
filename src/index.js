import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import { store } from '../src/services/store'
import { BrowserRouter } from 'react-router-dom';
import App from './components/App/app'
import './normalize.css'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Provider store={store}>
  <App></App>
  </Provider>
  </BrowserRouter>
);


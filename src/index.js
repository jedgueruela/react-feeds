import React from 'react';
import ReactDOM from 'react-dom';
import API, {
  APIContext
} from './api';
import App from './App';
import * as serviceWorker from './serviceWorker';

// require('dotenv').config();

ReactDOM.render(
  <APIContext.Provider value={ API }>
    <App />
  </APIContext.Provider>, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

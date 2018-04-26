import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import SpotsContainer from './containers/SpotsContainer';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: new HttpLink({uri: "http://localhost:60000/simple/v1/cjge4ohjw000601618sfku6wl"}),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
    <SpotsContainer />
  </ApolloProvider>,
  document.getElementById('root')
);
registerServiceWorker();

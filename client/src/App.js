import React from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";

import auth from "./utils/auth";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({ uri: "/graphql", });
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = auth.getToken();
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

//establish apollo client
const client = new ApolloClient({
  link: authLink.concat(httpLink),

  request: (operation) => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route 
            path='/' 
            component={SearchBooks}
          />
          <Route 
            path='/saved' 
            component={SavedBooks} 
          />
          <Route 
           render={() => <h1 className='display-2'>Wrong page!</h1>}
          />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;

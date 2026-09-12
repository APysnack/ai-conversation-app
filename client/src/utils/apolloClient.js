import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3000/graphql',
  credentials: 'include', // Include cookies for authentication
});

const authLink = new ApolloLink((operation, forward) => {
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // Enable debugging in development
  connectToDevTools: process.env.NODE_ENV === 'development',
});

export default client;

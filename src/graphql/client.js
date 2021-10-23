import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import Config from 'react-native-config';

import {getDataFromStore} from '../utils/storage';

const httpLink = createHttpLink({
  uri: Config.BASE_URL,
  // uri: 'http://localhost:4000/graphql',
});

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({message, locations, path}) =>
      console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`),
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key, value) =>
      key === '__typename' ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename,
    );
  }
  return forward(operation).map((data) => {
    return data;
  });
});

const getToken = async () => {
  const mfaVerified = await getDataFromStore('mfaVerified');
  if (mfaVerified) {
    const token = await getDataFromStore('token');

    return token;
  }

  return '';
};

const authLink = setContext(async (_, {headers}) => {
  // get the authentication token from local storage if it exists
  const token = await getToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    User: {
      keyFields: ['email'],
    },
    GuardianNote: {
      keyFields: ['sessionId'],
    },
  },
});

// Initialize Apollo Client
export const client = new ApolloClient({
  link: ApolloLink.from([cleanTypeName, errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
  },
});

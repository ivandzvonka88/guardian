/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GalioProvider, Block} from 'galio-framework';
import {ApolloProvider} from '@apollo/client';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import DeepLinkHandler from './navigation/DeepLinkHandler';
import Screens from './navigation/Screens';
import {navigationRef} from './navigation/RootNavigation';
import {client} from './graphql/client';
import {materialTheme} from './constants/';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <Screens />
              <DeepLinkHandler />
            </Block>
          </GalioProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ApolloProvider>
  );
};

export default App;

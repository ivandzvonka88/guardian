import React, {useEffect} from 'react';
import DeepLinking from 'react-native-deep-linking';
import {Linking, View} from 'react-native';

import {navigate} from './RootNavigation';

const DeepLinkHandler = () => {
  const handleUrl = ({url}) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url);
      }
    });
  };
  useEffect(() => {
    DeepLinking.addScheme('therapyguardian://');
    Linking.addEventListener('url', handleUrl);
    DeepLinking.addRoute('/login/:code', ({code}) => {
      navigate('SignIn', {code});
    });
    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));

    return function cleanup() {
      Linking.removeEventListener('url', handleUrl);
    };
  }, []);
  return <View />;
};

export default DeepLinkHandler;

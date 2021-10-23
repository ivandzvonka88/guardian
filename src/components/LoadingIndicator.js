import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

function LoadingIndicator() {
  return (
    <View style={styles.wrapper}>
      <ActivityIndicator size="large" color="#ccc" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    zIndex: 2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingIndicator;

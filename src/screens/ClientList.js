import React, {useEffect} from 'react';
import {StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Block, Text, theme} from 'galio-framework';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useLazyQuery} from '@apollo/client';

import {LoadingIndicator} from 'src/components';
import {GET_GUARDIAN_CLIENTS, GET_PAY_PERIODS} from '../graphql/queries';

export default function ClientList({navigation}) {
  const insets = useSafeAreaInsets();
  const [
    getGuardianClients,
    {data, loading: clientsLoading, error},
  ] = useLazyQuery(GET_GUARDIAN_CLIENTS, {
    fetchPolicy: 'network-only',
  });
  const [
    getPayPeriods,
    {data: payPeriodsData, loading: payPeriodsLoading},
  ] = useLazyQuery(GET_PAY_PERIODS);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getGuardianClients();
      getPayPeriods();
    });
    return unsubscribe;
  }, [navigation]);

  const loading = clientsLoading || payPeriodsLoading;

  return (
    <Block flex style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          {
            paddingTop: insets.top * 0.4,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {!loading &&
          data &&
          data.guardianClients.map((client) => (
            <Block key={client.clientId} style={styles.clientBlock}>
              <TouchableOpacity
                style={{marginTop: theme.SIZES.BASE * 0.5}}
                onPress={() =>
                  navigation.navigate('ClientServiceData', {
                    name: `${client.firstName} ${client.lastName}`,
                    id: client.clientId,
                    payPeriods: payPeriodsData.payPeriods || [],
                  })
                }>
                <Text size={14} color="#fff" style={styles.text}>
                  {client.firstName} {client.lastName}
                </Text>
              </TouchableOpacity>
            </Block>
          ))}
      </ScrollView>
      {loading && <LoadingIndicator />}
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 0,
    paddingHorizontal: theme.SIZES.BASE * 1,
  },
  clientBlock: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  text: {
    color: 'red',
    paddingVertical: 5,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    zIndex: 2,
    left: 0,
    right: 0,
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
});

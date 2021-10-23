import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useQuery, useMutation} from '@apollo/client';
import {Block, Text} from 'galio-framework';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RNPickerSelect from 'react-native-picker-select';
import VersionNumber from 'react-native-version-number';
import Config from 'react-native-config';

import {Drawer as DrawerCustomItem} from 'src/components';
import {getDataFromStore} from 'src/utils/storage';
import {GET_COMPANIES} from 'src/graphql/queries';
import {CHANGE_COMPANY} from 'src/graphql/mutations';
import {saveDataToStore} from 'src/utils/storage';
import {materialTheme} from 'src/constants';

function CustomDrawerContent({drawerPosition, navigation, state}) {
  const insets = useSafeAreaInsets();
  const [isGuardianUser, setIsGuardianUser] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const {data, refetch} = useQuery(GET_COMPANIES, {
    skip: !isGuardianUser,
    fetchPolicy: 'network-only',
  });

  const [changeCompany, {loading}] = useMutation(CHANGE_COMPANY, {
    onCompleted: async (data) => {
      const {
        guardianChangeCompany: {token, user, timezone},
      } = data;
      if (token && user && timezone) {
        saveAuth({token, user, timezone});
      }
      navigation.navigate('Pending Documentation');
      navigation.navigate('ClientList');
    },
  });

  useEffect(() => {
    (async () => {
      const user = await getDataFromStore('user');
      setIsGuardianUser(JSON.parse(user).byEmail);
    })();
  }, []);

  useEffect(() => {
    const currentCompany = data?.companies?.find(({current}) => current);
    if (currentCompany) {
      setCompanyId(currentCompany.id);
    }
  }, [data]);

  const saveAuth = async ({token, user, timezone}) => {
    if (token && user) {
      await saveDataToStore('token', token);
      await saveDataToStore(
        'user',
        JSON.stringify({...user, byEmail: !user.id}),
      );
      timezone && saveDataToStore('timezone', timezone);
    }
  };

  const screens = isGuardianUser
    ? ['Client List', 'Pending Documentation', 'Terms of Use']
    : ['Pending Documentation', 'Terms of Use'];

  return (
    <Block
      style={styles.container}
      forceInset={{top: 'always', horizontal: 'never'}}>
      <Block flex style={{paddingLeft: 7, paddingRight: 14}}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: Math.max(insets.top, 48) * 2,
              paddingLeft: drawerPosition === 'left' ? insets.left : 0,
              paddingRight: drawerPosition === 'right' ? insets.right : 0,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          {isGuardianUser && companyId && (
            <RNPickerSelect
              key={companyId}
              value={companyId}
              onValueChange={(value) => {
                if (value === companyId) return;
                setCompanyId(value);
                changeCompany({variables: {id: value}});
              }}
              disabled={loading}
              items={(data?.companies || []).map(({id, name}) => ({
                label: name,
                value: id,
              }))}
              style={pickerSelectStyles}
              placeholder={{}}
            />
          )}
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
        </ScrollView>
      </Block>
      <Block flex={0.3} style={{paddingLeft: 7, paddingRight: 14}}>
        <DrawerCustomItem title="Sign Out" navigation={navigation} />
        <Text style={styles.versionNumber}>
          Version: {VersionNumber.appVersion}
        </Text>
        {Config.MODE === 'staging' && (
          <Text style={styles.versionNumber}>
            Staging Build: {VersionNumber.buildVersion}
          </Text>
        )}
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  versionNumber: {
    color: materialTheme.COLORS.LABEL,
    paddingLeft: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 7,
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 7,
  },
});

export default CustomDrawerContent;

import React, {useState, useEffect} from 'react';
import {Dimensions, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Icon} from 'galio-framework';
import messaging from '@react-native-firebase/messaging';

import {materialTheme} from 'src/constants';
import {Header} from 'src/components';
import SignInScreen from 'src/screens/SignIn';
import SignUpScreen from 'src/screens/SignUp';
import SignUpCodeScreen from 'src/screens/SignUpCode';
import ClientListScreen from 'src/screens/ClientList';
import ClientServiceDataScreen from 'src/screens/ClientServiceData';
import PendingDocumentation from 'src/screens/PendingDocumentation';
import MfaCodeScreen from 'src/screens/MfaCodeScreen';

import {DocumentationModal} from 'src/components';
import CustomDrawerContent from './Menu';
import {navigate} from './RootNavigation';
import useVersionCheck from '../hooks/useVersionCheck';

const {width} = Dimensions.get('screen');

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ClientStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="ClientList"
        component={ClientListScreen}
        options={{
          header: ({navigation, scene}) => (
            <Header
              white
              title="Client List"
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ClientServiceData"
        component={ClientServiceDataScreen}
        options={({route}) => ({
          header: ({navigation, scene}) => (
            <Header
              back
              white
              title={route.params.name}
              navigation={navigation}
              scene={scene}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function DocumentationStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Pending Documentation"
        component={PendingDocumentation}
        options={{
          header: ({navigation, scene}) => (
            <Header
              white
              title="Pending Documentation"
              scene={scene}
              navigation={navigation}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function GuardianUserStack({
  route: {
    params: {sessionId},
  },
}) {
  const [modalVisible, setModalVisible] = useState(Boolean(sessionId));
  return (
    <>
      <Drawer.Navigator
        style={{flex: 1}}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        drawerStyle={{
          backgroundColor: 'white',
          width: width * 0.8,
        }}
        drawerContentOptions={{
          activeTintColor: 'white',
          inactiveTintColor: '#000',
          activeBackgroundColor: materialTheme.COLORS.ACTIVE,
          inactiveBackgroundColor: 'transparent',
          itemStyle: {
            width: width * 0.74,
            paddingHorizontal: 12,
            // paddingVertical: 4,
            justifyContent: 'center',
            alignContent: 'center',
            // alignItems: 'center',
            overflow: 'hidden',
          },
          labelStyle: {
            fontSize: 18,
            fontWeight: 'normal',
          },
        }}
        initialRouteName="Client List">
        <Drawer.Screen
          name="Client List"
          component={ClientStack}
          options={{
            drawerIcon: ({focused}) => (
              <Icon
                size={16}
                name="list"
                family="GalioExtra"
                color={focused ? 'white' : materialTheme.COLORS.MUTED}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Pending Documentation"
          component={DocumentationStack}
          options={{
            drawerIcon: ({focused}) => (
              <Icon
                size={16}
                name="md-list-outline"
                family="ionicon"
                color={focused ? 'white' : materialTheme.COLORS.MUTED}
              />
            ),
          }}
        />
      </Drawer.Navigator>
      {sessionId && (
        <DocumentationModal
          docId={sessionId}
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
}

function DesigneeStack({
  route: {
    params: {sessionId},
  },
}) {
  const [modalVisible, setModalVisible] = useState(Boolean(sessionId));
  return (
    <>
      <Drawer.Navigator
        style={{flex: 1}}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        drawerStyle={{
          backgroundColor: 'white',
          width: width * 0.8,
        }}
        drawerContentOptions={{
          activeTintColor: 'white',
          inactiveTintColor: '#000',
          activeBackgroundColor: materialTheme.COLORS.ACTIVE,
          inactiveBackgroundColor: 'transparent',
          itemStyle: {
            width: width * 0.74,
            paddingHorizontal: 12,
            // paddingVertical: 4,
            justifyContent: 'center',
            alignContent: 'center',
            // alignItems: 'center',
            overflow: 'hidden',
          },
          labelStyle: {
            fontSize: 18,
            fontWeight: 'normal',
          },
        }}
        initialRouteName="Pending Documentation">
        <Drawer.Screen
          name="Pending Documentation"
          component={DocumentationStack}
          options={{
            drawerIcon: ({focused}) => (
              <Icon
                size={16}
                name="md-list-outline"
                family="ionicon"
                color={focused ? 'white' : materialTheme.COLORS.MUTED}
              />
            ),
          }}
        />
      </Drawer.Navigator>
      {sessionId && (
        <DocumentationModal
          docId={sessionId}
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
}

export default function MainStack(props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  useVersionCheck();

  useEffect(() => {
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      navigate('SignIn', {code: remoteMessage.data.code});
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          setCode(remoteMessage.data.code);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        option={{
          headerTransparent: true,
        }}
        initialParams={{
          code,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="SignUpCode" component={SignUpCodeScreen} />
      <Stack.Screen name="MfaCodeScreen" component={MfaCodeScreen} />
      <Stack.Screen name="Guardian" component={GuardianUserStack} />
      <Stack.Screen name="Designee" component={DesigneeStack} />
    </Stack.Navigator>
  );
}

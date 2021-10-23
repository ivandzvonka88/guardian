import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Button, Input, Text, theme} from 'galio-framework';
import {useMutation} from '@apollo/client';
import messaging from '@react-native-firebase/messaging';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {materialTheme} from 'src/constants';
import {HeaderHeight} from 'src/constants/utils';
import {Radio} from 'src/components';

import {
  LOGIN_GUARDIAN,
  LOGIN_BY_CODE,
  UPDATE_GUARDIAN,
  UPDATE_DESIGNEE,
} from '../graphql/mutations';
import {saveDataToStore, getDataFromStore} from '../utils/storage';
import {getUser} from '../utils/user';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

const {height, width} = Dimensions.get('screen');

export default function SignIn({navigation, route: {params}}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [byEmail, setByEmail] = useState(false);

  const [LoginGuardian, {loading: gurdianLogin}] = useMutation(LOGIN_GUARDIAN, {
    onCompleted: ({loginGuardian}) => saveAuth(loginGuardian),
    onError: () => showErrorAlert(),
  });
  const [LoginByCode, {loading: designeeLogin}] = useMutation(LOGIN_BY_CODE, {
    onCompleted: ({loginByCode}) => saveAuth(loginByCode),
    onError: () => showErrorAlert(),
  });
  const [updateGuardian] = useMutation(UPDATE_GUARDIAN);
  const [updateDesignee] = useMutation(UPDATE_DESIGNEE);

  const onSignIn = () => {
    if (byEmail) {
      if (email !== '' && password !== '') {
        LoginGuardian({variables: {userName: email, password}});
      }
    } else {
      if (code !== '') {
        LoginByCode({variables: {code}});
      }
    }
  };

  const showErrorAlert = () =>
    Alert.alert(
      'Error',
      'You have entered an invalid login info',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  useEffect(() => {
    (async () => {
      const token = await getDataFromStore('token');
      const mfaVerified = await getDataFromStore('mfaVerified');

      if (token && mfaVerified) {
        const user = await getUser();
        navigation.navigate(user.id ? 'Designee' : 'Guardian', {
          sessionId: null,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (params?.code) {
      setByEmail(false);
      setCode(params?.code);
      LoginByCode({variables: {code: params?.code}});
    }
  }, [params]);

  const saveAuth = async ({token, user, sessionId, timezone, mfaCode}) => {
    if (token && user) {
      console.log('token:::', token);
      await saveDataToStore('token', token);
      await saveDataToStore(
        'user',
        JSON.stringify({...user, byEmail: !user.id}),
      );
      timezone && saveDataToStore('timezone', timezone);

      const enabled = await requestUserPermission();
      if (enabled) {
        const pnToken = await messaging().getToken();

        if (user.id) {
          updateDesignee({
            variables: {
              pnToken,
            },
          });
        } else {
          updateGuardian({
            variables: {
              pnToken,
            },
          });
        }
      }

      if (user.mfaEnabled && mfaCode) {
        navigation.navigate('MfaCodeScreen', {
          mfaCode,
          user,
          sessionId,
        });
      } else {
        saveDataToStore('mfaVerified', '1');
        navigation.navigate(user.id ? 'Designee' : 'Guardian', {sessionId});
      }
    } else {
      showErrorAlert();
    }
  };

  return (
    <Block flex style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Block flex>
        <LinearGradient
          style={styles.background}
          colors={[
            materialTheme.COLORS.GRADIENT_START,
            materialTheme.COLORS.GRADIENT_END,
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        />
        <KeyboardAwareScrollView
          extraHeight={theme.SIZES.BASE * 25}
          enableOnAndroid={true}>
          <Block space="between" style={styles.padded}>
            <Block style={styles.formWrapper}>
              <Block style={styles.radioBlock}>
                <Radio
                  color="white"
                  label="Email/Password"
                  labelStyle={styles.radioLabel}
                  initialValue={byEmail}
                  onChange={() => setByEmail(true)}
                />
              </Block>
              {byEmail && (
                <Block style={styles.inputBlock}>
                  <Input
                    style={styles.input}
                    placeholder="Email"
                    type="email-address"
                    color="black"
                    placeholderTextColor="grey"
                    bgColor="white"
                    onChangeText={setEmail}
                    value={email}
                  />
                  <Input
                    style={styles.input}
                    placeholder="Password"
                    color="black"
                    iconColor="black"
                    placeholderTextColor="grey"
                    bgColor="white"
                    onChangeText={setPassword}
                    value={password}
                    password
                    viewPass
                  />
                  {/* <TouchableOpacity style={{marginTop: theme.SIZES.BASE * 0.5}}>
              <Text size={14} color="#fff" style={styles.forgotPass}>
                Forgot your password?
              </Text>
            </TouchableOpacity> */}
                </Block>
              )}
              <Block style={styles.radioBlock}>
                <Radio
                  color="white"
                  label="Code"
                  labelStyle={styles.radioLabel}
                  initialValue={!byEmail}
                  onChange={() => setByEmail(false)}
                />
              </Block>
              {!byEmail && (
                <Block style={styles.inputBlock}>
                  <Input
                    style={styles.input}
                    placeholder="Code"
                    color="black"
                    placeholderTextColor="grey"
                    bgColor="white"
                    onChangeText={setCode}
                    value={code}
                  />
                </Block>
              )}
            </Block>
            <Block center>
              <Button
                shadowless
                style={styles.button}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={onSignIn}
                loading={gurdianLogin || designeeLogin}>
                SIGN IN
              </Button>
              <TouchableOpacity
                style={{marginTop: theme.SIZES.BASE * 0.5}}
                onPress={goToSignUp}>
                <Text size={14} color="#fff" style={styles.signup}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
        </KeyboardAwareScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  background: {
    width,
    height,
    position: 'absolute',
    top: 0,
  },
  padded: {
    width,
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
  },
  formWrapper: {
    marginTop:
      Platform.OS === 'android' ? theme.SIZES.BASE * 12 : theme.SIZES.BASE * 15,
    height: 320,
  },
  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
  },
  button: {
    width: width - theme.SIZES.BASE * 10,
    height: theme.SIZES.BASE * 3,
  },
  signup: {
    textAlign: 'center',
  },
  input: {
    borderRadius: 5,
    borderWidth: 0,
    borderBottomColor: 'rgba(255,255,255,0.6)',
    borderBottomWidth: 1,
  },
  forgotPass: {
    textAlign: 'right',
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
    backgroundColor: 'rgba(80, 80, 80, 0.4)',
  },
  radioBlock: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    padding: 20,
    marginVertical: 5,
  },
  radioLabel: {
    color: 'white',
  },
  inputBlock: {
    marginVertical: 10,
  },
});

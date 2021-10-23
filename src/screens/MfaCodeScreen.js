import React, {useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Block, Button, Input, Text, theme} from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import {useMutation} from '@apollo/client';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {materialTheme} from '../constants';
import {HeaderHeight} from '../constants/utils';

import {RESEND_MFA_CODE} from '../graphql/mutations';
import {saveDataToStore} from '../utils/storage';

const {height, width} = Dimensions.get('screen');

export default function MfaCodeScreen({navigation, route: {params}}) {
  const [code, setCode] = useState('');
  const [mfaCode, setMfaCode] = useState(params.mfaCode);
  const {user, sessionId} = params;

  const [resendMfaCode, {loading}] = useMutation(RESEND_MFA_CODE, {
    onCompleted: (data) => {
      setMfaCode(data.resendMfaCode);
    },
    onError: () => {},
  });

  const handleConfirm = async () => {
    if (mfaCode === code) {
      await saveDataToStore('mfaVerified', '1');
      navigation.navigate(user.id ? 'Designee' : 'Guardian', {sessionId});
    } else {
      showErrorAlert();
    }
  };
  const handleResend = () => {
    resendMfaCode({
      variables: {
        phone: user.phone,
      },
    });
  };
  const handleGoBack = () => {
    navigation.pop();
  };

  const showErrorAlert = () =>
    Alert.alert('Error', 'The code is incorrect. Please try again.', [
      {
        text: 'OK',
        onPress: () => {
          setCode('');
        },
      },
    ]);

  const disabled = code.length !== 6;

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
              <Block>
                <Text size={16} color={materialTheme.COLORS.DEFAULT}>
                  Please input the code sent to your number ending as{' '}
                  {user.phone.substr(-4)}.
                </Text>
              </Block>
              <Input
                style={styles.input}
                placeholder="Code"
                color="#fff"
                placeholderTextColor="rgba(255,255,255,0.6)"
                bgColor="transparent"
                onChangeText={setCode}
                value={code}
              />
            </Block>
            <Block center style={{marginTop: theme.SIZES.BASE * 2}}>
              <Button
                style={styles.button}
                color={
                  disabled
                    ? materialTheme.COLORS.MUTED
                    : materialTheme.COLORS.BUTTON_COLOR
                }
                disabled={disabled}
                loading={loading}
                onPress={handleConfirm}>
                CONFIRM
              </Button>
              <TouchableOpacity
                style={{marginTop: theme.SIZES.BASE}}
                onPress={handleResend}>
                <Text size={14} color="#fff" style={styles.signup}>
                  Resend Code
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: theme.SIZES.BASE}}
                onPress={handleGoBack}>
                <Text size={14} color="#fff" style={styles.signup}>
                  Go Back
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
    borderRadius: 0,
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
});

import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Button, Input, Text, theme} from 'galio-framework';
import {useMutation} from '@apollo/client';

import {materialTheme} from 'src/constants';

import {VERIFY_GUARDIAN_CODE} from '../graphql/mutations';
import {saveDataToStore} from '../utils/storage';

const {height, width} = Dimensions.get('screen');

export default function SignUpCode({navigation, route: {params}}) {
  const [code, setCode] = useState('');
  const [verifyGuardianCode, {loading}] = useMutation(VERIFY_GUARDIAN_CODE);

  const handleVerify = async () => {
    try {
      const {data} = await verifyGuardianCode({
        variables: {
          id: params.guardianId || 5220,
          companyId: params.companyId || 33,
          code,
        },
      });

      saveAuth(data.verifyGuardianCode);
    } catch (error) {
      showErrorAlert();
    }
  };

  const saveAuth = async ({error, token, user, timezone}) => {
    if (error) {
      showErrorAlert();
      return;
    }
    if (token && user) {
      await saveDataToStore('token', token);
      await saveDataToStore('user', JSON.stringify({...user, byEmail: true}));
      timezone && saveDataToStore('timezone', timezone);

      navigation.navigate('Guardian', {sessionId: null});
    }
  };

  const handleCodeChange = (value) => {
    setCode(value.toUpperCase());
  };

  const showErrorAlert = () => {
    Alert.alert(
      'Error',
      'You have entered a wrong code.',
      [
        {
          text: 'OK',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        style={styles.background}
        colors={[
          materialTheme.COLORS.GRADIENT_START,
          materialTheme.COLORS.GRADIENT_END,
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
      />
      <SafeAreaView style={styles.container}>
        <Block center style={styles.content}>
          <Text color="white">Please enter the code sent through your SMS</Text>
          <Input
            style={styles.input}
            color="black"
            value={code}
            onChangeText={handleCodeChange}
          />
          <Button
            shadowless
            style={styles.button}
            color={materialTheme.COLORS.BUTTON_COLOR}
            onPress={handleVerify}
            loading={loading}
            disabled={!code}>
            VERIFY
          </Button>
        </Block>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width,
    height,
    position: 'absolute',
    top: 0,
  },
  content: {
    paddingTop: 100,
    paddingHorizontal: 50,
  },
  input: {
    marginTop: 10,
    marginBottom: 40,
  },
  button: {
    width: width - theme.SIZES.BASE * 10,
    height: theme.SIZES.BASE * 3,
  },
});

import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Block, Button, Text, theme} from 'galio-framework';
import {useMutation, useQuery} from '@apollo/client';
import messaging from '@react-native-firebase/messaging';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';

import {materialTheme} from 'src/constants';
import TCInput from 'src/components/Form/TCInput';
import TCPicker from 'src/components/Form/TCPicker';
import PhoneInput from 'src/components/Form/PhoneInput';

import {GET_ALL_COMPANIES} from '../graphql/queries';
import {REGISTER_GUARDIAN} from '../graphql/mutations';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
};

const {height, width} = Dimensions.get('screen');

const fields = [
  {
    name: 'firstName',
    label: 'First Name',
  },
  {
    name: 'lastName',
    label: 'Last Name',
  },
  {
    name: 'email',
    label: 'Email',
    props: {
      type: 'email-address',
    },
  },
  {
    name: 'phone',
    label: 'Phone',
    component: PhoneInput,
    props: {
      type: 'phone-pad',
    },
  },
  {
    name: 'password',
    label: 'Password',
    props: {
      password: true,
      viewPass: true,
    },
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    props: {
      password: true,
      viewPass: true,
    },
  },
  {
    name: 'pin',
    label: 'Pin',
    props: {
      type: 'number-pad',
    },
  },
];

const initialValues = fields.reduce(
  (acc, cur) => {
    const {name} = cur;
    acc[name] = '';
    return acc;
  },
  {companyId: 0},
);

const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string()
    .length(14, 'Invalid Phone number!')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email!').required('Email is required'),
  password: Yup.string()
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .matches(/\d/, 'Password must have a number')
    // .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
  pin: Yup.string().length(4).required('Pin is required'),
  companyId: Yup.number().min(1, 'Company is required'),
});

export default function SignUp({navigation}) {
  const [registerGuardian, {loading}] = useMutation(REGISTER_GUARDIAN);
  const {data} = useQuery(GET_ALL_COMPANIES);
  const allCompanies = data?.allCompanies || [];

  const handleSignUp = async (values) => {
    const enabled = await requestUserPermission();
    let pnToken;
    if (enabled) {
      pnToken = await messaging().getToken();
    }

    const {confirmPassword, ...rest} = values;

    try {
      const {data} = await registerGuardian({
        variables: {
          guardian: {
            ...rest,
            pnToken,
          },
        },
      });
      navigation.navigate('SignUpCode', {
        companyId: values.companyId,
        guardianId: data.registerGuardian,
      });
    } catch (error) {}
  };

  const goToLogin = () => {
    navigation.pop();
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
        <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={handleSignUp}>
          {({handleSubmit, isValid}) => (
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="always"
              extraHeight={theme.SIZES.BASE * 25}
              enableOnAndroid={true}
              contentContainerStyle={styles.scrollViewContent}>
              {fields.map((field) => (
                <Block key={field.name}>
                  <Field
                    {...field.props}
                    component={field.component || TCInput}
                    name={field.name}
                    placeholder={field.label}
                  />
                </Block>
              ))}
              <Block style={{marginTop: 10}}>
                <Field
                  component={TCPicker}
                  name="companyId"
                  placeholder={{label: 'Select Company', value: 0}}
                  items={allCompanies.map((c) => ({
                    label: c.name,
                    value: c.id,
                  }))}
                />
              </Block>
              <Block center style={{marginTop: 30}}>
                <Button
                  shadowless
                  style={styles.button}
                  color={materialTheme.COLORS.BUTTON_COLOR}
                  onPress={handleSubmit}
                  loading={loading}
                  // disabled={!isValid}
                >
                  SIGN UP
                </Button>
                <TouchableOpacity
                  style={{marginTop: theme.SIZES.BASE * 0.5}}
                  onPress={goToLogin}>
                  <Text size={14} color="#fff" style={styles.login}>
                    Go back to Log In
                  </Text>
                </TouchableOpacity>
              </Block>
            </KeyboardAwareScrollView>
          )}
        </Formik>
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
  scrollViewContent: {
    padding: 20,
  },
  button: {
    width: width - theme.SIZES.BASE * 10,
    height: theme.SIZES.BASE * 3,
  },
  login: {
    textAlign: 'center',
  },
});

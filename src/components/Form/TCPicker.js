import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'galio-framework';
import RNPickerSelect from 'react-native-picker-select';

import {materialTheme} from 'src/constants';

const TCPicker = (props) => {
  const {
    field: {name, value},
    form: {errors, touched, setFieldValue, setFieldTouched},
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

  return (
    <>
      <RNPickerSelect
        {...inputProps}
        value={value}
        onValueChange={(val) => {
          setFieldValue(name, val);
        }}
        onOpen={() => {
          setFieldTouched(name);
        }}
        style={hasError ? errorPickerStyles : commonPickerStyles}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    marginTop: 10,
    color: materialTheme.COLORS.ERROR,
  },
  errorInput: {
    borderColor: materialTheme.COLORS.ERROR,
  },
});

const commonPickerStyles = {
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
  placeholder: {
    color: 'grey',
  },
};

const errorPickerStyles = {
  ...commonPickerStyles,
  inputIOS: {
    ...commonPickerStyles.inputIOS,
    borderWidth: 1,
    borderColor: materialTheme.COLORS.ERROR,
  },
  inputAndroid: {
    ...commonPickerStyles.inputAndroid,
    borderWidth: 1,
    borderColor: materialTheme.COLORS.ERROR,
  },
};

export default TCPicker;

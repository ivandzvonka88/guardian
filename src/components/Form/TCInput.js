import React from 'react';
import {StyleSheet} from 'react-native';
import {Input, Text} from 'galio-framework';

import {materialTheme} from 'src/constants';

const TCInput = (props) => {
  const {
    field: {name, onBlur, onChange, value},
    form: {errors, touched, setFieldTouched},
    ...inputProps
  } = props;

  const hasError = errors[name] && touched[name];

  return (
    <>
      <Input
        color="black"
        placeholderTextColor="grey"
        style={hasError && styles.errorInput}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name);
          onBlur(name);
        }}
        {...inputProps}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 14,
    color: materialTheme.COLORS.ERROR,
  },
  errorInput: {
    borderColor: materialTheme.COLORS.ERROR,
  },
});

export default TCInput;

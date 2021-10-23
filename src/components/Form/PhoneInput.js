import React from 'react';
import TCInput from './TCInput';

const normalizeInput = (value) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, '');
  const cvLength = currentValue.length;

  if (cvLength < 4) return currentValue;
  if (cvLength < 7)
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
  return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
    3,
    6,
  )}-${currentValue.slice(6, 10)}`;
};

const PhoneInput = (props) => {
  const {
    field: {name, onChange},
  } = props;

  const handleChange = (newValue) => {
    onChange(name)(normalizeInput(newValue));
  };

  return <TCInput {...props} type="phone-pad" onChangeText={handleChange} />;
};

export default PhoneInput;

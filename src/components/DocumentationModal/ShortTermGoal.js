import React from 'react';
import {StyleSheet} from 'react-native';
import {Block, Text} from 'galio-framework';
import RNPickerSelect from 'react-native-picker-select';

function ShortTermGoal({text, score, options, onChange}) {
  if (!options) {
    return null;
  }

  return (
    <Block>
      <Text bold style={styles.itemTitle}>
        Action Step(s) / Short Term Goal(s)
      </Text>
      <Text style={styles.text}>{text}</Text>

      <Block>
        <Text style={styles.itemTitle}>Score:</Text>
        <RNPickerSelect
          disabled
          value={score}
          onValueChange={onChange}
          items={options}
          style={pickerSelectStyles}
          placeholder={{label: 'Select Score', value: null}}
        />
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 14,
    marginVertical: 5,
    color: 'white',
  },
  text: {
    fontSize: 12,
    marginVertical: 3,
    color: 'white',
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

export default ShortTermGoal;

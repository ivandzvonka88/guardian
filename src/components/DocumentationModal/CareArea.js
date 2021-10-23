import React from 'react';
import {StyleSheet} from 'react-native';
import {Block, Text} from 'galio-framework';
import RNPickerSelect from 'react-native-picker-select';

function CareArea({careAreas, scoring, onChange}) {
  const handleScoreChange = (careId, score) => {
    const newCareAreas = careAreas.map((ca) => {
      if (ca.careId === careId) {
        return {
          ...ca,
          score,
        };
      }
      return ca;
    });

    onChange(newCareAreas);
  };

  if (!careAreas || !scoring) {
    return null;
  }

  return (
    <Block>
      <Text bold style={styles.blockTitle}>
        Care Area:
      </Text>
      {careAreas.map((ca) => (
        <Block key={ca.careId}>
          <Text style={styles.itemTitle}>{ca.careArea}</Text>
          <RNPickerSelect
            disabled
            value={ca.score}
            onValueChange={(value) => handleScoreChange(ca.careId, value)}
            items={scoring}
            style={pickerSelectStyles}
            placeholder={{label: 'Select Score', value: null}}
          />
        </Block>
      ))}
    </Block>
  );
}

const styles = StyleSheet.create({
  blockTitle: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: 'white',
  },
  itemTitle: {
    fontSize: 14,
    marginVertical: 5,
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

export default CareArea;

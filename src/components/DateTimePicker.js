import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Text} from 'galio-framework';
import dayjs from 'dayjs';

import {getDateTime, getTimestamp} from '../utils/timezone';

const DateTimePicker = ({disabled, time, setTime, style, timezone}) => {
  const [open, setOpen] = useState(false);
  const datetime = getDateTime(time * 1000, timezone).format(
    'MM/DD/YYYY HH:mm:ss',
  );
  if (!timezone) return null;
  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          setOpen(true);
        }}>
        <Text style={[styles.handler, style]}>
          {getDateTime(time * 1000, timezone).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
        <DateTimePickerModal
          isVisible={open}
          mode="datetime"
          onConfirm={(tm) => {
            const timestamp = getTimestamp(
              dayjs(tm).format('YYYY-MM-DD HH:mm:ss'),
              timezone,
            );
            setTime(timestamp / 1000);
            setOpen(false);
          }}
          onCancel={() => {
            setOpen(false);
          }}
          date={new Date(datetime)}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  handler: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default DateTimePicker;

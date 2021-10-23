import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Dimensions, Platform} from 'react-native';
import {Block, Text, theme, Switch, Checkbox, Icon} from 'galio-framework';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useLazyQuery} from '@apollo/client';
import {TabView, SceneMap} from 'react-native-tab-view';
import RNPickerSelect from 'react-native-picker-select';
import weekday from 'dayjs/plugin/weekday';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import {HeaderHeight} from 'src/constants/utils';
import {LoadingIndicator} from 'src/components';
import {getDateTime} from 'src/utils/timezone';
import {getDataFromStore} from 'src/utils/storage';
import materialTheme from 'src/constants/Theme';

import {GET_NOTES_BY_CLIENT} from '../graphql/queries';
import {
  APPROVE_NOTES_BY_GUARDIAN,
  APPROVE_ALL_NOTES_BY_GUARDIAN,
} from '../graphql/mutations';

dayjs.extend(weekday);
dayjs.extend(utc);

const renderTime = (utc, adjUtc, timezone) => {
  const utcTime = getDateTime(Number(utc * 1000), timezone).format('hh:mm a');
  const afterTime = adjUtc
    ? `${getDateTime(Number(adjUtc * 1000), timezone).format('hh:mm a')} Adj`
    : utcTime;

  return (
    <>
      <Text bold color={materialTheme.COLORS.GREEN}>
        {afterTime}
      </Text>
      {adjUtc ? <Text>{utcTime}</Text> : null}
    </>
  );
};

export default function ClientServiceData({route}) {
  const initialLayout = {width: Dimensions.get('window').width};

  const {id: clientId, payPeriods} = route.params;

  const weeks = payPeriods.map((pp, index) => {
    const startDate = dayjs(Number(pp.startDate)).utc().format('M/D/YYYY');
    const endDate = dayjs(Number(pp.endDate)).utc().format('M/D/YYYY');
    return {
      label: `${startDate} - ${endDate}`,
      value: index,
      startDate,
      endDate,
    };
  });

  const [timezone, setTimezone] = useState();
  const [weekNumber, setWeekNumber] = useState(0);
  const [isAllApproved, setIsAllApproved] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'manual', title: 'Manual'},
    {key: 'evv', title: 'EVV'},
  ]);

  const [getNotesByClient, {data, loading: notesLoading, error}] = useLazyQuery(
    GET_NOTES_BY_CLIENT,
    {
      fetchPolicy: 'network-only',
    },
  );
  const [approveNotesByGurdian, {loading: notesApproving}] = useMutation(
    APPROVE_NOTES_BY_GUARDIAN,
  );
  const [approveAllNotesByGuardian, {loading: notesApprovingAll}] = useMutation(
    APPROVE_ALL_NOTES_BY_GUARDIAN,
  );

  useEffect(() => {
    (async () => {
      const timezone = await getDataFromStore('timezone');

      setTimezone(timezone);
    })();
  }, []);

  useEffect(() => {
    let isApproved = true;

    data &&
      data.notesByClient.forEach((clientServiceData) => {
        if (clientServiceData.approvedNote === false) {
          isApproved = false;
          return;
        }
      });

    setIsAllApproved(isApproved);
  }, [JSON.stringify(data)]);

  useEffect(() => {
    getNotesByClient({
      variables: {
        clientId,
        isEVV: index === 0 ? false : true,
        startDate: weeks[weekNumber].startDate,
        endDate: weeks[weekNumber].endDate,
      },
    });
  }, [weekNumber, index]);

  const approveAll = () => {
    setIsAllApproved(!isAllApproved);

    approveAllNotesByGuardian({
      variables: {
        approved: !isAllApproved,
        clsvId: clientId,
        startDate: weeks[weekNumber].startDate,
        endDate: weeks[weekNumber].endDate,
      },
      refetchQueries: [
        {
          query: GET_NOTES_BY_CLIENT,
          variables: {
            clientId,
            isEVV: index === 0 ? false : true,
            startDate: weeks[weekNumber].startDate,
            endDate: weeks[weekNumber].endDate,
          },
        },
      ],
      awaitRefetchQueries: true,
    });
  };

  const approveNote = (checked, clientData) => {
    approveNotesByGurdian({
      variables: {
        sessionId: clientData.sessionId,
        noteType: clientData.noteType,
        approved: checked,
        isEVV: index === 0 ? false : true,
        pin: 0,
      },
      update(cache, {data: approveNotesByGurdian}) {
        cache.modify({
          id: cache.identify(approveNotesByGurdian),
          fields: {
            approvedNote() {
              return approveNotesByGurdian.approvedNote;
            },
            guardianId() {
              return approveNotesByGurdian.guardianId;
            },
          },
        });
      },
    });
  };

  const ServiceData = () => (
    <Block flex style={styles.container}>
      <Block row middle space="between" style={styles.headerSection}>
        <RNPickerSelect
          value={weekNumber}
          onValueChange={(value) => {
            if (value !== null && value >= 0) {
              setWeekNumber(value);
              setIsAllApproved(false);
            }
          }}
          items={weeks}
          placeholder={{label: 'Select a date'}}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return (
              <Icon
                size={16}
                name="caret-down-outline"
                family="ionicon"
                color="white"
              />
            );
          }}
        />
        {index === 0 && (
          <Block row middle>
            <Text style={styles.headerText}>Approve All</Text>
            <Switch
              style={styles.switch}
              value={isAllApproved}
              onChange={approveAll}
              thumbColor={'white'}
              trackColor={{false: '#eee', true: '#81b0ff'}}
              disabled={
                data && data.notesByClient && data.notesByClient.length === 0
              }
            />
          </Block>
        )}
      </Block>
      <ScrollView
        contentContainerStyle={[
          {
            paddingTop: theme.SIZES.BASE * 0.6,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {data &&
          data.notesByClient.map((clientServiceData) => (
            <Block
              card
              key={clientServiceData.sessionId}
              style={styles.cardBlock}>
              <Block row space="between">
                <Block flex>
                  <Block>
                    <Text bold>Date</Text>
                    <Text>
                      {getDateTime(
                        Number(clientServiceData.utcIn * 1000),
                        timezone,
                      ).format('MM/DD/YYYY')}
                    </Text>
                  </Block>
                  <Block style={styles.titleText}>
                    <Text bold>In Time</Text>
                    {renderTime(
                      clientServiceData.utcIn,
                      clientServiceData.adjUtcIn,
                      timezone,
                    )}
                  </Block>
                  <Block style={styles.titleText}>
                    <Text bold>Out Time</Text>
                    {renderTime(
                      clientServiceData.utcOut,
                      clientServiceData.adjUtcOut,
                      timezone,
                    )}
                  </Block>
                </Block>
                <Block flex>
                  <Block>
                    <Text bold>Service</Text>
                    <Text>{clientServiceData.serviceName}</Text>
                  </Block>
                  <Block style={styles.titleText}>
                    <Text bold>Provider Name</Text>
                    <Text>{clientServiceData.providerName}</Text>
                  </Block>
                  <Block style={styles.titleText}>
                    <Text bold>Note Type</Text>
                    <Text>{clientServiceData.noteType}</Text>
                  </Block>
                </Block>
                <Block middle style={{paddingHorizontal: 5}}>
                  <Checkbox
                    label=""
                    initialValue={clientServiceData.approvedNote}
                    onChange={(value) => approveNote(value, clientServiceData)}
                  />
                </Block>
              </Block>
              {index === 1 && (
                <Block row style={styles.titleText}>
                  <Text bold style={{paddingRight: 10}}>
                    Problems:
                  </Text>
                  {!clientServiceData.approvedNote && (
                    <Text style={{color: 'red'}}>
                      Designee Verification Missing
                    </Text>
                  )}
                </Block>
              )}
            </Block>
          ))}
      </ScrollView>
    </Block>
  );

  const renderScene = SceneMap({
    manual: ServiceData,
    evv: ServiceData,
  });

  const loading = notesLoading || notesApproving || notesApprovingAll;

  return (
    <>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
      {loading && <LoadingIndicator />}
    </>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  container: {
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  headerSection: {
    backgroundColor: '#d84765',
    paddingHorizontal: theme.SIZES.BASE * 0.5,
    paddingVertical: theme.SIZES.BASE * 0.5,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switch: {
    marginLeft: 5,
  },
  cardBlock: {
    padding: theme.SIZES.BASE * 0.5,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  titleText: {
    marginTop: 5,
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
    backgroundColor: 'transparent',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'white',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'white',
    width: 220,
    paddingRight: 20, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: 15,
  },
});

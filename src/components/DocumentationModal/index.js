import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  ActivityIndicator,
  View,
} from 'react-native';
import {Block, Button, Text, theme} from 'galio-framework';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation, useQuery} from '@apollo/client';

import {materialTheme} from 'src/constants';
import {GET_NOTE_BY_SESSION_ID} from 'src/graphql/queries';
import {APPROVE_NOTES_BY_GUARDIAN} from 'src/graphql/mutations';
import {getDataFromStore} from 'src/utils/storage';
import {getDateTime} from 'src/utils/timezone';

import CareArea from './CareArea';
import LongTermObjectives from './LongTermObjectives';
import DateTimePicker from '../DateTimePicker';

function DocumentationModal({docId, isVisible, onClose}) {
  const [approveNotesByGurdian, {loading: docApproving}] = useMutation(
    APPROVE_NOTES_BY_GUARDIAN,
    {
      onCompleted: () => {
        onClose();
      },
      onError: (error) => console.log('-----', error),
      update(cache, {data: {approveNotesByGuardian: approvedDoc}}) {
        cache.modify({
          fields: {
            pendingNotes(existingDocs = []) {
              return existingDocs.filter(
                (doc) => doc.docId !== approvedDoc.sessionId,
              );
            },
          },
        });
      },
    },
  );

  const {
    data: {clientNoteBySessionId: doc} = {},
    loading: docLoading,
  } = useQuery(GET_NOTE_BY_SESSION_ID, {
    variables: {sessionId: docId, isTherapy: false},
  });

  const insets = useSafeAreaInsets();
  const [timezone, setTimezone] = useState();
  const [utcIn, setUtcIn] = useState(null);
  const [utcOut, setUtcOut] = useState(null);
  const [adjUtcIn, setAdjUtcIn] = useState(null);
  const [adjUtcOut, setAdjUtcOut] = useState(null);

  const [careAreas, setCareAreas] = useState(doc?.careAreas);
  const [longTermObjectives, setLongTermObjectives] = useState(
    doc?.longTermObjectives,
  );

  const isLoading = docLoading || docApproving;

  useEffect(() => {
    (async () => {
      const timezone = await getDataFromStore('timezone');

      setTimezone(timezone);
    })();
  }, []);

  useEffect(() => {
    setAdjUtcIn(doc?.adjUtcIn ? doc?.adjUtcIn / 1000 : null);
    setAdjUtcOut(doc?.adjUtcOut ? doc?.adjUtcOut / 1000 : null);
    setUtcIn(doc?.utcIn / 1000);
    setUtcOut(doc?.utcOut / 1000);
    setCareAreas(doc?.careAreas);
    setLongTermObjectives(doc?.longTermObjectives);
  }, [doc]);
  return (
    <Modal visible={isVisible}>
      <Block flex style={[styles.modalContent, {paddingTop: insets.top * 1.5}]}>
        <ScrollView>
          <Block style={styles.summary}>
            <Text bold style={styles.title}>
              Pending session documentation for:
            </Text>
            <Text color="white" size={16}>
              {doc?.clientName}
            </Text>
            <Text color="white" size={16} style={{marginTop: 3}}>
              Date:{' '}
              {getDateTime(Number(utcIn * 1000), timezone).format('MM/DD/YYYY')}
            </Text>
          </Block>
          <Block style={styles.block}>
            <Text bold style={styles.blockTitle}>
              Client Location:
            </Text>
            <Text style={styles.blockDescription}>
              {doc?.clientLocation
                ? `${
                    doc?.clientLocation.address1 || doc?.clientLocation.address2
                  }, ${doc?.clientLocation.city}`
                : ''}
            </Text>
          </Block>
          <Block style={styles.block}>
            <Text bold style={styles.blockTitle}>
              Session Notes:
            </Text>
            <Text style={styles.blockDescription}>{doc?.note}</Text>
          </Block>

          <CareArea
            careAreas={careAreas}
            scoring={doc?.scoring}
            onChange={setCareAreas}
          />
          <LongTermObjectives
            longTermObjectives={longTermObjectives}
            scoring={doc?.scoring}
            onChange={setLongTermObjectives}
          />
          <Block style={styles.block}>
            <Text bold style={styles.blockTitle}>
              Recorded Time In/Out
            </Text>
            <View style={styles.adjust}>
              <Text color="white">
                {getDateTime(utcIn * 1000, timezone).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
              <Text color="white" size={16}>
                -
              </Text>
              <Text color="white">
                {getDateTime(utcOut * 1000, timezone).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </View>
          </Block>
          <Block style={styles.block}>
            <Text bold style={styles.blockTitle}>
              Adjust In/Out
            </Text>
            <View style={styles.adjust}>
              <Text
                color="white"
                style={
                  adjUtcIn && utcIn !== adjUtcIn ? styles.adjustUpdated : {}
                }>
                {getDateTime((adjUtcIn || utcIn) * 1000, timezone).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
              <Text color="white" size={16}>
                -
              </Text>
              <Text
                color="white"
                style={
                  adjUtcOut && utcOut !== adjUtcOut ? styles.adjustUpdated : {}
                }>
                {getDateTime((adjUtcOut || utcOut) * 1000, timezone).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </View>
          </Block>
        </ScrollView>
        <Block row style={styles.actionBlock}>
          <Button
            style={styles.submitBtn}
            color={materialTheme.COLORS.BUTTON_COLOR}
            onPress={() =>
              approveNotesByGurdian({
                variables: {
                  sessionId: doc.docId,
                  fromMobile: true,
                  noteType: doc.noteType,
                  approved: true,
                },
              })
            }>
            <Text style={styles.buttonText}>Approve</Text>
          </Button>

          <Button style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </Button>
        </Block>
        {isLoading && (
          <Block center middle style={styles.indicatorWrapper}>
            <Block card style={{backgroundColor: 'white', padding: 20}}>
              <ActivityIndicator />
              <Text style={{marginTop: 10, color: 'grey'}}>
                {docLoading ? 'Loading...' : 'Submitting...'}
              </Text>
            </Block>
          </Block>
        )}
      </Block>
    </Modal>
  );
}

const styles = StyleSheet.create({
  indicatorWrapper: {
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
  modalContent: {
    backgroundColor: materialTheme.COLORS.PRIMARY,
    paddingHorizontal: theme.SIZES.BASE * 1.5,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    marginTop: 5,
    color: 'white',
  },
  blockTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: 'white',
  },
  blockDescription: {
    fontSize: 14,
    color: 'white',
  },
  actionBlock: {
    padding: 20,
    marginVertical: 30,
    justifyContent: 'space-between',
  },
  submitBtn: {
    margin: 0,
    width: 100,
    borderRadius: 7,
    height: 40,
    marginHorizontal: 5,
  },
  multiTextInput: {
    borderWidth: 1,
    borderColor: materialTheme.COLORS.BLOCK,
    height: 90,
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
  },
  block: {
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    margin: 0,
  },
  closeBtn: {
    margin: 0,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 7,
    width: 70,
    height: 40,
    marginHorizontal: 5,
  },
  buttonText: {color: 'white'},
  adjust: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustUpdated: {
    fontWeight: 'bold',
  },
});

export default DocumentationModal;

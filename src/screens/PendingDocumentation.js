import React, {useEffect, useState} from 'react';
import {Block, Text, theme} from 'galio-framework';
import {useLazyQuery} from '@apollo/client';
import {StyleSheet, ScrollView, Platform, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HeaderHeight} from 'src/constants/utils';
import {GET_PENDING_NOTES} from 'src/graphql/queries';
import {DocumentationModal, LoadingIndicator} from 'src/components';
import {getDateTime} from 'src/utils/timezone';

function PendingDocumentation({navigation}) {
  const [GetPendingNotes, {data, error, loading}] = useLazyQuery(
    GET_PENDING_NOTES,
    {
      fetchPolicy: 'network-only',
    },
  );
  const insets = useSafeAreaInsets();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      GetPendingNotes();
    });

    return unsubscribe;
  }, [navigation]);

  const pendingNotes = data?.pendingNotes;
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Block flex style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          {
            paddingTop: insets.top * 0.4,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {pendingNotes?.map((document) => (
          <TouchableOpacity
            key={`${document.docType}-${document.docId}`}
            style={styles.documentItem}
            onPress={() => {
              setSelectedDocument(document);
              setModalVisible(true);
            }}>
            <Block>
              <Text
                style={
                  styles.itemText
                }>{`${document.clientName} - ${document.svc}`}</Text>
              <Text>
                {getDateTime(Number(document.dt)).format('MM/DD/YYYY')}
              </Text>
            </Block>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedDocument && (
        <DocumentationModal
          docId={selectedDocument.docId}
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    paddingHorizontal: theme.SIZES.BASE * 1,
    position: 'relative',
  },
  documentItem: {
    paddingVertical: theme.SIZES.BASE * 0.5,
    paddingHorizontal: theme.SIZES.BASE * 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  itemText: {
    color: 'red',
  },
});

export default PendingDocumentation;

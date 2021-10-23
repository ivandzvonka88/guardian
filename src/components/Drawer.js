import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Block, Text, Icon, theme} from 'galio-framework';

import materialTheme from 'src/constants/Theme';
import Terms from 'src/screens/Terms';
import {deleteDataFromStore} from '../utils/storage';

const resetToken = async () => {
  await deleteDataFromStore('token');
  await deleteDataFromStore('mfaVerified');
};

function DrawerItem({focused, title, navigation}) {
  const [isTermsVisible, setIsTermsVisible] = useState(false);

  renderIcon = () => {
    switch (title) {
      case 'Client List':
        return (
          <Icon
            size={18}
            name="md-list-outline"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Terms of Use':
        return (
          <Icon
            size={18}
            name="ios-newspaper-outline"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Pending Documentation':
        return (
          <Icon
            size={18}
            name="folder-open-outline"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      case 'Sign Out':
        return (
          <Icon
            size={18}
            name="md-log-out-outline"
            family="ionicon"
            color={focused ? 'white' : materialTheme.COLORS.MUTED}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={{height: 55}}
      onPress={() => {
        if (title !== 'Sign Out') {
          if (title === 'Terms of Use') {
            setIsTermsVisible(true);
          } else {
            navigation.navigate(title);
          }
        } else {
          resetToken();
          navigation.popToTop();
        }
      }}>
      <Block
        flex
        row
        style={[
          styles.defaultStyle,
          focused ? [styles.activeStyle, styles.shadow] : null,
        ]}>
        <Block middle flex={0.1} style={{marginRight: 28}}>
          {renderIcon()}
        </Block>
        <Block row center flex={0.9}>
          <Text size={18} color={focused ? 'white' : 'black'}>
            {title}
          </Text>
        </Block>
      </Block>

      <Terms
        isVisible={isTermsVisible}
        onClose={() => {
          setIsTermsVisible(false);
          navigation.closeDrawer();
        }}
      />
    </TouchableOpacity>
  );
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.PRIMARY,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
});

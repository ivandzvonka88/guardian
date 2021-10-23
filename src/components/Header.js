import React from 'react';
import {withNavigation} from '@react-navigation/compat';
import {TouchableOpacity, StyleSheet, Platform, Dimensions} from 'react-native';
import {Block, NavBar, theme, Icon} from 'galio-framework';

import materialTheme from 'src/constants/Theme';

const {height, width} = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height > 800 || width > 800);

class Header extends React.Component {
  renderLeft = () => {
    const {white, back, navigation} = this.props;

    return (
      <TouchableOpacity
        onPress={() => (back ? navigation.goBack() : navigation.openDrawer())}
        style={styles.touchableArea}>
        <Icon
          size={26}
          family="evilicons"
          name={back ? 'chevron-left' : 'navicon'}
          color={theme.COLORS[white ? 'WHITE' : 'ICON']}
        />
      </TouchableOpacity>
    );
  };

  renderRight = () => {
    const {white, title, navigation, scene} = this.props;
    const {params} = scene.route;

    switch (title) {
      case 'Clients':
        return [
          <TouchableOpacity
            style={styles.touchableArea}
            key="check-client"
            onPress={() =>
              navigation.setParams({isEditingMode: !params?.isEditingMode})
            }>
            <Icon
              size={20}
              family="feather"
              name={params?.isEditingMode ? 'user-x' : 'user-check'}
              color={theme.COLORS.WHITE}
            />
          </TouchableOpacity>,
        ];
      default:
        break;
    }
  };

  render() {
    const {back, title, white, transparent} = this.props;

    return (
      <Block style={[styles.shadow, {backgroundColor: 'rgba(0,0,0,0)'}]}>
        <NavBar
          back={back}
          title={title}
          style={styles.navbar}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{alignItems: 'center'}}
          leftStyle={{flex: 0.3}}
          left={this.renderLeft()}
          titleStyle={[
            styles.title,
            {color: theme.COLORS[white ? 'WHITE' : 'ICON']},
          ]}
        />
      </Block>
    );
  }
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX() ? theme.SIZES.BASE * 4 : theme.SIZES.BASE * 1.5,
    zIndex: 5,
    backgroundColor: materialTheme.COLORS.PRIMARY,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  touchableArea: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

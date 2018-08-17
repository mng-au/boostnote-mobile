import * as React from 'react';
import { Linking, Text, View, Platform } from 'react-native';
import { Container, Icon, Button } from 'native-base';

import styles from './SideBarStyles';
import autobind from 'autobind-decorator';

export interface ISideBarProps {
  changeMode: (mode: number) => void;
  onClose: () => void;
}

export default class SideBar extends React.Component<ISideBarProps> {
  constructor(props: ISideBarProps) {
    super(props);
  }

  @autobind
  onAllNotesButtonPress() {
    this.props.changeMode(0);
    this.props.onClose();
  }

  @autobind
  onDropboxButtonPress() {
    this.props.changeMode(1);
    this.props.onClose();
  }

  @autobind
  async onBoostnoteSubscribeTextPress() {
    await Linking.openURL('https://boostnote.io/#subscribe');
  }

  @autobind
  async onBoostnoteGithubTextPress() {
    await Linking.openURL('https://github.com/mng-au/boostnote-mobile');
  }

  @autobind
  async onBoostnoteTwitterTextPress() {
    await Linking.openURL('https://twitter.com/boostnoteapp');
  }

  @autobind
  async onBoostnoteFacebookTextPress() {
    await Linking.openURL('https://www.facebook.com/groups/boostnote/');
  }

  render() {
    return (
      <Container style={{ backgroundColor: '#2E3235' }}>
        <View style={styles.sideNavWrap}>
          <View style={styles.noteSelectorWrap}>
            <Text style={styles.appName}>Boostnote Mobile</Text>
            <Button
              style={
                Platform.OS === 'android'
                  ? {
                      marginBottom: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      width: '96%',
                      height: 35,
                      paddingTop: 6,
                      paddingLeft: 7,
                    }
                  : { backgroundColor: 'transparent', paddingLeft: 0 }
              }
              onPress={this.onAllNotesButtonPress}
            >
              <Text
                style={Platform.OS === 'android' ? styles.noteSelectorAndroid : styles.noteSelector}
              >
                <Icon
                  name={'md-archive'}
                  style={{ color: '#FDC134', fontSize: 14, backgroundColor: 'transparent' }}
                />{' '}
                All Notes
              </Text>
            </Button>
          </View>

          <View style={styles.noteSelectorWrap}>
            <Button
              style={
                Platform.OS === 'android'
                  ? {
                      marginBottom: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      width: '96%',
                      height: 35,
                      paddingTop: 6,
                      paddingLeft: 7,
                    }
                  : { backgroundColor: 'transparent', paddingLeft: 0 }
              }
              onPress={this.onDropboxButtonPress}
            >
              <Text
                style={Platform.OS === 'android' ? styles.noteSelectorAndroid : styles.noteSelector}
              >
                <Icon
                  name={'logo-dropbox'}
                  style={{ color: '#2BA6FA', fontSize: 18, backgroundColor: 'transparent' }}
                />{' '}
                Dropbox
              </Text>
            </Button>
          </View>

          {/* <View style={styles.hariboteWrap}>
                            <Text style={styles.noteHaribote}>Folders</Text>
                            <Text style={styles.hariboteDesc}>Under development.</Text>
                        </View> */}
        </View>

        <View style={styles.bottomLink}>
          <Text onPress={this.onBoostnoteSubscribeTextPress} style={styles.bottomLinkWord}>
            <Icon style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.6)' }} name={'ios-mail'} />
          </Text>
          <Text onPress={this.onBoostnoteGithubTextPress} style={styles.bottomLinkWord}>
            <Icon
              style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.6)' }}
              name={'logo-github'}
            />
          </Text>
          <Text onPress={this.onBoostnoteTwitterTextPress} style={styles.bottomLinkWord}>
            <Icon
              style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.6)' }}
              name={'logo-twitter'}
            />
          </Text>
          <Text onPress={this.onBoostnoteFacebookTextPress} style={styles.bottomLinkWord}>
            <Icon
              style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.6)' }}
              name={'logo-facebook'}
            />
          </Text>
        </View>
      </Container>
    );
  }
}

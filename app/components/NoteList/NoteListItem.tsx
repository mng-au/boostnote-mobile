import * as React from 'react';
import { Text, View, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Icon } from 'native-base';
import * as moment from 'moment';
import removeMd from 'remove-markdown-and-html';
import autobind from 'autobind-decorator';
import { INote } from '../../models';

interface INodeListItemStyles {
  noteList: StyleProp<ViewStyle>;
  noteItemSectionLeft: StyleProp<ViewStyle>;
  noteItemSectionRight: StyleProp<ViewStyle>;
  noteListText: StyleProp<TextStyle>;
  noteListTextNone: StyleProp<TextStyle>;
  noteListDate: StyleProp<TextStyle>;
  noteStarIcon: any;
  noteListIcon: any;
  noteListIconWrap: any;
}

const styles: INodeListItemStyles = {
  noteList: {
    width: '100%',
    height: 65,
    marginTop: 0,
    marginBottom: 0,
    borderColor: '#F7F7F7',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(244,244,244,0.1)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  noteStarIcon: {
    fontSize: 21,
    color: 'gold',
    paddingLeft: 15,
    right: -3,
  },
  noteListIconWrap: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 50,
    overflow: 'hidden',
  },
  noteListIcon: {
    fontSize: 14,
    color: '#adadad',
  },
  noteListText: {
    color: '#3a3941',
    backgroundColor: 'transparent',
    fontSize: 14,
    flex: 1,
    paddingLeft: 10,
  },
  noteListTextNone: {
    color: '#adadad',
    backgroundColor: 'transparent',
    fontSize: 14,
    flex: 1,
  },
  noteListDate: {
    color: 'rgba(40,44,52,0.4)',
    fontSize: 13,
    fontWeight: '600',
  },
  noteItemSectionLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 3,
  },
  noteItemSectionRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

interface INoteListItemProps {
  note: INote;
  onNotePress: (fileName: string, isOpen: boolean) => void;
  onStarPress: (fileName: string) => void;
}

class NoteListItem extends React.Component<INoteListItemProps> {
  constructor(props: INoteListItemProps) {
    super(props);
    this.onNotePress = this.onNotePress.bind(this);
    this.onStarPress = this.onStarPress.bind(this);
  }

  @autobind
  onNotePress() {
    const { note, onNotePress } = this.props;
    const { fileName } = note;

    onNotePress(fileName, true);
  }

  @autobind
  onStarPress() {
    const { note, onStarPress } = this.props;
    const { fileName } = note;

    onStarPress(fileName);
  }

  render() {
    const { note } = this.props;
    const { content, isStarred, updatedAt } = note;
    return (
      <TouchableOpacity style={styles.noteList} onPress={this.onNotePress}>
        <View style={styles.noteItemSectionLeft}>
          <Text
            numberOfLines={2}
            ellipsizeMode={'tail'}
            style={
              content !== 'Tap here and write something!'
                ? styles.noteListText
                : styles.noteListTextNone
            }
          >
            {removeMd(content)}
          </Text>
        </View>
        <View style={styles.noteItemSectionRight}>
          {/* <Text style={styles.noteListDate}>
              {moment(updatedAt).format('MMM D') + '\n' + moment(createdAt).format('MMM D')}
              </Text> */}
          <Text style={styles.noteListDate}>{moment(updatedAt).format('MMM D')}</Text>
          <TouchableOpacity onPress={this.onStarPress}>
            <Icon name={isStarred ? 'md-star' : 'md-star-outline'} style={styles.noteStarIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

export default NoteListItem;

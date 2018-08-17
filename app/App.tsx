import * as React from 'react';
import { Platform, View, TouchableOpacity } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Drawer,
} from 'native-base';

import DropboxNoteList from './views/DropboxNoteList';

import SideBar from './components/SideBar';
import NoteModal from './views/note/NoteModal';
import NoteListItem from './components/NoteList/NoteListItem';
import styles from './AppStyle';

import * as AwsMobileAnalyticsConfig from './lib/AwsMobileAnalytics';
import { makeRandomHex } from './lib/Strings';

import RNFetchBlob from 'react-native-fetch-blob';
import autobind from 'autobind-decorator';
import { INote } from './models';
const fs = RNFetchBlob.fs;
const dirs = RNFetchBlob.fs.dirs;

const MARKDOWN_NOTE = 'MARKDOWN_NOTE';
// const SNIPPET_NOTE = 'SNIPPET_NOTE'
const DEFAULT_FOLDER = 'DEFAULT_FOLDER';

interface IHeaderLeft {
  openDrawer: () => void;
}

const HeaderLeft = ({ openDrawer }: IHeaderLeft) => (
  <Left>
    <View>
      <Button transparent={true} onPress={openDrawer}>
        <Icon name={'md-reorder'} style={styles.headerMenuButton} />
      </Button>
    </View>
  </Left>
);

interface IHeaderBodyProps {
  mode: unknown;
}

const HeaderBody = ({ mode }: IHeaderBodyProps) => (
  <Body>
    <View>
      <Title style={Platform.OS === 'android' ? styles.androidAppName : styles.iOsAppName}>
        {mode === 0 ? 'All Notes' : 'Dropbox'}
      </Title>
    </View>
  </Body>
);

interface IHeaderRightProps {
  onFilterFavorites: () => void;
  filterFavorites: boolean;
}

const HeaderRight = ({ onFilterFavorites, filterFavorites }: IHeaderRightProps) => (
  <Right>
    <View>
      <TouchableOpacity onPress={onFilterFavorites}>
        <Icon
          name={filterFavorites ? 'md-star' : 'md-star-outline'}
          style={styles.headerRightMenuButton}
        />
      </TouchableOpacity>
    </View>
  </Right>
);

interface INoteListItemProps {
  noteList: INote[];
  filterFavorites: boolean;
  onStarPress: () => void;
  setNoteModalIsOpen: () => void;
}

const NoteList = ({
  noteList,
  filterFavorites,
  onStarPress,
  setNoteModalIsOpen,
}: INoteListItemProps) => (
  <Content contentContainerStyle={{ display: 'flex' }}>
    {noteList.map((note) => {
      if (filterFavorites && !note.isStarred) {
        return null;
      }
      return (
        <NoteListItem
          note={note}
          onStarPress={onStarPress}
          onNotePress={setNoteModalIsOpen}
          key={note.fileName}
        />
      );
    })}
  </Content>
);

interface ICreateNewNoteButtonProps {
  onPressActionButton: () => void;
}

const CreateNewNoteButton = ({ onPressActionButton }: ICreateNewNoteButtonProps) => (
  <Button transparent={true} onPress={onPressActionButton} style={styles.newPostButtonWrap}>
    <View style={styles.newPostButton}>
      <Icon name={'md-add'} style={{ color: '#fff' }} />
    </View>
  </Button>
);

interface IAppProps {}

interface IAppState {
  isNoteOpen: boolean;
  mode: number; // 0: 'AllNote', 1: 'Dropbox'
  noteList: any[];
  fileName: string;
  content: string;
  filterFavorites: boolean;
  isConnectedToDropbox: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps, context?: any) {
    super(props, context);
    this.state = {
      isNoteOpen: false,
      mode: 0, // 0: 'AllNote', 1: 'Dropbox'
      noteList: [],
      fileName: '',
      content: '',
      filterFavorites: false,
      isConnectedToDropbox: false,
    };

    // Init AwsMobileAnalytics
    AwsMobileAnalyticsConfig.initAwsMobileAnalytics();
  }

  componentWillMount() {
    this.listDir(dirs.DocumentDir)
      .then((files) => {
        // Check whether the 'Boostnote' folder exist or not.
        const filteredFiles = files.filter((name) => {
          return name === 'Boostnote';
        });
        // If not, create.
        if (filteredFiles.length === 0) {
          this.createDir();
        }
        return this.listFiles();
      })
      .then((files) => {
        const filteredFiles = files.filter((name) => {
          return name === 'boostnote.json';
        });
        // Check whether the folder has a setting file or not.
        if (filteredFiles.length === 0) {
          // If not, create.
          const defaultJson = {
            note: [],
          };
          fs.createFile(
            `${dirs.DocumentDir}/Boostnote/boostnote.json`,
            JSON.stringify(defaultJson),
            'utf8',
          ).catch((err) => console.log(err));
        }
        return this.listFiles();
      })
      .then((files) => {
        const filteredFiles = files.filter((name) => {
          return name.endsWith('.md');
        });
        // Check whether the folder has any note files or not.
        if (filteredFiles.length === 0) {
          // If not, create.
          this.createNewNote(`${makeRandomHex()}.md`);
        }
        return this.listFilesAndSetState();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  @autobind
  openDrawer() {
    this._drawer._root.open();
  }

  @autobind
  closeDrawer() {
    this._drawer._root.close();
  }

  @autobind
  setNoteModalIsOpen(fileName: string, isOpen: boolean) {
    if (isOpen) {
      fs.readFile(`${dirs.DocumentDir}/Boostnote/${fileName}`, 'utf8').then((content: string) => {
        this.setState({
          fileName: fileName,
          content: content,
          isNoteOpen: true,
        });
      });
    } else {
      AwsMobileAnalyticsConfig.recordDynamicCustomEvent('EDIT_NOTE');
      this.listFilesAndSetState();
      this.setState({
        isNoteOpen: false,
      });
    }
  }

  @autobind
  onStarPress(fileName: string) {
    fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8')
      .then((content: string) => {
        const contentObject = JSON.parse(content);
        const newNotes = [];
        for (let i in contentObject.note) {
          const newNote = { ...contentObject.note[i] };
          if (newNote.name === fileName) {
            newNote.isStarred = !newNote.isStarred;
          }
          newNotes.push(newNote);
        }
        contentObject.note = newNotes;
        fs.writeFile(
          `${dirs.DocumentDir}/Boostnote/boostnote.json`,
          JSON.stringify(contentObject),
          'utf8',
        )
          .then(this.listFilesAndSetState)
          .catch((err: Error) => console.log(err));
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  @autobind
  onFilterFavorites() {
    this.setState((prevState, props) => {
      return { filterFavorites: !prevState.filterFavorites };
    });
  }

  @autobind
  listDir() {
    return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`);
  }

  @autobind
  listFiles() {
    return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/Boostnote`);
  }

  @autobind
  async listFilesAndSetState() {
    const files = await this.listFiles();
    const filteredFiles = files.filter((name: string) => {
      return name.endsWith('.md');
    });

    const settingJsonFile = await fs.readFile(
      `${dirs.DocumentDir}/Boostnote/boostnote.json`,
      'utf8',
    );

    // Change file name to object of file name and one liner content
    const fileList = [];
    for (let i = 0; i < filteredFiles.length; i++) {
      const fileName = filteredFiles[i];
      const content = await fs.readFile(`${dirs.DocumentDir}/Boostnote/${fileName}`, 'utf8');
      const filteredSettingFile = JSON.parse(settingJsonFile).note.filter((setting) => {
        return setting.name === fileName;
      })[0];
      fileList.push({
        fileName: fileName,
        content: content === '' ? 'Tap here and write something!' : content.split(/\r\n|\r|\n/)[0],
        createdAt: filteredSettingFile.createdAt,
        isStarred: filteredSettingFile.isStarred,
        updatedAt: filteredSettingFile.updatedAt,
      });
    }
    fileList.sort((a, b) => {
      return a.createdAt < b.createdAt ? 1 : -1;
    });

    this.setState({
      noteList: fileList,
    });
  }

  @autobind
  createDir() {
    RNFetchBlob.fs
      .mkdir(`${dirs.DocumentDir}/Boostnote`)
      .then(() => {
        console.log('OK');
      })
      .catch(() => {
        console.log('NG');
      });
  }

  @autobind
  createNewNote(fileName: string, isOpen: boolean) {
    const newFileName = fileName === '' ? `${makeRandomHex()}.md` : fileName;

    // Create a real file
    fs.createFile(`${dirs.DocumentDir}/Boostnote/${newFileName}`, '', 'utf8')
      .then((file) => {
        this.setState({
          isNoteOpen: isOpen,
          fileName: newFileName,
          content: '',
        });
        // Update setting file
        return fs.readFile(`${dirs.DocumentDir}/Boostnote/boostnote.json`, 'utf8');
      })
      .then((content) => {
        const contentObject = JSON.parse(content);
        const date = new Date();
        const thisNote = {
          type: MARKDOWN_NOTE,
          folder: DEFAULT_FOLDER,
          title: '',
          name: newFileName,
          isStarred: false,
          createdAt: date,
          updatedAt: date,
        };
        contentObject.note.push(thisNote);
        fs.writeFile(
          `${dirs.DocumentDir}/Boostnote/boostnote.json`,
          JSON.stringify(contentObject),
          'utf8',
        ).catch((err: Error) => console.log(err));
        AwsMobileAnalyticsConfig.recordDynamicCustomEvent('CREATE_NOTE');
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  @autobind
  changeMode(mode) {
    this.setState({
      mode: mode,
    });
  }

  @autobind
  onPressActionButton() {
    if (this.state.mode === 0) {
      this.createNewNote('', true);
    } else if (this.state.mode === 1) {
      this.refs.dropboxNoteList.createNewNote();
    }
  }

  @autobind
  setIsConnectedToDropbox(value: boolean) {
    this.setState({
      isConnectedToDropbox: value,
    });
  }

  render() {
    const {
      noteList,
      mode,
      filterFavorites,
      isNoteOpen,
      fileName,
      content,
      isConnectedToDropbox,
    } = this.state;
    return (
      <Drawer
        ref={(ref) => {
          this._drawer = ref;
        }}
        content={<SideBar changeMode={this.changeMode} onClose={() => this.closeDrawer()} />}
        panOpenMask={0.05}
      >
        <Container>
          <Header
            style={Platform.OS === 'android' ? styles.androidHeader : styles.iosHeader}
            androidStatusBarColor="#239F85"
          >
            <HeaderLeft openDrawer={this.openDrawer} />
            <HeaderBody mode={mode} />
            <HeaderRight
              onFilterFavorites={this.onFilterFavorites}
              filterFavorites={filterFavorites}
            />
          </Header>
          {mode === 0 ? (
            <NoteList
              noteList={noteList}
              filterFavorite={filterFavorites}
              onStarPress={this.onStarPress}
              setNoteModalIsOpen={this.setNoteModalIsOpen}
            />
          ) : (
            <DropboxNoteList
              ref={'dropboxNoteList'}
              isConnectedToDropbox={isConnectedToDropbox}
              setIsConnectedToDropbox={this.setIsConnectedToDropbox}
            />
          )}
        </Container>
        <View>
          {mode === 1 && !isConnectedToDropbox ? null : (
            <CreateNewNoteButton onPressActionButton={this.onPressActionButton} />
          )}
          <NoteModal
            setIsOpen={this.setNoteModalIsOpen}
            isNoteOpen={isNoteOpen}
            fileName={fileName}
            content={content}
          />
        </View>
      </Drawer>
    );
  }
}

import * as React from 'react';
import { View, TouchableHighlight, ScrollView } from 'react-native';
import { Styles } from './NoteInputSupportStyles';
import { default as SvgUri } from 'react-native-svg-uri';

import headIcon from '../../../resource/noteInputSupportIcons/icon-head';
import listIcon from '../../../resource/noteInputSupportIcons/icon-list';
import codeIcon from '../../../resource/noteInputSupportIcons/icon-code';
import boldIcon from '../../../resource/noteInputSupportIcons/icon-bold';
import italicIcon from '../../../resource/noteInputSupportIcons/icon-italic';
import quoteIcon from '../../../resource/noteInputSupportIcons/icon-quote';
import checkboxIcon from '../../../resource/noteInputSupportIcons/icon-checkbox';
import pasteIcon from '../../../resource/noteInputSupportIcons/icon-paste';
import autobind from 'autobind-decorator';

export interface INoteInputSupportProps {
  insertMarkdownBetween: (value: string) => void;
  pasteContent: () => void;
}

export default class NoteInputSupport extends React.Component<INoteInputSupportProps> {
  constructor(props: INoteInputSupportProps, context?: any) {
    super(props, context);
  }

  @autobind
  onInsertMarkdownHeadPress() {
    this.props.insertMarkdownBetween('#');
  }

  @autobind
  onInsertMarkdownListPress() {
    this.props.insertMarkdownBetween('- ');
  }

  @autobind
  onInsertMarkdownCodePress() {
    this.props.insertMarkdownBetween('```\n');
  }

  render() {
    return (
      <View style={Styles.inputSupportWrap}>
        <ScrollView horizontal={true} keyboardShouldPersistTaps={'always'}>
          <TouchableHighlight
            onPress={this.onInsertMarkdownHeadPress}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={headIcon} />{' '}
              {/* TODO - style={Styles.supportImage} />*/}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.onInsertMarkdownListPress}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={listIcon} />{' '}
              {/* TODO - style={Styles.supportImage} /> */}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.onInsertMarkdownCodePress}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={codeIcon} />{' '}
              {/* TODO - style={Styles.supportImage} /> */}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('- [ ] ');
            }}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'20'} height={'30'} svgXmlData={checkboxIcon} />
              {/* TODO - style={Styles.checkboxImage} /> */}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={this.props.pasteContent.bind(this)}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={pasteIcon} />{' '}
              {/* TODO - style={Styles.supportImage} /> */}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('**');
            }}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={boldIcon} />{' '}
              {/* TODO - style={Styles.supportImage} /> */}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('> ');
            }}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={quoteIcon} />{' '}
              {/* TODO - style={Styles.supportImage} /> */}
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              this.props.insertMarkdownBetween('_');
            }}
            style={Styles.inputElementsStyle}
          >
            <View>
              <SvgUri width={'17'} height={'17'} svgXmlData={italicIcon} />{' '}
              {/* TODO - style={Styles.supportImage} /> */}
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }
}

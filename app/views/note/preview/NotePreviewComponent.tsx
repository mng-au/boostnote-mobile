import * as React from 'react';

import { View, Text } from 'react-native';

import CheckBox from 'react-native-check-box';
import Markdown, {
  PluginContainer,
  stringToTokens,
  MarkdownIt,
} from 'react-native-markdown-renderer';
import markdownItCheckbox from 'markdown-it-checkbox';
import autobind from 'autobind-decorator';

export interface INotePreviewProps {
  text: string;
  onTapCheckBox: (line: number) => void;
}

interface INotePreviewState {
  text: string;
  taskListLinesFromMarkdown: any[];
  taskListIdsFromCheckbox: any[];
}

export default class NotePreview extends React.Component<INotePreviewProps, INotePreviewState> {
  constructor(props: INotePreviewProps) {
    super(props);

    this.state = {
      text: this.props.text,
      taskListLinesFromMarkdown: this.createTaskListLine(props.text),
      taskListIdsFromCheckbox: [],
    };
  }

  componentWillReceiveProps(props: INotePreviewProps) {
    this.setState({
      text: props.text,
      taskListLinesFromMarkdown: this.createTaskListLine(props.text),
      taskListIdsFromCheckbox: [],
    });
  }

  @autobind
  hasParents(parents: any, type: any) {
    return parents.findIndex((el: any) => el.type === type) > -1;
  }

  @autobind
  createTaskListLine(text: string) {
    return stringToTokens(text, MarkdownIt().use(markdownItCheckbox))
      .filter((token: any) => token.type === 'inline')
      .filter((token: any) => token.children[0] && token.children[0].type === 'checkbox_input')
      .map((token: any) => token.map[0]);
  }

  @autobind
  onCheckBoxClickFactory(node: any): () => void {
    return () => {
      const selfNode = node;
      const i = this.state.taskListIdsFromCheckbox
        .slice(-this.state.taskListLinesFromMarkdown.length)
        .findIndex((element) => element === selfNode.attributes.id); // , index, array
      this.props.onTapCheckBox(this.state.taskListLinesFromMarkdown[i]);
    };
  }

  render() {
    return (
      <View style={{ margin: 15 }}>
        <Markdown
          plugins={[new PluginContainer(markdownItCheckbox)]}
          rules={{
            li: (node: any, children: any, parent: any, styles: any) => {
              if (this.hasParents(parent, 'ul')) {
                // For tasklist
                if (
                  node.children[0] &&
                  node.children[0].type === 'p' &&
                  node.children[0].children[0] &&
                  node.children[0].children[0].type === 'input'
                ) {
                  return (
                    <View key={node.key} style={styles.listUnorderedItem}>
                      <View style={[styles.listItem]}>{children}</View>
                    </View>
                  );
                }

                return (
                  <View key={node.key} style={styles.listUnorderedItem}>
                    <Text style={styles.listUnorderedItemIcon}>{'\u00B7'}</Text>
                    <View style={[styles.listItem]}>{children}</View>
                  </View>
                );
              }

              if (this.hasParents(parent, 'ol')) {
                return (
                  <View key={node.key} style={styles.listOrderedItem}>
                    <Text style={styles.listOrderedItemIcon}>{node.index + 1}</Text>
                    <View style={[styles.listItem]}>{children}</View>
                  </View>
                );
              }

              return (
                <View key={node.key} style={[styles.listItem]}>
                  {children}
                </View>
              );
            },
            label: (node: any, children: any) => {
              // , parents: any
              return children;
            },
            input: (node: any) => {
              // , children: any, parents: any
              this.state.taskListIdsFromCheckbox.push(node.attributes.id);

              return (
                <CheckBox
                  key={node.key}
                  onClick={this.onCheckBoxClickFactory(node)}
                  isChecked={!!node.attributes.checked}
                  isIndeterminate={false}
                />
              );
            },
          }}
        >
          {this.state.text}
        </Markdown>
      </View>
    );
  }
}

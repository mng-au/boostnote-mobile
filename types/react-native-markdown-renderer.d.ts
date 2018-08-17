declare module 'react-native-markdown-renderer' {
  import * as React from 'react';

  export class PluginContainer {
    constructor(value: any);
  }

  export const stringToTokens: any;

  export interface IMarkdownIt {
    use: (value: any) => string;
  }

  export function MarkdownIt(): IMarkdownIt;

  // noinspection TsLint
  export interface IMarkdownPlugin {
  }

  export interface IMarkdownProps {
    plugins: IMarkdownPlugin[];
    rules: any;
  }

  // noinspection TsLint
  export default class Markdown extends React.Component<IMarkdownProps> {}
}

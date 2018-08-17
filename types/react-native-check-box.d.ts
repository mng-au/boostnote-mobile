declare module 'react-native-check-box' {
  import * as React from 'react';

  export interface ICheckBoxProps {
    onClick: () => void;
    isChecked: boolean;
    isIndeterminate: boolean;
  }

  export default class CheckBox extends React.Component<ICheckBoxProps> {}
}

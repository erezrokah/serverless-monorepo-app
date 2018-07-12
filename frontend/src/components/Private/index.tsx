import * as React from 'react';
import { InjectedAuthReduxProps } from 'redux-auth-wrapper/history4/redirect';
import { Segment } from 'semantic-ui-react';

export class Private extends React.Component<InjectedAuthReduxProps, any> {
  public render() {
    return <Segment> This is a private page </Segment>;
  }
}

export default Private;

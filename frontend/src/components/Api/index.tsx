import * as React from 'react';
import { Segment } from 'semantic-ui-react';
import EmailApi from './EmailApi';
import PrivateApi from './PrivateApi';
import PublicApi from './PublicApi';

export class Api extends React.Component<any, any> {
  public render() {
    return (
      <Segment.Group>
        <Segment>
          <EmailApi />
        </Segment>
        <Segment>
          <PublicApi />
        </Segment>
        <Segment>
          <PrivateApi />
        </Segment>
      </Segment.Group>
    );
  }
}

export default Api;

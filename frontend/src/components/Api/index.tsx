import * as React from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { privateApi, publicApi } from '../../lib/api';

class Api extends React.Component<any, any> {
  public render() {
    return (
      <Segment>
        <Button id="publicApi" onClick={publicApi}>
          Public Api
        </Button>
        <Button id="privateApi" onClick={privateApi}>
          Private Api
        </Button>
      </Segment>
    );
  }
}

export default Api;

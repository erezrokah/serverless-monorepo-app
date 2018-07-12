import * as React from 'react';
import { LoadingComponentProps } from 'react-loadable';
import { Button, Dimmer, Loader, Segment } from 'semantic-ui-react';

const Loading = () => (
  <Dimmer active={true} inverted={true}>
    <Loader inverted={true}>Loading</Loader>
  </Dimmer>
);

export const ComponentLoading = (props: LoadingComponentProps) => {
  if (props.error) {
    return (
      <Segment>
        Error! <Button onClick={props.retry}>Retry</Button>
      </Segment>
    );
  } else if (props.timedOut) {
    return (
      <Segment>
        Taking a long time... <Button onClick={props.retry}>Retry</Button>
      </Segment>
    );
  } else if (props.pastDelay) {
    return <Segment>Loading...</Segment>;
  } else {
    return null;
  }
};

export default Loading;

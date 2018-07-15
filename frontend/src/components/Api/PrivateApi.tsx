import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Message } from 'semantic-ui-react';
import { privateApiRequested } from '../../actions/api';
import { privateApiSelector } from '../../selectors/api';
import { IApiState, IState as Store } from '../../types/redux';

interface IProps extends IApiState {
  privateApiRequested: typeof privateApiRequested;
}

export class PrivateApi extends React.Component<IProps, any> {
  public render() {
    const { error, inProgress, result } = this.props;

    const ResultComponent =
      !error && result ? (
        <Message success={true} header="Private Api Result" content={result} />
      ) : null;

    const ErrorComponent = error ? (
      <Message
        error={true}
        header="Error Accessing Private Api"
        content={error && error.message}
      />
    ) : null;

    return (
      <React.Fragment>
        <Button
          id="privateApi"
          onClick={this.props.privateApiRequested}
          loading={inProgress}
          disabled={inProgress}
        >
          Private Api
        </Button>
        {ResultComponent}
        {ErrorComponent}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...privateApiSelector(state),
});

export default connect(
  mapStateToProps,
  { privateApiRequested },
)(PrivateApi);

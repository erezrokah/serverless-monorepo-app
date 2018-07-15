import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Message } from 'semantic-ui-react';
import { publicApiRequested } from '../../actions/api';
import { publicApiSelector } from '../../selectors/api';
import { IApiState, IState as Store } from '../../types/redux';

interface IProps extends IApiState {
  publicApiRequested: typeof publicApiRequested;
}

export class PublicApi extends React.Component<IProps, any> {
  public render() {
    const { error, inProgress, result } = this.props;

    const ResultComponent =
      !error && result ? (
        <Message success={true} header="Public Api Result" content={result} />
      ) : null;

    const ErrorComponent = error ? (
      <Message
        error={true}
        header="Error Accessing Public Api"
        content={error && error.message}
      />
    ) : null;

    return (
      <React.Fragment>
        <Button
          id="privateApi"
          onClick={this.props.publicApiRequested}
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
  ...publicApiSelector(state),
});

export default connect(
  mapStateToProps,
  { publicApiRequested },
)(PublicApi);

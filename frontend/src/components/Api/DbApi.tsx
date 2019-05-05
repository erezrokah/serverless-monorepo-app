import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Message, InputOnChangeData } from 'semantic-ui-react';
import { dbCreateApiRequested } from '../../actions/api';
import { dbCreateApiSelector } from '../../selectors/api';
import { IApiState, IState as Store } from '../../types/redux';

interface IState {
  [key: string]: string;
}

interface IProps extends IApiState {
  dbCreateApiRequested: typeof dbCreateApiRequested;
}

interface IEventProps extends InputOnChangeData {
  name: string;
}

export class DbApi extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { text: '' };
  }

  public render() {
    const { text } = this.state;
    const { error, inProgress, result } = this.props;
    return (
      <Form
        onSubmit={this.onFileSave}
        loading={inProgress}
        error={!!error}
        success={!!result}
      >
        <Form.Group>
          <Form.Input
            placeholder="Todos item text"
            name="text"
            type="text"
            value={text}
            onChange={this.handleChange}
            required={true}
            id="dbApi"
          />

          <Button content="Save Todos Item" />
        </Form.Group>
        <Message success={true} header="Todos Api Result" content={result} />
        <Message
          error={true}
          header="Error Saving File"
          content={error && error.message}
        />
      </Form>
    );
  }

  private handleChange = (
    _: React.SyntheticEvent<HTMLInputElement, Event>,
    data: InputOnChangeData,
  ) => {
    const { name, value } = data as IEventProps;
    this.setState({ [name]: value });
  };

  private onFileSave = () => this.props.dbCreateApiRequested(this.state.text);
}

const mapStateToProps = (state: Store) => ({
  ...dbCreateApiSelector(state),
});

export default connect(
  mapStateToProps,
  { dbCreateApiRequested },
)(DbApi);

import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Message, InputOnChangeData } from 'semantic-ui-react';
import { emailApiRequested } from '../../actions/api';
import { emailApiSelector } from '../../selectors/api';
import { IApiState, IState as Store } from '../../types/redux';

interface IState {
  [key: string]: string;
}

interface IProps extends IApiState {
  emailApiRequested: typeof emailApiRequested;
}

interface IEventProps {
  name: string;
  value: string;
}

export class EmailApi extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { email: '' };
  }

  public render() {
    const { email } = this.state;
    const { error, inProgress, result } = this.props;
    return (
      <Form
        onSubmit={this.onEmailSend}
        loading={inProgress}
        error={!!error}
        success={!!result}
      >
        <Form.Group>
          <Form.Input
            placeholder="Destination Email"
            name="email"
            type="email"
            value={email}
            onChange={this.handleChange}
            required={true}
            id="emailApi"
          />
          <Button content="Send Email" />
        </Form.Group>
        <Message success={true} header="Email Api Result" content={result} />
        <Message
          error={true}
          header="Error Sending Email"
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

  private onEmailSend = () => this.props.emailApiRequested(this.state.email);
}

const mapStateToProps = (state: Store) => ({
  ...emailApiSelector(state),
});

export default connect(
  mapStateToProps,
  { emailApiRequested },
)(EmailApi);

import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Segment } from 'semantic-ui-react';
import {
  emailApiRequested,
  privateApiRequested,
  publicApiRequested,
} from '../../actions/api';

interface IState {
  [key: string]: string;
}

interface IProps {
  emailApiRequested: typeof emailApiRequested;
  privateApiRequested: typeof privateApiRequested;
  publicApiRequested: typeof publicApiRequested;
}

interface IEventProps {
  name: string;
  value: string;
}

export class Api extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { email: '' };
  }

  public render() {
    const { email } = this.state;
    return (
      <Segment>
        <Form id="apiForm" onSubmit={this.onEmailSend}>
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
        </Form>
        <Button id="publicApi" onClick={this.props.publicApiRequested}>
          Public Api
        </Button>
        <Button id="privateApi" onClick={this.props.privateApiRequested}>
          Private Api
        </Button>
      </Segment>
    );
  }

  private handleChange = (
    _: React.SyntheticEvent,
    { name, value }: IEventProps,
  ) => this.setState({ [name]: value });

  private onEmailSend = () => this.props.emailApiRequested(this.state.email);
}

export default connect(
  null,
  { emailApiRequested, privateApiRequested, publicApiRequested },
)(Api);

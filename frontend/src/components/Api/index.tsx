import * as React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { emailApi, privateApi, publicApi } from '../../lib/api';

interface IState {
  [key: string]: string;
}

interface IEventProps {
  name: string;
  value: string;
}

class Api extends React.Component<any, IState> {
  constructor(props: any) {
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
              placeholder="Email"
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
        <Button id="publicApi" onClick={publicApi}>
          Public Api
        </Button>
        <Button id="privateApi" onClick={privateApi}>
          Private Api
        </Button>
      </Segment>
    );
  }

  private handleChange = (
    _: React.SyntheticEvent,
    { name, value }: IEventProps,
  ) => this.setState({ [name]: value });

  private onEmailSend = () => emailApi(this.state.email);
}

export default Api;

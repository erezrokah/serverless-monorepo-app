import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedAuthReduxProps } from 'redux-auth-wrapper/history4/redirect';
import { Button, Segment } from 'semantic-ui-react';
import { loginRequested as login } from '../../actions/auth';

interface IProps extends InjectedAuthReduxProps {
  login: typeof login;
}

export class Login extends React.Component<IProps, any> {
  public render() {
    return (
      <Segment>
        <Button onClick={this.login}>Log in</Button>
      </Segment>
    );
  }

  private login = () => {
    this.props.login();
  };
}

export default connect(
  null,
  { login },
)(Login);

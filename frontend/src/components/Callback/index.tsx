import { replace } from 'connected-react-router';
import * as React from 'react';
import { connect } from 'react-redux';
import { loginFulfilled, loginRejected } from '../../actions/auth';
import { handleAuthentication } from '../../lib/auth';
import { paths } from '../../routes';
import Loading from '../Loading';

interface IProps {
  loginFulfilled: typeof loginFulfilled;
  loginRejected: typeof loginRejected;
  replace: typeof replace;
}

export class Callback extends React.Component<IProps, any> {
  public async componentDidMount() {
    try {
      const authResult = await handleAuthentication();
      this.props.loginFulfilled(authResult);
      this.props.replace(authResult.state || paths.public);
    } catch (err) {
      this.props.loginRejected(err);
      this.props.replace(paths.login);
    }
  }

  public render() {
    return <Loading />;
  }
}

export default connect(
  null,
  { loginFulfilled, loginRejected, replace },
)(Callback);

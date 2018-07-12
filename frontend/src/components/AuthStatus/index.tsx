import * as React from 'react';
import { connect } from 'react-redux';
import { Button, Segment } from 'semantic-ui-react';
import { logoutRequested as logout } from '../../actions/auth';
import { isAuthenticated } from '../../selectors/auth';
import { IState } from '../../types/redux';

interface IStoreProps {
  authenticated: boolean;
}

interface IProps extends IStoreProps {
  logout: typeof logout;
}

export const AuthStatus: React.SFC<IProps> = props => {
  if (props.authenticated) {
    return (
      <Segment>
        <Button onClick={props.logout}>Sign out</Button>
      </Segment>
    );
  } else {
    return <Segment>You are not logged in.</Segment>;
  }
};

const mapStateToProps = (state: IState): IStoreProps => ({
  authenticated: isAuthenticated(state),
});

export default connect(
  mapStateToProps,
  { logout },
)(AuthStatus);

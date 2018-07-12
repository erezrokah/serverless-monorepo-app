import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Switch } from 'react-router-dom';
import { Container, Segment } from 'semantic-ui-react';
import { syncAuthStateRequested as syncAuthState } from './actions/auth';
import Api from './components/Api';
import AuthStatus from './components/AuthStatus';
import Loading from './components/Loading';
import { paths, routes } from './routes';
import { isInitialized } from './selectors/auth';
import { pathnameSelector } from './selectors/router';
import { IState } from './types/redux';

interface IStoreProps {
  initialized: boolean;
  pathname: string;
}

interface IProps extends IStoreProps {
  syncAuthState: typeof syncAuthState;
}

export class App extends React.Component<IProps, any> {
  public componentDidMount() {
    this.props.syncAuthState();
  }

  public render() {
    if (!this.props.initialized) {
      return (
        <Container>
          <Loading />
        </Container>
      );
    }
    return (
      <Container>
        <div style={{ width: 1000, margin: '0 auto' }}>
          <Segment>
            <ul>
              <li>
                <Link to={paths.public}> Public Page </Link>
              </li>
              <li>
                <Link to={paths.private}> Private Private </Link>
              </li>
            </ul>
          </Segment>
          <Switch>
            {routes.Home}
            {routes.Public}
            {routes.Private}
            {routes.Login}
            {routes.Callback}
            {routes.NotFound}
          </Switch>
          <AuthStatus />
          <Api />
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  initialized: isInitialized(state),
  pathname: pathnameSelector(state),
});

export default connect(
  mapStateToProps,
  { syncAuthState },
)(App);

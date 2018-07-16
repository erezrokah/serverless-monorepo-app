import * as React from 'react';
import { connect } from 'react-redux';
import { Link, Switch } from 'react-router-dom';
import { Container, List, Segment } from 'semantic-ui-react';
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
    const { pathname } = this.props;
    return (
      <Container>
        <Segment>
          <List link={true}>
            <List.Item
              as={Link}
              to={paths.public}
              active={pathname === paths.public}
            >
              Public Page
            </List.Item>
            <List.Item
              as={Link}
              to={paths.private}
              active={pathname === paths.private}
            >
              Private Page
            </List.Item>
          </List>
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

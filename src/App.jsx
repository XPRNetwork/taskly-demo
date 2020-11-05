import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import {
  HomeContainer,
  AccountContainer,
  TasksContainer,
} from './pages';
import ProtonSDK from './utils/proton';
import './App.sass';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actor: '',
      permission: '',
      session: '',
      accountData: {}
    };
  }

  componentDidMount = async ()  => { 
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = async () => {
    const { auth, accountData } = await ProtonSDK.restoreSession();
    if (auth && auth.actor && auth.permission) {
      this.setLoggedInState(auth.actor, auth.permission, accountData);
    }
  }

  setLoggedInState = async (actor, permission, accountData) => {
    const { history } = this.props;
    this.setState({ actor, permission, accountData });
    if (!window.location.href.includes('/account') && !window.location.href.includes('/tasks')) {
      history.push('/account');
    }
  }

  logout = async () => {
    const { accountData } = this.state;
    const { history } = this.props;
    if (accountData && accountData.acc) {
      await ProtonSDK.logout();
      this.setState({ actor: '', accountData: {}, session: '' });
    }

    history.push('/');
  }

  render() {
    const { accountData, actor, permission } = this.state;
    const { history, location } = this.props;
    
    return (
      <Switch>
        <Route path="/tasks" render={() => <TasksContainer accountData={accountData} logout={this.logout} permission={permission} actor={actor} />} />
        <Route path="/account" render={() => <AccountContainer location={location} accountData={accountData} actor={actor} permission={permission} logout={this.logout} history={history} />} />
        <Route path="/" render={() => <HomeContainer setLoggedInState={this.setLoggedInState} />} />
      </Switch>
    );
  }
}

export default withRouter(App);

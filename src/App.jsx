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
    if (auth.actor && auth.permission) {
      this.setLoggedInState(auth.actor, auth.permission, accountData);
    }
  }

  setLoggedInState = async (actor, permission, accountData) => {
    this.setState({ actor, permission, accountData });
    if (!window.location.href.includes('/account') && !window.location.href.includes('/tasks')) {
      if (this.isPageHidden()) {
        window.onfocus = this.loadAccountsPage;
      } else {
        this.loadAccountsPage();
      }
    }
  }

  isPageHidden = () => {
    return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
  }

  loadAccountsPage = () => {
    const { history } = this.props;
    history.push('/account');
    window.onfocus = null;
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
        <Route path="/account" render={() => <AccountContainer location={location} accountData={accountData} actor={actor} permission={permission} logout={this.logout} history={history} isPageHidden={this.isPageHidden}/>} />
        <Route path="/" render={() => <HomeContainer setLoggedInState={this.setLoggedInState} />} />
      </Switch>
    );
  }
}

export default withRouter(App);

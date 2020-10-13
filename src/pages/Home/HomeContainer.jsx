import React from 'react';
import Home from './Home';
import ProtonSDK from '../../utils/proton';

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: 0,
    }
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth)
  }

  updateWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  }

  generateLoginRequest = async () =>  {
    const { setLoggedInState } = this.props;
    try {
      this.setState({ isLoggingIn: true });
      const { auth, accountData } = await ProtonSDK.login();
      setLoggedInState(auth.actor, auth.permission, accountData);
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { windowWidth } = this.state;

    return(
      <Home openLoginModal={this.generateLoginRequest} windowWidth={windowWidth} />
    );
  }
}

export default HomeContainer;

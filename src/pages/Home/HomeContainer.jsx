import React from "react";
import Home from "./Home";
import ProtonSDK from "../../utils/proton";

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      windowWidth: 0,
      error: '',
    };
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener("resize", this.updateWindowWidth);
    /* istanbul ignore next */
    document.addEventListener("backToSelector", () => {
      this.generateLoginRequest();
    });
  }

  updateWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  setErrorState = (error) => {
    this.setState({ error: error.toString() });
  }

  /* istanbul ignore next */
  generateLoginRequest = async () => {
    const { setLoggedInState } = this.props;
    const { auth, accountData, error } = await ProtonSDK.login();
    if (error) {
      console.log(error);
      this.setErrorState(error);
    } else if (auth && auth.actor && auth.permission) {
      setLoggedInState(auth.actor, auth.permission, accountData);
    }
  };

  render() {
    const { windowWidth, error } = this.state;

    return (
      <Home
        openLoginModal={this.generateLoginRequest}
        windowWidth={windowWidth}
        error={error}
      />
    );
  }
}

export default HomeContainer;

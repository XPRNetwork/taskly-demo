import { ConnectWallet } from '@protonprotocol/proton-web-sdk'
import TasklyLogo from '../taskly-logo.svg'

class ProtonSDK {
  constructor() {
    this.chainId = process.env.REACT_APP_CHAIN_ID;
    this.endpoints = [process.env.REACT_APP_CHAIN_ENDPOINT]; // Multiple for fault tolerance
    this.appName = "Taskly";
    this.requestAccount = "taskly"; // optional
    this.session = null;
    this.link = null;
  }

  login = async () => {
    try {
      this.link = await ConnectWallet({
        linkOptions: { chainId: this.chainId, endpoints: this.endpoints },
        transportOptions: { requestAccount: this.requestAccount, backButton: true },
        selectorOptions: { appName: this.appName,appLogo: TasklyLogo}
      });
      const { session } = await this.link.login(this.requestAccount);

      this.session = session;
      localStorage.setItem('savedUserAuth', JSON.stringify(session.auth));
      return { auth: session.auth, accountData: session.accountData[0] };
    } catch (e) {
      return e;
    }
  };

  sendTransaction = async (actions) => {
    try {
      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );
      return result;
    } catch (e) {
      return e;
    }
  };

  logout = async () => {
    await this.link.removeSession(this.appName, this.session.auth);
    localStorage.removeItem("savedUserAuth");
  };

  restoreSession = async () => {
    const savedUserAuth = JSON.parse(localStorage.getItem("savedUserAuth"));
    if (savedUserAuth) {
      try {
        this.link = await ConnectWallet({
          linkOptions: { chainId: this.chainId, endpoints: this.endpoints},
          transportOptions: { requestAccount: this.requestAccount, backButton: true },
          selectorOptions: { appName: this.appName, appLogo: TasklyLogo, showSelector: false}
        });
        const result = await this.link.restoreSession(this.requestAccount, savedUserAuth);
        if (result) {
          this.session = result;
          return { auth: this.session.auth, accountData: this.session.accountData[0] };
        }
      } catch(e) {
        return e;
      }
    }
    return { auth: { actor: "", permission: "" }, accountData: {} };
  };
}

const protonSDK = new ProtonSDK();
export default protonSDK;
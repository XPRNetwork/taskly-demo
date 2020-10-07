import { ConnectProton } from '@protonprotocol/proton-web-sdk'

class ProtonSDK {
  constructor() {
    this.chainId = process.env.REACT_APP_CHAIN_ID;
    this.endpoints = [process.env.REACT_APP_CHAIN_ENDPOINT]; // Multiple for fault tolerance
    this.appName = 'Taskly';
    this.requestAccount = 'taskly'; // optional
    this.session = null;
    this.link = null;
  }

  login = async () => {
    this.link = ConnectProton({ chainId: this.chainId, endpoints: this.endpoints, scheme: process.env.REACT_APP_SCHEME }, { requestAccount: this.requestAccount });
    try {
      const { session } = await this.link.login(this.appName);
      this.session = session;
      localStorage.setItem('savedUserAuth', JSON.stringify(session.auth));
      return { auth: session.auth, accountData: session.accountData[0] };
    } catch (e) {
      return e;
    }
  }

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
  }

  logout = async () => {
    await this.link.removeSession(this.appName, this.session.auth);
    localStorage.removeItem('savedUserAuth');
  }

  restoreSession = async () => {
    const savedUserAuth = JSON.parse(localStorage.getItem('savedUserAuth'));
    if (savedUserAuth) {
      this.link = ConnectProton({ chainId: this.chainId, endpoints: this.endpoints, scheme: process.env.REACT_APP_SCHEME }, { requestAccount: this.requestAccount });
      const result = await this.link.restoreSession(this.appName, savedUserAuth);
      if (result) {
        this.session = result;
        return { auth: this.session.auth, accountData: this.session.accountData[0] };
      }
    }
    return { auth: { actor: '', permission: '' }, accountData: {}};
  }
}

const protonSDK = new ProtonSDK();
export default protonSDK;
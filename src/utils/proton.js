import { ConnectWallet } from '@protonprotocol/proton-web-sdk'
import TasklyLogo from '../taskly-logo.svg'

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
    try {
      const { link, session } = await ConnectWallet({
        linkOptions: { chainId: this.chainId, endpoints: this.endpoints },
        transportOptions: { requestAccount: this.requestAccount, backButton: true },
        selectorOptions: { appName: this.appName,appLogo: TasklyLogo}
      });
      this.link = link;
      this.session = session;

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
    await this.link.removeSession(this.requestAccount, this.session.auth);
  }

  restoreSession = async () => {
    try {
      const { link, session } = await ConnectWallet({
        linkOptions: { chainId: this.chainId, endpoints: this.endpoints, restoreSession: true},
        transportOptions: { requestAccount: this.requestAccount },
        selectorOptions: { appName: this.appName, appLogo: TasklyLogo, showSelector: false}
      });
      this.link = link;
      this.session = session;

      if (session) {
        return { auth: this.session.auth, accountData: this.session.accountData[0] };
      } else {
        return { auth: { actor: '', permission: '' }, accountData: {}};
      }
    } catch(e) {
      return e;
    }
  }
}

const protonSDK = new ProtonSDK();
export default protonSDK;
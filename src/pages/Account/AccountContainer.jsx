import React from 'react';
import PropTypes from 'prop-types';
import Account from './Account';
import ProtonSDK from '../../utils/proton';

class AccountContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      completedTasks: [
        'Filed your tax return',
        'Organized all your contacts',
        'Contact DMV about updating tags',
        'Sent a request to your building manager',
      ]
    }
  }

  openConfirmModal = async () => {
    const { actor, permission, history } = this.props;
    try {
      const actions = [{
        account: 'xtokens',
        name: 'transfer',
        authorization: [{
          actor: actor,
          permission: permission
        }],
        data: {
            from: actor,
            to: ProtonSDK.requestAccount,
            quantity: '5.000000 FOOBAR',
            memo: 'Taskly'
        }
      }];
      const tx = await ProtonSDK.sendTransaction(actions);
      if (tx.processed.id) {
        history.push('/tasks');
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { completedTasks } = this.state;
    const { accountData, logout } = this.props;

    return(
      <Account openConfirmModal={this.openConfirmModal} completedTasks={completedTasks} accountData={accountData} logout={logout} />
    );
  }
}

AccountContainer.propTypes = {
  accountData: PropTypes.shape(),
  permission: PropTypes.string,
  actor: PropTypes.string,
  logout: PropTypes.func.isRequired,
};

AccountContainer.defaultProps = {
  accountData: {},
  permission: '',
  actor: '',
};

export default AccountContainer;

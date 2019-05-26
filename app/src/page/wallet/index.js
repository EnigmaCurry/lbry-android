import { connect } from 'react-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { doPushDrawerStack, doSetPlayerVisible } from 'redux/actions/drawer';
import { selectBalance } from 'lbry-redux';
import { doCheckSync, doGetSync, selectUser, selectHasSyncedWallet } from 'lbryinc';
import Constants from 'constants';
import WalletPage from './view';

const select = state => ({
  user: selectUser(state),
  balance: selectBalance(state),
  hasSyncedWallet: selectHasSyncedWallet(state),
  understandsRisks: makeSelectClientSetting(Constants.SETTING_ALPHA_UNDERSTANDS_RISKS)(state),
  backupDismissed: makeSelectClientSetting(Constants.SETTING_BACKUP_DISMISSED)(state),
  rewardsNotInterested: makeSelectClientSetting(Constants.SETTING_REWARDS_NOT_INTERESTED)(state),
});

const perform = dispatch => ({
  checkSync: () => dispatch(doCheckSync()),
  getSync: password => dispatch(doGetSync(password)),
  setClientSetting: (key, value) => dispatch(doSetClientSetting(key, value)),
  pushDrawerStack: () => dispatch(doPushDrawerStack(Constants.DRAWER_ROUTE_WALLET)),
  setPlayerVisible: () => dispatch(doSetPlayerVisible(false))
});

export default connect(select, perform)(WalletPage);

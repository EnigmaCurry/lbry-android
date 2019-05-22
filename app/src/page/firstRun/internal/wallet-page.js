import React from 'react';
import { Lbry } from 'lbry-redux';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  NativeModules,
  Platform,
  Text,
  TextInput,
  View
} from 'react-native';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from 'styles/colors';
import Constants from 'constants';
import firstRunStyle from 'styles/firstRun';

class WalletPage extends React.PureComponent {
  state = {
    password: null,
    placeholder: 'password',
    statusTries: 0,
    walletReady: false,
    hasCheckedSync: false
  };

  componentDidMount() {
    this.checkWalletReady();
    this.props.checkSync();
    setTimeout(() => this.setState({ hasCheckedSync: true}), 1000);
  }

  checkWalletReady = () => {
    // make sure the sdk wallet component is ready
    Lbry.status().then(status => {
      if (status.startup_status && status.startup_status.wallet) {
        this.setState({ walletReady: true });
        return;
      }
      setTimeout(this.checkWalletReady, 1000);
    }).catch((e) => {
      console.log(e);
      setTimeout(this.checkWalletReady, 1000);
    });
  }

  handleChangeText = (text) => {
    // save the value to the state email
    const { onPasswordChanged } = this.props;
    this.setState({ password: text });
    if (onPasswordChanged) {
      onPasswordChanged(text);
    }

    if (NativeModules.UtilityModule) {
      NativeModules.UtilityModule.setSecureValue(Constants.KEY_FIRST_RUN_PASSWORD, text);
      // simply set any string value to indicate that a passphrase was set on first run
      AsyncStorage.setItem(Constants.KEY_FIRST_RUN_PASSWORD, "true");
    }
  }

  render() {
    const { onPasswordChanged, onWalletViewLayout, isRetrievingSync, hasSyncedWallet } = this.props;

    let content;
    if (!this.state.walletReady || !this.state.hasCheckedSync || isRetrievingSync) {
      content = (
        <View>
          <ActivityIndicator size="large" color={Colors.White} style={firstRunStyle.waiting} />
            <Text style={firstRunStyle.paragraph}>Retrieving your account information...</Text>
        </View>
      );
    } else {
      content = (
        <View onLayout={onWalletViewLayout}>
          <Text style={firstRunStyle.title}>Password</Text>
          <Text style={firstRunStyle.paragraph}>
            {hasSyncedWallet ? "Please enter the password you used to secure your wallet." :
            "Please enter a password to secure your account and wallet."}
          </Text>
          <TextInput style={firstRunStyle.passwordInput}
            placeholder={this.state.placeholder}
            underlineColorAndroid="transparent"
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={text => this.handleChangeText(text)}
            onFocus={() => {
              if (!this.state.password || this.state.password.length === 0) {
                this.setState({ placeholder: '' });
              }
            }}
            onBlur={() => {
              if (!this.state.password || this.state.password.length === 0) {
                this.setState({ placeholder: 'password' });
              }
            }}
            />
            {(this.state.password && this.state.password.trim().length) > 0 &&
              <View style={firstRunStyle.passwordStrength}>
                <BarPasswordStrengthDisplay
                  width={Dimensions.get('window').width - 80}
                  minLength={1}
                  password={this.state.password} />
              </View>}
          <Text style={firstRunStyle.infoParagraph}>Note: for wallet security purposes, LBRY is unable to reset your password.</Text>
        </View>
      );
    }

    return (
      <View style={firstRunStyle.container}>
        {content}
      </View>
    );
  }
}

export default WalletPage;

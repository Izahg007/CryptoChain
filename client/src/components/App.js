import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Blocks from './Transactions';
import logo from '../resources/logo-no-background.png';
import ConductTransaction from './ConductTransaction';
import MyNav from './MyNavBar';

class App extends Component {
    state = {
        walletInfo: {},
    };

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { address, balance } = this.state.walletInfo;
        return (
            <div>
                <MyNav />
                <div className='subbody'>
                    <div className="logo-container">
                        <img src={logo} className='logo'></img>
                        <div className='logo-text'><h1>Future of Cryptocurrency</h1></div>
                    </div>

                    <div className="WalletInfo">
                        <div ><b>Address:</b> <span className="addr">{address}</span></div>
                        <div> <b>Balance:</b> {balance}</div>
                    </div>
                    <br />
                    <Blocks />
                </div>
            </div>
        );
    }
}

export default App;
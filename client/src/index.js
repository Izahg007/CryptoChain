import React from 'react';
import {render} from 'react-dom';
import {Router, Switch, Route} from 'react-router-dom';
import history from './history';
import App from './components/App';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import './index.css';

render(
<Router history={history}>
    <Switch>
        <Route exact path='/' component={App} />
        <Route path='/conductTx' component={ConductTransaction} />
        <Route path='/mine' component={TransactionPool} />
    </Switch>
</Router>,
document.getElementById('root')
);
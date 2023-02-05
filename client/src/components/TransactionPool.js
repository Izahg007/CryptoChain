import React, { Component } from 'react';
import Transaction from './Transaction';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch('http://localhost:3000/api/transaction-pool-map')
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    mineTransaction = () => {
        fetch('http://localhost:3000/api/mine-transactions')
        .then(response => {
            if(response.status === 200){
                alert('Success');
            } else {
                alert('Error '+response);
                console.log(response);
            }
        });
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();
    }

    render() {
        return (
            <div className='subbody2'>
                <Link to='/'><h3>←</h3></Link>
                <div className='TransactionPool'>
                    <h3>Unverified Transaction</h3>
                    {
                        Object.values(this.state.transactionPoolMap).map(transaction => {
                            return (
                                <div key={transaction.id}>
                                    <hr />
                                    <Transaction transaction={transaction} />
                                </div>
                            )
                        })
                    }
                    <br />
                    <Button
                        bsstyle='Primary'
                        onClick={this.mineTransaction}
                    >Mine Transactions</Button>
                </div>
            </div>
        );
    }
}

export default TransactionPool;

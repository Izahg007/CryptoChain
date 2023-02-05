import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import MyNav from './MyNavBar';
import {Link} from 'react-router-dom';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0 };

    updateRecipient = e => {
        this.setState({ recipient: e.target.value });
    }
    updateAmount = e => {
        this.setState({ amount: Number(e.target.value) });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;
    
        fetch('http://localhost:3000/api/transact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
          .then(json => {
            alert(json.message || json.type);
          });
      }

    render() {
        return (
            <div>
                <div className='subbody2'>
                <Link to='/'><h3>←</h3></Link>
                    <h1 style={{ textAlign: 'center' }}>Conduct A Transaction</h1>
                    <div className="ConductTransaction">
                        <FormGroup>
                            <FormControl
                                input='text'
                                placeholder='recipient'
                                value={this.state.recipient}
                                onChange={this.updateRecipient}
                            />
                        </FormGroup>
                        <br />
                        <FormGroup>
                            <FormControl
                                input='number'
                                placeholder='amount'
                                value={this.state.amount}
                                onChange={this.updateAmount}
                            />
                        </FormGroup>
                        <br />
                        <div>
                            <Button 
                            bsstyle="Primary" 
                            onClick={this.conductTransaction}
                            >Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ConductTransaction;
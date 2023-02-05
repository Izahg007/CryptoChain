import React, {Component} from 'react';

class Blocks extends Component{
    state = {Tx : []};
    componentDidMount(){
        fetch('http://localhost:3000/api/recentTx')
        .then (response => response.json())
        .then (json => this.setState({Tx : json}));
    }
    render(){
        return (
            <div>
                <h1>Recent Transactions</h1>
                {
                    this.state.Tx.map(tx => {
                        return (
                        <div key={tx.id} className="transactions">
                            <div ><b>Id</b> :{tx.id}</div>
                            <div> <b>Input</b> :<span className="addr">{tx.input.address}</span></div>
                            <div> <b>OutputMap</b>: {JSON.stringify(tx.outputMap).replace(/[{()}"]/g, '')}</div>
                            <hr />
                        </div>
                        );
                    })
                }
            </div>
        )
    }
}
export default Blocks;
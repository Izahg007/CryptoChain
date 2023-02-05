class recentTx {
    constructor() {
        this.recentTransactions = [
            { 
                id: 'dummy-id',
                outputMap: {
                    address: 'dummy-addr',
                    amount : 1000
                },
                input:{
                    address:'dummy-input'
                }
            }
        ];
    }
    getTransactions(transactions) {
        if (this.recentTransactions.length <= 8) {
            this.recentTransactions.unshift(transactions[0]);
            this.recentTransactions.unshift(transactions[1]);
        } else {
            this.recentTransactions.pop();
            this.recentTransactions.pop();
            this.recentTransactions.unshift(transactions[0]);
            this.recentTransactions.unshift(transactions[1]);
        }
    }
}



module.exports = recentTx;
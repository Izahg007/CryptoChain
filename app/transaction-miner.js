const Transaction = require('../wallet/transaction');
const recentTx = require('./recentTx');

class TransactionMiner {
  constructor({ blockchain, transactionPool, wallet, pubsub, recent }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
    this.recent = recent;
  }
  mineTransactions() {
    // get the transaction pool's valid transactions
    const transactions = this.transactionPool.getValidTransactions();
    // generate the miner's reward
    transactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );
    // add a block consisting of these transactions to the blockchain
    this.blockchain.addBlock({ data: transactions });
    this.recent.getTransactions(transactions);
    // broadcast the updated blockchain
    this.pubsub.broadcastChain();
    // clear the pool
    this.transactionPool.clear();
  }
}

module.exports =TransactionMiner;
const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }
    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        //checking if the chain starts with genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (var i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, data, difficulty, nonce } = chain[i];

            const actualLastHash = chain[i - 1].hash;
            const lastDifficulty = chain[i - 1].difficulty;

            //checking for the lastHash validation
            if (lastHash !== actualLastHash) return false;

            //checking for the data integrity
            const validatedHash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
            if (hash !== validatedHash) return false;

            //checking for jump in difficulty
            if ((lastDifficulty - difficulty) > 1) return false;

        }

        return true;
    }



    replaceChain(chain, onSuccess) {
        const currentChainLength = this.chain.length;
        //we replace the chain only if the chain is longer and valid
        if (chain.length <= currentChainLength) {
            console.error('Incoming chain is shorter than current chain');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('Incoming chain is not valid')
            return;
        }

        if (onSuccess) onSuccess();
        console.log('Replacing the chain with', chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const transactionSet = new Set();
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards exceeds limit');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error('Invalid input amount');
                        return false;
                    }
                    if (transactionSet.has(transaction)) {
                        console.error('An identical transaction appears more than once in the block');
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }
        }

        return true;
    }
}

module.exports = Blockchain;
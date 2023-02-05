const Blockchain = require('./index');
const Block = require('./block');
const {cryptoHash} = require('../util/');

describe('Blockchain', ()=>{
    let blockchain, newChain, originalChain;
    beforeEach( ()=>{
        blockchain = new Blockchain();
        newChain = new Blockchain();

        originalChain = blockchain.chain;
    });
    it('contains a `chain` Array instance',()=>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });
    it('starts with a genesis block',()=>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });
    it('adds a new block to the chain',()=>{
        const newData = 'foobar';
        blockchain.addBlock({
            data: newData
        });
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()',()=>{

        describe('when the chain does not start with the genesis block',() => {

            it('returns a false value',()=>{
                blockchain.chain[0] = { data:'fake-genesis-block' };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });

        });

        describe('when the chain starts with the genesis block and has multiple blocks',()=>{
            
            beforeEach( ()=>{
                blockchain.addBlock({data:'Bears'});
                blockchain.addBlock({data:'Grylls'});
                blockchain.addBlock({data:'Battlestar Galactica'});
            });

            describe('and a lastHash reference has changed',() => {

                it('it returns false',()=>{
                    blockchain.chain[2].lastHash = 'broken-hashes';
                    
                    //expect the value to be false
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with an invalid field',()=>{

                it('it returns false',()=>{
                    blockchain.chain[2].data = '<some-evil-data-inserted>';
                    
                    //expect the value to be false
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain contains a block with a jumped difficulty', ()=>{
                it('returns false',()=>{
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = cryptoHash(lastHash, timestamp, nonce, data, difficulty);
                    const badBlock = new Block({
                        timestamp, lastHash, data, nonce, difficulty, hash
                    });
                    blockchain.chain.push(badBlock);
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the block does not contains any invalid block',()=>{

                it('it returns true',()=>{

                    //expect the value to be true
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });

        });
    });

    describe('replaceChain()', () => {
        let errorMock, logMock;
        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe('when the new chain is not longer',()=>{

            beforeEach(()=>{
                newChain.chain[0] = {new : 'chain'};
                blockchain.replaceChain(newChain.chain);
            });

            it('it does not get replaced',()=>{
                expect(blockchain.chain).toEqual(originalChain);
            });
            it('logs an error',()=>{
                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('when the chain is longer',()=>{

            beforeEach( ()=>{
                newChain.addBlock({data:'Bears'});
                newChain.addBlock({data:'Grylls'});
                newChain.addBlock({data:'Battlestar Galactica'});
            });

            describe('and the chain is invalid',()=>{
                beforeEach(()=>{
                    newChain.chain[2].hash = 'some-fake-hash';
                    blockchain.replaceChain(newChain.chain);
                });
                it('does not replaces the chain',()=>{
                    expect(blockchain.chain).toEqual(originalChain);
                });

                it('logs an error',()=>{
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe('and the chain is valid',()=>{
                beforeEach(()=>{
                    blockchain.replaceChain(newChain.chain);
                });
                it('replaces the chain',()=>{
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
                it('it logs a message',()=>{
                    expect(logMock).toHaveBeenCalled();
                });
            });
        })
    });
});

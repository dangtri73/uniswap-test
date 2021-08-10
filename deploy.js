const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'pear upper coffee winter language silent become curious frame finish question regular',
    'https://rinkeby.infura.io/v3/60987efd72db4f10b52ab0c8545ab9bb'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hi there!'] })
        .send({gas: '1000000', from: accounts[0]});
    console.log('Contract deploy to', result.options.address);
};
deploy();
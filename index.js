
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'pear upper coffee winter language silent become curious frame finish question regular',
    'https://rinkeby.infura.io/v3/60987efd72db4f10b52ab0c8545ab9bb'
);
const Web3Client = new Web3(provider);

// const Web3Client = new Web3(new Web3.providers.HttpProvider(provider));

// The minimum ABI required to get the ERC20 Token balance
const minABI = [
    // balanceOf
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];
const tokenAddress = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
const walletAddress = "0x2e940Dbfa37A093Dc79c0b35b903613d00cEFE15";

// const contract = await new Web3Client.eth.Contract(JSON.parse(interface), tokenAddress);
// const contract = new Web3Client.eth.Contract(minABI, tokenAddress);

const getBalance = async () => {
    const contract = await new Web3Client.eth.Contract(minABI, tokenAddress);
    console.log(contract);
    const result = await contract.methods.balanceOf(walletAddress).call(); // 29803630997051883414242659

    //   const format = Web3Client.utils.fromWei(result); // 29803630.997051883414242659

    //   console.log(format);
}

getBalance();
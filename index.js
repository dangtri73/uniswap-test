const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const { ChainId, Token, TokenAmount, Pair } = require('@uniswap/sdk')

// const providerr = "https://mainnet.infura.io/v3/60987efd72db4f10b52ab0c8545ab9bb";
// const Web3Client = new Web3(new Web3.providers.HttpProvider(providerr));

const provider = new HDWalletProvider(
    'pear upper coffee winter language silent become curious frame finish question regular',
    'https://mainnet.infura.io/v3/60987efd72db4f10b52ab0c8545ab9bb'
);

const walletAddressRink = "0xFA3fBD05380E998C432515b299cf0157bE9C0c21";

const walletAddressMain = "0x1cf56Fd8e1567f8d663e54050d7e44643aF970Ce";

const wethAddressRink = "0xdf032bc4b9dc2782bb09352007d4c57b75160b15";
const usdtAddressRink = "0x01547ef97f9140dbdf5ae50f06b77337b95cf4bb";
const wbtcAddressRink = "0x5af59f281b3cfd0c12770e4633e6c16dd08ea543";

const wethAddressMain = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const usdtAddressMain = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const wbtcAddressMain = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

const minABI = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];
const web3 = new Web3(provider);

const getReserveETH = async () => {
    const reserve = await Web3Client.eth.getBalance(walletAddress);
    return reserve;
}

const getReserve = async (addressToken) => {
    const contract = await new web3.eth.Contract(minABI, addressToken);
    const value = await contract.methods.balanceOf(walletAddressMain).call();
    return value;
}

const calculate = async (inputWETH) => {
    // Calculate WETH -> USDT
    const wethAmount = inputWETH;
    const wethReserve = await getReserve(wethAddressMain);
    const usdtReserve = await getReserve(usdtAddressMain);

    const usdtAmout = (wethAmount * usdtReserve * 997) / (wethReserve * 1000 + wethAmount * 997);
}

const final = async () => {
    const a = await contract.methods.getTokenPrice("0x5308a481b2b65f6086083d2268acb73aadc757e0", "1234")
        .send({ from: "0xFA3fBD05380E998C432515b299cf0157bE9C0c21"});
    console.log(a);
}

deploy();

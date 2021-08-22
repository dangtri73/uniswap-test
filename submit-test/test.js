const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');
const {pairAbi} = require('../build/pair.json');
const {factoryAbi} = require('../build/factory.json')
const {pairq} = require('../build/wethToUsdt.json')

//Link to Mainnet
const providerr = "https://mainnet.infura.io/v3/60987efd72db4f10b52ab0c8545ab9bb";
const Web3Client = new Web3(new Web3.providers.HttpProvider(providerr));

// Pair Address
const wethToUsdt = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852";
const usdtToWbtc = "0x0DE0Fa91b6DbaB8c8503aAA2D1DFa91a192cB149";
const wbtcToWeth = "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940";

// Reserve Data
let pairWethUsdt;
let pairUsdtWbtc;
let pairWbtcWeth;

// Get Reserve from ABI
const getReserves = async (abi, pairAddress) => {
    const result = await new Web3Client.eth.Contract(abi, pairAddress)
    const reserves = await result.methods.getReserves().call()
    // console.log(reserves);
    return reserves;
}
const getAllReserves = async () => {
    pairWethUsdt = await getReserves(pairAbi, wethToUsdt);
    pairUsdtWbtc = await getReserves(pairAbi, usdtToWbtc);
    pairWbtcWeth = await getReserves(pairAbi, wbtcToWeth);
};

// Calculate Amount Output from Reserves
const calculateAmoutOutput = async (pair, inputAmout) => {
    reserve0 = pair.reserve0;
    console.log(reserve0);
    reserve1 = pair.reserve1;
    console.log(reserve1);
    const outputAmout = (inputAmout*reserve1*0.997)/(reserve0*1+inputAmout*0.997);
    console.log(outputAmout);
    return outputAmout;
}

const calculateAmoutOutputt = async (pair, inputAmout) => {
    reserve0 = pair.reserve1;
    console.log(reserve0);
    reserve1 = pair.reserve0;
    console.log(reserve1);
    const outputAmout = (inputAmout*reserve1*0.997)/(reserve0*1+inputAmout*0.997);
    console.log(outputAmout);
    return outputAmout;
}
/** Hàm chạy chương trình */
const deploy = async () => {
    await getAllReserves();
    const InputWETH = 111111;
    const usdtOutput = await calculateAmoutOutput(pairWethUsdt, InputWETH);
    const wbtcOutput = await calculateAmoutOutputt(pairUsdtWbtc, usdtOutput);
    const wethOutput = await calculateAmoutOutput(pairWbtcWeth, wbtcOutput);
    console.log("Amount WETH Input: ", InputWETH);
    console.log("Amount WETH Output: ", wethOutput);
}

deploy();
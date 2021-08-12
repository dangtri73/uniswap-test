const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const {pairAbi} = require('./build/pair.json');
const {factoryAbi} = require('./build/factory.json')
const {pairq} = require('./build/wethToUsdt.json')
const {BigNumber,FixedFormat,FixedNumber,formatFixed,parseFixed} = require("@ethersproject/bignumber");
const { ethers } = require("ethers");

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
    return reserves;
}
const getAllReserves = async () => {
    pairWethUsdt = await getReserves(pairAbi, wethToUsdt);
    pairUsdtWbtc = await getReserves(pairAbi, usdtToWbtc);
    pairWbtcWeth = await getReserves(pairAbi, wbtcToWeth);
};

// Calculate Amount Output from Reserves
const calculateAmoutOutput = async (pair, inputAmout) => {
    const reserve0BN = ethers.utils.parseEther(pair.reserve0.toString());
    const reserve1BN = ethers.utils.parseEther(pair.reserve1.toString());
    // const outputAmout = (inputAmout*reserve1*0.997)/(reserve0*1+inputAmout*0.997);
    const inputAmoutBN = inputAmout.mul(ethers.utils.parseEther("997")).div(ethers.utils.parseEther("1000"));
    const numerator = inputAmoutBN.mul(reserve1BN)
    const denominator = reserve0BN.add(inputAmoutBN)
    const outputAmountBN = numerator.div(denominator);
    console.log(ethers.utils.formatUnits(outputAmountBN));
    console.log("--------------------");
    return outputAmountBN;
}

const calculateAmoutOutputRevert = async (pair, inputAmout) => {
    const reserve0BN = ethers.utils.parseEther(pair.reserve1.toString());
    const reserve1BN = ethers.utils.parseEther(pair.reserve0.toString());
    // const outputAmout = (inputAmout*reserve1*0.997)/(reserve0*1+inputAmout*0.997);
    const inputAmoutBN = inputAmout.mul(ethers.utils.parseEther("997")).div(ethers.utils.parseEther("1000"));
    const numerator = inputAmoutBN.mul(reserve1BN)
    const denominator = reserve0BN.add(inputAmoutBN)
    const outputAmountBN = numerator.div(denominator);
    console.log(ethers.utils.formatUnits(outputAmountBN));
    console.log("--------------------");
    return outputAmountBN;
}

// Run program
const deploy = async () => {
    await getAllReserves();
    const InputWeth = "1111111111111"; // Need a string to change to BigNumer
    const InputWethBN = ethers.utils.parseEther(InputWeth);
    const usdtOutput = await calculateAmoutOutput(pairWethUsdt, InputWethBN);
    const wbtcOutput = await calculateAmoutOutputRevert(pairUsdtWbtc, usdtOutput);
    const wethOutput = await calculateAmoutOutput(pairWbtcWeth, wbtcOutput);
    console.log("Amount WETH Input: ", InputWeth);
    console.log("Amount WETH Output: ", ethers.utils.formatUnits(wethOutput));
}

deploy();
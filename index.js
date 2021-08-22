const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');
const {pairAbi} = require('./build/pair.json');
const {factoryAbi} = require('./build/factory.json')
const {pairq} = require('./build/wethToUsdt.json')

/** 
 * Connect to Mainnets
 * @function 
 * */
const providerr = "https://mainnet.infura.io/v3/60987efd72db4f10b52ab0c8545ab9bb";
const Web3Client = new Web3(new Web3.providers.HttpProvider(providerr));

/**
 * Pair Address
 * @constant {wethToUsdt, usdtToWbtc, wbtcToWeth}
 */
const wethToUsdt = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852";
const usdtToWbtc = "0x0DE0Fa91b6DbaB8c8503aAA2D1DFa91a192cB149";
const wbtcToWeth = "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940";

/**
 * Pair contain reserves
 * @constant {pairWethUsdt, pairUsdtWbtc, pairWbtcWeth}
 */
let pairWethUsdt;
let pairUsdtWbtc;
let pairWbtcWeth;

/** Get Reserve from ABI */ 
const getReserves = async (abi, pairAddress) => {
    const result = await new Web3Client.eth.Contract(abi, pairAddress)
    const reserves = await result.methods.getReserves().call()
    // console.log(reserves);
    return reserves;
}
/** Get Reserve from ABI */ 
const getAllReserves = async () => {
    pairWethUsdt = await getReserves(pairAbi, wethToUsdt);
    pairUsdtWbtc = await getReserves(pairAbi, usdtToWbtc);
    pairWbtcWeth = await getReserves(pairAbi, wbtcToWeth);
};

/** Calculate amount output */
const calculateAmoutOutput = async (dx) => {
    const x = pairWethUsdt.reserve0;
    const y = pairWethUsdt.reserve1;
    const z = pairUsdtWbtc.reserve0;
    const y1 = pairUsdtWbtc.reserve1;
    const z1 = pairWbtcWeth.reserve0;
    const t = pairWbtcWeth.reserve1;

    const dt = (t*z*y*dx*Math.pow(0.997, 3))/(z1*y1*x+(z1*y1*0.997+z1*y*Math.pow(0.997, 2)+z*y*Math.pow(0.997, 3))*dx);
    return dt;
}
/** Run program */
const deploy = async () => {
    await getAllReserves();
    const InputWETH = 111111;
    const OutputWETH = await calculateAmoutOutput(InputWETH);
    console.log("Amount WETH Input: ", InputWETH);
    console.log("Amount WETH Output: ", OutputWETH);
}

deploy();
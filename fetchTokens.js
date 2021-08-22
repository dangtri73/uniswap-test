const axios = require("axios");
const Web3 = require("web3");
const { abi } = require("./build/constant.js");
const api  = require("./graphQL.js")

const tokenSource = "https://tokens.coingecko.com/uniswap/all.json";
const endpoint =
  "https://eth-mainnet.alchemyapi.io/v2/V9Y0Sqci0_6sG1Xy4DWJT7WqfZWo6-7-";
const walletAddress = "0xFA3fBD05380E998C432515b299cf0157bE9C0c21";
const web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
let info = {
  blockNum: "",
  TxHash: "",
  from: "",
  to: "",
  value: "",
  tokenAddress: "",
  symbol: "",
  tokenName: "",
  balanceFrom: "",
  balanceTo: ""
}

const getAllTokens = async () => {
  try {
    const result = await axios.get(tokenSource, {
      headers: { "Content-Type": "application/json" },
    });
    return result.data;
  } catch (err) {
    console.log(err);
  }
};

// const convertToNumber = (hex, decimals) => {
//   const balance = Web3.utils.toBN(hex);
//   let balanceDecimal = balance;
//   if (decimals && balance.toLocaleString() === "0" && decimals < 20) {
//     balanceDecimal = balance.div(Web3.utils.toBN(10 ** decimals));
//   }
//   return balanceDecimal.toLocaleString();
// };

const getBalance = (addressToken) => {
  const contract = new web3.eth.Contract(abi, addressToken); // get Amount Token of Wallet
  const balance = contract.methods.balanceOf(walletAddress).call();
  return balance;
};

const getAllBalances = async () => {
  const { tokens, name } = await getAllTokens();
  for (let i = 0; i < tokens.length; i++) {
    let balances = [];
    let symbol = tokens[i].symbol;
    let tokensAddress = tokens[i].address;
    try {
      balance = await getBalance(tokensAddress);
      balances.push({ symbol: symbol, balance: balance });
      console.log({ symbol: symbol, balance: balance });
    } catch (error) {
      throw new Error(error.message);
    }
  }
  console.log(balances);
};

const getBlockNum = async () => {
  const blockNum = await web3.eth.getBlockNumber();
  console.log(blockNum);
  info.blockNum = blockNum-15000;
  return blockNum-15000;
}

const getAllTxOfBlock = async (blockNum) => {
  let block = await web3.eth.getBlock(blockNum);
  let count = 0;
  let txERC20 = [];
  for (let transactionIndex in block.transactions) {
    let transactionHash = block.transactions[transactionIndex];
    let transaction = await web3.eth.getTransaction(transactionHash);
    if (transaction.input.substr(0,10) == "0xa9059cbb") {
      txERC20.push(transaction);
      count++
      break;
      // console.log(transaction);
    }
  }
  info.TxHash = txERC20[0].hash
  info.from = txERC20[0].from
  return txERC20[0].hash;
}

const encrypt =  () => {
  const input = "0xa9059cbb000000000000000000000000538590c0821fd57ab9961fe7e63fe6eba252768b0000000000000000000000000000000000000000000000000000000279323356"
  let input_data = '0x' + input.slice(10);
  let params = web3.eth.abi.decodeParameters(['address', 'uint256'], input_data);
  // let params1 = web3.eth.abi.decodeParameter('uint256', '0x00000000000000000000000000000000000000000000003635c9adc5dea00000');
  // console.log((params1));
  info.to = params[0]
  info.value = params[1]
  return params;
}

const getTokenInfo = async () => {
  const apiGetTokenAddress = await new api(info.TxHash, null).transferInfoApi();
  const tokenAddress = apiGetTokenAddress.logs[0].address;
  info.tokenAddress = tokenAddress;
  // const apiGetTokenSymbol = await new api(null, tokenAddress).contractInfoApi();
  // const symbol = apiGetTokenSymbol
  const tokenContract = await new web3.eth.Contract(abi, tokenAddress);
  const tokenName = await tokenContract.methods.name().call();
  const tokenSymbol = await tokenContract.methods.symbol().call();
  // console.log(tokenSymbol, tokenName);
  info.tokenName = tokenName;
  info.symbol = tokenSymbol;
}

const getBalanceAtCertainBlock = async (tokenAddress, walletAddress , blockNum) => {
  // const result = await web3.eth.getBalance("0x0000000000000000000000000000000000000000", 13069105)
  const contract = await new web3.eth.Contract(abi, tokenAddress); // get Amount Token of Wallet
  const balance = await contract.methods.balanceOf(walletAddress).call({}, blockNum);
  // console.log(balance);
  return balance;
}

const run = async () => {
  // const blockNum = await getBlockNum();
  blockNum = 13075210
  await getAllTxOfBlock(blockNum);
  await encrypt();
  await getTokenInfo()
  const balanceFromCurrent = await getBalanceAtCertainBlock(info.tokenAddress, info.from, blockNum)
  const balanceFromPrevious = await getBalanceAtCertainBlock(info.tokenAddress, info.from, blockNum - 1)
  const balanceFromNext = await getBalanceAtCertainBlock(info.tokenAddress, info.from, blockNum + 1)
  const balanceToCurrent = await getBalanceAtCertainBlock(info.tokenAddress, info.to, blockNum)
  info.balanceFrom = balanceFromCurrent;
  info.balanceTo = balanceToCurrent;
  const fee = balanceFromPrevious - balanceFromCurrent - info.value;
  console.log("Balance at Current block: ", balanceFromCurrent);
  console.log("Balance at Previous block: ", balanceFromPrevious);
  console.log(`Fee of token ${info.symbol}: `,fee);
  console.log("---------------------------------------------------");
  console.log(info);
}

run();



const axios = require('axios');

class api {
  // API get ERC20 Tokens Transferred Information from Transaction Hash ( target to get token contract )
  apiTransferred =
    "https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=0xee717f40b3bfd7860005ad91ba924fb646dae422f60370144ff320fe7375e6bc&apikey=YourApiKeyToken";
  // API to get name of token from token contract
  apiTokenName =
    "https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2&page=1&offset=5";
  txHash;
  contractAddress;
    constructor(txHashInit, contractAddressInit) {
      this.txHash = txHashInit;
      this.contractAddress = contractAddressInit;
    }
  transferInfoApi = async () => {
    try {
      const result = await axios.get(
        `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${this.txHash}&apikey=YourApiKeyToken`
      )
      return result.data.result; //
    } catch (error) {
      throw new Error(error.message);
    }
  }
  contractInfoApi = async () => {
    try {
      const result = await axios.get(
        `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${this.contractAddress}&page=1&offset=5`
      )
      return result.data
    } catch (error) {
      throw new Error(error.message);
    }
  }
  graphAPI = async () => {
    try {
      const result = await axios.post(
        "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
        {
          query: `
          {
            pairs {
              id
            }
          }
              `,
        }
      );
      console.log(result.status);
      console.log(result.data.data);
    } catch (err) {
      console.log(err);
    }
  };
}
const main =async() => {
  const test = new api("0x8ad6a663b46cb3714ba20d6b59d3eab1537fd0a991448ca67b389c827df4db0e", "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2");
  // const test1 = await test.transferInfoApi();
  const test2 = await test.contractInfoApi();
  // console.log(test1);
  console.log(test2);
}
// main();
module.exports = api;

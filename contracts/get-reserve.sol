pragma solidity 0.5.16;
import "https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/UniswapV2Pair.sol";

contract Uniswap {

    uint public res0;
    string public message;
    uint public Res0;
    uint public Res1;
    IUniswapV2Pair public pair;
    IERC20 public token1;
    
    constructor (string memory initialMessage) payable public {
        message = initialMessage;
    }
    
    function setMessage(string memory newMessage) public returns (string memory) {
        message = newMessage;
    }
   
    function getBalance() public view returns (uint) {
        return address(this).balance;    
    }
   
    // calculate price based on pair reserves
    function getTokenPrice(address pairAddress, uint amount) public payable returns(uint)
    {
        
    pair = IUniswapV2Pair(pairAddress);
    token1 = IERC20(pair.token1());


    (Res0, Res1,) = pair.getReserves();

    // decimals
    res0 = Res0*(10**token1.decimals());
    return(Res0); // return amount of token0 needed to buy token1
    }
   
}
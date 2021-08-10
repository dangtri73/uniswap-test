pragma solidity ^0.4.17; 
// import "https://github.com/Uniswap/uniswap-v2-core/blob/master/contracts/UniswapV2Pair.sol";

contract Inbox {
    string public message;
    
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }
    
    function setMessage(string newMessage) public {
        message = newMessage;
    }
}

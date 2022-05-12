pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FCTToken is ERC20 {

    uint public amountAllowed = 1000000000000000000;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 50000000 * (10 ** 18));
    }

    mapping(address => uint) public lockTime;

    function requestTokens (address requestor , uint amount) external {
        
        //check user has requested for token in past 24 hours or not
        require(block.timestamp > lockTime[msg.sender], "Pls retry after end of locktime!");
        
        //if passed then mint tokens for the user
        _mint(requestor, amount);

        //then update locktime
        lockTime[msg.sender] = block.timestamp + 1 days;
    }
}
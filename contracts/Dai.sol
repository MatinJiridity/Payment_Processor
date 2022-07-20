// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

// create fake dai token
contract Dai is ERC20 {
    constructor() ERC20('Dai Stablecoin', 'DAI')  {}

    // create some dai token
    function faucet(address to, uint amount) external {
        _mint(to, amount);
    }
}
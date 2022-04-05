// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HelloWorld {

    address private _owner;

    constructor() {
        _owner = msg.sender;
    }     

    modifier onlyOwner(address caller) {
        require(caller == _owner, "You are not the owner of the contract");
        _;
    }

    function sayHello() external pure returns (string memory) {        
        return "Hello World";
    }

    function sayHelloMyName(string memory _name) external pure returns (string memory) {      
        require(bytes(_name).length != 0, "Inserisci il tuo nome!");
        return string(abi.encodePacked("hello ", _name));
    }

    function areYouTheAdmin(address caller) external view onlyOwner(caller) returns (string memory) {              
        return "yes";
    }

    receive() external payable {}

    // Function to receive Ether. msg.data must be empty
    fallback() external payable {}

    function getContractAmount(address caller) public view onlyOwner(caller) returns (uint256){
	    return address(this).balance;
    }

    function withdraw() external {
      address payable to = payable(msg.sender);
      to.transfer(getContractAmount(msg.sender));
   }

}
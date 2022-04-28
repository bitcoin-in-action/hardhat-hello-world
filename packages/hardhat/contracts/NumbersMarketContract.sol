pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol


contract NumbersMarketContract is Ownable {
    mapping(address => uint256[]) public busyNumbers;
    uint[] public numbers = new uint[](101);
    event Log(address indexed sender, uint256 number);

    constructor() {
        uint256 i = 0;
        while(i < 101){
            numbers[i] = i;
            i++;
        }
    }

    function getTotalNumber() public view returns (uint256[] memory) {
        return numbers;
    }

    function checkAvailableNumber(uint256 index) public view returns (bool){
        // Delete does not change the array length.
        // It resets the value at index to it's default value,
        // in this case 0

        if(numbers[index] == 0){
            return false;
        }

        return true;
    }

    function buyNumber(uint256 _number) public payable {        
        
        if (_number < 0 || _number > 100) {
            revert("Number is not valid! Please select from 1 to 100");
        } 

        if (!checkAvailableNumber(_number)) {
            revert("Number not Available!");
        } 

        if (msg.value < 0.1 ether) {
            revert("more eth!");
        }        
        
        busyNumbers[msg.sender].push(_number);        
        delete numbers[_number];
        emit Log(msg.sender, _number);
        
    }
    

    function getBusyNumbers(address addr) public view returns (uint256[] memory) {
        return busyNumbers[addr];
    }

    function getContractAmount() public view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(getContractAmount());
    }

    // to support receiving ETH by default
    receive() external payable {}
    fallback() external payable {}
}

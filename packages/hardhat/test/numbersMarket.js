const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");
const contract = require("../artifacts/contracts/NumbersMarketContract.sol/NumbersMarketContract.json");
const abi = contract.abi;
const iface = new ethers.utils.Interface(abi)

use(solidity);

describe("Numbers Market", function () {
  let myContract;
  let owner;
  let addr1;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
  });

  describe("NumbersMarketContract", function () {
    it("Should deploy NumbersMarketContract", async function () {
      const NumbersMarketContract = await ethers.getContractFactory("NumbersMarketContract");
      myContract = await NumbersMarketContract.deploy();
    });

    it("Should contains 100 numbers from 1 to 100", async function () {

      const arrayLength = await myContract.getTotalNumber();
      //console.log(arrayLength.length);

      const lastNumber = await myContract.numbers(arrayLength.length - 1);
      expect(lastNumber.toString()).to.be.equal('100');
      expect(await myContract.numbers(0)).to.be.equal('0');

      for (i = 0; i < arrayLength.length; i++) {

        expect(arrayLength[i].toString()).to.be.equal(i.toString());
      }

    });


    it("Should return an error form the getContractAmount function", async function () {
      await expect(myContract.connect(addr1).getContractAmount()).to.be.reverted;
    });


    it("Should send ether to the contract", async function () {

      let balanceAddr1 = await addr1.getBalance();

      const tx = {
        from: addr1.address,
        to: myContract.address,
        value: ethers.utils.parseEther('1')
      }
      let sendTx = await addr1.sendTransaction(tx);
      //console.log(await sendTx.wait());

      let balanceAddrAfterTx = await addr1.getBalance();

      //1000000000000000000 wei
      let amount = await myContract.getContractAmount();

      // 1 ether
      let amountEtherUnit = ethers.utils.formatUnits(amount, 'ether');

      expect(amountEtherUnit).to.be.equal('1.0');
      expect(balanceAddrAfterTx).to.not.eql(balanceAddr1);
    });

    it("Should return an error from the withdraw function", async function () {
      await expect(myContract.connect(addr1).withdraw()).to.be.reverted;
    });

    it("Should return withdraw the ethers", async function () {
      let balanceOwner = ethers.utils.formatUnits(await owner.getBalance(), 'ether');
      await myContract.connect(owner).withdraw();
      let balanceOwnerAfterTx = ethers.utils.formatUnits(await owner.getBalance(), 'ether');
      expect(balanceOwner).to.not.eql(balanceOwnerAfterTx);
    });


    it("Should get true from checkAvailableNumber", async function () {
      expect(await myContract.checkAvailableNumber(10)).to.be.equal(true);
    });


    it('Should add a new number in mapping', async function () {

      //https://github.com/ethers-io/ethers.js/issues/478
      //create the data for the transaction
      let data = iface.encodeFunctionData("buyNumber", [ethers.utils.hexlify(10)])

      const tx = {
        from: owner.address,
        to: myContract.address,
        value: ethers.utils.parseEther('0.1'),
        data: data
      }

      await owner.sendTransaction(tx);

      let data2 = iface.encodeFunctionData("buyNumber", [ethers.utils.hexlify(5)])

      const tx2 = {
        from: owner.address,
        to: myContract.address,
        value: ethers.utils.parseEther('0.1'),
        data: data2
      }

      await owner.sendTransaction(tx2);

      let numbers = await myContract.getBusyNumbers(owner.address);

      expect(numbers[0].toString()).to.be.equal('10');
      expect(numbers[1].toString()).to.be.equal('5');

    });

    it("Should get true from checkAvailableNumber", async function () {
      expect(await myContract.checkAvailableNumber(10)).to.be.equal(false);
    });


    it('Should add a new number in mapping (friendly method)', async function () {

      //https://docs.ethers.io/v5/api/contract/contract/
      //https://docs.ethers.io/v5/api/contract/contract/#Contract--write
      // expect(await myContract.buyNumber(1, {
      //   value: ethers.utils.parseEther('0.1')
      // }).to.emit(myContract, "Log")
      //   .withArgs(owner.address, "You bought the number 1", block.timestamp));

      let initialAmout = await myContract.getContractAmount();

      expect(await myContract.buyNumber(1, {
        value: ethers.utils.parseEther('0.1')
      })).to.emit(myContract, "Log")
        .withArgs(owner.address, 1);


      let numbers = await myContract.getBusyNumbers(owner.address);
      expect(numbers[0].toString()).to.be.equal('10');
      expect(numbers[1].toString()).to.be.equal('5');
      expect(numbers[2].toString()).to.be.equal('1');      

      let finalAmount = await myContract.getContractAmount();
      
      expect(finalAmount).to.not.eql(initialAmout);

    })

    it('Should get an error try to buy a number not available', async function () {

      const tx = myContract.buyNumber(1, {
        value: ethers.utils.parseEther('0.1')
      });

      await expect(tx).to.be.reverted;

    })

    it('Should get an error because the number is greater than 100', async function () {

      const tx = myContract.buyNumber(101, {
        value: ethers.utils.parseEther('0.1')
      });

      await expect(tx).to.be.reverted;

    })

    it('Should get an error because the number is lower than 0', async function () {

      const tx = myContract.buyNumber(-1, {
        value: ethers.utils.parseEther('0.1')
      });

      await expect(tx).to.be.reverted;

    })

    it('Should get an error because the number is 0', async function () {

      const tx = myContract.buyNumber(0, {
        value: ethers.utils.parseEther('0.1')
      });

      await expect(tx).to.be.reverted;

    })

  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld", function () {

  let contract;
  let owner;
  let addr1;

  beforeEach(async () => {
    [owner, addr1,] = await ethers.getSigners();
    const HelloWorldContract = await ethers.getContractFactory("HelloWorld");
    contract = await HelloWorldContract.deploy();
  });

  it("Should return Hello World", async function () {
    expect(await contract.sayHello()).to.equal("Hello World");
  });

  it("Should return yes from the areYouAdmin function", async function () {
    expect(await contract.areYouTheAdmin(owner.address)).to.equal("yes");
  });

  it("Should return an error from the areYouAdmin function", async function () {
    await expect(contract.areYouTheAdmin(addr1.address)).to.be.reverted;
    await expect(contract.areYouTheAdmin(addr1.address)).to.be.revertedWith('You are not the owner of the contract');
  });

  it("Should return a message from sayHelloMyName function", async function () {
    expect(await contract.sayHelloMyName("WeSchool")).to.be.equal("hello WeSchool");
  });

  it("Should return an error form the getContractAmount function", async function () {
    await expect(contract.getContractAmount(addr1.address)).to.be.reverted;
    await expect(contract.getContractAmount(addr1.address)).to.be.revertedWith('You are not the owner of the contract');
  });

  it("Should return a message from getContractAmount function", async function () {
    expect(await contract.getContractAmount(owner.address)).to.be.equal(0);
  });

  it("Should send ether to the contract", async function () {

    let balanceAddr1 = await addr1.getBalance();

    const tx = {
      from: addr1.address,
      to: contract.address,
      value: ethers.utils.parseEther('1')
    }
    let sendTx = await addr1.sendTransaction(tx);
    //console.log(await sendTx.wait());

    let balanceAddrAfterTx = await addr1.getBalance();

    //1000000000000000000 wei
    let amount = await contract.getContractAmount(owner.address);

    // 1 ether
    let amountEtherUnit = ethers.utils.formatUnits(amount, 'ether');

    expect(amountEtherUnit).to.be.equal('1.0');
    expect(balanceAddrAfterTx).to.not.eql(balanceAddr1);
  });

  it("Should return an error from the withdraw function", async function () {
    const tx = contract.connect(addr1).withdraw();
    await expect(tx).to.be.revertedWith("You are not the owner of the contract");
  });

  it("Should return withdraw the ethers", async function () {

    let balanceAddr1 = await addr1.getBalance();

    const tx = {
      from: addr1.address,
      to: contract.address,
      value: ethers.utils.parseEther('9900')
    }
    let sendTx = await addr1.sendTransaction(tx);

    let balanceAddr1AfterTx = ethers.utils.formatUnits(await addr1.getBalance(), 'ether');
    let balanceOwner = ethers.utils.formatUnits(await owner.getBalance(), 'ether');

    expect(balanceAddr1).to.not.eql(balanceAddr1AfterTx);

    await contract.connect(owner).withdraw();
    let balanceOwnerAfterTx = ethers.utils.formatUnits(await owner.getBalance(), 'ether');
    expect(balanceOwner).to.not.eql(balanceOwnerAfterTx);
  });


});

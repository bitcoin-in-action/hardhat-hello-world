const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HelloWorld", function () {

  let contract;
  let owner;
  let addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
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

});

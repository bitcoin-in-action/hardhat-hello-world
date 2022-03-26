//hardHat node
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

// Contract address and Abi
var contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "areYouTheAdmin",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sayHello",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      }
    ],
    "name": "sayHelloMyName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
]

//contract instance
contract = new web3.eth.Contract(abi, contractAddress);
web3.eth.handleRevert = true

// Accounts
var account;
console.log(contract.methods)
web3.eth.getAccounts(function (err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.");
    return;
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the Ethereum client is configured properly.");
    return;
  }
  account = accounts[0];
  console.log('Account: ' + account);
  web3.eth.defaultAccount = account;
});

//Hello World
function registerSayHello() {
  contract.methods.sayHello().call().then(function (res) {
    $('#info').html(res);
  });
}

function areYouTheAdmin() {

  contract.methods.areYouTheAdmin($("#admin").val())
    .call().then((res) => {
      $('#info').html(res);
    })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    )
}

function sayHelloMyName() {

  let name = $("#name").val();
  contract.methods.sayHelloMyName(name)
    .call().then((res) => {
      $('#info').html(res);
    })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    )

}
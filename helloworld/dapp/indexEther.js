//hardHat node
// var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

let privateKey = "f2e850c6beb2b668173d84735fae81e536ec38b93f77aa7342d97676ab535ce7"
//var contractAddress = '0xEcE3799FFF607C6061dBdcc9C74459410ce74c69'; //ropsten
var contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
let currentAccount;
let contract;
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
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
    "inputs": [
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "getContractAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
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
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

//Hello World
function registerSayHello() {
  contract.sayHello().then(function (res) {
    $('#info').html(res);
  });
}


function areYouTheAdminWeb3() {

  contract.areYouTheAdmin(currentAccount).then((res) => {
    $('#info').html(res);
  })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason.data.message);
    }
    )
}

function sayHelloMyName() {

  let name = $("#name").val();
  contract.sayHelloMyName(name).then((res) => {
    $('#info').html(res);
  })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    )
}

function sendEther() {
  let val = $("#ether").val();

  const tx = {
    to: contractAddress,
    value: ethers.utils.parseEther(val),
  }

  try {
    wallet.sendTransaction(tx).then((transaction) => {
      console.dir(transaction)
      $('#info').html(JSON.stringify(transaction));
    })
  } catch (error) {

    $('#info').html(error);
  }
}

function checkBalance() {

  contract.getContractAmount(currentAccount).then(function (res) {
    $('#info').html(ethers.utils.formatUnits(res, 'ether') + " ETH");
  })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    );
}

function withdraw(){

  contract.withdraw().then(function (res) {
    $('#info').text(JSON.stringify(res));

  }).catch(revertReason => {
    console.log(revertReason);
    $('#info').text(revertReason);
  });
}

document.addEventListener("DOMContentLoaded", function (event) {

  window.ethereum.on('accountsChanged', function (accounts) {
    handleAccountsChanged(accounts)
  })

  if (window.ethereum) {

    ethereum.request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err) => console.error(err.message));

    ethereum.on("chainChanged", () => window.location.reload());

    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        console.log(`Using account ${accounts[0]}`);
      } else {
        console.error("0 accounts.");
      }
    });

    ethereum.on("message", (message) => console.log(message));

    ethereum.on("connect", (info) => {
      console.log(`Connected to network ${info}`);
    });

    ethereum.on("disconnect", (error) => {
      console.log(`Disconnected from network ${error}`);
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    wallet = new ethers.Wallet(privateKey, provider)
    contract = new ethers.Contract(contractAddress, abi, signer);


  } else {
    console.error("Install MetaMask.");
  }

});

function handleAccountsChanged(accounts) {
  console.log('Calling HandleChanged')

  if (accounts.length === 0) {
    console.log('Please connect to MetaMask.');
    $('#metamaskStatus').html('Connect with Metamask')
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
    $('#metamaskStatus').html(`Current Account ${currentAccount}`)
  }

  console.log('WalletAddress in HandleAccountChanged =' + currentAccount)
}

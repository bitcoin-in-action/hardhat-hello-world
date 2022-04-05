//hardHat node
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));

// Contract address and Abi
var contractAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';
let currentAccount;

const abi =  [
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

//Metamask
document.addEventListener("DOMContentLoaded", function (event) {

  window.ethereum.on('accountsChanged', function (accounts) {
    handleAccountsChanged(accounts)
  })

  window.ethereum.on('networkChanged', function (networkId) {
    // Time to reload your interface with the new networkId
  })

  //https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
  if (window.ethereum) {

    console.log(abi)

    //https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
    ethereum.request({ method: "eth_requestAccounts" })
      .then(handleAccountsChanged)
      .catch((err) => console.error(err.message));

    ethereum.on("chainChanged", () => window.location.reload());

    ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        console.log(`Using account ${accounts[0]}`);
      } else {
        console.error("0 accounts.");
      }
    });

    ethereum.on("message", (message) => console.log(message));

    ethereum.on("connect", (info) => {
      console.log(`Connected to network ${info.chainId}`);
    });

    ethereum.on("disconnect", (error) => {
      console.log(`Disconnected from network ${error}`);
    });


  } else {
    alert("Please, Install MetaMask.");
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

function sendEther() {

  let val = $("#ether").val();
  web3.eth.sendTransaction({
    from: currentAccount,
    to: contractAddress,
    value: web3.utils.toWei(val, 'ether'),
  }).on('transactionHash', function (hash) {
    $('#info').text(hash);

  }).on('error', console.error);

}

function sendEtherMetamask() {

  let val = $("#etherMetamask").val();
  let wei = web3.utils.toWei(val, 'ether')
  let hex = web3.utils.toHex(wei)

  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: currentAccount,
          to: contractAddress,
          value: hex,
        },
      ],
    })
    .then((txHash) => {
      console.log(txHash);
      $('#info').text(txHash);
    })
    .catch((error) => {
      console.error;
      $('#info').text(JSON.stringify(error.message));
    });
}

function connectMetamask() {
  ethereum.request({ method: "eth_requestAccounts" })
    .then(handleAccountsChanged)
    .catch((err) => console.error(err.message));
}

//web3 example https://docs.metamask.io/guide/sending-transactions.html#example 
function checkBalance() {

  contract.methods.getContractAmount(currentAccount).call().then(function (res) {
    $('#info').html(web3.utils.fromWei(res, 'ether') + " ETH");
  })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    );

}

function areYouTheAdminMetamask() {

  contract.methods.areYouTheAdmin(currentAccount)
    .call().then((res) => {
      $('#info').html(res);
    })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    )
}


function withdraw() {
  
  contract.methods.withdraw().call().then((res) => {
      console.dir(res)
      $('#info').html(res);
    })
    .catch(revertReason => {
      console.log({ revertReason });
      $('#info').text(revertReason);
    }
    )
}

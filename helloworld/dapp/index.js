//hardHat node
// var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545/'));


var web3 = new Web3(new Web3.providers.HttpProvider(
  'https://eth-ropsten.alchemyapi.io/v2/BrzyWixUmYhLoQbJ5OJXYhUXQIjueilo'
));

// Contract address and Abi
var contractAddress = '0xEcE3799FFF607C6061dBdcc9C74459410ce74c69';
let currentAccount;

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
    //alert("No account found! Make sure the Ethereum client is configured properly.");
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

function sayHelloRPC() {

  ethereum
    .request({
      method: 'eth_call',
      params: [
        {
          from: currentAccount,
          to: contractAddress,
          data: web3.utils.keccak256("sayHello()").substr(0, 10) //'0xef5fb05b'
        }, "latest"],
    })
    .then((txHash) => {
      console.log(txHash);
      $('#info').html(txHash).append("<br />" + web3.eth.abi.decodeParameter('string', txHash));
    })
    .catch((error) => {
      console.error;
      $('#info').text(JSON.stringify(error.message));
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

function sayHelloMyNameRPC() {

  const data = web3.eth.abi.encodeFunctionCall({
    name: 'sayHelloMyName',
    type: 'function',
    inputs: [{
      type: 'string',
      name: '_name'
    }]
  }, [
    $("#name").val(),
  ]);
  console.log(data);


  // const method = web3.utils.keccak256("sayHelloMyName(string memory)").substr(0, 10); //'0x10a7b27a'
  // let name = web3.utils.toHex($("#name").val());
  // console.log(name)
  // // const dataToPass = `${method}000000000000000000000000000000000000000000000000000000${name.substr(2)}`
  // const dataToPass = `${method}0000000000000000000000000000000000000000000000000000000000666f6f`

  // console.log(dataToPass);

  ethereum
    .request({
      method: 'eth_call',
      params: [
        {
          from: currentAccount,
          to: contractAddress,
          data: data
        }, "latest"],
    })
    .then((txHash) => {
      console.log(txHash);
      $('#info').html(txHash).append("<br />" + web3.eth.abi.decodeParameter('string', txHash));
    })
    .catch((error) => {
      console.error;
      $('#info').text(JSON.stringify(error.message));




    });


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

  // It will then sign locally using the private key of that account, and send the transaction via web3.eth.sendSignedTransaction().
  web3.eth.sendTransaction({
    from: currentAccount,
    to: contractAddress,
    value: web3.utils.toWei(val, 'ether'),
  }).on('transactionHash', function (hash) {
    $('#info').text(hash);

  }).on('error', function(error, receipt){
    $('#info').text(error);
    console.error;
  });

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

function checkBalanceRPC() {

  const method = web3.utils.keccak256("getContractAmount(address)").substr(0, 10); //'0x97df76ee'
  const data = method + web3.eth.abi.encodeParameter('address', currentAccount).substr(2);
  console.log(data);

  ethereum
    .request({
      method: 'eth_call',
      params: [
        {
          from: currentAccount,
          to: contractAddress,
          data: data
        }, "latest"],
    })
    .then((txHash) => {
      console.log(txHash);
      $('#info').html(txHash).append("<br />" + web3.utils.fromWei(web3.eth.abi.decodeParameter('uint256', txHash), 'ether') + " ETH");
    })
    .catch((error) => {
      console.error;
      $('#info').text(JSON.stringify(error.message));
    });

}

function areYouTheAdminWeb3() {

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

function areYouTheAdminMetamaskRPC() {



  const method = web3.utils.keccak256("areYouTheAdmin(address)").substr(0, 10); //'0x24283e49'

  // The documentation then tells to take the parameter, encode it in hex and pad it left to 32 bytes.
  //total 32 bytes => 64 char
  //address length => 20 bytes (40 char)(without 0x)
  //address length => 12 bytes (24 char) (without 0x)
  //const paddingAddress = `${method}000000000000000000000000${currentAccount.substr(2)}`

  //OR
  const paddingAddress = method + web3.eth.abi.encodeParameter('address', currentAccount).substr(2);
  console.log(paddingAddress);

  ethereum
    .request({
      method: 'eth_call',
      params: [
        {
          from: currentAccount,
          to: contractAddress,
          data: paddingAddress
        }, "latest"],
    })
    .then((txHash) => {
      console.log(txHash);
      $('#info').html(txHash).append("<br />" + web3.eth.abi.decodeParameter('string', txHash));
    })
    .catch((error) => {
      console.error;
      $('#info').text(JSON.stringify(error.message));
    });

}

function withdraw() {

  contract.methods.withdraw().send({
    from: currentAccount
  }).on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    $('#info').text(error);
  });

}

function withdrawRPC() {
  ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: currentAccount,
          to: contractAddress,
          data: web3.utils.keccak256("withdraw()").substr(2, 8)
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


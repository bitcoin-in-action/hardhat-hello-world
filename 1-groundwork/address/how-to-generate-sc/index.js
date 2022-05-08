const rlp = require('rlp');
const keccak = require('js-sha3').keccak256;

var nonce = 0x0; // The nonce must be a hex literal!
console.log(`nonce: ${nonce}`);

var creator_address = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; //Requires a hex string as input!
console.log(`creator_address: ${creator_address}`)

var input_arr = [ creator_address, nonce ];

var rlp_encoded = rlp.encode(input_arr);

var contract_address_long = keccak(rlp_encoded);

var contract_address = contract_address_long.substring(24); //Trim the first 24 characters.

console.log(`contract_address: ${contract_address}`)

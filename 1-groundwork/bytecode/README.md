# bytecode sample with solc and truffle

## solc

To compile with solc use the following command

`docker run -v $PWD/contracts:/sources -v $PWD/build/solc-output:/output ethereum/solc:stable -o /output --abi --bin /sources/Hello.sol`

and you'll find the output in `./build/solc-output`

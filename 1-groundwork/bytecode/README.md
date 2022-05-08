# bytecode sample with solc and truffle

## solc

To compile with solc use the following command

`docker run --rm -it -v $PWD/contracts:/sources -v $PWD/build/solc-output:/output ethereum/solc:stable -o /output --abi --bin /sources/Hello.sol --overwrite`

and you'll find the output in `./build/solc-output`

## truffle

We use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) to guarantee Node.js version.

Before running the sample

`nvm install`

`nvm use`

`npm install`

Then we can run the sample with

`npm run compile`

and then, with Ganache still running

`npm run deploy`

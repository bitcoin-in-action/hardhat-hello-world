#!/bin/bash

npm install -g npx --allow-root --unsafe-perm=true --force

echo "NPM INSTALL NPX WITH ALLOW ROOT DONE"

cd helloworld

echo "NPM INSTALL IN ${PWD}"
npm install
echo "NPM INSTALL FINISHED YOU CAN GO AHEAD!!!"

npx hardhat node --hostname 0.0.0.0


echo "==========================================================="
echo "$(date) - Oz container up and running!!" >> /var/log/oz.log
echo "$(date) - Append to /var/log/oz.log to see message here!" >> /var/log/oz.log
tail -f /var/log/oz.log

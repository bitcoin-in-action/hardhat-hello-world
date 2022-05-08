#!/bin/sh

set -e


SCRIPT_DIR=`dirname $0`

cd $SCRIPT_DIR

COMMAND_LOCATION=`command -v openssl`
if [ -z "$COMMAND_LOCATION" ]
then
      echo "openssl could not be found"
fi

COMMAND_LOCATION=`command -v keccak-256sum`
if [ -z "$COMMAND_LOCATION" ]
then
      echo "keccak-256sum could not be found"
fi

for i in 1 2 3
do

  printf  "\n \e[31m ######### Create private key public key and Ethereum address ${i}  #########\e[0m\n\n"

  #Get private key and the public key
  printf "\n \n\e[45m ---------- 🔑🗝 My private and Public key $i --------- \e[49m\n"
  openssl ecparam -name secp256k1 -genkey -noout -rand /dev/urandom | openssl ec -text -noout > Key_$i.ignore.txt
  cat Key_$i.ignore.txt

  #Get the uncompressed public key and remove the 04 prefix
  printf "\n \n\e[44m ---------- 🔑 Public key $i --------- \e[49m\n"
  cat Key_$i.ignore.txt | grep pub -A 5 | tail -n +2 | tr -d '\n[:space:]:' | sed 's/^04//' > pub_$i.ignore.txt
  cat pub_$i.ignore.txt

  #Get the private key and remove the 00 from the prefix. Sometimes openSSL add it
  printf "\n \n\e[43m ---------- 🗝 Private Key $i --------- \e[49m\n"
  cat Key_$i.ignore.txt | grep priv -A 3 | tail -n +2 | tr -d '\n[:space:]:' | sed 's/^00//' > priv_$i.ignore.txt
  cat priv_$i.ignore.txt

  #apply keccak-256sum and add 0x get the last 41 char (digest) and apply the prefix 0x on the result   
  cat pub_$i.ignore.txt | keccak-256sum -x -l | tr -d ' -' | tail -c 41 | sed -e 's/^/0x/' > address_$i.ignore.txt
  printf "\n \n\e[46m ---------- ADDRESS ETHEREUM --------- \e[49m\n"
  cat address_$i.ignore.txt

done
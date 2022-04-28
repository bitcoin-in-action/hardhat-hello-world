import { Button, notification, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";
const { ethers } = require("ethers");

export default function BuyNumber({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  userSigner
}) {

  const [newNumber, setNewNumber] = useState("loading...");

  // QUA
  const [_busyNumbers, setBusyNumbers] = useState([])

  const [_contractAmount, setContractAmount] = useState([])

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <h2>Number Market</h2>
        <h4>Buy Your Number 🎰</h4>
        <Divider />
        <div style={{ margin: 8 }}>
          <Input
            onChange={e => {
              setNewNumber(e.target.value);
            }}
          />
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {

              //TODO check Number prima di comprare
              //validazione solo numeri
              const available = await writeContracts.NumbersMarketContract.checkAvailableNumber(newNumber);

              console.log("the Number is available?", available)

              if (!available) {
                notification.error({
                  message: "The number is not available",
                  description: "Please choose another one!",
                });
                return false;
              }



              const result = tx(
                writeContracts.NumbersMarketContract.buyNumber(newNumber, {
                  value: utils.parseEther("0.1"),
                }), update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                    );
                  }
                });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Buy Now!
          </Button>
        </div>
        <hr></hr>
        <div style={{ margin: 8 }}>
          <p>Show my numbers</p>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              console.log(address)
              const busyNumbers = await writeContracts.NumbersMarketContract.getBusyNumbers(address);
              console.log(busyNumbers)
              setBusyNumbers(busyNumbers)
            }}
          >
            Get My numbers
          </Button>
          <p>
            {_busyNumbers ? _busyNumbers.map(n => (<span>{n.toString()},</span>)) : null}
          </p>

        </div>
        <hr></hr>

        <div style={{ margin: 8 }}>
          <p>Get Amount</p>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              try {

                const contractAmount = await writeContracts.NumbersMarketContract.getContractAmount();
                if (contractAmount) {
                  setContractAmount(contractAmount)
                }
                console.log("........")
                console.log(_contractAmount)
              } catch (error) {
                console.log(JSON.stringify(error))
                notification.error({
                  message: "The number is not available",
                  description: JSON.stringify(error), //TODO MIGLIRARE
                });
                return false;
              }
            }}
          >
            Get Amount
          </Button>
          <p>

            {_contractAmount.length > 0 ? ethers.utils.formatEther(_contractAmount) : '0'} ether

          </p>

        </div>

        <hr></hr>
        <div style={{ margin: 8 }}>
          <p>Withdraw</p>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {

              const result = tx(
                writeContracts.NumbersMarketContract.withdraw(), update => {
                  console.log("📡 Transaction Update:", update);
                  if (update && (update.status === "confirmed" || update.status === 1)) {
                    console.log(" 🍾 Transaction " + update.hash + " finished!");
                    console.log(
                      " ⛽️ " +
                      update.gasUsed +
                      "/" +
                      (update.gasLimit || update.gas) +
                      " @ " +
                      parseFloat(update.gasPrice) / 1000000000 +
                      " gwei",
                    );
                  }
                });

                


            }}
          >
            Withdraw
          </Button>
          <p>

          </p>

        </div>


      </div>
    </div>
  );
}
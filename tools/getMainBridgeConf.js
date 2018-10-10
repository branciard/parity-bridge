const Promise = require('bluebird');
const Web3 = require('web3');
const fs = require('fs-extra');
const openAsync = Promise.promisify(fs.open);
const writeAsync = Promise.promisify(fs.write);
const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);

var MSG_SENDER = process.argv[2] || "0x0513425AE000f5bAEaD0ed485ED8c36E737e3586";
var SMART_CONTRACT_ADDRESS = process.argv[3] || "0x5822183c62a2fe7834adc65a2dd91cd6d08d5b36";
//poa test :
var NODE_TARGET = process.argv[4] || "http://localhost:8545";

web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});

async function getAbiContent() {
  try {
    var abiFileContent = await readFileAsync("../compiled_contracts/MainBridge.abi");
    return JSON.parse(abiFileContent);
  } catch (err) {
    console.error(err)
  }
};

async function run() {
  try {
    var abi = await getAbiContent();
    var mainBridgeContract = new web3.eth.Contract(abi,SMART_CONTRACT_ADDRESS);
    var requiredSignatures = await mainBridgeContract.methods.requiredSignatures().call();
    console.debug("requiredSignatures          : ["+requiredSignatures+"]" );
    var estimatedGasCostOfWithdraw = await mainBridgeContract.methods.estimatedGasCostOfWithdraw().call();
    console.debug("estimatedGasCostOfWithdraw  : ["+estimatedGasCostOfWithdraw+"]");
    var maxTotalMainContractBalance = await mainBridgeContract.methods.maxTotalMainContractBalance().call();
    console.debug("maxTotalMainContractBalance : ["+maxTotalMainContractBalance+"]");
    var maxSingleDepositValue = await mainBridgeContract.methods.maxSingleDepositValue().call();
    console.debug("maxSingleDepositValue       : ["+maxSingleDepositValue+"]");
    var isMainBridgeContract = await mainBridgeContract.methods.isMainBridgeContract().call();
    console.debug("isMainBridgeContract        : ["+isMainBridgeContract+"]");


  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();

const Web3 = require("web3");
const Promise = require('bluebird');
//var MSG_SENDER = process.argv[2] || "0x0513425AE000f5bAEaD0ed485ED8c36E737e3586";
var MSG_SENDER = process.argv[2] || "0x5822183c62a2fe7834adc65a2dd91cd6d08d5b36";

//poa test :
var NODE_TARGET = process.argv[4] || "http://localhost:8545";
web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});

async function run() {
  var balance = await web3.eth.getBalancePromise(MSG_SENDER);
  console.log("Balance of ["+MSG_SENDER+"] is ["+balance+"]");
}

run();
//9012000000000000010
//9012000000000000020

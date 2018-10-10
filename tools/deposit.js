
const Web3 = require('web3');//version"web3": "^1.0.0-beta.36"
const Promise = require('bluebird');

var MSG_SENDER = process.argv[2] || "0x0513425AE000f5bAEaD0ed485ED8c36E737e3586";
//poa test :
var SMART_CONTRACT_ADDRESS = process.argv[3] || "0x5822183c62a2fe7834adc65a2dd91cd6d08d5b36";
//KOVAN :
//var SMART_CONTRACT_ADDRESS = process.argv[3] || "0x0f428cd91419cec5b2f2d9197e39772b41ec6d96";
//poa test :
var NODE_TARGET = process.argv[4] || "http://localhost:8545";


web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});
//TX ok : https://kovan.etherscan.io/tx/0xcb8789fd765488497f8797bad17e005b8f0a2380891e2b56803bff6e71522147#eventlog

//KOVAN : 34.207.142.223
web3.eth.getTransactionCount(MSG_SENDER)

web3.eth.getTransactionCountPromise(MSG_SENDER).timeout(2000).then(function(currentNonce) {
  console.log("MSG_SENDER [" + MSG_SENDER + "] nonce is ["+currentNonce+"]");
  try {
    web3.eth.sendTransaction({
        from: MSG_SENDER,
        to: SMART_CONTRACT_ADDRESS,
        value: "1000000000000000000", //1 ETH
        gas:"1000000",
        gasPrice:"20000000000",
        nonce:currentNonce
      })
      .on('transactionHash', function(hash) {
        console.debug("depositTx : " + hash);
      })
      .on('receipt', function(receipt) {
        console.debug("receipt : " + receipt);
        str = JSON.stringify(receipt, null, 4);
        console.debug(str);
      })
      .on('confirmation', function(confirmationNumber, receipt) {
        console.debug("confirmationNumber : " + confirmationNumber);
      })
      .on('error', function(error) {
        console.error("sendTransaction error !");
        console.error(error);
        process.exit(1);
      });

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}).catch(Promise.TimeoutError, function(e) {
  console.log("could getTransactionCount within 2 sec");
  process.exit(1);
});

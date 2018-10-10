const Promise = require('bluebird');
const Web3 = require('web3');
const fs = require('fs-extra');
const openAsync = Promise.promisify(fs.open);
const writeAsync = Promise.promisify(fs.write);
const readFileAsync = Promise.promisify(fs.readFile);
const writeFileAsync = Promise.promisify(fs.writeFile);

var MSG_SENDER = process.argv[2] || "0x0513425AE000f5bAEaD0ed485ED8c36E737e3586";
var SMART_CONTRACT_ADDRESS = process.argv[3] || "0xdaf9346b7e255c998c486fdb0968eb487129e51a";
//poa test :
var NODE_TARGET = process.argv[3] || "http://localhost:8545";

web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});

async function getAbiContent() {
  try {
    var abiFileContent = await readFileAsync("../compiled_contracts/SideBridge.abi");
    return JSON.parse(abiFileContent);
  } catch (err) {
    console.error(err)
  }
};

async function run() {
  try {
    var abi = await getAbiContent();
    var sideBridgeContract = new web3.eth.Contract(abi, SMART_CONTRACT_ADDRESS);
    var balanceOfBefore = await sideBridgeContract.methods.balanceOf(MSG_SENDER).call();
    console.log("MSG_SENDER [" + MSG_SENDER + "] balanceOf before is [" + balanceOfBefore + "]");

    web3.eth.getTransactionCountPromise(MSG_SENDER).timeout(2000).then(function(currentNonce) {
      console.log("MSG_SENDER [" + MSG_SENDER + "] nonce is [" + currentNonce + "]");
      try {
        sideBridgeContract.methods.transferToMainViaRelay(MSG_SENDER, '100000000000000000', '20000000000').send({
            from: MSG_SENDER,
            gas: "4000000",
            gasPrice: "20000000000",
            nonce: currentNonce
          })
          .on('transactionHash', function(hash) {
            console.debug("transferToMainViaRelay : " + hash);
          })
          .on('receipt', function(receipt) {
            console.debug("receipt : " + receipt);
            str = JSON.stringify(receipt, null, 4);
            console.debug(str);
            var balanceOfBefore = sideBridgeContract.methods.balanceOf(MSG_SENDER).call();
            console.log("MSG_SENDER [" + MSG_SENDER + "] balanceOf after is [" + balanceOfBefore + "]");

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
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();

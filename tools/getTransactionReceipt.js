const Promise = require('bluebird');
const Web3 = require("web3");
var TX = process.argv[2] || "0xd294bd1e2e20d58d58020af4ed3a9455c79acc2dc0c11238429acdee23099dbd";
//test poa :
var NODE_TARGET = process.argv[3] || "http://localhost:8545";

web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});

web3.eth.getTransactionReceiptPromise(TX).timeout(2000).then(function(result) {
  console.log("TX [" + TX + "] receipt is :");
  console.log(result);
}).catch(Promise.TimeoutError, function(e) {
  console.log("could getTransactionReceiptPromise within 2 sec");
  process.exit(1);
});

const Promise = require('bluebird');
const Web3 = require("web3");
var MSG_SENDER = process.argv[2] || "0x0513425AE000f5bAEaD0ed485ED8c36E737e3586";
//test poa :
var NODE_TARGET = process.argv[3] || "http://localhost:8545";


web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});

web3.eth.getTransactionCountPromise(MSG_SENDER).timeout(2000).then(function(result) {
  console.log("MSG_SENDER [" + MSG_SENDER + "] nonce is ["+result+"]");
}).catch(Promise.TimeoutError, function(e) {
  console.log("could getTransactionCount within 2 sec");
  process.exit(1);
});

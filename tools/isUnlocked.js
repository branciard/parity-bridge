const Promise = require('bluebird');
const Web3 = require("web3");
var MSG_SENDER = process.argv[2] || "0x0513425AE000f5bAEaD0ed485ED8c36E737e3586";
//poa test :
var NODE_TARGET = process.argv[3] || "http://localhost:8545";

web3 = new Web3(new Web3.providers.HttpProvider(NODE_TARGET));

Promise.promisifyAll(web3.eth, {
  suffix: "Promise"
});

web3.eth.signPromise(
  "Am I Unloked ?",
  MSG_SENDER
).timeout(2000).then(function() {
  console.log("MSG_SENDER [" + MSG_SENDER + "] is unlocked");
}).catch(Promise.TimeoutError, function(e) {
  console.log("could unlock within 2 sec");
  process.exit(1);
});

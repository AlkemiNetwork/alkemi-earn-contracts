const fs = require("fs");

let contract = JSON.parse(
	fs.readFileSync("../build/contracts/AlkemiEarnVerified.json", "utf8")
);
fs.writeFile(
	"../ABI/AlkemiEarnVerified_ABI.json",
	JSON.stringify(contract.abi),
	function (err) {
		if (err) throw err;
		console.log("Alkemi Earn Verified ABI Saved!");
	}
);
contract = JSON.parse(
	fs.readFileSync("../build/contracts/AlkemiEarnPublic.json", "utf8")
);
fs.writeFile(
	"../ABI/AlkemiEarnPublic_ABI.json",
	JSON.stringify(contract.abi),
	function (err) {
		if (err) throw err;
		console.log("Alkemi Earn Public ABI Saved!");
	}
);
contract = JSON.parse(
	fs.readFileSync("../build/contracts/ChainLink.json", "utf8")
);
fs.writeFile(
	"../ABI/ChainLink_ABI.json",
	JSON.stringify(contract.abi),
	function (err) {
		if (err) throw err;
		console.log("Chainlink ABI Saved!");
	}
);
contract = JSON.parse(
	fs.readFileSync("../build/contracts/AlkemiWETH.json", "utf8")
);
fs.writeFile(
	"../ABI/AlkemiWETH_ABI.json",
	JSON.stringify(contract.abi),
	function (err) {
		if (err) throw err;
		console.log("Alkemi WETH ABI Saved!");
	}
);
contract = JSON.parse(
	fs.readFileSync("../build/contracts/AlkemiRateModel.json", "utf8")
);
fs.writeFile(
	"../ABI/AlkemiRateModel_ABI.json",
	JSON.stringify(JSON.parse(JSON.stringify(contract.abi))),
	function (err) {
		if (err) throw err;
		console.log("Alkemi Rate Model ABI Saved!");
	}
);

contract = JSON.parse(
	fs.readFileSync("../build/contracts/RewardControl.json", "utf8")
);
fs.writeFile(
	"../ABI/RewardControl_ABI.json",
	JSON.stringify(contract.abi),
	function (err) {
		if (err) throw err;
		console.log("Reward Control ABI Saved!");
	}
);

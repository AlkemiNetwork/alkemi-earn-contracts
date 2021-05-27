const fs = require("fs");

let contract = JSON.parse(
	fs.readFileSync("./build/contracts/MoneyMarket.json", "utf8")
);
fs.writeFile(
	"./ABI/MoneyMarket_ABI.json",
	JSON.stringify(contract.abi),
	function(err) {
		if (err) throw err;
		console.log("Money Market ABI Saved!");
	}
);
contract = JSON.parse(
	fs.readFileSync("./build/contracts/AlkemiEarnPublicV10.json", "utf8")
);
fs.writeFile(
	"./ABI/AlkemiEarnPublic_ABI.json",
	JSON.stringify(contract.abi),
	function(err) {
		if (err) throw err;
		console.log("Alkemi Earn Public ABI Saved!");
	}
);
contract = JSON.parse(
	fs.readFileSync("./build/contracts/ChainLink.json", "utf8")
);
fs.writeFile("./ABI/ChainLink_ABI.json", JSON.stringify(contract.abi), function(
	err
) {
	if (err) throw err;
	console.log("Chainlink ABI Saved!");
});
contract = JSON.parse(
	fs.readFileSync("./build/contracts/AlkemiWETH.json", "utf8")
);
fs.writeFile(
	"./ABI/AlkemiWETH_ABI.json",
	JSON.stringify(contract.abi),
	function(err) {
		if (err) throw err;
		console.log("Alkemi WETH ABI Saved!");
	}
);

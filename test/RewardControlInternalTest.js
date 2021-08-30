"use strict";

const { gas } = require("./Utils");
const { getContract } = require("./Contract");
const RewardControl = getContract("./test/RewardControlHarness.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");

contract(
	"RewardControl internal functions test",
	function ([root, ...accounts]) {
		describe("#updateAlkSupplyIndex", async () => {
			it("update supply state on the first time successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetBlockNumber(1)
					.send({ gas: 1000000, from: root });
				await rewardControl.methods
					.harnessSetAlkSpeed(accounts[1], "4161910200000000000", true)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetMarketTotalSupply(accounts[1], "100")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessUpdateAlkSupplyIndex(accounts[1], true)
					.send({
						gas: 1000000,
						from: root,
					});
				let response = await rewardControl.methods
					.alkSupplyState(true, accounts[1])
					.call();
				let index = response[0];
				let block = response[1];
				assert.equal(
					index.toString(),
					"41619102000000000000000000000000000000000000000000000"
				);
				assert.equal(block.toString(), "1");
			});

			it("update supply state on the second time on the next block successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetBlockNumber(2)
					.send({ gas: 1000000, from: root }); // last block is #1, current block is #2
				await rewardControl.methods
					.harnessSetAlkSpeed(accounts[1], "4161910200000000000", true)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetAlkSupplyState(
						accounts[1],
						"41619102000000000000000000000000000000000000000000000",
						1,
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetMarketTotalSupply(accounts[1], "100")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessUpdateAlkSupplyIndex(accounts[1], true)
					.send({ gas: 1000000, from: root });
				let response = await rewardControl.methods
					.alkSupplyState(true, accounts[1])
					.call();
				let index = response[0];
				let block = response[1];
				assert.equal(
					index.toString(),
					"83238204000000000000000000000000000000000000000000000"
				);
				assert.equal(block.toString(), "2");
			});

			it("update supply state on the second time with multiple block gap successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetBlockNumber(3)
					.send({ gas: 1000000, from: root }); // last block is #1, current block is #3
				await rewardControl.methods
					.harnessSetAlkSpeed(accounts[1], "4161910200000000000", true)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetAlkSupplyState(
						accounts[1],
						"41619102000000000000000000000000000000000000000000000",
						1,
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetMarketTotalSupply(accounts[1], "100")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessUpdateAlkSupplyIndex(accounts[1], true)
					.send({ gas: 1000000, from: root });
				let response = await rewardControl.methods
					.alkSupplyState(true, accounts[1])
					.call();
				let index = response[0];
				let block = response[1];
				assert.equal(
					index.toString(),
					"124857306000000000000000000000000000000000000000000000"
				);
				assert.equal(block.toString(), "3");
			});
		});

		describe("#updateAlkBorrowIndex", async () => {
			it("update borrow state on the first time successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetBlockNumber(1)
					.send({ gas: 1000000, from: root });
				await rewardControl.methods
					.harnessSetAlkSpeed(accounts[1], "4161910200000000000", true)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetMarketTotalBorrows(accounts[1], "100")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessUpdateAlkBorrowIndex(accounts[1], true)
					.send({ gas: 1000000, from: root });
				let response = await rewardControl.methods
					.alkBorrowState(true, accounts[1])
					.call();
				let index = response[0];
				let block = response[1];
				assert.equal(
					index.toString(),
					"41619102000000000000000000000000000000000000000000000"
				);
				assert.equal(block.toString(), "1");
			});

			it("update borrow state on the second time on the next block successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetBlockNumber(2)
					.send({ gas: 1000000, from: root }); // last block is #1, current block is #2
				await rewardControl.methods
					.harnessSetAlkSpeed(accounts[1], "4161910200000000000", true)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetAlkBorrowState(
						accounts[1],
						"41619102000000000000000000000000000000000000000000000",
						1,
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetMarketTotalBorrows(accounts[1], "100")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessUpdateAlkBorrowIndex(accounts[1], true)
					.send({ gas: 1000000, from: root });
				let response = await rewardControl.methods
					.alkBorrowState(true, accounts[1])
					.call();
				let index = response[0];
				let block = response[1];
				assert.equal(
					index.toString(),
					"83238204000000000000000000000000000000000000000000000"
				);
				assert.equal(block.toString(), "2");
			});

			it("update borrow state on the second time with multiple block gap successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetBlockNumber(3)
					.send({ gas: 1000000, from: root }); // last block is #1, current block is #3
				await rewardControl.methods
					.harnessSetAlkSpeed(accounts[1], "4161910200000000000", true)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetAlkBorrowState(
						accounts[1],
						"41619102000000000000000000000000000000000000000000000",
						1,
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetMarketTotalBorrows(accounts[1], "100")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessUpdateAlkBorrowIndex(accounts[1], true)
					.send({ gas: 1000000, from: root });
				let response = await rewardControl.methods
					.alkBorrowState(true, accounts[1])
					.call();
				let index = response[0];
				let block = response[1];
				assert.equal(
					index.toString(),
					"124857306000000000000000000000000000000000000000000000"
				);
				assert.equal(block.toString(), "3");
			});
		});

		describe("#distributeSupplierAlk", async () => {
			it("update accrued alk for a supplier on the first time successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetAlkSupplyState(
						accounts[1],
						"41619102000000000000000000000000000000000000000000000",
						"1",
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetSupplyBalance(accounts[1], accounts[2], "25")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessDistributeSupplierAlk(accounts[1], accounts[2], true)
					.send({
						gas: 1000000,
						from: root,
					});
				let alkAccrued = await rewardControl.methods
					.alkAccrued(accounts[2])
					.call();
				assert.equal(alkAccrued.toString(), "0");
				let alkSupplierIndex = await rewardControl.methods
					.alkSupplierIndex(true, accounts[1], accounts[2])
					.call();
				assert.equal(
					alkSupplierIndex.toString(),
					"41619102000000000000000000000000000000000000000000000"
				);
			});
		});

		describe("#distributeBorrowerAlk", async () => {
			it("update accrued alk for a borrower on the first time successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.harnessSetAlkBorrowState(
						accounts[1],
						"41619102000000000000000000000000000000000000000000000",
						"1",
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessSetBorrowBalance(accounts[1], accounts[2], "25")
					.send({
						gas: 1000000,
						from: root,
					});
				await rewardControl.methods
					.harnessDistributeBorrowerAlk(accounts[1], accounts[2], true)
					.send({
						gas: 1000000,
						from: root,
					});
				let alkAccrued = await rewardControl.methods
					.alkAccrued(accounts[2])
					.call();
				assert.equal(alkAccrued.toString(), "0");
				let alkBorrowerIndex = await rewardControl.methods
					.alkBorrowerIndex(true, accounts[1], accounts[2])
					.call();
				assert.equal(
					alkBorrowerIndex.toString(),
					"41619102000000000000000000000000000000000000000000000"
				);
			});
		});

		describe("#transferAlk", async () => {
			it("transfer ALK when RewardControl has no balance", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				const ALK = await EIP20.new(
					"70000000000000000000000000",
					"test ALK",
					18,
					"ALK"
				).send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], ALK._address)
					.send({ gas: 1000000, from: root });

				await rewardControl.methods
					.harnessTransferAlk(
						accounts[1],
						"1040477550000000000",
						accounts[5],
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				let participantAlkBalance = await ALK.methods
					.balanceOf(accounts[1])
					.call();
				assert.equal(participantAlkBalance.toString(), "0");
				let rewardControlAlkBalance = await ALK.methods
					.balanceOf(rewardControl._address)
					.call();
				assert.equal(rewardControlAlkBalance.toString(), "0");
			});

			it("transfer ALK when RewardControl has enough balance", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				const ALK = await EIP20.new(
					"70000000000000000000000000",
					"test ALK",
					18,
					"ALK"
				).send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], ALK._address)
					.send({ gas: 1000000, from: root });
				await ALK.methods
					.transfer(rewardControl._address, "1040477550000000000")
					.send({ from: root });

				await rewardControl.methods
					.harnessTransferAlk(
						accounts[1],
						"1040477550000000000",
						accounts[5],
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				let participantAlkBalance = await ALK.methods
					.balanceOf(accounts[1])
					.call();
				assert.equal(participantAlkBalance.toString(), "1040477550000000000");
				let rewardControlAlkBalance = await ALK.methods
					.balanceOf(rewardControl._address)
					.call();
				assert.equal(rewardControlAlkBalance.toString(), "0");
			});

			it("transfer ALK when RewardControl has not enough balance", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				const ALK = await EIP20.new(
					"70000000000000000000000000",
					"test ALK",
					18,
					"ALK"
				).send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], ALK._address)
					.send({ gas: 1000000, from: root });
				await ALK.methods
					.transfer(rewardControl._address, "940477550000000000")
					.send({ from: root });

				await rewardControl.methods
					.harnessTransferAlk(
						accounts[1],
						"1040477550000000000",
						accounts[5],
						true
					)
					.send({
						gas: 1000000,
						from: root,
					});
				let participantAlkBalance = await ALK.methods
					.balanceOf(accounts[1])
					.call();
				assert.equal(participantAlkBalance.toString(), "0");
				let rewardControlAlkBalance = await ALK.methods
					.balanceOf(rewardControl._address)
					.call();
				assert.equal(rewardControlAlkBalance.toString(), "940477550000000000");
			});
		});

		describe("#transferOwnership", async () => {
			it("transfer OwnerShip successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[4])
					.send({ gas: 1000000, from: root });
				let owner_1 = await rewardControl.methods.owner().call();
				assert.equal(owner_1.toString(), root.toString());
				await rewardControl.methods
					.transferOwnership(accounts[1])
					.send({ from: root });
				let owner_2 = await rewardControl.methods.owner().call();
				assert.equal(owner_2.toString(), root.toString());
				await rewardControl.methods
					.acceptOwnership()
					.send({ from: accounts[1] });
				let owner_3 = await rewardControl.methods.owner().call();
				assert.equal(owner_3.toString(), accounts[1].toString());
			});

			it("transfer OwnerShip failed without permission", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[4])
					.send({ gas: 1000000, from: root });
				let owner_1 = await rewardControl.methods.owner().call();
				assert.equal(owner_1.toString(), root.toString());
				await assert.revert(
					rewardControl.methods
						.transferOwnership(accounts[1])
						.send({ from: accounts[1] }),
					"revert non-owner"
				); // accounts[1] is not the owner at this moment
				let owner_2 = await rewardControl.methods.owner().call();
				assert.equal(owner_2.toString(), root.toString());
				await assert.revert(
					rewardControl.methods.acceptOwnership().send({ from: accounts[1] }),
					"revert AcceptOwnership: only new owner do this."
				);
				let owner_3 = await rewardControl.methods.owner().call();
				assert.equal(owner_3.toString(), root.toString());
			});
		});

		describe("#{add|remove}Market", async () => {
			it("add/remove market failed without permission", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[4])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					0
				);

				await rewardControl.methods
					.addMarket(accounts[4], true)
					.send({ from: root });
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					1
				);

				await rewardControl.methods
					.addMarket(accounts[5], true)
					.send({ from: root });
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 1).call()).toString(),
					accounts[5].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					2
				);

				await assert.revert(
					rewardControl.methods
						.addMarket(accounts[6], true)
						.send({ from: accounts[1] }),
					"revert non-owner"
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 1).call()).toString(),
					accounts[5].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					2
				);

				await assert.revert(
					rewardControl.methods
						.removeMarket(0, true)
						.send({ from: accounts[1] }),
					"revert non-owner"
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 1).call()).toString(),
					accounts[5].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					2
				);
			});

			it("add existing market failed", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[4])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					0
				);

				await rewardControl.methods
					.addMarket(accounts[4], true)
					.send({ from: root });
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					1
				);

				await rewardControl.methods
					.addMarket(accounts[5], true)
					.send({ from: root });
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 1).call()).toString(),
					accounts[5].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					2
				);

				await assert.revert(
					rewardControl.methods
						.addMarket(accounts[4], true)
						.send({ from: root }),
					"revert Market already exists"
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 1).call()).toString(),
					accounts[5].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					2
				);

				await assert.revert(
					rewardControl.methods
						.addMarket(accounts[5], true)
						.send({ from: root }),
					"revert Market already exists"
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 0).call()).toString(),
					accounts[4].toString()
				);
				assert.equal(
					(await rewardControl.methods.allMarkets(true, 1).call()).toString(),
					accounts[5].toString()
				);
				assert.equal(
					await rewardControl.methods.harnessGetNumberOfMarkets(true).call(),
					2
				);
			});
		});

		describe("#{set|get}AlkAddress", async () => {
			it("set/get alk address successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[5], accounts[2], accounts[3])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				);

				await rewardControl.methods
					.setAlkAddress(accounts[4])
					.send({ from: root });
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[4]
				);
			});

			it("set alk address failed with permission", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[6], accounts[2], accounts[3])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				);

				await assert.revert(
					rewardControl.methods
						.setAlkAddress(accounts[4])
						.send({ from: accounts[5] }),
					"revert non-owner"
				);
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				); // alk address stays the same.
			});

			it("set the same alk address failed ", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[5], accounts[2], accounts[3])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				);

				await assert.revert(
					rewardControl.methods.setAlkAddress(accounts[3]).send({ from: root }),
					"revert The same ALK address"
				);
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				); // alk address stays the same.
			});

			it("set empty alk address failed ", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[5], accounts[2], accounts[3])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				);

				await assert.revert(
					rewardControl.methods
						.setAlkAddress("0x0000000000000000000000000000000000000000")
						.send({ from: root }),
					"revert ALK address cannot be empty"
				);
				assert.equal(
					await rewardControl.methods.getAlkAddress().call(),
					accounts[3]
				); // alk address stays the same.
			});
		});

		describe("#setAlkRate", async () => {
			it("set alk rate successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[4])
					.send({ gas: 1000000, from: root });
				assert.equal(
					await rewardControl.methods.alkRate().call(),
					3690226761271430000
				);

				await rewardControl.methods.setAlkRate(100).send({ from: root });
				assert.equal(await rewardControl.methods.alkRate().call(), 100);

				await rewardControl.methods.setAlkRate(100).send({ from: root });
				assert.equal(await rewardControl.methods.alkRate().call(), 100);

				await assert.revert(
					rewardControl.methods.setAlkRate(200).send({ from: accounts[4] }),
					"revert non-owner"
				);
				assert.equal(await rewardControl.methods.alkRate().call(), 100);

				await rewardControl.methods.setAlkRate(0).send({ from: root });
				assert.equal(await rewardControl.methods.alkRate().call(), 0);
			});
		});

		describe("#{set|get}AlkemiEarnVerifiedAddress", async () => {
			it("set/get AlkemiEarnVerified address successfully", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[5])
					.send({ gas: 1000000, from: root });
				let result = await rewardControl.methods.getAlkemiEarnAddress().call();
				let { 0: verifiedAddress1, 1: publicAddress1 } = result;
				assert.equal(verifiedAddress1, accounts[2]);

				await rewardControl.methods
					.setAlkemiEarnVerifiedAddress(accounts[4])
					.send({ from: root });
				result = await rewardControl.methods.getAlkemiEarnAddress().call();
				let { 0: verifiedAddress2, 1: publicAddress2 } = result;
				assert.equal(verifiedAddress2, accounts[4]);
			});

			it("set the same AlkemiEarnVerified address failed", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[5])
					.send({ gas: 1000000, from: root });
				let result = await rewardControl.methods.getAlkemiEarnAddress().call();
				let { 0: verifiedAddress1, 1: publicAddress1 } = result;
				assert.equal(verifiedAddress1, accounts[2]);

				await assert.revert(
					rewardControl.methods
						.setAlkemiEarnVerifiedAddress(accounts[2])
						.send({ from: root }),
					"revert The same AlkemiEarnVerified address"
				);
				result = await rewardControl.methods.getAlkemiEarnAddress().call();
				let { 0: verifiedAddress2, 1: publicAddress2 } = result;
				assert.equal(verifiedAddress2, accounts[2]);
			});

			it("set empty AlkemiEarnVerified address failed", async () => {
				const rewardControl = await RewardControl.new().send({ from: root });
				await rewardControl.methods
					.initializer(root, accounts[2], accounts[3], accounts[5])
					.send({ gas: 1000000, from: root });
				let result = await rewardControl.methods.getAlkemiEarnAddress().call();
				let { 0: verifiedAddress1, 1: publicAddress1 } = result;
				assert.equal(verifiedAddress1, accounts[2]);

				await assert.revert(
					rewardControl.methods
						.setAlkemiEarnVerifiedAddress(
							"0x0000000000000000000000000000000000000000"
						)
						.send({ from: root }),
					"revert AlkemiEarnVerified address cannot be empty"
				);
				result = await rewardControl.methods.getAlkemiEarnAddress().call();
				let { 0: verifiedAddress2, 1: publicAddress2 } = result;
				assert.equal(verifiedAddress2, accounts[2]);
			});
		});
	}
);

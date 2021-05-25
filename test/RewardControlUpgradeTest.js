"use strict";

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
const RewardControl = getContract("./test/RewardControlHarness.sol");
const RewardControlV2 = getContract("./test/RewardControlHarnessV2.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");

contract('RewardControl upgrade test', function ([root, ...accounts]) {

    describe("#upgrade using openzeppelin", async () => {
        it("upgrade without the need to transfer ALK balance", async () => {
            // given
            const rewardControl = await RewardControl.new().send({from: root});
            const ALK = await EIP20.new(BigInt("70000000000000000000000000"), "test ALK", 18, "ALK").send({from: root});
            await ALK.methods.transfer(rewardControl._address, BigInt("70000000000000000000000000")).send({from: root});
            await rewardControl.methods.initializer(root, accounts[2], ALK._address).send({gas: 1000000, from: root});
            let marketA = accounts[1];
            let supplier = accounts[4];
            let borrower = supplier;
            await rewardControl.methods.addMarket(marketA).send({gas: 1000000, from: root});
            await mockMarketLiquidity(rewardControl, marketA, "100", "100");
            await mockSupplyBalance(rewardControl, marketA, supplier, "0");
            await rewardControl.methods.harnessSetBlockNumber(1).send({gas: 1000000, from: root});

            // when #1 refresh supply index
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "25");

            // then
            await assertSupplyResults("1", rewardControl, marketA, supplier,
                "4161910200000000000",
                "41619102000000000000000000000000000000000000000000000",
                "0"); // 0 ALK

            // when #2 refresh supply index
            await rewardControl.methods.harnessFastForward(1).send({gas: 1000000, from: root});
            await rewardControl.methods.refreshAlkSupplyIndex(marketA, supplier).send({gas: 1000000, from: root});
            await mockSupplyBalance(rewardControl, marketA, supplier, "50");

            // then
            await assertSupplyResults("2", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "1040477550000000000"); // 1.040477550000000000 ALK

            // when claim on the same block
            await rewardControl.methods.claimAlk(supplier).send({gas: 1000000, from: root});

            // then
            let participantAlkBalance = await ALK.methods.balanceOf(supplier).call();
            assert.equal(participantAlkBalance.toString(), "1040477550000000000");
            let rewardControlAlkBalance = await ALK.methods.balanceOf(rewardControl._address).call();
            assert.equal(rewardControlAlkBalance.toString(), "69999998959522450000000000");
            await assertSupplyResults("6", rewardControl, marketA, supplier,
                "4161910200000000000",
                "83238204000000000000000000000000000000000000000000000",
                "0"); // 0 ALK
        });
    });

    async function mockMarketLiquidity(rewardControl, market, totalSupply, totalBorrows) {
        await rewardControl.methods.harnessSetMarketTotalSupply(market, BigInt(totalSupply)).send({
            gas: 1000000,
            from: root
        });
        await rewardControl.methods.harnessSetMarketTotalBorrows(market, BigInt(totalBorrows)).send({
            gas: 1000000,
            from: root
        });
    }

    async function mockSupplyBalance(rewardControl, market, supplier, supplyBalance) {
        await rewardControl.methods.harnessSetSupplyBalance(market, supplier, BigInt(supplyBalance)).send({
            gas: 1000000,
            from: root
        });
    }

    async function mockBorrowBalance(rewardControl, market, borrower, borrowBalance) {
        await rewardControl.methods.harnessSetBorrowBalance(market, borrower, BigInt(borrowBalance)).send({
            gas: 1000000,
            from: root
        });
    }

    async function assertSupplyResults(label, rewardControl, market, supplier, expectedAlkSpeed, expectedSupplierIndex, expectedAlkAccrued) {
        let speed = await rewardControl.methods.alkSpeeds(market).call();
        let alkSupplierIndex = await rewardControl.methods.alkSupplierIndex(market, supplier).call();
        let alkAccrued = await rewardControl.methods.alkAccrued(supplier).call();
        console.log(`${label}: actual speed = ${speed}`);
        console.log(`${label}: ALK supplier index = ${alkSupplierIndex}`);
        console.log(`${label}: ALK accrued  = ${alkAccrued}`);
        assert.equal(speed.toString(), expectedAlkSpeed, label);
        assert.equal(alkSupplierIndex.toString(), expectedSupplierIndex, label);
        assert.equal(alkAccrued.toString(), expectedAlkAccrued, label);
    }

    async function assertBorrowResults(label, rewardControl, market, borrower, expectedAlkSpeed, expectedBorrowerIndex, expectedAlkAccrued) {
        let speed = await rewardControl.methods.alkSpeeds(market).call();
        let alkBorrowerIndex = await rewardControl.methods.alkBorrowerIndex(market, borrower).call();
        let alkAccrued = await rewardControl.methods.alkAccrued(borrower).call();
        console.log(`${label}: actual speed = ${speed}`);
        console.log(`${label}: ALK borrower index = ${alkBorrowerIndex}`);
        console.log(`${label}: ALK accrued  = ${alkAccrued}`);
        assert.equal(speed.toString(), expectedAlkSpeed, label);
        assert.equal(alkBorrowerIndex.toString(), expectedBorrowerIndex, label);
        assert.equal(alkAccrued.toString(), expectedAlkAccrued, label);
    }

});


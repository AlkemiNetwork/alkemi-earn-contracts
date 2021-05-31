"use strict";

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
const RewardControl = artifacts.require("./test/RewardControlHarness.sol");
const RewardControlV2 = artifacts.require("./test/RewardControlHarnessV2.sol");
const EIP20 = getContract("./test/EIP20Harness.sol");
const {deployProxy, upgradeProxy} = require('@openzeppelin/truffle-upgrades');

contract('RewardControl upgrade test', function ([root, ...accounts]) {

    describe("#upgrade using openzeppelin", async () => {
        it("upgrade without the need to transfer ALK balance", async () => {
            // given
            const ALK = await EIP20.new("70000000000000000000000000", "test ALK", 18, "ALK").send({from: root});

            const rewardControlV1 = await deployProxy(RewardControl, [root, accounts[2], ALK._address], {
                initializer: 'initializer',
                unsafeAllowCustomTypes: true
            });
            console.log(`rewardControl.address: ${rewardControlV1.address}`);

            await ALK.methods.transfer(rewardControlV1.address, "70000000000000000000000000").send({from: root});
            assert.equal((await ALK.methods.balanceOf(rewardControlV1.address).call()).toString(), "70000000000000000000000000");

            await rewardControlV1.harnessTransferAlk(accounts[1], "10000000000000000000000000");
            assert.equal((await ALK.methods.balanceOf(accounts[1]).call()).toString(), "10000000000000000000000000");
            assert.equal((await ALK.methods.balanceOf(rewardControlV1.address).call()).toString(), "60000000000000000000000000");

            // when
            const rewardControlV2 = await upgradeProxy(rewardControlV1.address, RewardControlV2, {unsafeAllowCustomTypes: true});
            console.log(`rewardControlV2.address: ${rewardControlV2.address}`);

            // then
            await rewardControlV2.setValue(100);
            assert.equal(await rewardControlV2.getValue(), 100);

            await rewardControlV2.harnessTransferAlk(accounts[2], "20000000000000000000000000");
            assert.equal((await ALK.methods.balanceOf(accounts[2]).call()).toString(), "20000000000000000000000000");
            assert.equal((await ALK.methods.balanceOf(rewardControlV2.address).call()).toString(), "40000000000000000000000000");

        });
    });

});


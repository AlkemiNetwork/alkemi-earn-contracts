"use strict";

const {gas} = require('./Utils');
const {getContract} = require('./Contract');
const RewardControl = getContract("./RewardControlHarness.sol");

contract('RewardControl', function([root, ...accounts]) {

  describe("#deploy", async () => {
    it("try to deploy RewardControl contract", async () => {
      const rewardControl = await RewardControl.new().send({from: root});
      await rewardControl.methods.initializer(root, accounts[0], accounts[1]).send({gas: 1000000, from: root})
      await rewardControl.methods.addMarket(accounts[2]).send({gas: 1000000, from: root})
      await rewardControl.methods.harnessRefreshAlkSpeeds().send({gas: 1000000, from: root});
    });
  });

});

"use strict";

const {initWorldWithRewardDistribution, getUser, getToken, getAmount} = require("./Scenario/World");
const {processEvents} = require("./Scenario/Event");

const scenarios = require("./scenarios-reward-distribution.json");
const {addToken, faucet, initRewardControl} = require("./Scenario/Event");

/**
 * N.B. only run scenarios matching the following regular expression
 */
const INCLUDED_SCENARIOS = /^(Supply|Withdraw|Borrow|PayBorrow|Liquidate):/i; // Add 'Excel' here for excel scenarios

contract("Scenarios", function (accounts) {
    /*
     * This test runs our scenarios, which come from the reference implementation.
     */

    Object.entries(scenarios).forEach(([name, events]) => {
        if (name.match(INCLUDED_SCENARIOS)) {
            it("scenario: " + name, async () => {
                let world = await initWorldWithRewardDistribution(accounts);
                world = await addToken(world, "ALK");
                world = await faucet(
                    world,
                    world.rewardControl._address,
                    getToken(world, "ALK"),
                     "70000000000000000000000000"
                );
                world = await initRewardControl(world, getToken(world, "ALK"));
                let finalWorld;

                // console.log(["Scenario", name, "Events", events, world]);

                finalWorld = await processEvents(world, events);

                console.log(["Final world", finalWorld, finalWorld.actions]);
            });
        } else {
            it.skip("scenario: " + name, async () => {
            });
        }
    });
});

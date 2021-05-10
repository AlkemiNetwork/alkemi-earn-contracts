pragma solidity ^0.4.24;

import "./RewardControlStorage.sol";
import "./RewardControlInterface.sol";
import "./ExponentialNoError.sol";

contract RewardControl is RewardControlStorage, RewardControlInterface, ExponentialNoError {

    /** usage
     * mintAllowed --> supply
     * redeemAllowed --> withdraw
     * seizeAllowed --> liquidateBorrow
     * transferAllowed --> ???
     * refreshCompSpeedsInternal (used by refreshCompSpeeds)
     * claimComp --> claimAlk
     * borrowAllowed --> borrow
     * repayBorrowAllowed --> repayBorrow
     */
    function refreshAlkIndex(address market, address supplier) public {
        refreshAlkSpeeds();
        updateAlkIndex(market);
        distributeAlk(market, supplier);
    }

    /**
     * Recalculate and update ALK speeds for all ALK markets
     */
    function refreshAlkSpeeds() internal {
        // Loop through each market to sum total_liquidity
        total_liquidity = 0
        foreach market in allMarkets:
            total_liquidity = total_liquidity + MoneyMarket:market.totalSupply + MoneyMarket:market.totalBorrow
        // For each market calculate reward_allocation_ratio and then multiply it with alkRate to store it in alkSpeeds mapping
        foreach market in allMarkets:
            reward_allocation_ratio = (MoneyMarket:market.totalSupply + MoneyMarket:market.totalBorrow) / total_liquidity
            alkSpeeds[market] = alkRate * reward_allocation_ratio
    }

    /**
     * Accrue ALK to the market by updating the supply index
     * @param market The market whose supply index to update
     */
    function updateAlkIndex(address market) internal {
        // Get current market state of the given market
        supply_state = alkSupplyState[market]
        // Get current market supply speed
        supply_speed = alkSpeeds[market]
        // Get delta number of blocks between the current block and the last visited block
        current_block_number = getCurrentBlockNumber()
        delta_blocks = current_block_number - supply_state.block
        // Get total rewards since last visited block
        alk_accrued = delta_blocks * supply_speed
        // Get total supply units for current market
        market_total_supply = MoneyMarket:market.totalSupply
        // Calculate rewards per unit
        alk_accrued_per_unit = alk_accrued / market_total_supply
        // Calculate new supply index
        new_supply_index = supply_state.index + alk_accrued_per_unit
        // Update market state
        alkSupplyState[market] = MarketState({
                index: new_supply_index,
                block: current_block_number
        });
    }

    /**
     * Calculate ALK accrued by a supplier and add it on top of alkAccrued[supplier]
     * @param market The market in which the supplier is interacting
     * @param supplier The address of the supplier to distribute ALK to
     */
    function distributeAlk(address market, address supplier) internal {
        // Get current market state of the given market
        supply_state = alkSupplyState[market]
        supply_index = supply_state.index
        // Get the last snapshot of the supplier index for the given market
        supplier_index = alkSupplierIndex[market][supplier]
        // Update snapshot of the supplier index for the given market to the latest index
        alkSupplierIndex[market][supplier] = supply_index

        if supplier_index is not initialized:
           // Set supplier_index to the initial value

        delta_index = supply_index - supplier_index
        // Get the balance of the given market for the supplier address
        supplier_balance = MoneyMarket:getSupplyBalance(supplier, market)
        // Calculate ALK accrued to be distributed to the particular supplier
        supplier_delta = supplier_balance * delta_index
        alkAccrued[supplier] = alkAccrued[supplier] + supplier_delta
    }

    /**
     * Calculate additional accrued ALK for a contributor since last accrual
     * @param contributor The address to calculate contributor rewards for
     */
    /*function updateContributorRewards(address contributor) public {}*/

    /**
     * @notice Claim all the ALK accrued by holder in all markets
     * @param holder The address to claim ALK for
     */
    function claimAlk(address holder) public {
        claimAlk(holder, allMarkets);
    }

    /**
     * @notice Claim all the ALK accrued by holder in the specified markets
     * @param holder The address to claim ALK for
     * @param markets The list of markets to claim ALK in
     */
    function claimAlk(address holder, address[] memory markets) internal {
        // loop through each market
        for (uint i = 0; i < markets.length; i++) {
            address market = markets[i];

            updateAlkIndex(market);
            distributeAlk(market, holder);

            updateAlkBorrowIndex(market);
            distributeBorrowerAlk(market, holder);

            alkAccrued[supplier] = transferAlkInternal(holder, alkAccrued[supplier]);
        }
    }

    /**
     * Transfer ALK to the user
     * @dev Note: If there is not enough ALK, we do not perform the transfer all.
     * @param user The address of the user to transfer ALK to
     * @param amount The amount of ALK to (possibly) transfer
     * @return The amount of ALK which was NOT transferred to the user
     */
    function transferAlkInternal(address user, uint amount) internal returns (uint) {}

    function getCurrentBlockNumber() public view returns (uint) {
        return block.number;
    }

    function getAlkAccrued(address participant) public view returns (uint) {
        return alkAccrued[participant];
    }

    /**
     * Return the address of the ALK token
     * @return The address of ALK
     */
    function getAlkAddress() public view returns (address) {
        return 0xc00e94Cb662C3520282E6f5717214004A7f26888;
    }

}

pragma solidity ^0.4.24;

import "./RewardControlStorage.sol";
import "./RewardControlInterface.sol";
import "./ExponentialNoError.sol";
import "./EIP20Interface.sol";

contract RewardControl is RewardControlStorage, RewardControlInterface, ExponentialNoError {

    /**
     * Events
     */

    /// @notice Emitted when a new ALK speed is calculated for a market
    event AlkSpeedUpdated(address indexed market, uint newSpeed);

    /// @notice Emitted when ALK is distributed to a participant
    event DistributedAlk(address indexed market, address indexed participant, uint participantDelta, uint marketIndexMantissa);

    event TransferredAlk(address indexed participant, uint participantAccrued);

    event OwnerUpdate(address indexed owner, address indexed newOwner);

    event MarketAdded(address indexed market, uint numberOfMarkets);

    event MarketRemoved(address indexed market, uint numberOfMarkets);

    /**
     * Constants
     */

    /// @notice The initial ALK index for a market
    uint224 public constant alkInitialIndex = 1e36;

    /// The rate at which the flywheel distributes ALK, per block
    uint public constant alkRate = 8323820396000000000;

    /**
     * Constructor
     */

    /**
     * @notice `RewardControl` is the contract to calculate and distribute reward tokens
     * @notice This contract uses Openzeppelin Upgrades plugin to make use of the upgradeability functionality using proxies
     * @notice Hence this contract has an 'initializer' in place of a 'constructor'
     * @notice Make sure to add new global variables only at the bottom of all the existing global variables i.e., line #344
     * @notice Also make sure to do extensive testing while modifying any structs and enums during an upgrade
     */
    function initializer(address _owner, address _moneyMarket, address _alkAddress) public {
        if(initializationDone == false) {
            initializationDone = true;
            owner = _owner;
            moneyMarket = MoneyMarket(_moneyMarket);
            alkAddress = _alkAddress;
        }
    }

    /**
     * Modifiers
     */

    modifier onlyOwner() {
        require(msg.sender == owner, "non-owner");
        _;
    }

    /**
     * Public functions
     */

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
    function refreshAlkIndex(address market, address participant) external {
        refreshAlkSpeeds();
        updateAlkIndex(market);
        distributeAlk(market, participant);
    }

    /**
     * @notice Claim all the ALK accrued by holder in all markets
     * @param holder The address to claim ALK for
     */
    function claimAlk(address holder) external {
        claimAlk(holder, allMarkets);
    }

    /**
     * Private functions
     */

    /**
     * Recalculate and update ALK speeds for all ALK markets
     */
    function refreshAlkSpeeds() internal {
        Exp memory totalLiquidity = Exp({mantissa : 0});
        Exp[] memory marketTotalLiquidity = new Exp[](allMarkets.length);
        address currentMarket;
        for (uint i = 0; i < allMarkets.length; i++) {
            currentMarket = allMarkets[i];
            uint currentMarketTotalSupply = getMarketTotalSupply(currentMarket);
            uint currentMarketTotalBorrows = getMarketTotalBorrows(currentMarket);
            Exp memory currentMarketTotalLiquidity = Exp({mantissa : add_(currentMarketTotalSupply, currentMarketTotalBorrows)});
            marketTotalLiquidity[i] = currentMarketTotalLiquidity;
            totalLiquidity = add_(totalLiquidity, currentMarketTotalLiquidity);
        }

        for (uint j = 0; j < allMarkets.length; j++) {
            currentMarket = allMarkets[j];
            uint newSpeed = totalLiquidity.mantissa > 0 ? mul_(alkRate, div_(marketTotalLiquidity[j], totalLiquidity)) : 0;
            alkSpeeds[currentMarket] = newSpeed;
            emit AlkSpeedUpdated(currentMarket, newSpeed);
        }
    }

    /**
     * Accrue ALK to the market by updating the index
     * @param market The market whose index to update
     */
    function updateAlkIndex(address market) internal {
        MarketState storage marketState = alkMarketState[market];
        uint marketSpeed = alkSpeeds[market]; // @TODO handle when market speed == 0
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = sub_(blockNumber, uint(marketState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint totalNetLiquidity = getTotalNetLiquidity(market);
            uint alkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = totalNetLiquidity > 0 ? fraction(alkAccrued, totalNetLiquidity) : Double({mantissa : 0});
            Double memory index = add_(Double({mantissa : marketState.index}), ratio);
            alkMarketState[market] = MarketState({
            index : safe224(index.mantissa, "new index exceeds 224 bits"),
            block : safe32(blockNumber, "block number exceeds 32 bits")
            });
        } else if (deltaBlocks > 0) {
            marketState.block = safe32(blockNumber, "block number exceeds 32 bits");
        }
    }

    /**
     * Calculate ALK accrued by a participant and add it on top of alkAccrued[participant]
     * @param market The market in which the participant is interacting
     * @param participant The address of the participant to distribute ALK to
     */
    function distributeAlk(address market, address participant) internal {
        MarketState storage marketState = alkMarketState[market];
        Double memory marketIndex = Double({mantissa : marketState.index});
        Double memory participantIndex = Double({mantissa : alkParticipantIndex[market][participant]});
        alkParticipantIndex[market][participant] = marketIndex.mantissa;

        if (participantIndex.mantissa == 0 && marketIndex.mantissa > 0) {
            participantIndex.mantissa = alkInitialIndex;
        }

        Double memory deltaIndex = sub_(marketIndex, participantIndex);
        // @TODO make sure it's correct source of data, and it might need to be across all markets instead
        uint participantNetLiquidity = getParticipantNetLiquidity(participant, market);
        uint participantDelta = mul_(participantNetLiquidity, deltaIndex);
        alkAccrued[participant] = add_(alkAccrued[participant], participantDelta);
        emit DistributedAlk(market, participant, participantDelta, marketIndex.mantissa);
    }

    /**
     * @notice Claim all the ALK accrued by holder in the specified markets
     * @param holder The address to claim ALK for
     * @param markets The list of markets to claim ALK in
     */
    function claimAlk(address holder, address[] memory markets) internal {
        for (uint i = 0; i < markets.length; i++) {
            address market = markets[i];

            updateAlkIndex(market);
            distributeAlk(market, holder);

            alkAccrued[holder] = transferAlk(holder, alkAccrued[holder]);
        }
    }

    /**
     * Transfer ALK to the user
     * @dev Note: If there is not enough ALK, we do not perform the transfer all.
     * @param participant The address of the participant to transfer ALK to
     * @param participantAccrued The amount of ALK to (possibly) transfer
     * @return The amount of ALK which was NOT transferred to the participant
     */
    function transferAlk(address participant, uint participantAccrued) internal returns (uint) {
        if (participantAccrued > 0) {
            EIP20Interface alk = EIP20Interface(getAlkAddress());
            uint alkRemaining = alk.balanceOf(address(this));
            if (participantAccrued <= alkRemaining) {
                alk.transfer(participant, participantAccrued);
                emit TransferredAlk(participant, participantAccrued);
                return 0;
            }
        }
        return participantAccrued;
    }

    /**
     * Getters
     */

    function getBlockNumber() public view returns (uint) {
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
        return alkAddress;
    }

    /**
     * Return the address of the underlying Money Market contract
     * @return The address of the underlying Money Market contract
     */
    function getMoneyMarketAddress() public view returns (address) {
        return address(moneyMarket);
    }

    function getMarketStats(address market) public constant returns (bool isSupported, uint blockNumber, address interestRateModel, uint totalSupply, uint supplyRateMantissa, uint supplyIndex, uint totalBorrows, uint borrowRateMantissa, uint borrowIndex) {
        return (moneyMarket.markets(market));
    }

    // @TODO get actual total net liquidity
    function getTotalNetLiquidity(address market) public view returns (uint) {
        uint totalSupply;
        uint totalBorrows;
        (, , , totalSupply, , , totalBorrows, , ) = getMarketStats(market);
        return add_(totalSupply, totalBorrows);
    }

    function getMarketTotalSupply(address market) public view returns (uint) {
        uint totalSupply;
        (, , , totalSupply, , , , , ) = getMarketStats(market);
        return totalSupply;
    }

    function getMarketTotalBorrows(address market) public view returns (uint) {
        uint totalBorrows;
        (, , , , , , totalBorrows, , ) = getMarketStats(market);
        return totalBorrows;
    }

    function getParticipantNetLiquidity(address participant, address market) public view returns (uint) {
        uint supplyBalance = moneyMarket.getSupplyBalance(participant, market);
        uint borrowBalance = moneyMarket.getBorrowBalance(participant, market);
        if (supplyBalance > borrowBalance) {
            return sub_(supplyBalance, borrowBalance);
        }
        return sub_(borrowBalance, supplyBalance);
    }

    /**
     * Admin functions
     */

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != owner, "TransferOwnership: the same owner.");
        newOwner = _newOwner;
    }

    function acceptOwnership() external {
        require(msg.sender == newOwner, "AcceptOwnership: only new owner do this.");
        emit OwnerUpdate(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }

    function addMarket(address market) external onlyOwner {
        require(!allMarketsIndex[market], "Market already exists");
        allMarketsIndex[market] = true;
        allMarkets.push(market);
        emit MarketAdded(market, allMarkets.length);
    }

    function removeMarket(uint id) external onlyOwner {
        require(allMarkets[id] != address(0), "Market does not exist");
        allMarketsIndex[allMarkets[id]] = false;
        address removedMarket = allMarkets[id];
        delete allMarkets[id];
        emit MarketRemoved(removedMarket, allMarkets.length);
    }

    function setAlkAddress(address _alkAddress) external onlyOwner {
        require(alkAddress != _alkAddress, "The same ALK address");
        require(_alkAddress != address(0), "ALK address cannot be empty");
        alkAddress = _alkAddress;
    }

    function setMoneyMarketAddress(address _moneyMarket) external onlyOwner {
        require(address(moneyMarket) != _moneyMarket, "The same Money Market address");
        require(_moneyMarket != address(0), "MoneyMarket address cannot be empty");
        moneyMarket = MoneyMarket(_moneyMarket);
    }

}

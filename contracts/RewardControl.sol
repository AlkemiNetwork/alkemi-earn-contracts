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

    /// @notice Emitted when ALK is distributed to a supplier
    event DistributedSupplierAlk(address indexed market, address indexed supplier, uint supplierDelta, uint supplierAccruedAlk, uint supplyIndexMantissa);

    /// @notice Emitted when ALK is distributed to a borrower
    event DistributedBorrowerAlk(address indexed market, address indexed borrower, uint borrowerDelta, uint borrowerAccruedAlk, uint borrowIndexMantissa);

    event TransferredAlk(address indexed participant, uint participantAccrued);

    event OwnerUpdate(address indexed owner, address indexed newOwner);

    event MarketAdded(address indexed market, uint numberOfMarkets);

    event MarketRemoved(address indexed market, uint numberOfMarkets);

    /**
     * Constants
     */

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
        if (initializationDone == false) {
            initializationDone = true;
            owner = _owner;
            moneyMarket = MoneyMarket(_moneyMarket);
            alkAddress = _alkAddress;
            alkRate = 4161910200000000000;
            // 8323820396000000000 divided by 2 (for lending and borrowing separately)
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
     */
    function refreshAlkSupplyIndex(address market, address supplier) external {
        refreshAlkSpeeds();
        updateAlkSupplyIndex(market);
        distributeSupplierAlk(market, supplier);
    }

    /** usage
     * borrowAllowed --> borrow
     * repayBorrowAllowed --> repayBorrow
     * refreshCompSpeedsInternal (used by refreshCompSpeeds)
     * claimComp --> claimAlk
     */
    function refreshAlkBorrowIndex(address market, address borrower) external {
        refreshAlkSpeeds();
        updateAlkBorrowIndex(market);
        distributeBorrowerAlk(market, borrower);
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
     * Accrue ALK to the market by updating the supply index
     * @param market The market whose supply index to update
     */
    function updateAlkSupplyIndex(address market) internal {
        MarketState storage supplyState = alkSupplyState[market];
        uint marketSpeed = alkSpeeds[market];
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = sub_(blockNumber, uint(supplyState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint marketTotalSupply = getMarketTotalSupply(market);
            uint alkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = marketTotalSupply > 0 ? fraction(alkAccrued, marketTotalSupply) : Double({mantissa : 0});
            Double memory index = add_(Double({mantissa : supplyState.index}), ratio);
            alkSupplyState[market] = MarketState({
            index : safe224(index.mantissa, "new index exceeds 224 bits"),
            block : safe32(blockNumber, "block number exceeds 32 bits")
            });
        } else if (deltaBlocks > 0) {
            supplyState.block = safe32(blockNumber, "block number exceeds 32 bits");
        }
    }

    /**
     * Accrue ALK to the market by updating the borrow index
     * @param market The market whose borrow index to update
     */
    function updateAlkBorrowIndex(address market) internal {
        MarketState storage borrowState = alkBorrowState[market];
        uint marketSpeed = alkSpeeds[market];
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = sub_(blockNumber, uint(borrowState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint marketTotalBorrows = getMarketTotalBorrows(market);
            uint alkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = marketTotalBorrows > 0 ? fraction(alkAccrued, marketTotalBorrows) : Double({mantissa : 0});
            Double memory index = add_(Double({mantissa : borrowState.index}), ratio);
            alkBorrowState[market] = MarketState({
            index : safe224(index.mantissa, "new index exceeds 224 bits"),
            block : safe32(blockNumber, "block number exceeds 32 bits")
            });
        } else if (deltaBlocks > 0) {
            borrowState.block = safe32(blockNumber, "block number exceeds 32 bits");
        }
    }

    /**
     * Calculate ALK accrued by a supplier and add it on top of alkAccrued[supplier]
     * @param market The market in which the supplier is interacting
     * @param supplier The address of the supplier to distribute ALK to
     */
    function distributeSupplierAlk(address market, address supplier) internal {
        MarketState storage supplyState = alkSupplyState[market];
        Double memory supplyIndex = Double({mantissa : supplyState.index});
        Double memory supplierIndex = Double({mantissa : alkSupplierIndex[market][supplier]});
        alkSupplierIndex[market][supplier] = supplyIndex.mantissa;

        if (supplierIndex.mantissa > 0) {
            Double memory deltaIndex = sub_(supplyIndex, supplierIndex);
            uint supplierBalance = moneyMarket.getSupplyBalance(supplier, market);
            uint supplierDelta = mul_(supplierBalance, deltaIndex);
            alkAccrued[supplier] = add_(alkAccrued[supplier], supplierDelta);
            emit DistributedSupplierAlk(market, supplier, supplierDelta, alkAccrued[supplier], supplyIndex.mantissa);
        }
    }

    /**
     * Calculate ALK accrued by a borrower and add it on top of alkAccrued[borrower]
     * @param market The market in which the borrower is interacting
     * @param borrower The address of the borrower to distribute ALK to
     */
    function distributeBorrowerAlk(address market, address borrower) internal {
        MarketState storage borrowState = alkBorrowState[market];
        Double memory borrowIndex = Double({mantissa : borrowState.index});
        Double memory borrowerIndex = Double({mantissa : alkBorrowerIndex[market][borrower]});
        alkBorrowerIndex[market][borrower] = borrowIndex.mantissa;

        if (borrowerIndex.mantissa > 0) {
            Double memory deltaIndex = sub_(borrowIndex, borrowerIndex);
            uint borrowerBalance = moneyMarket.getBorrowBalance(borrower, market);
            uint borrowerDelta = mul_(borrowerBalance, deltaIndex);
            alkAccrued[borrower] = add_(alkAccrued[borrower], borrowerDelta);
            emit DistributedBorrowerAlk(market, borrower, borrowerDelta, alkAccrued[borrower], borrowIndex.mantissa);
        }
    }

    /**
     * @notice Claim all the ALK accrued by holder in the specified markets
     * @param holder The address to claim ALK for
     * @param markets The list of markets to claim ALK in
     */
    function claimAlk(address holder, address[] memory markets) internal {
        for (uint i = 0; i < markets.length; i++) {
            address market = markets[i];

            updateAlkSupplyIndex(market);
            distributeSupplierAlk(market, holder);

            updateAlkBorrowIndex(market);
            distributeBorrowerAlk(market, holder);

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

    function getMarketTotalSupply(address market) public view returns (uint) {
        uint totalSupply;
        (,,, totalSupply,,,,,) = getMarketStats(market);
        return totalSupply;
    }

    function getMarketTotalBorrows(address market) public view returns (uint) {
        uint totalBorrows;
        (,,,,,, totalBorrows,,) = getMarketStats(market);
        return totalBorrows;
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

    function setAlkRate(uint _alkRate) external onlyOwner {
        alkRate = _alkRate;
    }

}

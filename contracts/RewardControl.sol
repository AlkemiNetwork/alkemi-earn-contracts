pragma solidity 0.4.24;

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

    /// @notice Emitted when ALK is transferred to a participant
    event TransferredAlk(address indexed participant, uint participantAccrued);

    /// @notice Emitted when the owner of the contract is updated
    event OwnerUpdate(address indexed owner, address indexed newOwner);

    /// @notice Emitted when a market is added
    event MarketAdded(address indexed market, uint numberOfMarkets);

    /// @notice Emitted when a market is removed
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
     * @notice Make sure to add new global variables only in a derived contract of RewardControlStorage, inherited by this contract
     * @notice Also make sure to do extensive testing while modifying any structs and enums during an upgrade
     */
    function initializer(address _owner, address _moneyMarket, address _alkAddress) public {
        if (initializationDone == false) {
            initializationDone = true;
            owner = _owner;
            moneyMarket = MoneyMarket(_moneyMarket);
            alkAddress = _alkAddress;
            alkRate = 4161910200000000000;
            // 8323820396000000000 divided by 2 (for lending or borrowing)
        }
    }

    /**
     * Modifiers
     */

    /**
     * @notice Make sure that the sender is only the owner of the contract
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "non-owner");
        _;
    }

    /**
     * Public functions
     */

    /**
     * @notice Refresh ALK supply index for the specified market and supplier
     * @param market The market whose supply index to update
     * @param supplier The address of the supplier to distribute ALK to
     */
    function refreshAlkSupplyIndex(address market, address supplier) external {
        if (!allMarketsIndex[market]) {
            return;
        }
        refreshAlkSpeeds();
        updateAlkSupplyIndex(market);
        distributeSupplierAlk(market, supplier);
    }

    /**
     * @notice Refresh ALK borrow index for the specified market and borrower
     * @param market The market whose borrow index to update
     * @param borrower The address of the borrower to distribute ALK to
     */
    function refreshAlkBorrowIndex(address market, address borrower) external {
        if (!allMarketsIndex[market]) {
            return;
        }
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
     * @notice Claim all the ALK accrued by holder in the specified market
     * @param holder The address to claim ALK for
     * @param market The address of the market to claim ALK for
     */
    function claimAlk(address holder, address market) external {
        require(allMarketsIndex[market], "Market does not exist");
        address[] memory markets = new address[](1);
        markets[0] = market;
        claimAlk(holder, markets);
    }

    /**
     * Private functions
     */

    /**
     * @notice Recalculate and update ALK speeds for all markets
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
     * @notice Accrue ALK to the market by updating the supply index
     * @param market The market whose supply index to update
     */
    function updateAlkSupplyIndex(address market) internal {
        MarketState storage supplyState = alkSupplyState[market];
        uint marketSpeed = alkSpeeds[market];
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = sub_(blockNumber, uint(supplyState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint marketTotalSupply = getMarketTotalSupply(market);
            uint supplyAlkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = marketTotalSupply > 0 ? fraction(supplyAlkAccrued, marketTotalSupply) : Double({mantissa : 0});
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
     * @notice Accrue ALK to the market by updating the borrow index
     * @param market The market whose borrow index to update
     */
    function updateAlkBorrowIndex(address market) internal {
        MarketState storage borrowState = alkBorrowState[market];
        uint marketSpeed = alkSpeeds[market];
        uint blockNumber = getBlockNumber();
        uint deltaBlocks = sub_(blockNumber, uint(borrowState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint marketTotalBorrows = getMarketTotalBorrows(market);
            uint borrowAlkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = marketTotalBorrows > 0 ? fraction(borrowAlkAccrued, marketTotalBorrows) : Double({mantissa : 0});
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
     * @notice Calculate ALK accrued by a supplier and add it on top of alkAccrued[supplier]
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
            uint supplierBalance = getSupplyBalance(market, supplier);
            uint supplierDelta = mul_(supplierBalance, deltaIndex);
            alkAccrued[supplier] = add_(alkAccrued[supplier], supplierDelta);
            emit DistributedSupplierAlk(market, supplier, supplierDelta, alkAccrued[supplier], supplyIndex.mantissa);
        }
    }

    /**
     * @notice Calculate ALK accrued by a borrower and add it on top of alkAccrued[borrower]
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
            uint borrowerBalance = getBorrowBalance(market, borrower);
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
     * @notice Transfer ALK to the participant
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

    /**
     * @notice Get the current block number
     * @return The current block number
     */
    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    /**
     * @notice Get the current accrued ALK for a participant
     * @param participant The address of the participant
     * @return The amount of accrued ALK for the participant
     */
    function getAlkAccrued(address participant) public view returns (uint) {
        return alkAccrued[participant];
    }

    /**
     * @notice Get the address of the ALK token
     * @return The address of ALK token
     */
    function getAlkAddress() public view returns (address) {
        return alkAddress;
    }

    /**
     * @notice Get the address of the underlying Money Market contract
     * @return The address of the underlying Money Market contract
     */
    function getMoneyMarketAddress() public view returns (address) {
        return address(moneyMarket);
    }

    /**
     * @notice Get market statistics from the Money Market contract
     * @param market The address of the market
     * @return Market statistics for the given market
     */
    function getMarketStats(address market) public view returns (bool isSupported, uint blockNumber, address interestRateModel, uint totalSupply, uint supplyRateMantissa, uint supplyIndex, uint totalBorrows, uint borrowRateMantissa, uint borrowIndex) {
        return (moneyMarket.markets(market));
    }

    /**
     * @notice Get market total supply from the Money Market contract
     * @param market The address of the market
     * @return Market total supply for the given market
     */
    function getMarketTotalSupply(address market) public view returns (uint) {
        uint totalSupply;
        (,,, totalSupply,,,,,) = getMarketStats(market);
        return totalSupply;
    }

    /**
     * @notice Get market total borrows from the Money Market contract
     * @param market The address of the market
     * @return Market total borrows for the given market
     */
    function getMarketTotalBorrows(address market) public view returns (uint) {
        uint totalBorrows;
        (,,,,,, totalBorrows,,) = getMarketStats(market);
        return totalBorrows;
    }

    /**
     * @notice Get supply balance of the specified market and supplier
     * @param market The address of the market
     * @param supplier The address of the supplier
     * @return Supply balance of the specified market and supplier
     */
    function getSupplyBalance(address market, address supplier) public view returns (uint) {
        return moneyMarket.getSupplyBalance(supplier, market);
    }

    /**
     * @notice Get borrow balance of the specified market and borrower
     * @param market The address of the market
     * @param borrower The address of the borrower
     * @return Borrow balance of the specified market and borrower
     */
    function getBorrowBalance(address market, address borrower) public view returns (uint) {
        return moneyMarket.getBorrowBalance(borrower, market);
    }

    /**
     * Admin functions
     */

    /**
     * @notice Transfer the ownership of this contract to the new owner. The ownership will not be transferred until the new owner accept it.
     * @param _newOwner The address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != owner, "TransferOwnership: the same owner.");
        newOwner = _newOwner;
    }

    /**
     * @notice Accept the ownership of this contract by the new owner
     */
    function acceptOwnership() external {
        require(msg.sender == newOwner, "AcceptOwnership: only new owner do this.");
        emit OwnerUpdate(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }

    /**
     * @notice Add new market to the reward program
     * @param market The address of the new market to be added to the reward program
     */
    function addMarket(address market) external onlyOwner {
        require(!allMarketsIndex[market], "Market already exists");
        allMarketsIndex[market] = true;
        allMarkets.push(market);
        emit MarketAdded(market, allMarkets.length);
    }

    /**
     * @notice Remove a market from the reward program based on array index
     * @param id The index of the `allMarkets` array to be removed
     */
    function removeMarket(uint id) external onlyOwner {
        if (id >= allMarkets.length) {
            return;
        }
        allMarketsIndex[allMarkets[id]] = false;
        address removedMarket = allMarkets[id];

        for (uint i = id; i < allMarkets.length - 1; i++) {
            allMarkets[i] = allMarkets[i + 1];
        }
        allMarkets.length--;
        emit MarketRemoved(removedMarket, allMarkets.length);
    }

    /**
     * @notice Set ALK token address
     * @param _alkAddress The ALK token address
     */
    function setAlkAddress(address _alkAddress) external onlyOwner {
        require(alkAddress != _alkAddress, "The same ALK address");
        require(_alkAddress != address(0), "ALK address cannot be empty");
        alkAddress = _alkAddress;
    }

    /**
     * @notice Set Money Market contract address
     * @param _moneyMarket The Money Market contract address
     */
    function setMoneyMarketAddress(address _moneyMarket) external onlyOwner {
        require(address(moneyMarket) != _moneyMarket, "The same Money Market address");
        require(_moneyMarket != address(0), "MoneyMarket address cannot be empty");
        moneyMarket = MoneyMarket(_moneyMarket);
    }

    /**
     * @notice Set ALK rate
     * @param _alkRate The ALK rate
     */
    function setAlkRate(uint _alkRate) external onlyOwner {
        alkRate = _alkRate;
    }

}

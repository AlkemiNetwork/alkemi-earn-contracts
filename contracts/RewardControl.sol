pragma solidity 0.4.24;

import "./RewardControlStorage.sol";
import "./RewardControlInterface.sol";
import "./ExponentialNoError.sol";
import "./EIP20Interface.sol";

contract RewardControl is
    RewardControlStorage,
    RewardControlInterface,
    ExponentialNoError
{
    /**
     * Events
     */

    /// @notice Emitted when a new ALK speed is calculated for a market
    event AlkSpeedUpdated(address indexed market, uint256 newSpeed, bool isVerified);

    /// @notice Emitted when ALK is distributed to a supplier
    event DistributedSupplierAlk(
        address indexed market,
        address indexed supplier,
        uint256 supplierDelta,
        uint256 supplierAccruedAlk,
        uint256 supplyIndexMantissa,
        bool isVerified
    );

    /// @notice Emitted when ALK is distributed to a borrower
    event DistributedBorrowerAlk(
        address indexed market,
        address indexed borrower,
        uint256 borrowerDelta,
        uint256 borrowerAccruedAlk,
        uint256 borrowIndexMantissa,
        bool isVerified
    );

    /// @notice Emitted when ALK is transferred to a participant
    event TransferredAlk(
        address indexed participant,
        uint256 participantAccrued,
        address market,
        bool isVerified
    );

    /// @notice Emitted when the owner of the contract is updated
    event OwnerUpdate(address indexed owner, address indexed newOwner);

    /// @notice Emitted when a market is added
    event MarketAdded(address indexed market, uint256 numberOfMarkets, bool isVerified);

    /// @notice Emitted when a market is removed
    event MarketRemoved(address indexed market, uint256 numberOfMarkets, bool isVerified);

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
    function initializer(
        address _owner,
        address _alkemiEarnVerified,
        address _alkemiEarnPublic,
        address _alkAddress
    ) public {
        if (initializationDone == false) {
            initializationDone = true;
            owner = _owner;
            alkemiEarnVerified = AlkemiEarnVerified(_alkemiEarnVerified);
            alkemiEarnPublic = AlkemiEarnPublic(_alkemiEarnPublic);
            alkAddress = _alkAddress;
            alkRate = 8323820396000000000;
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
     * @param isVerified Specifies if the market is from verified or public protocol
     */
    function refreshAlkSupplyIndex(address market, address supplier, bool isVerified) external {
        if (!allMarketsIndex[isVerified][market]) {
            return;
        }
        refreshAlkSpeeds();
        updateAlkSupplyIndex(market, isVerified);
        distributeSupplierAlk(market, supplier, isVerified);
    }

    /**
     * @notice Refresh ALK borrow index for the specified market and borrower
     * @param market The market whose borrow index to update
     * @param borrower The address of the borrower to distribute ALK to
     * @param isVerified Specifies if the market is from verified or public protocol
     */
    function refreshAlkBorrowIndex(address market, address borrower, bool isVerified) external {
        if (!allMarketsIndex[isVerified][market]) {
            return;
        }
        refreshAlkSpeeds();
        updateAlkBorrowIndex(market, isVerified);
        distributeBorrowerAlk(market, borrower, isVerified);
    }

    /**
     * @notice Claim all the ALK accrued by holder in all markets
     * @param holder The address to claim ALK for
     */
    function claimAlk(address holder) external {
        claimAlk(holder, allMarkets[true], true);
        claimAlk(holder, allMarkets[false], false);
    }

    /**
     * @notice Claim all the ALK accrued by holder by refreshing the indexes on the specified market only
     * @param holder The address to claim ALK for
     * @param market The address of the market to refresh the indexes for
     * @param isVerified Specifies if the market is from verified or public protocol
     */
    function claimAlk(address holder, address market, bool isVerified) external {
        require(allMarketsIndex[isVerified][market], "Market does not exist");
        address[] memory markets = new address[](1);
        markets[0] = market;
        claimAlk(holder, markets, isVerified);
    }

    /**
     * Private functions
     */

    /**
     * @notice Recalculate and update ALK speeds for all markets
     */
    function refreshMarketLiquidity() internal view returns (Exp[] memory, Exp memory) {
        Exp memory totalLiquidity = Exp({mantissa: 0});
        Exp[] memory marketTotalLiquidity = new Exp[](add_(allMarkets[true].length, allMarkets[false].length));
        address currentMarket;
        for (uint256 i = 0; i < allMarkets[true].length; i++) {
            currentMarket = allMarkets[true][i];
            uint256 currentMarketTotalSupply = getMarketTotalSupply(
                currentMarket,
                true
            );
            uint256 currentMarketTotalBorrows = getMarketTotalBorrows(
                currentMarket,
                true
            );
            Exp memory currentMarketTotalLiquidity = Exp({
                mantissa: add_(
                    currentMarketTotalSupply,
                    currentMarketTotalBorrows
                )
            });
            marketTotalLiquidity[i] = currentMarketTotalLiquidity;
            totalLiquidity = add_(totalLiquidity, currentMarketTotalLiquidity);
        }

        for (uint256 j = 0; j < allMarkets[false].length; j++) {
            currentMarket = allMarkets[false][j];
            currentMarketTotalSupply = getMarketTotalSupply(
                currentMarket,
                false
            );
            currentMarketTotalBorrows = getMarketTotalBorrows(
                currentMarket,
                false
            );
            currentMarketTotalLiquidity = Exp({
                mantissa: add_(
                    currentMarketTotalSupply,
                    currentMarketTotalBorrows
                )
            });
            marketTotalLiquidity[allMarkets[false].length + j] = currentMarketTotalLiquidity;
            totalLiquidity = add_(totalLiquidity, currentMarketTotalLiquidity);
        }
        return (marketTotalLiquidity,totalLiquidity);
    }

    /**
     * @notice Recalculate and update ALK speeds for all markets
     */
    function refreshAlkSpeeds() internal {
        address currentMarket;
        (Exp[] memory marketTotalLiquidity, Exp memory totalLiquidity) = refreshMarketLiquidity();

        for (uint256 i = 0; i < allMarkets[true].length; i++) {
            currentMarket = allMarkets[true][i];
            uint256 newSpeed = totalLiquidity.mantissa > 0
                ? mul_(alkRate, div_(marketTotalLiquidity[i], totalLiquidity))
                : 0;
            alkSpeeds[true][currentMarket] = newSpeed;
            emit AlkSpeedUpdated(currentMarket, newSpeed, true);
        }

        for (uint256 j = 0; j < allMarkets[false].length; j++) {
            currentMarket = allMarkets[false][j];
            newSpeed = totalLiquidity.mantissa > 0
                ? mul_(alkRate, div_(marketTotalLiquidity[allMarkets[true].length + j], totalLiquidity))
                : 0;
            alkSpeeds[false][currentMarket] = newSpeed;
            emit AlkSpeedUpdated(currentMarket, newSpeed, false);
        }
    }

    /**
     * @notice Accrue ALK to the market by updating the supply index
     * @param market The market whose supply index to update
     * @param isVerified Verified / Public protocol
     */
    function updateAlkSupplyIndex(address market, bool isVerified) internal {
        MarketState storage supplyState = alkSupplyState[isVerified][market];
        uint256 marketSpeed = alkSpeeds[isVerified][market];
        uint256 blockNumber = getBlockNumber();
        uint256 deltaBlocks = sub_(blockNumber, uint256(supplyState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint256 marketTotalSupply = getMarketTotalSupply(market, isVerified);
            uint256 supplyAlkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = marketTotalSupply > 0
                ? fraction(supplyAlkAccrued, marketTotalSupply)
                : Double({mantissa: 0});
            Double memory index = add_(
                Double({mantissa: supplyState.index}),
                ratio
            );
            alkSupplyState[isVerified][market] = MarketState({
                index: safe224(index.mantissa, "new index exceeds 224 bits"),
                block: safe32(blockNumber, "block number exceeds 32 bits")
            });
        } else if (deltaBlocks > 0) {
            supplyState.block = safe32(
                blockNumber,
                "block number exceeds 32 bits"
            );
        }
    }

    /**
     * @notice Accrue ALK to the market by updating the borrow index
     * @param market The market whose borrow index to update
     * @param isVerified Verified / Public protocol
     */
    function updateAlkBorrowIndex(address market, bool isVerified) internal {
        MarketState storage borrowState = alkBorrowState[isVerified][market];
        uint256 marketSpeed = alkSpeeds[isVerified][market];
        uint256 blockNumber = getBlockNumber();
        uint256 deltaBlocks = sub_(blockNumber, uint256(borrowState.block));
        if (deltaBlocks > 0 && marketSpeed > 0) {
            uint256 marketTotalBorrows = getMarketTotalBorrows(market, isVerified);
            uint256 borrowAlkAccrued = mul_(deltaBlocks, marketSpeed);
            Double memory ratio = marketTotalBorrows > 0
                ? fraction(borrowAlkAccrued, marketTotalBorrows)
                : Double({mantissa: 0});
            Double memory index = add_(
                Double({mantissa: borrowState.index}),
                ratio
            );
            alkBorrowState[isVerified][market] = MarketState({
                index: safe224(index.mantissa, "new index exceeds 224 bits"),
                block: safe32(blockNumber, "block number exceeds 32 bits")
            });
        } else if (deltaBlocks > 0) {
            borrowState.block = safe32(
                blockNumber,
                "block number exceeds 32 bits"
            );
        }
    }

    /**
     * @notice Calculate ALK accrued by a supplier and add it on top of alkAccrued[supplier]
     * @param market The market in which the supplier is interacting
     * @param supplier The address of the supplier to distribute ALK to
     * @param isVerified Verified / Public protocol
     */
    function distributeSupplierAlk(address market, address supplier, bool isVerified) internal {
        MarketState storage supplyState = alkSupplyState[isVerified][market];
        Double memory supplyIndex = Double({mantissa: supplyState.index});
        Double memory supplierIndex = Double({
            mantissa: alkSupplierIndex[isVerified][market][supplier]
        });
        alkSupplierIndex[isVerified][market][supplier] = supplyIndex.mantissa;

        if (supplierIndex.mantissa > 0) {
            Double memory deltaIndex = sub_(supplyIndex, supplierIndex);
            uint256 supplierBalance = getSupplyBalance(market, supplier, isVerified);
            uint256 supplierDelta = mul_(supplierBalance, deltaIndex);
            alkAccrued[supplier] = add_(alkAccrued[supplier], supplierDelta);
            emit DistributedSupplierAlk(
                market,
                supplier,
                supplierDelta,
                alkAccrued[supplier],
                supplyIndex.mantissa,
                isVerified
            );
        }
    }

    /**
     * @notice Calculate ALK accrued by a borrower and add it on top of alkAccrued[borrower]
     * @param market The market in which the borrower is interacting
     * @param borrower The address of the borrower to distribute ALK to
     * @param isVerified Verified / Public protocol
     */
    function distributeBorrowerAlk(address market, address borrower, bool isVerified) internal {
        MarketState storage borrowState = alkBorrowState[isVerified][market];
        Double memory borrowIndex = Double({mantissa: borrowState.index});
        Double memory borrowerIndex = Double({
            mantissa: alkBorrowerIndex[isVerified][market][borrower]
        });
        alkBorrowerIndex[isVerified][market][borrower] = borrowIndex.mantissa;

        if (borrowerIndex.mantissa > 0) {
            Double memory deltaIndex = sub_(borrowIndex, borrowerIndex);
            uint256 borrowerBalance = getBorrowBalance(market, borrower, isVerified);
            uint256 borrowerDelta = mul_(borrowerBalance, deltaIndex);
            alkAccrued[borrower] = add_(alkAccrued[borrower], borrowerDelta);
            emit DistributedBorrowerAlk(
                market,
                borrower,
                borrowerDelta,
                alkAccrued[borrower],
                borrowIndex.mantissa,
                isVerified
            );
        }
    }

    /**
     * @notice Claim all the ALK accrued by holder in the specified markets
     * @param holder The address to claim ALK for
     * @param markets The list of markets to claim ALK in
     * @param isVerified Verified / Public protocol
     */
    function claimAlk(address holder, address[] memory markets, bool isVerified) internal {
        for (uint256 i = 0; i < markets.length; i++) {
            address market = markets[i];

            updateAlkSupplyIndex(market, isVerified);
            distributeSupplierAlk(market, holder, isVerified);

            updateAlkBorrowIndex(market, isVerified);
            distributeBorrowerAlk(market, holder, isVerified);

            alkAccrued[holder] = transferAlk(holder, alkAccrued[holder], market, isVerified);
        }
    }

    /**
     * @notice Transfer ALK to the participant
     * @dev Note: If there is not enough ALK, we do not perform the transfer all.
     * @param participant The address of the participant to transfer ALK to
     * @param participantAccrued The amount of ALK to (possibly) transfer
     * @param market Market for which ALK is transferred
     * @param isVerified Verified / Public Protocol
     * @return The amount of ALK which was NOT transferred to the participant
     */
    function transferAlk(address participant, uint256 participantAccrued, address market, bool isVerified)
        internal
        returns (uint256)
    {
        if (participantAccrued > 0) {
            EIP20Interface alk = EIP20Interface(getAlkAddress());
            uint256 alkRemaining = alk.balanceOf(address(this));
            if (participantAccrued <= alkRemaining) {
                alk.transfer(participant, participantAccrued);
                emit TransferredAlk(participant, participantAccrued, market, isVerified);
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
    function getBlockNumber() public view returns (uint256) {
        return block.number;
    }

    /**
     * @notice Get the current accrued ALK for a participant
     * @param participant The address of the participant
     * @return The amount of accrued ALK for the participant
     */
    function getAlkAccrued(address participant) public view returns (uint256) {
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
     * @notice Get the address of the underlying AlkemiEarnVerified and AlkemiEarnPublic contract
     * @return The address of the underlying AlkemiEarnVerified and AlkemiEarnPublic contract
     */
    function getAlkemiEarnAddress() public view returns (address, address) {
        return (address(alkemiEarnVerified), address(alkemiEarnPublic));
    }

    /**
     * @notice Get market statistics from the AlkemiEarnVerified contract
     * @param market The address of the market
     * @param isVerified Verified / Public protocol
     * @return Market statistics for the given market
     */
    function getMarketStats(address market, bool isVerified)
        public
        view
        returns (
            bool isSupported,
            uint256 blockNumber,
            address interestRateModel,
            uint256 totalSupply,
            uint256 supplyRateMantissa,
            uint256 supplyIndex,
            uint256 totalBorrows,
            uint256 borrowRateMantissa,
            uint256 borrowIndex
        )
    {   
        if(isVerified){
            return (alkemiEarnVerified.markets(market));
        } else {
            return (alkemiEarnPublic.markets(market));
        }
    }

    /**
     * @notice Get market total supply from the AlkemiEarnVerified / AlkemiEarnPublic contract
     * @param market The address of the market
     * @param isVerified Verified / Public protocol
     * @return Market total supply for the given market
     */
    function getMarketTotalSupply(address market, bool isVerified)
        public
        view
        returns (uint256)
    {
        uint256 totalSupply;
        (, , , totalSupply, , , , , ) = getMarketStats(market, isVerified);
        return totalSupply;
    }

    /**
     * @notice Get market total borrows from the AlkemiEarnVerified contract
     * @param market The address of the market
     * @param isVerified Verified / Public protocol
     * @return Market total borrows for the given market
     */
    function getMarketTotalBorrows(address market, bool isVerified)
        public
        view
        returns (uint256)
    {
        uint256 totalBorrows;
        (, , , , , , totalBorrows, , ) = getMarketStats(market, isVerified);
        return totalBorrows;
    }

    /**
     * @notice Get supply balance of the specified market and supplier
     * @param market The address of the market
     * @param supplier The address of the supplier
     * @param isVerified Verified / Public protocol
     * @return Supply balance of the specified market and supplier
     */
    function getSupplyBalance(address market, address supplier, bool isVerified)
        public
        view
        returns (uint256)
    {
        if(isVerified){
            return alkemiEarnVerified.getSupplyBalance(supplier, market);
        } else {
            return alkemiEarnPublic.getSupplyBalance(supplier, market);
        }
    }

    /**
     * @notice Get borrow balance of the specified market and borrower
     * @param market The address of the market
     * @param borrower The address of the borrower
     * @param isVerified Verified / Public protocol
     * @return Borrow balance of the specified market and borrower
     */
    function getBorrowBalance(address market, address borrower, bool isVerified)
        public
        view
        returns (uint256)
    {
        if(isVerified){
            return alkemiEarnVerified.getBorrowBalance(borrower, market);
        } else {
            return alkemiEarnPublic.getBorrowBalance(borrower, market);
        }
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
        require(
            msg.sender == newOwner,
            "AcceptOwnership: only new owner do this."
        );
        emit OwnerUpdate(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }

    /**
     * @notice Add new market to the reward program
     * @param market The address of the new market to be added to the reward program
     * @param isVerified Verified / Public protocol
     */
    function addMarket(address market, bool isVerified) external onlyOwner {
        require(!allMarketsIndex[isVerified][market], "Market already exists");
        allMarketsIndex[isVerified][market] = true;
        allMarkets[isVerified].push(market);
        emit MarketAdded(market, add_(allMarkets[isVerified].length, allMarkets[!isVerified].length), isVerified);
    }

    /**
     * @notice Remove a market from the reward program based on array index
     * @param id The index of the `allMarkets` array to be removed
     * @param isVerified Verified / Public protocol
     */
    function removeMarket(uint256 id, bool isVerified) external onlyOwner {
        if (id >= allMarkets[isVerified].length) {
            return;
        }
        allMarketsIndex[isVerified][allMarkets[isVerified][id]] = false;
        address removedMarket = allMarkets[isVerified][id];

        for (uint256 i = id; i < allMarkets[isVerified].length - 1; i++) {
            allMarkets[isVerified][i] = allMarkets[isVerified][i + 1];
        }
        allMarkets[isVerified].length--;
        emit MarketRemoved(removedMarket, add_(allMarkets[isVerified].length, allMarkets[!isVerified].length), isVerified);
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
     * @notice Set AlkemiEarnVerified contract address
     * @param _alkemiEarnVerified The AlkemiEarnVerified contract address
     */
    function setAlkemiEarnVerifiedAddress(address _alkemiEarnVerified)
        external
        onlyOwner
    {
        require(
            address(alkemiEarnVerified) != _alkemiEarnVerified,
            "The same AlkemiEarnVerified address"
        );
        require(
            _alkemiEarnVerified != address(0),
            "AlkemiEarnVerified address cannot be empty"
        );
        alkemiEarnVerified = AlkemiEarnVerified(_alkemiEarnVerified);
    }

    /**
     * @notice Set AlkemiEarnPublic contract address
     * @param _alkemiEarnPublic The AlkemiEarnVerified contract address
     */
    function setAlkemiEarnPublicAddress(address _alkemiEarnPublic)
        external
        onlyOwner
    {
        require(
            address(alkemiEarnPublic) != _alkemiEarnPublic,
            "The same AlkemiEarnPublic address"
        );
        require(
            _alkemiEarnPublic != address(0),
            "AlkemiEarnPublic address cannot be empty"
        );
        alkemiEarnPublic = AlkemiEarnPublic(_alkemiEarnPublic);
    }

    /**
     * @notice Set ALK rate
     * @param _alkRate The ALK rate
     */
    function setAlkRate(uint256 _alkRate) external onlyOwner {
        alkRate = _alkRate;
    }

    /**
     * @notice Get latest ALK rewards
     * @param user the supplier/borrower
     */
    function getAlkRewards(address user) external view returns (uint) {
        // Refresh ALK speeds
        uint256 alkRewards = alkAccrued[user];
        (Exp[] memory marketTotalLiquidity, Exp memory totalLiquidity) = refreshMarketLiquidity();
        for (uint256 i = 0; i < allMarkets[true].length; i++) {
            alkRewards = add_(alkRewards,add_(getSupplyAlkRewards(totalLiquidity,marketTotalLiquidity,user,i,i,true),getBorrowAlkRewards(totalLiquidity,marketTotalLiquidity,user,i,i,true)));
        }
        for (uint256 j = 0; j < allMarkets[false].length; j++) {
            alkRewards = add_(alkRewards,add_(getSupplyAlkRewards(totalLiquidity,marketTotalLiquidity,user,allMarkets[true].length + j,j,false),getBorrowAlkRewards(totalLiquidity,marketTotalLiquidity,user,allMarkets[true].length + j,j,false)));
        }
        return alkRewards;
    }

    /**
     * @notice Get latest Supply ALK rewards
     * @param totalLiquidity Total Liquidity of all markets
     * @param marketTotalLiquidity Array of individual market liquidity
     * @param user the supplier
     * @param i index of the market in marketTotalLiquidity array
     * @param j index of the market in the verified/public allMarkets array
     * @param isVerified Verified / Public protocol
     */
    function getSupplyAlkRewards(Exp memory totalLiquidity, Exp[] memory marketTotalLiquidity, address user, uint i, uint j, bool isVerified) internal view returns(uint256) {
            uint256 newSpeed = totalLiquidity.mantissa > 0
                ? mul_(alkRate, div_(marketTotalLiquidity[i], totalLiquidity))
                : 0;
            MarketState memory supplyState = alkSupplyState[isVerified][allMarkets[isVerified][j]];
            if (sub_(getBlockNumber(), uint256(supplyState.block)) > 0 && newSpeed > 0) {
                Double memory index = add_(
                    Double({mantissa: supplyState.index}),
                    (getMarketTotalSupply(allMarkets[isVerified][j], isVerified) > 0
                    ? fraction(mul_(sub_(getBlockNumber(), uint256(supplyState.block)), newSpeed), getMarketTotalSupply(allMarkets[isVerified][j], isVerified))
                    : Double({mantissa: 0}))
                );
                supplyState = MarketState({
                    index: safe224(index.mantissa, "new index exceeds 224 bits"),
                    block: safe32(getBlockNumber(), "block number exceeds 32 bits")
                });
            } else if (sub_(getBlockNumber(), uint256(supplyState.block)) > 0) {
                supplyState.block = safe32(
                    getBlockNumber(),
                    "block number exceeds 32 bits"
                );
            }

            if (isVerified && Double({
                mantissa: alkSupplierIndex[isVerified][allMarkets[isVerified][j]][user]
            }).mantissa > 0) {
                return mul_(alkemiEarnVerified.getSupplyBalance(user, allMarkets[isVerified][j]), sub_(Double({mantissa: supplyState.index}), Double({
                mantissa: alkSupplierIndex[isVerified][allMarkets[isVerified][j]][user]
            })));
            }
            if (!isVerified && Double({
                mantissa: alkSupplierIndex[isVerified][allMarkets[isVerified][j]][user]
            }).mantissa > 0) {
                return mul_(alkemiEarnPublic.getSupplyBalance(user, allMarkets[isVerified][j]), sub_(Double({mantissa: supplyState.index}), Double({
                mantissa: alkSupplierIndex[isVerified][allMarkets[isVerified][j]][user]
            })));
            } else {
                return 0;
            }
    }

    /**
     * @notice Get latest Borrow ALK rewards
     * @param totalLiquidity Total Liquidity of all markets
     * @param marketTotalLiquidity Array of individual market liquidity
     * @param user the borrower
     * @param i index of the market in marketTotalLiquidity array
     * @param j index of the market in the verified/public allMarkets array
     * @param isVerified Verified / Public protocol
     */
    function getBorrowAlkRewards(Exp memory totalLiquidity, Exp[] memory marketTotalLiquidity, address user, uint i, uint j, bool isVerified) internal view returns(uint256) {
            uint256 newSpeed = totalLiquidity.mantissa > 0
                ? mul_(alkRate, div_(marketTotalLiquidity[i], totalLiquidity))
                : 0;
            MarketState memory borrowState = alkBorrowState[isVerified][allMarkets[isVerified][j]];
            if (sub_(getBlockNumber(), uint256(borrowState.block)) > 0 && newSpeed > 0) {
                Double memory index = add_(
                    Double({mantissa: borrowState.index}),
                    (getMarketTotalBorrows(allMarkets[isVerified][j], isVerified) > 0
                    ? fraction(mul_(sub_(getBlockNumber(), uint256(borrowState.block)), newSpeed), getMarketTotalBorrows(allMarkets[isVerified][j], isVerified))
                    : Double({mantissa: 0}))
                );
                borrowState = MarketState({
                    index: safe224(index.mantissa, "new index exceeds 224 bits"),
                    block: safe32(getBlockNumber(), "block number exceeds 32 bits")
                });
            } else if (sub_(getBlockNumber(), uint256(borrowState.block)) > 0) {
                borrowState.block = safe32(
                    getBlockNumber(),
                    "block number exceeds 32 bits"
                );
            }

            if (Double({
                mantissa: alkBorrowerIndex[isVerified][allMarkets[isVerified][j]][user]
            }).mantissa > 0 && isVerified) {
                return mul_(alkemiEarnVerified.getBorrowBalance(user, allMarkets[isVerified][j]), sub_(Double({mantissa: borrowState.index}), Double({
                mantissa: alkBorrowerIndex[isVerified][allMarkets[isVerified][j]][user]
            })));
            }
            if (Double({
                mantissa: alkBorrowerIndex[isVerified][allMarkets[isVerified][j]][user]
            }).mantissa > 0 && !isVerified) {
                return mul_(alkemiEarnPublic.getBorrowBalance(user, allMarkets[isVerified][j]), sub_(Double({mantissa: borrowState.index}), Double({
                mantissa: alkBorrowerIndex[isVerified][allMarkets[isVerified][j]][user]
            })));
            } else {
                return 0;
            }
    }
}

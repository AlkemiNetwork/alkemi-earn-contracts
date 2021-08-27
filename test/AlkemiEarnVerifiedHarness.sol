pragma solidity ^0.4.24;

import "../contracts/ErrorReporter.sol";
import "../contracts/AlkemiEarnVerified.sol";

contract AlkemiEarnVerifiedHarness is AlkemiEarnVerified {
    mapping(address => uint256) public cashOverrides;

    mapping(address => bool) accountsToFailLiquidity;

    mapping(address => Exp) liquidityShortfalls;

    mapping(address => Exp) liquiditySurpluses;

    bool public failBorrowDenominatedCollateralCalculation;

    bool public failCalculateAmountSeize;

    /**
     * @dev Mapping of asset addresses and their corresponding price in terms of Eth-Wei
     *      which is simply equal to AssetWeiPrice * 10e18. For instance, if OMG token was
     *      worth 5x Eth then the price for OMG would be 5*10e18 or Exp({mantissa: 5000000000000000000}).
     *      If useOracle is false (its default), then we use this map for prices.
     * map: assetAddress -> Exp
     */
    mapping(address => Exp) public assetPrices;

    bool useOracle = false;

    function fetchAssetPrice(address asset)
        internal
        view
        returns (Error, Exp memory)
    {
        if (useOracle) {
            return super.fetchAssetPrice(asset);
        }

        return (Error.NO_ERROR, assetPrices[asset]);
    }

    function harnessSetCash(address asset, uint256 cashAmount) public {
        cashOverrides[asset] = cashAmount;
    }

    function getCash(address asset) internal view returns (uint) {
        uint override = cashOverrides[asset];
        if (override > 0) {
            return override;
        }
        return super.getCash(asset);
    }

    function calculateAccountLiquidity(address account)
        internal
        view
        returns (
            Error,
            Exp memory,
            Exp memory
        )
    {
        bool failLiquidityCheck = accountsToFailLiquidity[account];
        if (failLiquidityCheck) {
            return (
                Error.INTEGER_OVERFLOW,
                Exp({mantissa: 0}),
                Exp({mantissa: 0})
            );
        }

        Exp storage liquidityShortfall = liquidityShortfalls[account];
        if (!isZeroExp(liquidityShortfall)) {
            return (Error.NO_ERROR, Exp({mantissa: 0}), liquidityShortfall);
        }

        Exp storage liquiditySurplus = liquiditySurpluses[account];
        if (!isZeroExp(liquiditySurplus)) {
            return (Error.NO_ERROR, liquiditySurplus, Exp({mantissa: 0}));
        }

        return super.calculateAccountLiquidity(account);
    }

    function calculateDiscountedBorrowDenominatedCollateral(
        Exp memory underwaterAssetPrice,
        Exp memory collateralPrice,
        uint256 supplyCurrentCollateral
    ) internal view returns (Error, uint256) {
        if (failBorrowDenominatedCollateralCalculation) {
            return (Error.INTEGER_OVERFLOW, 0);
        } else {
            return
                super.calculateDiscountedBorrowDenominatedCollateral(
                    underwaterAssetPrice,
                    collateralPrice,
                    supplyCurrentCollateral
                );
        }
    }

    function calculateAmountSeize(
        Exp memory underwaterAssetPrice,
        Exp memory collateralPrice,
        uint256 amountCloseOfBorrow
    ) internal view returns (Error, uint256) {
        if (failCalculateAmountSeize) {
            return (Error.INTEGER_OVERFLOW, 0);
        }

        return
            super.calculateAmountSeize(
                underwaterAssetPrice,
                collateralPrice,
                amountCloseOfBorrow
            );
    }

    // Sets oracle address without checking its validity.
    function harnessSetOracle(address newOracle) public {
        oracle = newOracle;
    }

    function harnessSetUseOracle(bool _useOracle) public {
        useOracle = _useOracle;
    }

    function harnessSetFailCalculateAmountSeize(bool state) public {
        failCalculateAmountSeize = state;
    }

    function harnessSetFailLiquidityCheck(address account, bool setting)
        public
    {
        accountsToFailLiquidity[account] = setting;
    }

    function harnessSetLiquidityShortfall(address account, uint256 shortfall)
        public
    {
        (Error err0, Exp memory shortfallExp) = getExp(shortfall, 1);
        assert(err0 == Error.NO_ERROR);

        liquidityShortfalls[account] = shortfallExp;
    }

    function harnessSetLiquiditySurplus(address account, uint256 surplus)
        public
    {
        (Error err0, Exp memory surplusExp) = getExp(surplus, 1);
        assert(err0 == Error.NO_ERROR);

        liquiditySurpluses[account] = surplusExp;
    }

    function harnessSetAccountSupplyBalance(
        address account,
        address asset,
        uint256 principal,
        uint256 interestIndex
    ) public {
        supplyBalances[account][asset] = Balance({
            principal: principal,
            interestIndex: interestIndex
        });
    }

    function harnessSetAccountBorrowBalance(
        address account,
        address asset,
        uint256 principal,
        uint256 interestIndex
    ) public {
        borrowBalances[account][asset] = Balance({
            principal: principal,
            interestIndex: interestIndex
        });
    }

    function harnessSupportMarket(address asset) public {
        markets[asset].isSupported = true;
    }

    function harnessUnsupportMarket(address asset) public {
        markets[asset].isSupported = false;
    }

    function harnessGetSupplyIndex(address asset)
        public
        view
        returns (uint256)
    {
        return markets[asset].supplyIndex;
    }

    function harnessGetBorrowIndex(address asset)
        public
        view
        returns (uint256)
    {
        return markets[asset].borrowIndex;
    }

    function harnessGetInterestRateModel(address asset)
        public
        view
        returns (address)
    {
        return markets[asset].interestRateModel;
    }

    function harnessSetAssetPrice(
        address asset,
        uint256 priceNum,
        uint256 priceDenom
    ) public {
        (Error err0, Exp memory assetPrice) = getExp(priceNum, priceDenom);
        assert(err0 == Error.NO_ERROR);

        setAssetPriceInternal(asset, assetPrice);
    }

    function harnessSetAssetPriceMantissa(address asset, uint256 priceMantissa)
        public
    {
        setAssetPriceInternal(asset, Exp({mantissa: priceMantissa}));
    }

    // TODO: RENAME to include harness in name
    /**
     * @notice Sets the price of a given asset
     * @dev Oracle function to set the price of a given asset
     * @param asset Asset to set the price of
     * @param assetPriceMantissa Price of asset-wei in terms of eth-wei, scaled by 1e18.
     * @return uint 0=success, otherwise a failure (see ErrorReporter.sol for details)
     */
    function _setAssetPrice(address asset, uint256 assetPriceMantissa)
        public
        returns (uint256)
    {
        // Set the asset price to `price`
        setAssetPriceInternal(asset, Exp({mantissa: assetPriceMantissa}));
        return uint256(Error.NO_ERROR);
    }

    /**
     * @dev Sets the price for the given asset. The price for any asset must be specified as
     * the AssetWeiPrice * 10e18. For instance, if DRGN is currently worth 0.00113323 Eth then
     * the price must be specified as Exp({mantissa: 1133230000000000}).
     */
    function setAssetPriceInternal(address asset, Exp memory price) internal {
        assetPrices[asset] = price;
    }

    function harnessSetMaxAssetPrice(address asset) public {
        setAssetPriceInternal(asset, Exp({mantissa: 2**256 - 1}));
    }

    function harnessSetMarketDetails(
        address asset,
        uint256 totalSupply,
        uint256 supplyRateBasisPoints,
        uint256 supplyIndex,
        uint256 totalBorrows,
        uint256 borrowRateBasisPoints,
        uint256 borrowIndex
    ) public {
        (Error err0, Exp memory supplyRate) = getExp(
            supplyRateBasisPoints,
            10000
        );
        (Error err1, Exp memory borrowRate) = getExp(
            borrowRateBasisPoints,
            10000
        );

        assert(err0 == Error.NO_ERROR);
        assert(err1 == Error.NO_ERROR);

        markets[asset].blockNumber = block.number;
        markets[asset].totalSupply = totalSupply;
        markets[asset].supplyRateMantissa = supplyRate.mantissa;
        markets[asset].supplyIndex = supplyIndex;
        markets[asset].totalBorrows = totalBorrows;
        markets[asset].borrowRateMantissa = borrowRate.mantissa;
        markets[asset].borrowIndex = borrowIndex;
    }

    function harnessSetAccountSupplyBalanceAndMarketDetails(
        address account,
        address asset,
        uint256 principal,
        uint256 interestIndex,
        uint256 totalSupply,
        uint256 supplyRateBasisPoints,
        uint256 supplyIndex,
        uint256 totalBorrows,
        uint256 borrowRateBasisPoints,
        uint256 borrowIndex
    ) public {
        harnessSetAccountSupplyBalance(
            account,
            asset,
            principal,
            interestIndex
        );
        harnessSetMarketDetails(
            asset,
            totalSupply,
            supplyRateBasisPoints,
            supplyIndex,
            totalBorrows,
            borrowRateBasisPoints,
            borrowIndex
        );
    }

    function harnessSetAccountBorrowBalanceAndMarketDetails(
        address account,
        address asset,
        uint256 principal,
        uint256 interestIndex,
        uint256 totalSupply,
        uint256 supplyRateBasisPoints,
        uint256 supplyIndex,
        uint256 totalBorrows,
        uint256 borrowRateBasisPoints,
        uint256 borrowIndex
    ) public {
        harnessSetAccountBorrowBalance(
            account,
            asset,
            principal,
            interestIndex
        );
        harnessSetMarketDetails(
            asset,
            totalSupply,
            supplyRateBasisPoints,
            supplyIndex,
            totalBorrows,
            borrowRateBasisPoints,
            borrowIndex
        );
    }

    function harnessSetCollateralRatio(uint256 ratioNum, uint256 ratioDenom)
        public
    {
        (Error err0, Exp memory collateralRatioExp) = getExp(
            ratioNum,
            ratioDenom
        );
        assert(err0 == Error.NO_ERROR);

        collateralRatio = collateralRatioExp;
    }

    function harnessSetMarketBlockNumber(address asset, uint256 newBlockNumber)
        public
    {
        markets[asset].blockNumber = newBlockNumber;
    }

    function harnessSetMarketInterestRateModel(
        address asset,
        address interestRateModelAddress
    ) public {
        markets[asset].interestRateModel = InterestRateModel(
            interestRateModelAddress
        );
    }

    function harnessCalculateInterestIndex(
        uint256 startingInterestIndex,
        uint256 interestRateBasisPoints,
        uint256 blockDelta
    ) public pure returns (uint256) {
        // TODO: We can probably do this better getExp code in the newer versions of harnesses
        (Error err0, Exp memory interestRate) = getExp(
            interestRateBasisPoints,
            10000
        );
        assert(err0 == Error.NO_ERROR);

        (Error err1, uint256 newInterestIndex) = calculateInterestIndex(
            startingInterestIndex,
            interestRate.mantissa,
            0,
            blockDelta
        );
        assert(err1 == Error.NO_ERROR);

        return newInterestIndex;
    }

    function harnessAddCollateralMarket(address asset) public {
        addCollateralMarket(asset);
    }

    function harnessCalculateAccountLiquidity(address account)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        (
            Error err,
            Exp memory accountLiquidity,
            Exp memory accountShortfall
        ) = calculateAccountLiquidity(account);

        return (
            uint256(err),
            accountLiquidity.mantissa,
            accountShortfall.mantissa
        );
    }

    // Lets us set a liquidation discount without any validation or admin controls
    function harnessSetLiquidationDiscount(uint256 mantissa) public {
        liquidationDiscount = Exp({mantissa: mantissa});
    }

    function harnessSetFailBorrowDenominatedCollateralCalculation(bool state)
        public
    {
        failBorrowDenominatedCollateralCalculation = state;
    }
}

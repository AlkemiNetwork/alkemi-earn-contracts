pragma solidity 0.4.24;

import "./EIP20Interface.sol";
import "./PriceOracleProxy.sol";
import "./AlkemiEarnVerified.sol";

contract LiquidationChecker {
    AlkemiEarnVerified public alkemiEarnVerified;
    address public liquidator;
    bool public allowLiquidation;

    constructor(address alkemiEarnVerified_, address liquidator_) public {
        alkemiEarnVerified = AlkemiEarnVerified(alkemiEarnVerified_);
        liquidator = liquidator_;
        allowLiquidation = false;
    }

    function isAllowed(address asset, uint256 newCash)
        internal
        view
        returns (bool)
    {
        return allowLiquidation || !isLiquidate(asset, newCash);
    }

    function isLiquidate(address asset, uint256 newCash)
        internal
        view
        returns (bool)
    {
        return cashIsUp(asset, newCash) && oracleTouched();
    }

    function cashIsUp(address asset, uint256 newCash)
        internal
        view
        returns (bool)
    {
        uint256 oldCash = EIP20Interface(asset).balanceOf(alkemiEarnVerified);

        return newCash >= oldCash;
    }

    function oracleTouched() internal view returns (bool) {
        PriceOracleProxy oracle = PriceOracleProxy(address(alkemiEarnVerified.priceOracle()));

        bool sameOrigin = oracle.mostRecentCaller() == tx.origin;
        bool sameBlock = oracle.mostRecentBlock() == block.number;

        return sameOrigin && sameBlock;
    }

    function setAllowLiquidation(bool allowLiquidation_) public {
        require(
            msg.sender == liquidator,
            "LIQUIDATION_CHECKER_INVALID_LIQUIDATOR"
        );

        allowLiquidation = allowLiquidation_;
    }
}

pragma solidity 0.4.24;

import "./Exponential.sol";

/**
 * @title  Earn Interest Rate Model
 * @author ShiftForex
 * @notice See Model here
 */

contract AlkemiRateModel is Exponential {
    // Assuming avg. block time of 13.3 seconds; can be updated using changeBlocksPerYear() by the admin
    uint256 public blocksPerYear = 2371128;

    address public owner;
    address public newOwner;

    string public contractName;

    uint8 private hundred = 100;

    modifier onlyOwner() {
        require(msg.sender == owner, "non-owner");
        _;
    }

    enum IRError {
        NO_ERROR,
        FAILED_TO_ADD_CASH_PLUS_BORROWS,
        FAILED_TO_GET_EXP,
        FAILED_TO_MUL_PRODUCT_TIMES_BORROW_RATE
    }

    event OwnerUpdate(address indexed owner, address indexed newOwner);

    event blocksPerYearUpdated(uint256 oldBlocksPerYear, uint256 newBlocksPerYear);

    Exp internal SpreadLow;
    Exp internal BreakPointLow;
    Exp internal ReserveLow;
    Exp internal ReserveMid;
    Exp internal SpreadMid;
    Exp internal BreakPointHigh;
    Exp internal ReserveHigh;
    Exp internal SpreadHigh;

    Exp internal MinRateActual;
    Exp internal HealthyMinURActual;
    Exp internal HealthyMinRateActual;
    Exp internal MaxRateActual;
    Exp internal HealthyMaxURActual;
    Exp internal HealthyMaxRateActual;

    constructor(
        string memory _contractName,
        uint256 MinRate,
        uint256 HealthyMinUR,
        uint256 HealthyMinRate,
        uint256 HealthyMaxUR,
        uint256 HealthyMaxRate,
        uint256 MaxRate
    ) public {
        // Remember to enter percentage times 100. ex., if it is 2.50%, enter 250
        // Checks for reasonable interest rate parameters
        require(MinRate < MaxRate,"Min Rate should be lesser than Max Rate");
        require(HealthyMinUR < HealthyMaxUR,"HealthyMinUR should be lesser than HealthyMaxUR");
        require(HealthyMinRate < HealthyMaxRate,"HealthyMinRate should be lesser than HealthyMaxRate");
        owner = msg.sender;
        changeRates(_contractName,MinRate,HealthyMinUR,HealthyMinRate,HealthyMaxUR,HealthyMaxRate,MaxRate);
    }

    function changeRates(
        string memory _contractName,
        uint256 MinRate,
        uint256 HealthyMinUR,
        uint256 HealthyMinRate,
        uint256 HealthyMaxUR,
        uint256 HealthyMaxRate,
        uint256 MaxRate
    ) public onlyOwner {
        // Remember to enter percentage times 100. ex., if it is 2.50%, enter 250
        // Checks for reasonable interest rate parameters
        require(MinRate < MaxRate,"Min Rate should be lesser than Max Rate");
        require(HealthyMinUR < HealthyMaxUR,"HealthyMinUR should be lesser than HealthyMaxUR");
        require(HealthyMinRate < HealthyMaxRate,"HealthyMinRate should be lesser than HealthyMaxRate");
        contractName = _contractName;
        Exp memory temp1;
        Exp memory temp2;
        Exp memory HundredMantissa;
        Error err;

        (err, HundredMantissa) = getExp(hundred, 1);

        (err, MinRateActual) = getExp(MinRate, hundred);
        (err, HealthyMinURActual) = getExp(HealthyMinUR, hundred);
        (err, HealthyMinRateActual) = getExp(HealthyMinRate, hundred);
        (err, MaxRateActual) = getExp(MaxRate, hundred);
        (err, HealthyMaxURActual) = getExp(HealthyMaxUR, hundred);
        (err, HealthyMaxRateActual) = getExp(HealthyMaxRate, hundred);

        SpreadLow = MinRateActual;
        BreakPointLow = HealthyMinURActual;
        BreakPointHigh = HealthyMaxURActual;

        // ReserveLow = (HealthyMinRate-SpreadLow)/BreakPointLow;
        (err, temp1) = subExp(HealthyMinRateActual, SpreadLow);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, ReserveLow) = divExp(temp1, BreakPointLow);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol

        // ReserveMid = (HealthyMaxRate-HealthyMinRate)/(HealthyMaxUR-HealthyMinUR);
        (err, temp1) = subExp(HealthyMaxRateActual, HealthyMinRateActual);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, temp2) = subExp(HealthyMaxURActual, HealthyMinURActual);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, ReserveMid) = divExp(temp1, temp2);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol

        // SpreadMid = HealthyMinRate - (ReserveMid * BreakPointLow);
        (err, temp1) = mulExp(ReserveMid, BreakPointLow);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, SpreadMid) = subExp(HealthyMinRateActual, temp1);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        require(SpreadMid.mantissa >= 0,"Spread Mid cannot be a negative number");
        // ReserveHigh = (MaxRate - HealthyMaxRate) / (100 - HealthyMaxUR);
        (err, temp1) = subExp(MaxRateActual, HealthyMaxRateActual);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, temp2) = subExp(HundredMantissa, HealthyMaxURActual);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, ReserveHigh) = divExp(temp1, temp2);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol

        // SpreadHigh = (ReserveHigh * BreakPointHigh) - HealthyMaxRate;
        (err, temp2) = mulExp(ReserveHigh, BreakPointHigh);
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
        (err, SpreadHigh) = subExp(temp2,HealthyMaxRateActual);
        require(SpreadHigh.mantissa >=0,"Spread High cannot be a negative number");
        require(err == Error.NO_ERROR,"Integer Underflow / Overflow"); // To check for Integer overflow and underflow errors from Exponential.sol
    }

    function changeBlocksPerYear(uint256 _blocksPerYear) external onlyOwner {
        uint256 oldBlocksPerYear = blocksPerYear;
        blocksPerYear = _blocksPerYear;
        emit blocksPerYearUpdated(oldBlocksPerYear, _blocksPerYear);
    }

    function transferOwnership(address newOwner_) external onlyOwner {
        require(newOwner_ != owner, "TransferOwnership: the same owner.");
        newOwner = newOwner_;
    }

    function acceptOwnership() external {
        require(
            msg.sender == newOwner,
            "AcceptOwnership: only new owner do this."
        );
        emit OwnerUpdate(owner, newOwner);
        owner = newOwner;
        newOwner = address(0x0);
    }

    /*
     * @dev Calculates the utilization rate (borrows / (cash + borrows)) as an Exp in 1e18 scale
     */
    function getUtilizationRate(uint256 cash, uint256 borrows)
        internal
        view
        returns (IRError, Exp memory)
    {
        if (borrows == 0) {
            // Utilization rate is zero when there's no borrows
            return (IRError.NO_ERROR, Exp({mantissa: 0}));
        }

        (Error err0, uint256 cashPlusBorrows) = add(cash, borrows);
        if (err0 != Error.NO_ERROR) {
            return (
                IRError.FAILED_TO_ADD_CASH_PLUS_BORROWS,
                Exp({mantissa: 0})
            );
        }

        (Error err1, Exp memory utilizationRate) = getExp(
            borrows,
            cashPlusBorrows
        );
        if (err1 != Error.NO_ERROR) {
            return (IRError.FAILED_TO_GET_EXP, Exp({mantissa: 0}));
        }
        (err1, utilizationRate) = mulScalar(utilizationRate, hundred);

        return (IRError.NO_ERROR, utilizationRate);
    }

    /*
     * @dev Calculates the utilization and borrow rates for use by get{Supply,Borrow}Rate functions
     */
    function getUtilizationAndAnnualBorrowRate(uint256 cash, uint256 borrows)
        internal
        view
        returns (
            IRError,
            Exp memory,
            Exp memory
        )
    {
        (IRError err0, Exp memory utilizationRate) = getUtilizationRate(
            cash,
            borrows
        );
        if (err0 != IRError.NO_ERROR) {
            return (err0, Exp({mantissa: 0}), Exp({mantissa: 0}));
        }

        /**
         *  Borrow Rate
         *  0 < UR < 20% :      SpreadLow + UR * ReserveLow
         *  20% <= UR <= 80% :  SpreadMid + UR * ReserveMid
         *  80% < UR :          UR * ReserveHigh - SpreadHigh
         */

        Error err;

        uint256 annualBorrowRateScaled;
        Exp memory tempScaled;
        Exp memory tempScaled2;

        if (utilizationRate.mantissa < BreakPointLow.mantissa) {
            (err, tempScaled) = mulExp(utilizationRate, ReserveLow);
            assert(err == Error.NO_ERROR);
            (err, tempScaled2) = addExp(tempScaled, SpreadLow);
            annualBorrowRateScaled = tempScaled2.mantissa;
            assert(err == Error.NO_ERROR);
        } else if (utilizationRate.mantissa > BreakPointHigh.mantissa) {
            (err, tempScaled) = mulExp(utilizationRate, ReserveHigh);
            assert(err == Error.NO_ERROR);
            // Integer Underflow is handled in sub() function under CarefulMath
            (err, tempScaled2) = subExp(tempScaled, SpreadHigh);
            annualBorrowRateScaled = tempScaled2.mantissa;
            assert(err == Error.NO_ERROR);
        } else if (
            utilizationRate.mantissa >= BreakPointLow.mantissa &&
            utilizationRate.mantissa <= BreakPointHigh.mantissa
        ) {
            (err, tempScaled) = mulExp(utilizationRate, ReserveMid);
            assert(err == Error.NO_ERROR);
            (err, tempScaled2) = addExp(tempScaled, SpreadMid);
            annualBorrowRateScaled = tempScaled2.mantissa;
            assert(err == Error.NO_ERROR);
        }

        return (
            IRError.NO_ERROR,
            utilizationRate,
            Exp({mantissa: annualBorrowRateScaled})
        );
    }

    /**
     * @notice Gets the current supply interest rate based on the given asset, total cash and total borrows
     * @dev The return value should be scaled by 1e18, thus a return value of
     *      `(true, 1000000000000)` implies an interest rate of 0.000001 or 0.0001% *per block*.
     * @param _asset The asset to get the interest rate of
     * @param cash The total cash of the asset in the market
     * @param borrows The total borrows of the asset in the market
     * @return Success or failure and the supply interest rate per block scaled by 10e18
     */
    function getSupplyRate(
        address _asset,
        uint256 cash,
        uint256 borrows
    ) public view returns (uint256, uint256) {
        _asset; // pragma ignore unused argument
        (
            IRError err0,
            Exp memory utilizationRate0,
            Exp memory annualBorrowRate
        ) = getUtilizationAndAnnualBorrowRate(cash, borrows);
        if (err0 != IRError.NO_ERROR) {
            return (uint256(err0), 0);
        }

        /**
         *  Supply Rate
         *  = BorrowRate * utilizationRate * (1 - SpreadLow)
         */
        Exp memory temp1;
        Error err1;
        Exp memory oneMinusSpreadBasisPoints;
        (err1, temp1) = getExp(hundred, 1);
        assert(err1 == Error.NO_ERROR);
        (err1, oneMinusSpreadBasisPoints) = subExp(temp1, SpreadLow);

        // mulScalar only overflows when product is greater than or equal to 2^256.
        // utilization rate's mantissa is a number between [0e18,1e18]. That means that
        // utilizationRate1 is a value between [0e18,8.5e21]. This is strictly less than 2^256.
        assert(err1 == Error.NO_ERROR);

        // Next multiply this product times the borrow rate
        // Borrow rate should be divided by 1e2 to get product at 1e18 scale
        (err1, temp1) = mulExp(utilizationRate0, Exp({mantissa: annualBorrowRate.mantissa / 100}));
        // If the product of the mantissas for mulExp are both less than 2^256,
        // then this operation will never fail.
        // We know that borrow rate is in the interval [0, 2.25e17] from above.
        // We know that utilizationRate1 is in the interval [0, 9e21] from directly above.
        // As such, the multiplication is in the interval of [0, 2.025e39]. This is strictly
        // less than 2^256 (which is about 10e77).
        assert(err1 == Error.NO_ERROR);

        // oneMinusSpreadBasisPoints i.e.,(1 - SpreadLow) should be divided by 1e2 to get product at 1e18 scale
        (err1, temp1) = mulExp(temp1, Exp({mantissa: oneMinusSpreadBasisPoints.mantissa / 100}));
        assert(err1 == Error.NO_ERROR);

        // And then divide down by the spread's denominator (basis points divisor)
        // as well as by blocks per year.
        (Error err4, Exp memory supplyRate) = divScalar(
            temp1,
            blocksPerYear
        ); // basis points * blocks per year
        // divScalar only fails when divisor is zero. This is clearly not the case.
        assert(err4 == Error.NO_ERROR);

        return (uint256(IRError.NO_ERROR), supplyRate.mantissa / 100);
    }

    /**
     * @notice Gets the current borrow interest rate based on the given asset, total cash and total borrows
     * @dev The return value should be scaled by 1e18, thus a return value of
     *      `(true, 1000000000000)` implies an interest rate of 0.000001 or 0.0001% *per block*.
     * @param asset The asset to get the interest rate of
     * @param cash The total cash of the asset in the market
     * @param borrows The total borrows of the asset in the market
     * @return Success or failure and the borrow interest rate per block scaled by 10e18
     */
    function getBorrowRate(
        address asset,
        uint256 cash,
        uint256 borrows
    ) public view returns (uint256, uint256) {
        asset; // pragma ignore unused argument

        (
            IRError err0,
            ,
            Exp memory annualBorrowRate
        ) = getUtilizationAndAnnualBorrowRate(cash, borrows);
        if (err0 != IRError.NO_ERROR) {
            return (uint256(err0), 0);
        }

        // And then divide down by blocks per year.
        (Error err1, Exp memory borrowRate) = divScalar(
            annualBorrowRate,
            blocksPerYear
        ); // basis points * blocks per year
        // divScalar only fails when divisor is zero. This is clearly not the case.
        assert(err1 == Error.NO_ERROR);

        // Note: mantissa is the rate scaled 1e18, which matches the expected result
        return (uint256(IRError.NO_ERROR), borrowRate.mantissa / 100);
    }
}

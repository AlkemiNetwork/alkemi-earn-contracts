pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "./AssertHelpers.sol";
import "./MathHelpers.sol";
import "../contracts/AlkemiRateModel.sol";

contract StandardInterestRateModelTest is
    AlkemiRateModel(
        "Standard Rate Model",
        50,
        200,
        250,
        8000,
        3000,
        5000,
        0x0000000000000000000000000000000000000000,
        0x0000000000000000000000000000000000000000
    )
{
    // Supply rate = (1 - 0.1) * Ua * ( 5% + (45% * Ua) )
    // C.f. Elixir:
    /*
        getSupplyRate = fn (cash, borrows) ->
            ua = div(trunc(1.0e18) * trunc(borrows),(trunc(cash)+trunc(borrows)));
            ua_scaled = ua * 9000;
            borrowRate = trunc(5.0e16) + div(45*ua,100);

            borrowTimesUa = div(borrowRate * ua_scaled, trunc(1.0e18));

            div(borrowTimesUa, 10000 * 2102400);
        end
    */
    function testGetSupplyRate() public {
        (uint256 err0, uint256 rate0) = getSupplyRate(address(this), 500, 100);
        Assert.equal(0, err0, "should be successful");
        Assert.equal(6050692438, rate0, "supply rate for 500/100"); // getSupplyRate.(500, 100)

        (uint256 err1, uint256 rate1) = getSupplyRate(
            address(this),
            3 * 10**18,
            5 * 10**18
        );
        Assert.equal(0, err1, "should be successful");
        Assert.equal(70487828089, rate1, "borrow rate for 3e18/5e18"); // getSupplyRate.(3.0e18, 5.0e18)

        // TODO: Handle zero/zero case
        (uint256 err2, uint256 rate2) = getSupplyRate(address(this), 0, 0);
        Assert.equal(0, err2, "should be successful");
        Assert.equal(0, rate2, "borrow rate for 0/0");
    }

    function testGetSupplyRate_FAILED_TO_ADD_CASH_PLUS_BORROWS() public {
        (uint256 err, uint256 rate) = getSupplyRate(
            address(this),
            uint256(-1),
            uint256(-1)
        );
        Assert.equal(
            uint256(IRError.FAILED_TO_ADD_CASH_PLUS_BORROWS),
            err,
            "expected FAILED_TO_ADD_CASH_PLUS_BORROWS"
        );
        Assert.equal(0, rate, "error calculating");
    }

    function testGetSupplyRate_FAILED_TO_GET_EXP() public {
        (uint256 err, uint256 rate) = getSupplyRate(
            address(this),
            0,
            uint256(-1)
        );
        Assert.equal(
            uint256(IRError.FAILED_TO_GET_EXP),
            err,
            "expected FAILED_TO_GET_EXP"
        );
        Assert.equal(0, rate, "error calculating");
    }

    // Borrow rate = 5% + (45% * Ua)
    // C.f. Elixir:
    /*
        getBorrowRate = fn (cash, borrows) ->
            ua = div(trunc(1.0e18) * trunc(borrows),(trunc(cash)+trunc(borrows)));
            div(trunc(5.0e16) + div(45*ua,100), 2102400)
        end
    */
    function testGetBorrowRate() public {
        (uint256 err0, uint256 rate0) = getBorrowRate(address(this), 500, 100);
        Assert.equal(0, err0, "should be successful");
        Assert.equal(36486587571, rate0, "borrow rate for 500/100"); // getBorrowRate.(500, 100)

        (uint256 err1, uint256 rate1) = getBorrowRate(
            address(this),
            3 * 10**18,
            5 * 10**18
        );
        Assert.equal(0, err1, "should be successful");
        Assert.equal(113347261249, rate1, "borrow rate for 3e18/5e18"); // getBorrowRate.(3.0e18, 5.0e18)
    }

    function testGetBorrowRate_FAILED_TO_ADD_CASH_PLUS_BORROWS() public {
        (uint256 err, uint256 rate) = getBorrowRate(
            address(this),
            uint256(-1),
            uint256(-1)
        );
        Assert.equal(
            uint256(IRError.FAILED_TO_ADD_CASH_PLUS_BORROWS),
            err,
            "expected FAILED_TO_ADD_CASH_PLUS_BORROWS"
        );
        Assert.equal(0, rate, "error calculating");
    }

    function testGetBorrowRate_FAILED_TO_GET_EXP() public {
        (uint256 err, uint256 rate) = getBorrowRate(
            address(this),
            0,
            uint256(-1)
        );
        Assert.equal(
            uint256(IRError.FAILED_TO_GET_EXP),
            err,
            "expected FAILED_TO_GET_EXP"
        );
        Assert.equal(0, rate, "error calculating");
    }
}

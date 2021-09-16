---
layout: default
title: EIP20NonStandardInterface
---

# EIP20NonStandardInterface \(EIP20NonStandardInterface.sol\)

View Source: [contracts/EIP20NonStandardInterface.so](https://github.com/AlkemiNetwork/alkemi-earn-contracts/tree/ae6d5c01ff8b3810c4005457ac7ce441ab1c7ec5/contracts/EIP20NonStandardInterface.sol)l

Version of ERC20 with no return values for `transfer` and `transferFrom` See [https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca](https://medium.com/coinmonks/missing-return-value-bug-at-least-130-tokens-affected-d67bf08521ca)



### Contract Members

**Constants & Variables**

```javascript
uint256 public totalSupply;
```

**Events**

```javascript
event Transfer(address indexed _from, address indexed _to, uint256  _value);
event Approval(address indexed _owner, address indexed _spender, uint256  _value);
```

### Functions

* balanceOf\(address \_owner\)
* transfer\(address \_to, uint256 \_value\)
* transferFrom\(address \_from, address \_to, uint256 \_value\)
* approve\(address \_spender, uint256 \_value\)
* allowance\(address \_owner, address \_spender\)

#### balanceOf

```javascript
function balanceOf(address _owner) public view
returns(balance uint256)
```

**Returns**

The balance

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_owner | address | The address from which the balance will be retrieved |

#### transfer

send `_value` token to `_to` from `msg.sender`

```javascript
function transfer(address _to, uint256 _value) public nonpayable
```

**Returns**

Whether the transfer was successful or not

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_to | address | The address of the recipient |
| \_value | uint256 | The amount of token to be transferred |

#### transferFrom

send `_value` token to `_to` from `_from` on the condition it is approved by `_from`

```javascript
function transferFrom(address _from, address _to, uint256 _value) public nonpayable
```

**Returns**

Whether the transfer was successful or not

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_from | address | The address of the sender |
| \_to | address | The address of the recipient |
| \_value | uint256 | The amount of token to be transferred |

#### approve

`msg.sender` approves `_spender` to spend `_value` tokens

```javascript
function approve(address _spender, uint256 _value) public nonpayable
returns(success bool)
```

**Returns**

Whether the approval was successful or not

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_spender | address | The address of the account able to transfer the tokens |
| \_value | uint256 | The amount of tokens to be approved for transfer |

#### allowance

```javascript
function allowance(address _owner, address _spender) public view
returns(remaining uint256)
```

**Returns**

Amount of remaining tokens allowed to spent

**Arguments**

| Name | Type | Description |
| :--- | :--- | :--- |
| \_owner | address | The address of the account owning tokens |
| \_spender | address | The address of the account able to transfer the tokens |


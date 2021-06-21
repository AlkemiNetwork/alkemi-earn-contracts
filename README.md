# Alkemi Earn Contracts

[![MythXBadge](https://badgen.net/https/api.mythx.io/v1/projects/bdc732b7-27d2-4a17-be68-0a1f842ed64b/badge/data?cache=300&icon=https://raw.githubusercontent.com/ConsenSys/mythx-github-badge/main/logo_white.svg)](https://docs.mythx.io/dashboard/github-badges)

> Implementation of Alkemi Earn Contracts in Solidity.
> [earn.alkemi.network](https://earn.alkemi.network/)

## Table of Contents

- [Get Started](#get-started)
  - [Local development](#local-development)
- [Testing](#testing)
  - [Code Linting](#code-linting)
- [Networks](#networks)
  - [Mainnets](#mainnet-deployments)
    - [Ethereum Mainnet](#ethereum-mainnet)
- [Documentation](#documentation)
- [Issues](#issues)

---

## Get Started

For local development of `alkemi-earn-contracts` you can setup the development environment on your machine.

### Local development

For local development it is recommended to use [ganache](http://truffleframework.com/ganache/) to run a local development chain. Using the ganache simulator no full Ethereum node is required.

As a pre-requisite, you need:

- Node.js
- npm

Clone the project and install all dependencies:

    git clone git@github.com:AlkemiNetwork/alkemi-earn-contracts.git
    cd alkemi-earn-contracts/

    # install project dependencies
    $ npm i

Compile the solidity contracts:

    $ npm run compile

![](https://raw.githubusercontent.com/AlkemiNetwork/alkemi-reserve-contracts/master/docs/assets/alk-compile.gif)

In a new terminal, launch an Ethereum RPC client, we use the default ganache-cli command to configure and run a local development ganache:

    $ npm run ganache

Switch back to your other terminal and deploy the contracts:

    $ npm run deploy

## Testing

Run tests with:

    $ npm run test

### Code Linting

Linting is setup for `JavaScript` with [ESLint](https://eslint.org) & Solidity with [Solhint](https://protofire.github.io/solhint/) and [Prettier](https://prettier.io/).

    # lint solidity contracts
    $ npm run prettier:contracts

    # lint tests
    $ npm run lint:tests

Code style is enforced through the CI test process, builds will fail if there're any linting errors.

## Networks

#### Ethereum Mainnet

<table>
	<tr>
   		<th>Contract Name</th>
    	<th>Contract Address</th>
	</tr>
	<tr>
		<td> Alkemi Earn Verified - Admin Upgradeability Proxy </td>
		<td> 0x397c315d64D74d82A731d656f9C4D586D200F90A </td>
	</tr>
	<tr>
		<td> Liquidator </td>
		<td> 0x123ceAC83C6d5110671F09E96C0F8076CE4bC839 </td>
	</tr>
	<tr>
		<td> DAI </td>
		<td> 0x6b175474e89094c44da98b954eedeac495271d0f </td>
	</tr>
	<tr>
		<td> DAIRateModel </td>
		<td> 0x65E524b3594cFc26C1c0154e466695FB7fc9759C </td>
	</tr>
	<tr>
		<td> DAIPriceFeed </td>
		<td> 0x773616E4d11A78F511299002da57A0a94577F1f4 </td>
	</tr>
    <tr>
    	<td> USDC </td>
    	<td> 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48 </td>
    </tr>
    <tr>
    	<td> USDCRateModel </td>
    	<td> 0x65E524b3594cFc26C1c0154e466695FB7fc9759C </td>
    </tr>
	<tr>
    	<td> USDCPriceFeed </td>
    	<td> 0x986b5E1e1755e3C2440e960477f25201B0a8bbD4 </td>
    </tr>
    <tr>
    	<td> WBTC </td>
    	<td> 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 </td>
    </tr>
    <tr>
    	<td> WBTCRateModel </td>
    	<td> 0x2c59Df8A883a7Af938C4A1b059085521ffACC80C </td>
    </tr>
	<tr>
    	<td> WBTCPriceFeed </td>
    	<td> 0xdeb288F737066589598e9214E782fa5A8eD689e8 </td>
    </tr>
	<tr>
    	<td> WETH </td>
    	<td> 0x1f52453b32bfab737247114d56d756a6c37dd9ef </td>
    </tr>
    <tr>
    	<td> WETHRateModel </td>
    	<td> 0xc97a9F085839d02DB1E2A1550c58299Dc85F9655 </td>
    </tr>
	<tr>
    	<td> ChainLink Oracle </td>
    	<td> 0x2f83073131efc90693b90cdf3fa1fdd0f7030e05 </td>
    </tr>
</table>

## Documentation

- [Contracts Documentation](https://docs.alkemi.network/earn-contracts)

## Issues

If you come across an issue with Alkemi Protocol contracts, do a search in the [Issues](https://github.com/AlkemiNetwork/alkemi-earn-contracts/issues) tab of this repo to make sure it hasn't been reported before. Follow these steps to help us prevent duplicate issues and unnecessary notifications going to the many people watching this repo:

- If the issue you found has been reported and is still open, and the details match your issue, give a "thumbs up" to the relevant posts in the issue thread to signal that you have the same issue. No further action is required on your part.
- If the issue you found has been reported and is still open, but the issue is missing some details, you can add a comment to the issue thread describing the additional details.
- If the issue you found has been reported but has been closed, you can comment on the closed issue thread and ask to have the issue reopened because you are still experiencing the issue. Alternatively, you can open a new issue, reference the closed issue by number or link, and state that you are still experiencing the issue. Provide any additional details in your post so we can better understand the issue and how to fix it.

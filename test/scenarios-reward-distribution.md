> These are the notes for calculating the test expectation on scenarios-reward-distribution.json

# 1. Borrow
## 1.1 supply OMG 2nd time
### supply index
`(0.6571437157894737 * 1) / 3.75 = 0.1752383242`
## 1.2 claimAlk
### supply index
`(0.990931 * 1) / 9.375 = 0.1056993067`

`0.1056993067 + 0.1752383242105263 = 0.2809376309`
### accrued[Torrey] as transferred tokens
`(2.8093763087719298 - 1.752383242105263) * 9.375000000000000000 = 9.90931`
## 1.3 borrow Ether 2nd time
### borrow index
`(2.4728232681818184 x 1) / 7.875 = 0.3140093039`

`0.3140093039 + 1.4609154171428573 = 1.774924721`
### accrued[Torrey]
`(1.774924721038961 - 1.4609154171428573) * 4.375 = 1.3737907045`

# 2. Withdraw
## 2.1 withdraw
### supply index
`(4.1619102 x 1) / 3.0 = 1.3873034`

`1.3873034 + 2.7746068 = 4.1619102`
### accrued[Torrey]
`(4.1619102 - 2.7746068) * 1.5 = 2.0809551`

# 3. PayBorrow
## 3.1 payborrow
### borrow index
`(2.25932268 * 2) / 7.5 = 0.602486048`

`0.602486048 + 1.2228168777327935 = 1.8253029257`
### accrued[Geoff]
`(1.8253029257327937 - 1.2228168777327935) * 5 = 3.01243024`

# 4. Liquidate
## 4.1 liquidate
### accrued[Geoff]
#### supply OMG, Geoff
`(39.827686179787505 - 37.835547272727274) * 2.73 = 5.4385392163`
#### borrow Ether, Geoff
`(35.237907718731914 - 33.36400479925428) * 1.15 = 2.1549883574`
#### combine both supply and borrow rewards
`5.438539216 + 2.154988357 = 7.593527573`

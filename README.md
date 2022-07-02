# Project Name: 
Hit and Blow onChain

# About Project: 
Hit & Blow is a popular code-breaking PvP game (also known as Bulls and Cows).   
This project is a fully on-chain version of the game.

#### Gameplay
```
On a sheet of paper, the players each write a 4-digit secret number.  
The digits must be all different. Then, in turn, the players try to guess their opponent's number who gives the number of matches.  
If the matching digits are in their right positions, they are "bulls", if in different positions, they are "cows". 

Example:

Secret number: 4271
Opponent's try: 1234
Answer: 1 bull and 2 cows. (The bull is "2", the cows are "4" and "1".)

The first player to reveal the other's secret number wins the game.
```
https://en.wikipedia.org/wiki/Bulls_and_Cows

# the problem it is solving:
The problem is that the game needs a third party to prevent cheating or miscounting in mid-game.   
This characteristic makes it difficult to develop trustless fully onchain games and many other games have the same kind of characteristics.  
In this project, by utilizing Zero Knowledge proofs, the game can achieve the integrity of the game without relying on any third party and be enabled to be fully onchain.  

# Technologies used:
- circom
- snarkjs
- React
- TypeScript
- Next.js
- ethers.js
- Hardhat
- Tailwind CSS

# Polygonscan links of smart contracts:
https://mumbai.polygonscan.com/address/0x37962B31e86315F830eD725260519396A1F56865#code

# Challenges faced:
Terrible UX😱

ZKP(zero knowledge proofs) can make games fully onchain but currently blockchian itself doesn't work so well as a game's backend.
- Games need short delay instant finality
- Difficult to decide a gas fee for fast inclusion in the block
- Don't want to interact with MetaMask everytime.  
etc. 

In the blockchain field, recently many problems have been solved by ZKP.  
ZKP technology advances so quickly and creates new opportunities.  
For example What will happen after the arrival of zkEVM?  

I expect these problems will be solved in near future.  

Currently most of blockchain game users don't care about trustlessness. But if trustless fully onchain games can achieve the same level of UX as trustfull games, users must prefer fair and transparent games.





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

# The problem it is solving:
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

### Polygon Testnet Mumbai
- hitAndBlow contract deployed to: 0x37962B31e86315F830eD725260519396A1F56865
- verifier contract deployed to: 0x36939F47cB135e9Dabd0770817d4fA98719c7757
- poseidon contract deployed to: 0x3bE320d3955BfC7175B37aDf99a3C82E8237EF2a

# Challenges faced:
Terrible UX😱

These important features haven't been implemented yet (just because it takes time):
- Can not play multi games simultaneously. (When other players are playing the game you can only just watch it.)
- Not PvP but Player vs Bot. (Currently when you start playing the game, the bot automaticaly starts to play the game as your opponent for the convenience of a test play.)
- No time limit. (When the player or bot stops playing in the middle, the game gets stuck…)
- No upgradability.

ZKP(zero knowledge proofs) can make games fully onchain but currently blockchian itself doesn't work so well as a game's backend.
- Games need short delay instant finality
- Difficult to decide a gas fee for fast inclusion in the block
- Don't want to interact with MetaMask everytime.  
etc. 


In the blockchain field, recently many problems have been solved by ZKP.  
ZKP technology advances so quickly and is expanding new possibilities.
For example what will happen after the arrival of zkEVM?  

I expect these problems will be solved in near future.  

Currently most of blockchain game users don't care about trustlessness. But if trustless fully onchain games can achieve the same level of UX as trustfull games, users must prefer fair and transparent games.

# Demo Play (2x speed)
https://user-images.githubusercontent.com/3497643/176992128-b1daca20-1e1c-4032-b5ba-1961ebe3889e.mov


# Demo Site
https://hit-and-blow-onchain-polygon.herokuapp.com/


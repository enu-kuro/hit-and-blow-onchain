import { ethers } from "hardhat";
import { HitAndBlow, Verifier } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const { poseidonContract } = require("circomlibjs");

async function deploy(contractName: string, ...args: any[]) {
  const Factory = await ethers.getContractFactory(contractName);
  const instance = await Factory.deploy(...args);
  return instance.deployed();
}

async function deployPoseidon(signer: SignerWithAddress) {
  const Factory = new ethers.ContractFactory(
    poseidonContract.generateABI(5),
    poseidonContract.createCode(5),
    signer
  );
  const instance = await Factory.deploy();
  return instance.deployed();
}
async function main() {
  const [owner] = await ethers.getSigners();
  const poseidonContract = await deployPoseidon(owner);
  const verifier = (await deploy("Verifier")) as Verifier;
  const hitAndBlow = (await deploy(
    "HitAndBlow",
    verifier.address,
    poseidonContract.address
  )) as HitAndBlow;
  console.log("poseidon deployed to:", poseidonContract.address);
  console.log("verifier deployed to:", verifier.address);
  console.log("hitAndBlow deployed to:", hitAndBlow.address);
}

// mumbai
// poseidon deployed to: 0x3bE320d3955BfC7175B37aDf99a3C82E8237EF2a
// verifier deployed to: 0x36939F47cB135e9Dabd0770817d4fA98719c7757
// hitAndBlow deployed to: 0x37962B31e86315F830eD725260519396A1F56865

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IHasher, IHasherInterface } from "../IHasher";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256[5]",
        name: "inputs",
        type: "uint256[5]",
      },
    ],
    name: "poseidon",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

export class IHasher__factory {
  static readonly abi = _abi;
  static createInterface(): IHasherInterface {
    return new utils.Interface(_abi) as IHasherInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IHasher {
    return new Contract(address, _abi, signerOrProvider) as IHasher;
  }
}

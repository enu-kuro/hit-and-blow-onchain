import { BigNumber, ContractTransaction, ethers } from "ethers";
import { ErrorCode } from "@ethersproject/logger";
import { FourNumbers, ProofInput, SolidityProof } from "types";
const snarkjs = require("snarkjs");

export const CONTRACT_ADDRESS = "0x3c903E0b9E82bd7a4A2Ee7aDA07A46C1393f40Ff";
export const ZERO_ADDRESS = ethers.constants.AddressZero; //"0x0000000000000000000000000000000000000000";

type Chain = {
  name: string;
  id: number;
  url: string;
  contractAddress: string;
};
export const AvailableChains: Chain[] = [
  {
    name: "Polygon Testnet Mumbai",
    id: 80001,
    url: "https://polygon-mumbai.g.alchemy.com/v2/W3zqllW_P981aTabG_D2V9tMf4gZdhu_",
    contractAddress: "0x37962B31e86315F830eD725260519396A1F56865",
  },
];

const solutionInfoKeys = ["solutionArray", "solutionHash", "salt"];

export enum Stage {
  None = -1,
  Register,
  CommitSolutionHash,
  Playing,
  Reveal,
}

export const saveSolutionInfo = (
  solutionArray: FourNumbers,
  solutionHash: BigNumber,
  salt: BigNumber
) => {
  localStorage.setItem(solutionInfoKeys[0], JSON.stringify(solutionArray));
  localStorage.setItem(solutionInfoKeys[1], solutionHash.toString());
  localStorage.setItem(solutionInfoKeys[2], salt.toString());

  console.log("saveSolutionInfo");
};

export const retrieveSolutionInfo = (): [FourNumbers, BigNumber, BigNumber] => {
  const solutionArrayStr = localStorage.getItem(solutionInfoKeys[0]);
  const solutionHashStr = localStorage.getItem(solutionInfoKeys[1]);
  const saltStr = localStorage.getItem(solutionInfoKeys[2]);

  if (solutionArrayStr && solutionHashStr && saltStr) {
    return [
      JSON.parse(solutionArrayStr),
      BigNumber.from(solutionHashStr),
      BigNumber.from(saltStr),
    ];
  } else {
    throw new Error("SolutionInfo not found");
  }
};

export const removeSolutionInfo = () => {
  console.log("removeSolutionInfo");
  localStorage.removeItem(solutionInfoKeys[0]);
  localStorage.removeItem(solutionInfoKeys[1]);
  localStorage.removeItem(solutionInfoKeys[2]);
};

// @ts-ignore
export function buildSolidityProof(snarkProof, publicSignals) {
  return {
    a: snarkProof.pi_a.slice(0, 2),
    b: [
      snarkProof.pi_b[0].slice(0).reverse(),
      snarkProof.pi_b[1].slice(0).reverse(),
    ],
    c: snarkProof.pi_c.slice(0, 2),
    input: publicSignals,
  } as SolidityProof;
}

import path from "path";
import getConfig from "next/config";
const serverPath = (staticFilePath: string) => {
  return path.join(
    getConfig().serverRuntimeConfig.PROJECT_ROOT,
    staticFilePath
  );
};

export async function generateProof(inputs: ProofInput) {
  let wasmPath = "/HitAndBlow.wasm";
  let zkeyPath = "/HitAndBlow_0001.zkey";
  if (typeof window === "undefined") {
    wasmPath = serverPath(`/public${wasmPath}`);
    zkeyPath = serverPath(`/public${zkeyPath}`);
  }
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputs,
    wasmPath,
    zkeyPath
  );

  const solidityProof = await buildSolidityProof(proof, publicSignals);

  return [
    solidityProof.a,
    solidityProof.b,
    solidityProof.c,
    solidityProof.input,
  ] as const;
}

export function calculateHB(guess: FourNumbers, solution: FourNumbers) {
  const hit = solution.filter((sol, i) => {
    return sol === guess[i];
  }).length;

  const blow = solution.filter((sol, i) => {
    return sol !== guess[i] && guess.some((g) => g === sol);
  }).length;

  return [hit, blow];
}

export const retryIfFailed = <T extends any[]>(
  fn: (...args: T) => Promise<ContractTransaction>,
  repeat = 2
) => {
  const wrappedFunc = async (...args: T) => {
    // default maxPriorityFeePerGas is too low...
    const argsWithGasFee = [
      ...args,
      { maxPriorityFeePerGas: 1000000000 * 50, maxFeePerGas: 1000000000 * 51 },
    ] as T;

    for (let i = 0; i < repeat; i++) {
      const tx = await fn(...argsWithGasFee);
      // status:0(transaction error)????????????error???????????????reciept???????????????
      const reciept = await tx.wait().catch((err) => {
        console.log(err);
        if (err.code === ErrorCode.CALL_EXCEPTION) {
          // CALL_EXCEPTION????????????retry??????(???????????????????????????????????????)
          return Promise.resolve();
        }
        if (err.code === ErrorCode.UNPREDICTABLE_GAS_LIMIT) {
          // TODO: manualy set gas limit?
          console.log(ErrorCode);
          return Promise.resolve();
        }
        return Promise.reject(err);
      });
      if (reciept) {
        // console.log(reciept);
        return Promise.resolve();
      }
      console.log("retry!!!");
    }
    return Promise.reject("error");
  };
  return wrappedFunc;
};

// https://gist.github.com/justinfay/f30d53f8b85a274aee57
function permutations(array: number[], r: number) {
  // Algorythm copied from Python `itertools.permutations`.
  var n = array.length;
  if (r === undefined) {
    r = n;
  }
  if (r > n) {
    return;
  }
  var indices = [];
  for (var i = 0; i < n; i++) {
    indices.push(i);
  }
  var cycles = [];
  for (var i = n; i > n - r; i--) {
    cycles.push(i);
  }
  var results = [];
  var res = [];
  for (var k = 0; k < r; k++) {
    res.push(array[indices[k]]);
  }
  results.push(res);

  var broken = false;
  while (n > 0) {
    for (var i = r - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        indices = indices
          .slice(0, i)
          .concat(indices.slice(i + 1).concat(indices.slice(i, i + 1)));
        cycles[i] = n - i;
        broken = false;
      } else {
        var j = cycles[i];
        var x = indices[i];
        indices[i] = indices[n - j];
        indices[n - j] = x;
        var res = [];
        for (var k = 0; k < r; k++) {
          res.push(array[indices[k]]);
        }
        results.push(res);
        broken = true;
        break;
      }
    }
    if (broken === false) {
      break;
    }
  }
  return results;
}

export const initCandidates = () => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return permutations(numbers, 4) as FourNumbers[];
};

export const filterCandidates = (
  candidates: FourNumbers[],
  guess: FourNumbers,
  hit: number,
  blow: number
) => {
  if (hit === 0 && blow === 0) {
    return candidates;
  }
  return candidates.filter((digits) => {
    const unhit = digits.filter((num, i) => {
      return num !== guess[i];
    });
    if (
      unhit.length === 4 - hit &&
      unhit.filter((num) => guess.includes(num)).length === blow
    ) {
      return true;
    } else {
      return false;
    }
  });
};

export const randomSample = (items: FourNumbers[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

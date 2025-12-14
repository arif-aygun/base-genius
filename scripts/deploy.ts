import "@nomicfoundation/hardhat-ethers";
import hre from "hardhat";

async function main() {
  const name = process.env.CONTRACT_NAME || "Base News Genius Badge";
  const symbol = process.env.CONTRACT_SYMBOL || "BNGB";

  console.log("Deploying QuizResultNFT...");
  console.log("Name:", name);
  console.log("Symbol:", symbol);

  const Factory = await hre.ethers.getContractFactory("QuizResultNFT");
  const contract = await Factory.deploy(name, symbol);

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("\n✅ QuizResultNFT deployed to:", address);
  console.log("\nAdd this to your .env file:");
  console.log(`NFT_CONTRACT_ADDRESS=${address}`);
  console.log("\nVerify on BaseScan:");
  console.log(`npx hardhat verify --network baseSepolia ${address} "${name}" "${symbol}"`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

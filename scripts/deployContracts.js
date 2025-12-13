const { ethers } = require("hardhat");
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Bidding = await ethers.getContractFactory("Bidding");
  const bidding = await Bidding.deploy();
  await bidding.waitForDeployment();
  console.log("Bidding contract deployed to:", bidding.target);

  const GoofyGoober = await ethers.getContractFactory("GoofyGoober");
  const goofyGoober = await GoofyGoober.deploy();
  await goofyGoober.waitForDeployment();
  console.log("GoofyGoober contract deployed to:", goofyGoober.target);

  await bidding.setToken(goofyGoober.target);
  console.log("Token set for bidding contract");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

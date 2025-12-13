require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 300,
      },
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC,
      accounts: { mnemonic: process.env.MNEMONIC_KEY },
    },
  },
};

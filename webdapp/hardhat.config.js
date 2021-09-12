require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.5",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
    cache: "./src/cache",
    artifacts: "./src/artifacts"
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.FORKING_URL,
        blockNumber: 13195099//11250730//
      }
    }/*,
    ganache:{
      url: "HTTP://127.0.0.1:7545",
      accounts: ["2edb1022ad751e86680072aba80b52d093b03c692c064b762a51fbc27c1524d7"],
      chainId: 1337
    },
    rinkeby: {
      url: process.env.RINKEBY_URL
    }*/
  }
};

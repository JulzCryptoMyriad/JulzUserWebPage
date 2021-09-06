require("@nomiclabs/hardhat-waffle");
require('hardhat-deploy');
require("@nomiclabs/hardhat-ethers");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
    cache: "./src/cache",
    artifacts: "./src/artifacts"
  }
};

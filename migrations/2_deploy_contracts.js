const CoinFlip = artifacts.require("CoinFlip");

module.exports = async function(deployer, network, accounts) {
  const gasPrice = web3.utils.toWei('35', 'gwei'); // Adjust this value
  await deployer.deploy(CoinFlip, { gas: 5500000, gasPrice: gasPrice });
};

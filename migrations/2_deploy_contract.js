const Dai = artifacts.require("Dai.sol");
const PaymentProcessor = artifacts.require("PaymentProcessor.sol");

module.exports = async function (deployer, network, addresses) {
    const [admin, payer, _] = addresses;
    
    if (network === 'develop') {  //cmd: truffle develp
        await deployer.deploy(Dai); // sendd transaction
        const dai = await Dai.deployed(); //wait for transaction to be a mine
        await dai.faucet(payer, web3.utils.toWei('10000'));

        await deployer.deploy(PaymentProcessor, admin, dai.address); 
    } else { // deploy on mainnet
        const ADMIN_ADDRESS = '';
        const DAI_ADDRESS = '';
        await deployer.deploy(PaymentProcessor, ADMIN_ADDRESS, DAI_ADDRESS); 
    }
};

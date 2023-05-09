const { expect } = require("chai");

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";

const FEE_SIZE = 3;
function encodePath(path, fees) {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }

    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase();
}

describe("JulzPay security", function() {
    let owner,
    treasury,
    attacker;
    const deposit = ethers.utils.parseEther("0.5");
    let withdrawToken = WETH_ADDR;
    beforeEach(async () => {
        // deploy contract
        owner = ethers.provider.getSigner(0);
        treasury = ethers.provider.getSigner(1);
        attacker = ethers.provider.getSigner(2);
        const JulzPay = await ethers.getContractFactory("JulzPay");
        contract = await JulzPay.deploy(owner.getAddress(), false, false, treasury.getAddress(), withdrawToken, WETH_ADDR, {value: deposit});
        await contract.deployed();
        
        // deposit funds
        const path = encodePath([DAI_ADDR, WETH_ADDR], [3000]);
        let signer1 = await ethers.provider.getSigner(0);
        const tx = await contract.connect(signer1).deposit(deposit, WETH_ADDR, path,{value: deposit});
        await tx.wait();
        
    });

    it("Only owner can withdraw", async function() {
        const thirtyDays = 30 * 24 * 60 * 60;
        await hre.network.provider.request({
            method: "evm_increaseTime",
            params: [thirtyDays]
        });

        await expect(contract.connect(attacker).withdraw()).to.be.revertedWith("Invalid caller");
        
    });
    
});



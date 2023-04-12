const { assert } = require("chai");

const getERC20 = require("./getERC20");

const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

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
    let owner;
    let treasury;
    let monthly = true;
    const deposit = ethers.utils.parseEther("0.5");
    let withdrawToken = WETH_ADDR;
    beforeEach(async () => {
        owner = ethers.provider.getSigner(0);
        treasury = ethers.provider.getSigner(1);
        const JulzPay = await ethers.getContractFactory("JulzPay");
        contract = await JulzPay.deploy(owner.getAddress(), monthly, false, treasury.getAddress(), withdrawToken, WETH_ADDR, {value: deposit});
        await contract.deployed();
    });

    /*it("", async function() {

    });*/
    
});



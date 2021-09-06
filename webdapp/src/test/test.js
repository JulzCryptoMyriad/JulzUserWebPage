const { assert } = require("chai");

describe("JulzPay", function() {
    let owner;
    let treasury;
    let accepted;
    let lastWithdrawDate;
    let monthly = false;
    const deposit = ethers.utils.parseEther("1");

    beforeEach(async () => {
        owner = ethers.provider.getSigner(0);
        treasury = ethers.provider.getSigner(1);
        const JulzPay = await ethers.getContractFactory("JulzPay");
        contract = await JulzPay.deploy(owner.getAddress(), monthly, false, treasury.getAddress(), {value: deposit});
        await contract.deployed();
    });

    it("should be funded initially", async function() {
        const balance = await ethers.provider.getBalance(contract.address);
        assert.equal(balance.toString(), deposit);
    });

    it("storage must be set initially", async function(){
        assert.equal(await contract.treasury(), await treasury.getAddress());
        assert.equal(await contract.monthly(), monthly);
    });

    it("accepted tokens on storage must allow to be set and default is false", async function(){
        await contract.setAccepted("DAI", true);
        assert.equal(await contract.accepted("DAI"), true);
        assert.equal(await contract.accepted("ETH"), false);
    });

    describe("On Withdraw", () => {
        it("should revert if less than a month has passed", async () => {
            let ex;
            try {
                await contract.connect(treasury).withdraw();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Attempted to withdraw when Not ready to withdraw. Expected transaction to revert!");
        });

        it("should withdraw if more than a month has passed", async () => {
           
            const thirtynDays = 30 * 24 * 60 * 60;
            await hre.network.provider.request({
                method: "evm_increaseTime",
                params: [thirtynDays]
            });

            const before = await ethers.provider.getBalance(treasury.getAddress());
            const approve = await contract.withdraw();
            const after = await ethers.provider.getBalance(treasury.getAddress());
            assert.equal(after.sub(before).toString(), deposit.toString());

            const balance = await ethers.provider.getBalance(contract.address);

            assert.equal(balance, 0);
            
        });
    });

    describe("On Destruct", () => {
        it("should not revert if  owner calls", async () => {
            let ex;
            try {
                await contract.connect(owner).destruct();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert.isUndefined(ex);
        });

        it("should revert if non owner calls", async () => {
            let ex;
            try {
                await contract.connect(treasury).destruct();
            }
            catch (_ex) {
                ex = _ex;
            }
            assert(ex, "Attempted to destroy it!");
        });
    });

});

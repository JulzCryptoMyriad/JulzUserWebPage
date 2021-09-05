//SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.7;

import "hardhat/console.sol";

contract JulzPay{
    enum TokenSymbol {ETH, USDC, DAI, WBTC, USDT}//Eth, Usdc, Dai wrapped bitcoin, Thether

    address payable private owner;
    mapping(string => bool) accepted;//Symbol => accepted/not accepted
    bool public monthly;
    bool public covergas;//for later update
    uint256 public lastWithdrawDate;
    address public treasury;
    bool private processing;

    constructor(    address payable _owner,
    bool _monthly,
    bool _covergas,
    address _treasury) payable{
        owner = _owner;
        monthly = _monthly;
        covergas = _covergas;
        lastWithdrawDate = block.timestamp;
        treasury = _treasury;
    }

    function setAccepted(string memory key, bool _value) external{
        	accepted[key] = _value;
    }

    function withdraw() external{
        require(lastWithdrawDate + 30 days <= block.timestamp, "Not ready to withdraw");  
        require(processing == false);

        processing = true;            

        payable(treasury).transfer(address(this).balance);
        lastWithdrawDate = block.timestamp;
        
        processing = false;
    }

    event Paid(address, uint256);
    receive() external payable{
        emit Paid(msg.sender, msg.value);
    }

    function destruct() public {
        require(msg.sender == owner, "Not the owner");
        selfdestruct(owner);
    }
}
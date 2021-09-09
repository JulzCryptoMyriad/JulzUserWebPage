//SPDX-License-Identifier: WTFPL
pragma solidity ^0.7.5;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/BytesLib.sol";
import "hardhat/console.sol";

interface IERC20 {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract JulzPay{
    //enum TokenSymbol {ETH, USDC, DAI, WBTC, USDT}//Eth, Usdc, Dai wrapped bitcoin, Thether

    address payable private owner;
    IERC20 public withdrawToken;//Symbol => accepted/not accepted
    bool public monthly;
    bool public covergas;//for later update
    uint256 public lastWithdrawDate;
    address public treasury;
    bool private processing;
    ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    constructor(    address payable _owner,
    bool _monthly,
    bool _covergas,
    address _treasury,
    address _withdrawToken) payable{
        owner = _owner;
        monthly = _monthly;
        covergas = _covergas;
        withdrawToken =  IERC20(_withdrawToken);
        lastWithdrawDate = block.timestamp;
        treasury = _treasury;
    }

    function withdraw() external{
        require(lastWithdrawDate + 30 days <= block.timestamp, "Not ready to withdraw");  
        require(processing == false);

        processing = true;            

        payable(treasury).transfer(address(this).balance);
        lastWithdrawDate = block.timestamp;
        
        processing = false;
    }

    event Paid(address, uint256, address);
    //for erc20 payments
    function deposit(uint _amount, address _token) external {
        IERC20 erc20 =  IERC20(_token);
        // pulling cryptocurrency from the person calling this contract 
        erc20.transferFrom(
                msg.sender,
                address(this),
                _amount
        ) ;
        //Convert it to withdrawToken and modify test
        emit Paid( msg.sender, _amount, _token);
    }

    //for eth payments
    receive() external payable{
        emit Paid( msg.sender, msg.value, address(this));
    }

    function destruct() public {
        require(msg.sender == owner, "Not the owner");
        selfdestruct(owner);
    }
}
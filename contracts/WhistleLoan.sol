// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LoanStorage.sol";

contract WhistleLoan {
    LoanStorage public storageContract;
    address public owner;

    constructor(address _loanStorageAddress) {
        owner = msg.sender;
        storageContract = LoanStorage(_loanStorageAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function requestLoan(uint256 amount, string calldata data) external returns (uint256) {
        return storageContract.storeLoan(msg.sender, amount, data);
    }

    function stakeForLoan(uint256 loanId) external payable {
        (address borrower, uint256 amount, , bool isPaid) = storageContract.getLoan(loanId);
        require(!isPaid, "Loan already funded");
        require(msg.value >= amount, "Insufficient stake");

        payable(borrower).transfer(amount);
        storageContract.markLoanPaid(loanId);
    }
}

//whistleloan at - 0x62f5477Da2559EcA1Bc2412da40a3f6Bc40062d9
//at subscan - https://assethub-westend.subscan.io/account/0x62f5477da2559eca1bc2412da40a3f6bc40062d9
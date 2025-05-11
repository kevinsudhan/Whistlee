// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LoanStorage {
    struct Loan {
        address borrower;
        uint256 amount;
        string data;
        bool isPaid;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public nextLoanId;
    address public manager;

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager allowed");
        _;
    }

    constructor() {
        manager = msg.sender;
    }

    function setManager(address _manager) external {
        require(msg.sender == manager, "Only current manager can update");
        manager = _manager;
    }

    function storeLoan(
        address borrower,
        uint256 amount,
        string calldata data
    ) external onlyManager returns (uint256) {
        loans[nextLoanId] = Loan(borrower, amount, data, false);
        return nextLoanId++;
    }

    function markLoanPaid(uint256 loanId) external onlyManager {
        loans[loanId].isPaid = true;
    }

    function getLoan(uint256 loanId) external view returns (
        address borrower,
        uint256 amount,
        string memory data,
        bool isPaid
    ) {
        Loan memory loan = loans[loanId];
        return (loan.borrower, loan.amount, loan.data, loan.isPaid);
    }
}


//loan storage at - 0x96dfc97779d32f09988D6490159B4EcF4b31aBeE
// at subscan - https://assethub-westend.subscan.io/account/0x96dfc97779d32f09988d6490159b4ecf4b31abee
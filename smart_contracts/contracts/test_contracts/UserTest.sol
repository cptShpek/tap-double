pragma solidity 0.5.8;

import "../User.sol";

contract UserTest is User {

    constructor(address _management, address payable _admin) public User(_management, _admin) {}

    function getTestFunds() external payable {

    }

}

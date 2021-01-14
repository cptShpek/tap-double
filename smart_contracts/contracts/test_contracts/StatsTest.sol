pragma solidity 0.5.8;

import "../Stats.sol";

contract StatsTest is Stats {

    constructor(address _management, address payable _admin) public Stats(_management, _admin) {}

    function isUserWon(address) external returns (bool) {
        return true;
    }

}

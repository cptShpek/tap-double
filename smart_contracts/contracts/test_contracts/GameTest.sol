pragma solidity 0.5.8;

import '../Game.sol';

contract GameTest is Game {

    constructor(
        address _management,
        address payable _admin,
        uint256 _dailyPoolStartAt
    ) public Game(_management, _admin, _dailyPoolStartAt) {

    }

    function testFillPrize(
        uint256 _prizePool
    )
        public
    {
        prizePool = _prizePool.mul(80).div(100);
        dailyPools[dailyPools.length.sub(1)].amount = _prizePool.mul(20).div(100);
    }

    function testSetUserAttempts()
        public
    {
        dailyPools[dailyPools.length.sub(1)].userAttempts[msg.sender] = 1;
    }
}

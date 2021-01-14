pragma solidity 0.5.8;

import './management/Managed.sol';
import './User.sol';
import './Game.sol';
import './Dividend.sol';

contract Stats is Managed {
    uint256 nonce;
    event Debug(address u, string n, uint256 v);
    constructor(address _management, address payable _admin) public Managed(_management, _admin) {}

    function isUserWon(address _user) external returns (bool) {
        uint256 userNumber = uint256(keccak256(abi.encodePacked(_user)))%10;
        emit Debug(_user, 'userNumber', userNumber);
        uint256 randNumber = pseudoRandom(_user);
        emit Debug(_user, 'randNumber', randNumber);
        return userNumber == randNumber;
    }

    function pseudoRandom(address _user) private returns (uint256) {
        uint256 contractBalance = address(management.contractRegistry(CONTRACT_USER)).balance;
        (
            uint256 userTotalAmount,
            uint256 userGeneralPoolAmount,
            uint256 statsTotalAmount,
            uint256 statsGeneralAmount,
            uint256 statsTotalReferralSuns
        ) = User(management.contractRegistry(CONTRACT_USER)).getStats(_user);
        (
            uint256 userAttempts,
            uint256 statsPrizePool
        ) = Game(management.contractRegistry(CONTRACT_GAME)).getStats(_user);
        uint256 rand = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.difficulty,
                nonce,
                _user,
                contractBalance,
                userTotalAmount,
                userGeneralPoolAmount,
                statsTotalAmount,
                statsGeneralAmount,
                statsTotalReferralSuns,
                userAttempts,
                statsPrizePool
            ))) % 10;

        nonce++;

        return rand;
    }

}

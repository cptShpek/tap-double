pragma solidity 0.5.8;

import './management/Managed.sol';
import './User.sol';
import './Stats.sol';

contract Game is Managed {

    uint256 public prizePool;

    uint256 public dailyPoolPeriod = 1 days;

    DailyPool[] public dailyPools;

    struct DailyPool {
        uint256 endAt;
        uint256 amount;
        mapping(address => uint256) userAttempts;
    }

    constructor(
        address _management,
        address payable _admin,
        uint256 _dailyPoolStartAt
    ) public Managed(_management, _admin) {
        dailyPools.push(
            DailyPool(_dailyPoolStartAt.add(dailyPoolPeriod), 0)
        );
    }

    function getGameStats() public view returns (
        uint256 prizePoolAmount,
        uint256 dailyPoolAmount
    ) {
        prizePoolAmount = prizePool;
        dailyPoolAmount = dailyPools[dailyPools.length.sub(1)].amount;
    }


    function getStats(
        address _user
    ) public view returns (
        uint256 userAttempts,
        uint256 statsPrizePool
    ) {
        userAttempts = dailyPools[dailyPools.length.sub(1)].userAttempts[_user];
        statsPrizePool = prizePool;
    }

    function fillPrizePool(
        uint256 _value
    )
        external
        requireContractExistsInRegistry(CONTRACT_USER)
        canCallOnlyRegisteredContract(CONTRACT_USER)
    {
        if (dailyPools[dailyPools.length.sub(1)].endAt < block.timestamp) {
            prizePool = prizePool.add(_value);
            checkAndStartDaily();
        } else {
            uint256 dailyToAdd = _value.mul(prizePoolPercentageForDaily).div(100);
            prizePool = prizePool.add(_value.sub(dailyToAdd));
            dailyPools[dailyPools.length.sub(1)].amount = dailyPools[dailyPools.length.sub(1)].amount.add(
                dailyToAdd
            );
        }
    }

    function decreaseDailyPool(
        uint256 _value
    )
        external
        requireContractExistsInRegistry(CONTRACT_USER)
        canCallOnlyRegisteredContract(CONTRACT_USER)
    {
        dailyPools[dailyPools.length.sub(1)].amount = dailyPools[dailyPools.length.sub(1)].amount.sub(_value);
    }

    function double()
        external
        payable
        requireContractExistsInRegistry(CONTRACT_USER)
        requireContractExistsInRegistry(CONTRACT_DIVIDEND)
        returns (bool)
    {
        checkAndStartDaily();
        require(dailyPools[dailyPools.length.sub(1)].endAt >= block.timestamp, ERROR_ACCESS_DENIED);

        (
            uint256 userTotalAmount,
            address userReferral
        ) = User(management.contractRegistry(CONTRACT_USER)).getUser(msg.sender);

        require(userTotalAmount > 0, ERROR_ACCESS_DENIED);
        require(
            userTotalAmount <= dailyPools[dailyPools.length.sub(1)].amount.mul(dailyPoolPercentageToPlay).div(100),
            ERROR_ACCESS_DENIED
        );

        if (dailyPools[dailyPools.length.sub(1)].userAttempts[msg.sender] > 0) {
            uint256 playCostAmount = userTotalAmount.mul(playCostPercent).div(100);
            require(msg.value >= playCostAmount, ERROR_ACCESS_DENIED);

            applyPaidAttemptFee(playCostAmount, userReferral);
        }

        return doubleInternal();
    }

    function checkAndStartDaily() public {
        if (dailyPools[dailyPools.length.sub(1)].endAt < block.timestamp) {
            uint256 prizeAmountForNewDaily = prizePool.mul(prizePoolPercentageForDaily).div(100);

            dailyPools.push(DailyPool(
                dailyPools[dailyPools.length.sub(1)].endAt.add(dailyPoolPeriod),
                dailyPools[dailyPools.length.sub(1)].amount.add(prizeAmountForNewDaily)
            ));
            prizePool = prizePool.sub(prizeAmountForNewDaily);
        }
    }

    function applyPaidAttemptFee(uint256 _fee, address _userReferral) internal {
        uint256 adminFee = _fee.mul(paidAttemptAdminFeePercentage).div(100);
        if (_userReferral == address(0)) {
            adminFee = _fee.mul(paidAttemptAdminFeePercentage.add(paidAttemptReferralFeePercentage)).div(100);
        } else {
            User(management.contractRegistry(CONTRACT_USER))
                .applyPaidAttemptReferral
                .value(paidAttemptReferralFeePercentage)(msg.sender);
        }

        dailyPools[dailyPools.length.sub(1)].userAttempts[msg.sender] = dailyPools[
            dailyPools.length.sub(1)
        ].userAttempts[msg.sender].add(1);

        prizePool = prizePool.add(_fee.mul(paidAttemptPrizeFeePercentage).div(100));
        admin.transfer(adminFee);
    }

    function doubleInternal() internal returns (bool){
        bool isUserWon = Stats(management.contractRegistry(CONTRACT_STATS)).isUserWon(msg.sender);

        if (!isUserWon) {
            return false;
        }

        User(management.contractRegistry(CONTRACT_USER)).recordWinner(
            msg.sender
        );

        return true;
    }

}

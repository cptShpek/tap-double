pragma solidity 0.5.8;

import './management/Managed.sol';

contract Dividend is Managed {
    event Debug(address a, string check, uint256 value);

    uint256[] public timestampIndex;

    struct Record {
        uint256 totalAmount;
        uint256 dividendFeeAmount;
    }

    mapping(uint256 => Record) public timedRecord;

    struct User {
        uint256 syncAtIndex;
        uint256 userTotalAmount;
        uint256 dividendEarnedAmount;
    }

    mapping(address => User) public userData;

    constructor(address _management, address payable _admin) public Managed(_management, _admin) {}

    function getUserStats(
        address _user
    ) public view returns (
        uint256 currentTotalAmount,
        uint256 dividendEarnedAmount
    ) {
        currentTotalAmount = getCurrentTotalAmount();
        dividendEarnedAmount = calculateDividendEarnedAmount(_user);
    }

    function record(
        address _user,
        uint256 _userTotalAmount,
        uint256 _dividendFeeAmount
    )
        external
        requireContractExistsInRegistry(CONTRACT_USER)
        canCallOnlyRegisteredContract(CONTRACT_USER)
        returns(bool)
    {
        uint256 currentTotalAmount = getCurrentTotalAmount();

        uint256 index = timestampIndex.push(block.timestamp).sub(1);

        timedRecord[index].totalAmount = currentTotalAmount.add(_userTotalAmount);
        timedRecord[index].dividendFeeAmount = _dividendFeeAmount;

        return sync(_user, _userTotalAmount);
    }

    function getCurrentTotalAmount() public view returns (uint256) {
        uint256 index = timestampIndex.length != 0 ? timestampIndex.length.sub(1) : 0;

        return timedRecord[index].totalAmount;
    }

    function isSynced(address _user) public view returns (bool) {
        if (timestampIndex.length < 2) {
            return false;
        }
        return userData[_user].syncAtIndex == timestampIndex.length.sub(1);
    }

    function calculateDividendEarnedAmount(address _user) public view returns (uint256) {
        if (isSynced(_user)) {
            return userData[_user].dividendEarnedAmount;
        }

        uint256 dividendEarnedAmountToAdd;
        uint256 lastIndex = timestampIndex.length;

        for (uint256 i = userData[_user].syncAtIndex.add(1); i < lastIndex; i++) {
            dividendEarnedAmountToAdd = dividendEarnedAmountToAdd.add(
                userData[_user].userTotalAmount.mul(
                    timedRecord[i].dividendFeeAmount.div(2)
                ).div(
                    timedRecord[i].totalAmount
                )
            );
        }

        return userData[_user].dividendEarnedAmount.add(dividendEarnedAmountToAdd);
    }

    function sync(address _user, uint256 _userTotalAmount) internal returns (bool) {
        require(msg.sender != address(0), ERROR_WRONG_USER_ADDRESS);

        if (timestampIndex.length == 1) {
            userData[_user].userTotalAmount = _userTotalAmount;
            userData[_user].dividendEarnedAmount = timedRecord[0].dividendFeeAmount.div(2);
            return true;
        }

        if (isSynced(_user)) {
            return true;
        }

        userData[_user].userTotalAmount = _userTotalAmount;
        userData[_user].syncAtIndex = timestampIndex.length.sub(2);
        userData[_user].dividendEarnedAmount = calculateDividendEarnedAmount(_user);
        userData[_user].syncAtIndex = timestampIndex.length.sub(1);

        return true;
    }

}

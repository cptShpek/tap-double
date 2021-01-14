pragma solidity 0.5.8;

import './management/Managed.sol';
import './Dividend.sol';
import './Game.sol';

contract User is Managed {

    uint256 public statsAmount;
    uint256 public statsGAmount;
    uint256 public statsReferralSuns;

    struct UserData {
        bool exists;
        bool isWithdrawn;

        uint256 totalAmount;
        uint256 generalPoolAmount;

        DepositType depositType;

        address referral;
        uint256 totalReferralSuns;
        mapping(address => uint256) referralsSuns;
        address[] referrals;
    }

    mapping(address => UserData) public users;

    constructor(address _management, address payable _admin) public Managed(_management, _admin) {}

    function getStats(
        address _user
    ) public view returns (
        uint256 userTotalAmount,
        uint256 userGeneralPoolAmount,
        uint256 statsTotalAmount,
        uint256 statsGeneralAmount,
        uint256 statsTotalReferralSuns
    ) {
        userTotalAmount = users[_user].totalAmount;
        userGeneralPoolAmount = users[_user].generalPoolAmount;
        statsTotalAmount = statsAmount;
        statsGeneralAmount = statsGAmount;
        statsTotalReferralSuns = statsReferralSuns;
    }

    function getUser(
        address _user
    ) public view returns (
        uint256 userTotalAmount,
        address referralAddress
    ) {
        userTotalAmount = users[_user].totalAmount;
        referralAddress = users[_user].referral;
    }

    function getUserFullData(
        address _user
    ) public view returns (
        bool exists,
        bool isWithdrawn,

        uint256 totalAmount,
        uint256 generalPoolAmount,

        DepositType depositType,

        address referral,
        uint256 totalReferralSuns
    ) {
        exists = users[_user].exists;
        isWithdrawn = users[_user].isWithdrawn;
        totalAmount = users[_user].totalAmount;
        generalPoolAmount = users[_user].generalPoolAmount;
        depositType = users[_user].depositType;
        referral = users[_user].referral;
        totalReferralSuns = users[_user].totalReferralSuns;
    }

    function depositWithReferral(
        DepositType _depositType,
        address _referral,
        uint256 _referralRewardPercent
    )
        external
        payable
        requireContractExistsInRegistry(CONTRACT_GAME)
        requireContractExistsInRegistry(CONTRACT_DIVIDEND)
    {
        depositInternal(_depositType, _referral, _referralRewardPercent);
    }

    function deposit(
        DepositType _depositType
    )
        external
        payable
        requireContractExistsInRegistry(CONTRACT_GAME)
        requireContractExistsInRegistry(CONTRACT_DIVIDEND)
    {
        depositInternal(_depositType, address(0), 0);
    }

    function applyPaidAttemptReferral(
        address _user
    )
        external
        payable
        requireContractExistsInRegistry(CONTRACT_GAME)
        canCallOnlyRegisteredContract(CONTRACT_GAME)
    {
        address referral = users[_user].referral;
        users[referral].referralsSuns[msg.sender] = users[referral].referralsSuns[msg.sender].add(
            msg.value
        );

        users[referral].totalReferralSuns = users[referral].totalReferralSuns.add(msg.value);
        users[referral].generalPoolAmount = users[referral].generalPoolAmount.add(msg.value);
    }

    function calculateFees(
        uint256 _value,
        DepositType _depositType
    ) public view returns (
        uint256 prizeFee,
        uint256 referralFee,
        uint256 dividendFee,
        uint256 adminFee
    ) {
        prizeFee = _value.mul(depositsInfo[uint256(_depositType)].prizeFee).div(100);
        referralFee = _value.mul(depositsInfo[uint256(_depositType)].referralFee).div(100);
        dividendFee = _value.mul(depositsInfo[uint256(_depositType)].dividendFee).div(100);
        adminFee = _value.mul(depositsInfo[uint256(_depositType)].adminFee).div(100);
    }

    function depositInternal(DepositType _depositType, address _referral, uint256 _referralRewardPercent) internal {
        require(msg.value > 0, ERROR_WRONG_AMOUNT);
        require(depositsInfo[uint256(_depositType)].isSet, ERROR_NOT_AVAILABLE);

        if (users[msg.sender].exists) {
            require(
                users[msg.sender].isWithdrawn || _depositType == users[msg.sender].depositType,
                ERROR_WRONG_AMOUNT
            );
        }

        (
            uint256 prizeFee,
            uint256 referralFee,
            uint256 dividendFee,
            uint256 adminFee
        ) = calculateFees(msg.value, _depositType);

        uint256 fee = prizeFee.add(referralFee).add(dividendFee).add(adminFee);

        if (users[msg.sender].exists == true) {

            users[msg.sender].totalAmount = users[msg.sender].totalAmount.add(
                msg.value.mul(depositsInfo[uint256(_depositType)].multiplier).sub(fee)
            );

            users[msg.sender].generalPoolAmount = users[msg.sender].generalPoolAmount.add(
                msg.value.sub(fee)
            );

            if (users[msg.sender].isWithdrawn == true) {
                users[msg.sender].isWithdrawn = false;
                users[msg.sender].depositType = _depositType;
            }
        } else {
            users[msg.sender].exists = true;
            users[msg.sender].totalAmount = msg.value.mul(depositsInfo[uint256(_depositType)].multiplier).sub(fee);
            users[msg.sender].generalPoolAmount = msg.value.sub(fee);
            users[msg.sender].depositType = _depositType;
        }

        statsAmount = statsAmount.add(users[msg.sender].totalAmount);
        statsGAmount = statsGAmount.add(users[msg.sender].generalPoolAmount);

        applyFees(
            prizeFee,
            referralFee,
            dividendFee,
            adminFee,
            _referral,
            _referralRewardPercent
        );
    }

    function applyFees(
        uint256 _prizeFee,
        uint256 _referralFee,
        uint256 _dividendFee,
        uint256 _adminFee,

        address _referral,
        uint256 _referralRewardPercent
    ) internal {
        if (_referral == address(0) || _referralRewardPercent == 0) {
            _adminFee = _adminFee.add(_referralFee);
        } else {
            require(users[_referral].exists, ERROR_WRONG_USER_ADDRESS);

            proceedReferralFee(_referral, _referralRewardPercent, _referralFee);
        }

        Dividend(management.contractRegistry(CONTRACT_DIVIDEND)).record(
            msg.sender,
            users[msg.sender].totalAmount,
            _dividendFee
        );

        Game(management.contractRegistry(CONTRACT_GAME)).fillPrizePool(_prizeFee);

        admin.transfer(_adminFee);
    }

    function proceedReferralFee(
        address _referral,
        uint256 _referralRewardPercent,
        uint256 _feeAmount
    ) internal {
        uint256 referralFeeAmount = _feeAmount.mul(_referralRewardPercent).div(100);

        if (users[_referral].referralsSuns[msg.sender] == 0) {
            users[_referral].referrals.push(msg.sender);
        }

        users[msg.sender].referral = _referral;

        users[_referral].referralsSuns[msg.sender] = users[_referral].referralsSuns[msg.sender].add(
            referralFeeAmount
        );

        users[_referral].totalReferralSuns = users[_referral].totalReferralSuns.add(referralFeeAmount);
        users[_referral].generalPoolAmount = users[_referral].generalPoolAmount.add(referralFeeAmount);

        users[msg.sender].generalPoolAmount = users[msg.sender].generalPoolAmount.add(
            _feeAmount.sub(referralFeeAmount)
        );
        statsReferralSuns = statsReferralSuns.add(referralFeeAmount);
    }

    function recordWinner(
        address payable _user
    )
        external
        requireContractExistsInRegistry(CONTRACT_GAME)
        canCallOnlyRegisteredContract(CONTRACT_GAME)
    {
        uint256 wonAmount = users[_user].totalAmount.mul(2);

        uint256 dailyPoolDecreaseValue = wonAmount.sub(users[_user].generalPoolAmount);

        wonAmount = wonAmount.add(
            Dividend(management.contractRegistry(CONTRACT_DIVIDEND)).calculateDividendEarnedAmount(_user)
        );

        Game(management.contractRegistry(CONTRACT_GAME)).decreaseDailyPool(dailyPoolDecreaseValue);
        withdrawInternal(_user, wonAmount);
    }

    function withdraw() public requireContractExistsInRegistry(CONTRACT_DIVIDEND) {
        require(users[msg.sender].exists == true, ERROR_ACCESS_DENIED);
        require(users[msg.sender].isWithdrawn == false, ERROR_ACCESS_DENIED);

        uint256 amount = users[msg.sender].generalPoolAmount.add(
            Dividend(management.contractRegistry(CONTRACT_DIVIDEND)).calculateDividendEarnedAmount(msg.sender)
        );

        withdrawInternal(msg.sender, amount);
    }

    function withdrawInternal(address payable _user, uint256 _amount) internal {
        users[_user].isWithdrawn = true;

        users[_user].generalPoolAmount = 0;
        users[_user].totalAmount = 0;
//        Dividend(management.contractRegistry(CONTRACT_DIVIDEND)).markWithdrawn(_user);

        _user.transfer(_amount);
    }

}

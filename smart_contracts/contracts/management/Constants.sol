pragma solidity 0.5.8;

contract Constants {

    enum DepositType {X1, X2, X3, X4}

    // Info about particular deposit type
    struct DepositInfo {
        uint256 multiplier;
        uint256 prizeFee;
        uint256 referralFee;
        uint256 dividendFee;
        uint256 adminFee;
        bool isSet;
    }

    //Array of all deposit types info
    DepositInfo[4] public depositsInfo;

    // paid attempts data
    uint256 public playCostPercent = 10;
    uint256 public paidAttemptReferralFeePercentage = 10;
    uint256 public paidAttemptAdminFeePercentage = 20;
    uint256 public paidAttemptPrizeFeePercentage = 70;

    uint256 public dailyPoolPercentageToPlay = 25;

    uint256 public prizePoolPercentageForDaily = 20;

    constructor() internal {
        depositsInfo[uint256(DepositType.X1)].multiplier = 1;
        depositsInfo[uint256(DepositType.X1)].prizeFee = 10;
        depositsInfo[uint256(DepositType.X1)].referralFee = 1;
        depositsInfo[uint256(DepositType.X1)].dividendFee = 12;
        depositsInfo[uint256(DepositType.X1)].adminFee = 2;
        depositsInfo[uint256(DepositType.X1)].isSet = true;

        depositsInfo[uint256(DepositType.X2)].multiplier = 2;
        depositsInfo[uint256(DepositType.X2)].prizeFee = 20;
        depositsInfo[uint256(DepositType.X2)].referralFee = 2;
        depositsInfo[uint256(DepositType.X2)].dividendFee = 24;
        depositsInfo[uint256(DepositType.X2)].adminFee = 4;
        depositsInfo[uint256(DepositType.X2)].isSet = true;

        depositsInfo[uint256(DepositType.X3)].multiplier = 3;
        depositsInfo[uint256(DepositType.X3)].prizeFee = 30;
        depositsInfo[uint256(DepositType.X3)].referralFee = 3;
        depositsInfo[uint256(DepositType.X3)].dividendFee = 36;
        depositsInfo[uint256(DepositType.X3)].adminFee = 6;
        depositsInfo[uint256(DepositType.X3)].isSet = true;

        depositsInfo[uint256(DepositType.X4)].multiplier = 4;
        depositsInfo[uint256(DepositType.X4)].prizeFee = 40;
        depositsInfo[uint256(DepositType.X4)].referralFee = 4;
        depositsInfo[uint256(DepositType.X4)].dividendFee = 48;
        depositsInfo[uint256(DepositType.X4)].adminFee = 8;
        depositsInfo[uint256(DepositType.X4)].isSet = true;
    }


    // Permissions bit constants
//    uint256 public constant CAN_CREATE_COMPANY = 1;
//    uint256 public constant CAN_SUSPEND_RESUME_RECOGNIZING = 2;
//    uint256 public constant CAN_SIGN_TRANSACTION = 3;
//    uint256 public constant CAN_MINT_TOKENS = 4;
//    uint256 public constant CAN_UPDATE_STATE = 5;

    // Contract Registry keys
    uint256 public constant CONTRACT_USER = 1;
    uint256 public constant CONTRACT_DIVIDEND = 2;
    uint256 public constant CONTRACT_GAME = 3;
    uint256 public constant CONTRACT_STATS = 4;

    string public constant ERROR_WRONG_AMOUNT = "ERROR_WRONG_AMOUNT";
    string public constant ERROR_NOT_AVAILABLE = "ERROR_NOT_AVAILABLE";
    string public constant ERROR_WRONG_USER_ADDRESS = "ERROR_WRONG_USER_ADDRESS";
    string public constant ERROR_ACCESS_DENIED = "ERROR_ACCESS_DENIED";

    string public constant ERROR_NO_CONTRACT = "ERROR_NO_CONTRACT";
}
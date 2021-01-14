const abi = require('ethereumjs-abi'),
BigNumber = require('bignumber.js'),

Utils = require("./utils"),
User = artifacts.require('User.sol'),
UserTest = artifacts.require('./test_contracts/UserTest.sol'),
Dividend = artifacts.require('Dividend.sol'),
Game = artifacts.require('Game.sol'),
GameTest = artifacts.require('./test_contracts/GameTest.sol'),
Stats = artifacts.require('Stats.sol'),
StatsTest = artifacts.require('./test_contracts/StatsTest.sol'),
Management = artifacts.require("Management.sol");

const X1 = 0,
    X2 = 1,
    X3 = 2,
    X4 = 3;

const CONTRACT_USER = 1;
const CONTRACT_DIVIDEND = 2;
const CONTRACT_GAME = 3;
const CONTRACT_STATS = 4;

contract('User', accounts => {

    let user = null,
        dividend = null,
        game = null,
        stats = null,
        management = null;

    const owner = accounts[0];
    const admin = accounts[9];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];
    const user4 = accounts[4];

    const depositAmount = 100;

    const user1TotalAmountShouldBe = 75;
    const user1GeneralPoolAmountShouldBe = 75;
    const user1DividendEarnedAmountShouldBe = 6;
    const user1PrizePoolShouldBe = 8;
    const user1DailyPoolShouldBe = 2;

    const user2TotalAmountShouldBe = 150;
    const user2GeneralPoolAmountShouldBe = 50;
    const user2DividendEarnedAmountShouldBe = 8;
    const user2user1DividendEarnedAmountShouldBe = 10;
    const user2PrizePoolShouldBe = 24;//8 + 16
    const user2DailyPoolShouldBe = 6;//2 + 4

    const user3TotalAmountShouldBe = 225;
    const user3GeneralPoolAmountShouldBe = 25;
    const user3DividendEarnedAmountShouldBe = 9;
    const user3user1DividendEarnedAmountShouldBe = 13;
    const user3user2DividendEarnedAmountShouldBe = 14;
    const user3PrizePoolShouldBe = 48;//8 + 16 + 24
    const user3DailyPoolShouldBe = 12;//2 + 4 + 6

    const user4TotalAmountShouldBe = 300;
    const user4GeneralPoolAmountShouldBe = 0;
    const user4DividendEarnedAmountShouldBe = 9;//9.6;
    const user4user1DividendEarnedAmountShouldBe = 15;//15.4;
    const user4user2DividendEarnedAmountShouldBe = 18;//18.8;
    const user4user3DividendEarnedAmountShouldBe = 16;//16.2;
    const user4PrizePoolShouldBe = 80;//8 + 16 + 24 + 32
    const user4DailyPoolShouldBe = 20;//2 + 4 + 6 + 8

    let startAt = parseInt(new Date().getTime() / 1000) + 3600;

    beforeEach(async () => {
        management = await Management.new();
        user = await User.new(management.address, admin);
        dividend = await Dividend.new(management.address, admin);
        game = await Game.new(management.address, admin, startAt);
        stats = await Stats.new(management.address, admin);

        await management.registerContract(CONTRACT_USER, user.address, {from: owner})
            .then(Utils.receiptShouldSucceed);
        await management.registerContract(CONTRACT_DIVIDEND, dividend.address)
            .then(Utils.receiptShouldSucceed);
        await management.registerContract(CONTRACT_GAME, game.address)
            .then(Utils.receiptShouldSucceed);
        await management.registerContract(CONTRACT_STATS, stats.address)
            .then(Utils.receiptShouldSucceed);
    });

    describe('general testcases for deposit', () => {

        it('#user1', async () => {
            let userData = await user.getUserFullData.call(user1);
            let dividendData = await dividend.getUserStats.call(user1);
            let gameData = await game.getGameStats.call();

            assert.equal(userData.exists, false, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, 0, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, 0, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, 0, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(dividendData.dividendEarnedAmount, 0, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, 0, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, 0, "gameData.dailyPoolAmount is not equal");

            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            userData = await user.getUserFullData.call(user1);
            dividendData = await dividend.getUserStats.call(user1);
            gameData = await game.getGameStats.call();

            assert.equal(userData.exists, true, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, user1TotalAmountShouldBe, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, user1GeneralPoolAmountShouldBe, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, X1, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(dividendData.dividendEarnedAmount, user1DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user1PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user1DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
        });

        it('#user2', async () => {
            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            let userData = await user.getUserFullData.call(user2);
            let dividendData = await dividend.getUserStats.call(user2);

            let gameData = await game.getGameStats.call();

            assert.equal(userData.exists, false, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, 0, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, 0, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, 0, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(dividendData.dividendEarnedAmount, 0, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user1PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user1DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            userData = await user.getUserFullData.call(user2);
            dividendData = await dividend.getUserStats.call(user2);
            gameData = await game.getGameStats.call();

            assert.equal(userData.exists, true, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, user2TotalAmountShouldBe, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, user2GeneralPoolAmountShouldBe, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, X2, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(dividendData.dividendEarnedAmount, user2DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");
            assert.equal(await dividend.calculateDividendEarnedAmount.call(user1), user2user1DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user2PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user2DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
        });

        it('#user3', async () => {
            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            let userData = await user.getUserFullData.call(user3);
            let dividendData = await dividend.getUserStats.call(user3);
            let gameData = await game.getGameStats.call();

            assert.equal(userData.exists, false, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, 0, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, 0, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, 0, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(dividendData.dividendEarnedAmount, 0, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user2PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user2DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
            await user.deposit(X3, {from: user3, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            userData = await user.getUserFullData.call(user3);
            dividendData = await dividend.getUserStats.call(user3);
            gameData = await game.getGameStats.call();

            assert.equal(userData.exists, true, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, user3TotalAmountShouldBe, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, user3GeneralPoolAmountShouldBe, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, X3, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(new BigNumber(dividendData.dividendEarnedAmount).valueOf(), user3DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");
            assert.equal(await dividend.calculateDividendEarnedAmount.call(user1), user3user1DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");
            assert.equal(await dividend.calculateDividendEarnedAmount.call(user2), user3user2DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user3PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user3DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
        });

        it('#user4', async () => {
            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X3, {from: user3, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            let userData = await user.getUserFullData.call(user4);
            let dividendData = await dividend.getUserStats.call(user4);
            let gameData = await game.getGameStats.call();

            assert.equal(userData.exists, false, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, 0, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, 0, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, 0, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(dividendData.dividendEarnedAmount, 0, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user3PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user3DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
            await user.deposit(X4, {from: user4, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            userData = await user.getUserFullData.call(user4);
            dividendData = await dividend.getUserStats.call(user4);
            gameData = await game.getGameStats.call();

            assert.equal(userData.exists, true, "userData.exists is not equal");
            assert.equal(userData.isWithdrawn, false, "userData.isWithdrawn is not equal");
            assert.equal(userData.totalAmount, user4TotalAmountShouldBe, "userData.totalAmount is not equal");
            assert.equal(userData.generalPoolAmount, user4GeneralPoolAmountShouldBe, "userData.generalPoolAmount is not equal");
            assert.equal(userData.depositType, X4, "userData.depositType is not equal");
            assert.equal(userData.referral, 0x0, "userData.referral is not equal");
            assert.equal(userData.totalReferralSuns, 0, "userData.totalReferralSuns is not equal");

            assert.equal(new BigNumber(dividendData.dividendEarnedAmount).valueOf(), user4DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");
            assert.equal(await dividend.calculateDividendEarnedAmount.call(user1), user4user1DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");
            assert.equal(await dividend.calculateDividendEarnedAmount.call(user2), user4user2DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");
            assert.equal(await dividend.calculateDividendEarnedAmount.call(user3), user4user3DividendEarnedAmountShouldBe, "dividendData.dividendEarnedAmount is not equal");

            assert.equal(gameData.prizePoolAmount, user4PrizePoolShouldBe, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, user4DailyPoolShouldBe, "gameData.dailyPoolAmount is not equal");
        });

    });

    describe('general testcases for deposit', () => {

        it('#user1 free attempt', async () => {
            user = await UserTest.new(management.address, admin);
            game = await GameTest.new(management.address, admin, startAt);
            stats = await StatsTest.new(management.address, admin);
            await management.registerContract(CONTRACT_USER, user.address, {from: owner})
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_GAME, game.address)
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_STATS, stats.address)
                .then(Utils.receiptShouldSucceed);

            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X3, {from: user3, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X4, {from: user4, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            await user.getTestFunds({from: accounts[7], value: 5000});
            await game.testFillPrize(5000);

            let gameData = await game.getGameStats.call();

            assert.equal(gameData.prizePoolAmount, 4000, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, 1000, "gameData.dailyPoolAmount is not equal");

            await game.double({from: user1})
                .then(Utils.receiptShouldSucceed);
            await game.double({from: user1})
                .then(Utils.receiptShouldFailed)
                .catch(Utils.catchReceiptShouldFailed);

            gameData = await game.getGameStats.call();

            assert.equal(gameData.prizePoolAmount, 4000, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, 925, "gameData.dailyPoolAmount is not equal");
        });

        it('#user1 paid attempt', async () => {
            user = await UserTest.new(management.address, admin);
            game = await GameTest.new(management.address, admin, startAt);
            stats = await StatsTest.new(management.address, admin);
            await management.registerContract(CONTRACT_USER, user.address, {from: owner})
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_GAME, game.address)
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_STATS, stats.address)
                .then(Utils.receiptShouldSucceed);

            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X3, {from: user3, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X4, {from: user4, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            await user.getTestFunds({from: accounts[7], value: 5000});
            await game.testFillPrize(5000);

            let gameData = await game.getGameStats.call();

            assert.equal(gameData.prizePoolAmount, 4000, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, 1000, "gameData.dailyPoolAmount is not equal");

            await game.testSetUserAttempts({from: user1});

            await game.double({from: user1})
                .then(Utils.receiptShouldFailed)
                .catch(Utils.catchReceiptShouldFailed);
            await game.double({from: user1, value: 6})
                .then(Utils.receiptShouldFailed)
                .catch(Utils.catchReceiptShouldFailed);
            await game.double({from: user1, value: 8})
                .then(Utils.receiptShouldSucceed);

            gameData = await game.getGameStats.call();

            assert.equal(new BigNumber(gameData.dailyPoolAmount).valueOf(), 925, "gameData.dailyPoolAmount is not equal");
        });

        it('#user2 free attempt', async () => {
            user = await UserTest.new(management.address, admin);
            game = await GameTest.new(management.address, admin, startAt);
            stats = await StatsTest.new(management.address, admin);
            await management.registerContract(CONTRACT_USER, user.address, {from: owner})
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_GAME, game.address)
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_STATS, stats.address)
                .then(Utils.receiptShouldSucceed);

            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X3, {from: user3, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X4, {from: user4, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            await user.getTestFunds({from: accounts[7], value: 5000});
            await game.testFillPrize(4625);

            let gameData = await game.getGameStats.call();

            assert.equal(gameData.prizePoolAmount, 3700, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, 925, "gameData.dailyPoolAmount is not equal");

            await game.double({from: user2})
                .then(Utils.receiptShouldSucceed);
            await game.double({from: user2})
                .then(Utils.receiptShouldFailed)
                .catch(Utils.catchReceiptShouldFailed);

            gameData = await game.getGameStats.call();

            assert.equal(gameData.prizePoolAmount, 3700, "gameData.prizePoolAmount is not equal");
            assert.equal(new BigNumber(gameData.dailyPoolAmount).valueOf(), 675, "gameData.dailyPoolAmount is not equal");
        });

        it('#user2 paid attempt', async () => {
            user = await UserTest.new(management.address, admin);
            game = await GameTest.new(management.address, admin, startAt);
            stats = await StatsTest.new(management.address, admin);
            await management.registerContract(CONTRACT_USER, user.address, {from: owner})
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_GAME, game.address)
                .then(Utils.receiptShouldSucceed);
            await management.registerContract(CONTRACT_STATS, stats.address)
                .then(Utils.receiptShouldSucceed);

            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X2, {from: user2, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X3, {from: user3, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X4, {from: user4, value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            await user.getTestFunds({from: accounts[7], value: 5000});
            await game.testFillPrize(4625);

            let gameData = await game.getGameStats.call();

            assert.equal(gameData.prizePoolAmount, 3700, "gameData.prizePoolAmount is not equal");
            assert.equal(gameData.dailyPoolAmount, 925, "gameData.dailyPoolAmount is not equal");

            await game.testSetUserAttempts({from: user2});

            await game.double({from: user2})
                .then(Utils.receiptShouldFailed)
                .catch(Utils.catchReceiptShouldFailed);
            await game.double({from: user2, value: 14})
                .then(Utils.receiptShouldFailed)
                .catch(Utils.catchReceiptShouldFailed);
            await game.double({from: user2, value: 15})
                .then(Utils.receiptShouldSucceed);

            gameData = await game.getGameStats.call();

            assert.equal(new BigNumber(gameData.dailyPoolAmount).valueOf(), 675, "gameData.dailyPoolAmount is not equal");
        });
    });

    describe('check pseudoRandom', () => {
        it('#user1', async () => {
            await user.deposit(X1, {from: user1, value: depositAmount})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X1, {from: user2, value: 10000060040003000200})
                .then(Utils.receiptShouldSucceed);
            await user.deposit(X1, {from: accounts[3], value: depositAmount})
                .then(Utils.receiptShouldSucceed);

            await stats.isUserWon(accounts[1])
                .then(Utils.receiptShouldSucceed);
            await stats.isUserWon(accounts[1])
                .then(Utils.receiptShouldSucceed);
            await stats.isUserWon(accounts[2])
                .then(Utils.receiptShouldSucceed);
            await stats.isUserWon(accounts[2])
                .then(Utils.receiptShouldSucceed);
            await stats.isUserWon(accounts[3])
                .then(Utils.receiptShouldSucceed);
            await stats.isUserWon(accounts[3])
                .then(Utils.receiptShouldSucceed);

            assert.equal(
                1,
                0,
                "token address is not equal"
            );
        });
    });
});
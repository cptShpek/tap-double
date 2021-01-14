module.exports = {
    skipFiles: [
        'Migrations.sol'
    ],
    // need for dependencies
    copyNodeModules: true,
    copyPackages: [
        'openzeppelin-solidity'
    ],
    dir: '.',
    norpc: false
};

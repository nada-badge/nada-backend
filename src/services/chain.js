const crypto = require('crypto');
const { web3, transactionOptions } = require('../loader/web3');
const config = require('../config/config');

async function getAccount() {
    if (config.CHAIN_ENV === 'ganache') {
        const accounts = await web3.eth.getAccounts();
        return accounts[0];
    } else if (config.CHAIN_ENV === 'mumbai') {
        return config.MAIN_WALLET;
    } else {
        throw new Error('지원하지 않는 블록체인 네트워크 환경입니다.');
    }
}

function generateBadgeId(badgeInfo) {
    const badgeInfoString = JSON.stringify(badgeInfo);
    return crypto.createHash('sha256').update(badgeInfoString).digest('hex');
}

async function call(transactionData) {
    const senderAddress = await getAccount();

    transactionOptions.data = transactionData;
    transactionOptions.from = senderAddress;

    const signedTransaction = await web3.eth.accounts.signTransaction(transactionOptions, config.PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    return receipt;
}

module.exports = {
    generateBadgeId,
    call
}
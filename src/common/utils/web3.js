const { web3 } = require('../../loader/web3');
const config = require('../../config/config');

async function getAccount() {
    if (config.CHAIN_ENV === 'ganache') {
        return (await web3.eth.getAccounts())[0];
    } else if (config.CHAIN_ENV === 'mumbai') {
        return config.MAIN_WALLET;
    } else {
        throw new Error('지원하지 않는 블록체인 네트워크 환경입니다.');
    }
}

function setTrasactionOptions() {

}

module.exports = {
    getAccount,
    setTrasactionOptions
}
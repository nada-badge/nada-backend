/*
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const config = require("../config/config"); 

const web3 = new Web3(new Web3.providers.HttpProvider(config.CHAIN_NETWORK_URL));

const contract = getContract();

let transactionOptions = {
    to: config.CONTRACT_ADDRESS,    // 스마트 컨트랙트 주소
    gas: '3000000',                 // 가스 설정
//  from: ownerAccount,             // 발송 계정
};

function getContract() {
    const contractJSON = JSON.parse(fs.readFileSync(path.join(__dirname, config.CONTRACT_JSON_PATH), 'utf8'));  // 스마트 컨트랙트 ABI
    const contractAbi = contractJSON.abi;

    const contract = new web3.eth.Contract(contractAbi, config.CONTRACT_ADDRESS);
    return contract
}

module.exports = {
    web3,
    contract,
    transactionOptions
};
*/  

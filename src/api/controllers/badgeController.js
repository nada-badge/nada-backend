const crypto = require('crypto');
const { Badge } = require('../../models/badge');
const { contract, web3, transactionOptions } = require('../../loader/web3');
const { getAccount } = require('../../common/utils/web3');
const config = require('../../config/config');

async function issueBadge(req, res, next) {
    try {
        // 하나만 발급한다고 생각하고 구현해보자!
        const reqInfo = req.body;

        /*
        const isExist = await User.findOne({ 'userType': 2, 'email': reqInfo.issuer });

        if(isExist == null) {
            return res.status(401).json({ message: '발급자 확인이 불가능합니다.' });
        }
*/
        const badgeInfo = {
            id: "",
            owner: reqInfo.ownerEmail,
            category: reqInfo.category,
            role: reqInfo.groupInfo.role,
            issuer: reqInfo.issuer
        };

        const badgeInfoString = JSON.stringify(badgeInfo);
        const badgeId = crypto.createHash('sha256').update(badgeInfoString).digest('hex');

        console.log('Generated BadgeID:', badgeId);
        console.log(contract.methods)
          
        const transactionData = await contract.methods.claim(badgeInfo, badgeId).encodeABI();

        transactionOptions.data = transactionData;
        transactionOptions.from = await getAccount();

        const signedTransaction = await web3.eth.accounts.signTransaction(transactionOptions, config.PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

        if (!receipt.status) {
            return res.status(500).json({ message: '트랜잭션이 실패하였습니다.' });
        }

        const badge = new Badge({
            onwerEmail: reqInfo.onwerEmail,
            badgeName: reqInfo.badgeName,
            category: reqInfo.category,
            groupInfo: {
                groupName: reqInfo.groupName,
                team: reqInfo.team,
                role: reqInfo.role
            },
            issuer: reqInfo.issuer,
            description: reqInfo.description,
            status: "issued",
            badgeImageUrl: reqInfo.badgeImageUrl,
            issuedAt: Date.now
        });

//        await badge.save();

        res.status(200).json({ badgeInfo });
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    issueBadge
};
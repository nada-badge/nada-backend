const { Badge } = require('../../models/badge');
const { Group, User } = require('../../models/user');
const { contract } = require('../../loader/web3');
const { generateBadgeId, call } = require('../../services/chain');

async function issueBadge(req, res, next) {
    try {
        const reqInfo = req.body;

        const issuer = await User.findOne({ 'userType': 2, 'email': reqInfo.issuer });

        if(!issuer) {
            return res.status(401).json({ message: '발급자 확인이 불가능합니다.' });
        }
        const group = await Group.findById(issuer.groups[0]);

        let issuedBadges = [];
        let badgeInfos = [];

        await Promise.all(reqInfo.members.map(async member => {

            let badgeInfo = {
                badgeId: "",
                id: "",
                owner: member.email,
                category: group.category,
                role: member.role,
                issuer: issuer.email
            };

            const badgeId = generateBadgeId(badgeInfo);
            badgeInfo.badgeId = badgeId;

            badgeInfos.push(badgeInfo);

            const badge = new Badge({
                badgeIdAtChain: badgeId,
                onwerEmail: member.email,
                badgeName: reqInfo.badgeName,
                category: group.category,
                groupInfo: {
                    groupName: group.groupName,
                    team: member.team,
                    role: member.role
                },
                issuer: issuer.email,
                description: reqInfo.description,
                records: reqInfo.records,
                status: "issued",
                badgeImageUrl: reqInfo.badgeImageUrl,
            });

            await badge.save();

            // 멤버가 서비스에 등록된 회원인지 확인
            const memberUser = await User.findOne({ 'email': member.email });

            // 등록된 회원이면,
            if(memberUser) {
                // 1) 그 회원의 그룹 정보에 해당 그룹이 있는지 확인 후 연결
                if(!memberUser.groups.includes(group._id)) {
                    memberUser.groups.push(group);
                }
                // 2) 회원 정보에 뱃지 데이터 저장 (회원으로서의 멤버 정보 업데이트)
                memberUser.badges.push(badge._id);
                await memberUser.save();
                
                member.isUser = true;
            }

            // 기존부터 그룹에 포함된 회원인지 확인
            const memberInGroup = group.memberInfo.find(memberInfo => memberInfo.email === member.email);
            if(!memberInGroup) {
                // 멤버 자체의 데이터를 저장하기 위해 member 포맷의 데이터에 badge 정보 추가 후 저장
                member.badges = [];
                member.badges.push(badge._id);
                group.memberInfo.push(member);
            }
            else {
                memberInGroup.badges.push(badge._id);
            }

            issuedBadges.push(badge);
        }));

        const transactionData = await contract.methods.claim(badgeInfos).encodeABI();
        const receipt = await call(transactionData);

        if (!receipt.status) {
            return res.status(500).json({ message: '트랜잭션이 실패하였습니다.' });
        }

        await group.save();

        res.status(200).json({ issuedBadges });
    }
    catch (err) {
        next(err);
    }
}

async function listBadge(req, res, next) {
    try {
        const { email } = req.query;

        const user = await User.findOne({ 'email': email });

        if(!user) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        } 

        const badgeIds = user.badges;

        const badges = await Badge.find({ _id: { $in: badgeIds } });

        if(!badges || badges.length === 0) {
            return res.status(404).json({ message: '조회된 뱃지가 없습니다.' });
        }

        res.status(200).json({ badges });
    }
    catch (err) {
        next(err);
    }
}


module.exports = {
    issueBadge,
    listBadge
};
const { User } = require('../../models/user');
const { Notice } = require('../../models/notice');
const { toKST, setFunc } = require('../../common/utils/converter');0
const ACTIVITY = require('../../common/const/activity');

async function deleteUser(req, res, next) {
    try {
        const toDelete = req.body;
        const id = toDelete._id;
        console.log(id)


        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let user = await User.findById(id);

        if(!user || user.length == 0) {
            return res.status(404).json({ massege: '해당 사용자를 찾을 수 없습니다.' })
        }

        console.log(user)
        await user.deleteOne();
        
        res.status(200).json({ user });
        
    } 
    catch (err) {
        next(err);
    }
};

async function addField(req, res, next) {
    try {
        const userSetting = req.body;
        const userId = req.body._id; 

        let user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        if (userSetting.region) {
            if (userSetting.region.length > 2) {
                return res.status(401).json({ message: '지역은 최대 두 개까지만 설정 가능합니다.' });
            }
            if (!userSetting.region.every(selectedRegion => ACTIVITY.region.includes(selectedRegion))) {
                return res.status(401).json({ message: '유효하지 않은 지역이 포함되어 있습니다.' });
            }
            user.profile.region = userSetting.region;
        }

        if (userSetting.interestField) {
            if (userSetting.interestField.length > 2) {
                return res.status(401).json({ message: '관심 분야는 최대 두 개까지만 설정 가능합니다.' });
            }
            if (!userSetting.interestField.every(seletedField => ACTIVITY.field.includes(seletedField))) {
                return res.status(401).json({ message: '유효하지 않은 관심 분야가 포함되어 있습니다.' });
            }
            user.profile.interestField = userSetting.interestField;
        }

        await user.save();

        res.status(200).json({ message: "성공적인 저장" });
        
    } 
    catch (err) {
        next(err);
    }
};

async function addNotice(req, res, next) {
    try {
        const { title, content } = req.body;
        
        const notice = new Notice({
            title: title,
            content: content,
        });

        await notice.save();

        res.status(200).json({ message: '공지사항 등록 성공' });

    } 
    catch (err) {
        next(err);
    }
};

async function listNotice(req, res, next) {
    try {
        const id = req.query._id;

        if(id == null) {
            return res.status(400).json({ message: '_id(notice) 값이 null입니다.' });
        }

        const searched = await Notice.findOneAndUpdate(
            { _id: id },
            { new: true }
        );
              
        if(!searched || searched.length == 0) {
            return res.status(404).json({ massege: '해당 공지를 찾을 수 없습니다.' })
        }

        const notice = setFunc(searched, ['registeredAt', 'updatedAt'], toKST);
        
        res.status(200).json({ notice });
    }
    catch (err) {
        next(err);
    }
};

async function updateNotice(req, res, next) {
    try {
        const toUpdate = req.body;
        const id = toUpdate._id;

        if(id == null) {
            return res.status(400).json({ message: '_id(notice) 값이 null입니다.' });
        }

        let notice = await Notice.findById(id);

        if(!notice || notice.length == 0) {
            return res.status(404).json({message: '해당 공지를 찾을 수 없습니다.'});
        }

        toUpdate.updatedAt = new Date();

        Object.assign(notice, toUpdate);

        await notice.save();

        res.status(200).json({ notice });

    } 
    catch (err) {
        next(err);
    }
};

async function deleteNotice(req, res, next) {
    try {
        const toDelete = req.body;
        const id = toDelete._id;

        if(id == null) {
            return res.status(400).json({ message: '_id(notice) 값이 null입니다.' });
        }

        let notice = await Notice.findById(id);

        if(!notice || notice.length == 0) {
            return res.status(404).json({message: '해당 공지를 찾을 수 없습니다.'});
        }

        await notice.deleteOne();

        res.status(200).json({ notice });

    } 
    catch (err) {
        next(err);
    }
};

module.exports = {
    deleteUser,
    addField,
    addNotice,
    listNotice,
    updateNotice,
    deleteNotice
};
const { Activity } = require('../../models/activity');
const { Profile, User } = require('../../models/user');
const { toKST, setFunc } = require('../../common/utils/converter');
const ACTIVITY = require('../../common/const/activity');

async function addActivity(req, res, next) {
    try {
        const { activityName, groupName, field, category, region, institute, instituteURL, area, content, mainImageUrl, extraImageUrl, startedAt, endedAt } = req.body;

        if(category !== "전체" && !ACTIVITY.inActivity.includes(category)) {
            return res.status(401).json({ message: '카테고리 설정이 잘못되었습니다.' });
        }

        if(field[0] !== "전체" && !field.every(seletedField => ACTIVITY.field.includes(seletedField))) {
            return res.status(401).json({ message: '유효하지 않은 분야입니다.' });
        }

        if(region[0] !== "전국" && !region.every(selectedRegion => ACTIVITY.region.includes(selectedRegion))) {
            return res.status(401).json({ message: '장소 설정이 잘못되었습니다.' });
        }

        const start = new Date(startedAt);
        const end = new Date(endedAt);

        if(start.getTime() > end.getTime()) {
            return res.status(400).json({ message: '기간 설정이 유효하지 않습니다.' });
        }

        const current = new Date();
        if(current.getTime() > end.getTime()) {
            return res.status(400).json({ message: '이미 종료된 활동입니다.' });
        }

        const check = await Activity.findOne({ 
            activityName: activityName,
            groupName: groupName,
            startedAt: startedAt,
            endedAt: endedAt
        });

        if(check) {
            return res.status(400).json({ message: '이미 등록된 활동입니다.' });
        }

        const activity = new Activity({
            activityName: activityName,
            groupName: groupName,
            field: field,
            category: category,
            region: region,
            institute: institute,
            instituteURL: instituteURL,
            area: area,
            content: content,
            mainImageUrl: mainImageUrl,
            extraImageUrl: extraImageUrl,
            startedAt: startedAt,
            endedAt: endedAt
        });

        await activity.save();

        res.status(200).json({ message: '대외활동 입력 성공' });
    }
    catch (err) {
        next(err);
    }
};

async function getActivity(req, res, next) {
    try {
        const id = req.query._id;
    
        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }
        
        const searched = await Activity.findOneAndUpdate(
            { _id: id },
            { $inc: { views: 1 } },
            { new: true }
        );

        if(!searched){ 
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }

        const activity = setFunc(searched, ['registeredAt', 'updatedAt', 'startedAt', 'endedAt'], toKST);

        res.status(200).json({ activity });
    }
    catch (err) {
        next(err);
    }
};

async function listActivity(req, res, next) {
    try {
        const { groupName, field, region, category } = req.query;
       
        let query = {};
        
        if (groupName) { query.groupName = groupName }
        if (field[0] !== "전체") { query.field = { $in: field }; }
        if (region[0] !== "전국") { query.region = { $in: region }; }
        if (category[0] !== "전체") { query.category = { $in: category }; }

        const projection = { activityName: 1, mainImageUrl: 1, endedAt: 1 };

        searched = await Activity.find(query, projection);
       
        if(!searched || searched.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }
        
        const activities = setFunc(searched, ['endedAt'], toKST);
        
        res.status(200).json({ activities });
    }
    catch (err) {
        next(err);
    }
};

async function searchActivity(req, res, next) {
    try {
        const { activityName, groupName, content } = req.query;
   
        if (!activityName && !content && !groupName) {
            return res.status(400).json({ message: '적어도 하나의 검색어를 입력하세요.' });
        }

        let query = {};

        if (activityName) {
            query.activityName = new RegExp(activityName, 'i');
        }
        if (content) {
            query.content = new RegExp(content, 'i');
        }
        if (groupName) {
            query.groupName = new RegExp(groupName, 'i');
        }
        const searchResult = await Activity.find(query);
        
        if(!searchResult){ 
            return res.status(404).json({ massege: '검색 결과가 없습니다.' })
        }

        res.status(200).json({ result: searchResult });
    }
    catch (err) {
        next(err);
    }
};

async function updateActivity(req, res, next) {
    try {
        const toUpdate = req.body;
        const id = toUpdate._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let activity = await Activity.findById(id);
    
        if(!activity || activity.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }
        
        toUpdate.updatedAt = new Date();

        Object.assign(activity, toUpdate);

        await activity.save();
        
        res.status(200).json({ activity });
    }
    catch (err) {
        next(err);
    }
};

async function recommendActivity(req, res, next) {
    try {
        const email = req.query.email;

        const user = await User.findOne({ 'email': email });

        if (!user) {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        const { region, interestField } = user.profile;

        const todayDate = new Date();

        let queryConditions = {
            groupName: { $nin: user.groups.map(group => group.groupName) },
            startedAt: { $gte: todayDate }
        };

        if (region.length > 0 && interestField.length > 0) {
                queryConditions = {
                    $or: [
                        { region: { $in: region }, field: { $in: interestField } },
                        { region: { $in: region }, field: { $exists: false } },
                        { field: { $in: interestField }, region: { $exists: false } },
                        { region: { $nin: region }, field: { $in: interestField } },
                        { region: { $in: region }, field: '전체' },
                        { region: '전국', field: { $in: interestField } }, 
                        { region: '전국', field: '전체' }
                    ]
                };
        } else if (region.length > 0) {
            queryConditions = { 
                $or: [
                    { region: { $in: region } },
                    { region: { $in: region }, field: '전체' },
                ]
            };
        } else if (interestField.length > 0) {
            queryConditions = { 
                $or: [
                    { field: { $in: interestField } },
                    { region: '전국', field: { $in: interestField } },
                ]
            };
        } else {
            res.status(400).json({ message: '지역 또는 관심 분야를 설정하세요.' });
            return;
        }

        let sortOption = { endedAt: 1 };

        const recommendedActivities = await Activity.find(queryConditions)
            .select('activityName mainImageUrl endedAt')
            .sort(sortOption)
            .limit(5);

        res.status(200).json({ recommendActivity: recommendedActivities });
    } catch (err) {
        next(err);
    }
};

async function deleteActivity(req, res, next) {
    try {
        const toDelete = req.body;
        const id = toDelete._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let activity = await Activity.findById(id);
    
        if(!activity || activity.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }

        await activity.deleteOne();
        
        res.status(200).json({ activity });
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    addActivity,
    getActivity,
    listActivity,
    recommendActivity,
    searchActivity,
    updateActivity,
    deleteActivity
};

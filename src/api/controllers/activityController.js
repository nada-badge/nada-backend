const { Activity } = require('../../models/activity');
const { toKST, setFunc } = require('../../common/utils/converter');

async function addActivity(req, res, next) {
    try {
        const { activityName, groupName, field, category, area, content, startedAt, endedAt } = req.body;
        
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
            area: area,
            content: content,
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
        
        const searched = await Activity.findById(id);

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
        const groupName = req.query.groupName;
        let searched;
        
        if(groupName == null) {
            searched = await Activity.find();
        }
        else {
            searched = await Activity.find({ groupName });
        }
       
        if(!searched || searched.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }
        
        const activities = setFunc(searched, ['registeredAt', 'updatedAt', 'startedAt', 'endedAt'], toKST);
        
        res.status(200).json({ activities });
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
    updateActivity,
    deleteActivity
};
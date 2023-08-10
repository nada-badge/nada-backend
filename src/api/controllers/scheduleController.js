const { Schedule } = require('../../models/schedule');
const { toKST, setFunc } = require('../../common/utils/converter');

async function addSchedule(req, res, next) {
    try {
        const { scheduleName, groupId, groupName, field, category, area, content, startedAt, endedAt } = req.body;
        
        const start = new Date(startedAt);
        const end = new Date(endedAt);

        if(start.getTime() > end.getTime()) {
            return res.status(400).json({ message: '기간 설정이 유효하지 않습니다.' });
        }

        const current = new Date();
        if(current.getTime() > end.getTime()) {
            return res.status(400).json({ message: '이미 종료된 활동입니다.' });
        }

        const check = await Schedule.findOne({ 
            scheduleName: scheduleName,
            groupName: groupName,
            startedAt: startedAt,
            endedAt: endedAt
        });

        if(check) {
            return res.status(400).json({ message: '이미 등록된 활동입니다.' });
        }

        const schedule = new Schedule({
            scheduleName: scheduleName,
            groupId: groupId,
            groupName: groupName,
            field: field,
            category: category,
            area: area,
            content: content,
            startedAt: startedAt,
            endedAt: endedAt
        });

        await schedule.save();

        res.status(200).json({ message: '대외활동 입력 성공' });
    }
    catch (err) {
        next(err);
    }
};

async function getSchedule(req, res, next) {
    try {
        const id = req.query._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }
        
        const searched = await Schedule.findById(id);

        if(!searched){ 
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }

        const schedule = setFunc(searched, ['registeredAt', 'updatedAt', 'startedAt', 'endedAt'], toKST);

        res.status(200).json({ schedule });
    }
    catch (err) {
        next(err);
    }
};

async function listSchedule(req, res, next) {
    try {
        const groupName  = req.query.groupName;
        let searched;
        
        if(groupName == null) {
            searched = await Schedule.find();
        }
        else {
            searched = await Schedule.find({ groupName });
        }
       
        if(!searched || searched.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }
        
        const schedules = setFunc(searched, ['registeredAt', 'updatedAt', 'startedAt', 'endedAt'], toKST);
        
        res.status(200).json({ schedules });
    }
    catch (err) {
        next(err);
    }
};

async function updateSchedule(req, res, next) {
    try {
        const toUpdate = req.body;
        const id = toUpdate._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let schedule = await Schedule.findById(id);
    
        if(!schedule || schedule.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }

        Object.assign(schedule, toUpdate);

        await schedule.save();
        
        res.status(200).json({ schedule });
    }
    catch (err) {
        next(err);
    }
};

async function deleteSchedule(req, res, next) {
    try {
        const toDelete = req.body;
        const id = toDelete._id;

        if(id == null) {
            return res.status(400).json({ message: 'id 값이 null입니다.' });
        }

        let schedule = await Schedule.findById(id);
    
        if(!schedule || schedule.length == 0) {
            return res.status(404).json({ massege: '해당 일정을 찾을 수 없습니다.' })
        }

        await schedule.deleteOne();
        
        res.status(200).json({ schedule });
    }
    catch (err) {
        next(err);
    }
};


module.exports = {
    addSchedule,
    getSchedule,
    listSchedule,
    updateSchedule,
    deleteSchedule
};
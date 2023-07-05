const { Schedule } = require('../../models/schedule');

async function addSchedule(req, res, next) {
    try {
        const { scheduleName, groupId, field, category, area, content, startedAt, endedAt } = req.body;
        
        const start = new Date(startedAt);
        const end = new Date(endedAt);

        if(start.getTime() > end.getTime()) {
            return res.status(400).json({ message: '기간 설정이 유효하지 않습니다.' });
        }

        const current = new Date();
        if(current.getTime() > end.getTime()) {
            return res.status(400).json({ message: '이미 종료된 활동입니다.' });
        }

        const schedule = new Schedule({
            scheduleName: scheduleName,
            groupId: groupId,
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

module.exports = {
    addSchedule
};
const { Calendar } = require('../../models/calendar');
const { User } = require('../../models/user');
const { Activity } = require('../../models/activity');
const { toKST, setFunc } = require('../../common/utils/converter');

async function addBookmark(req, res, next) {
    try {
        const { email, activity_id } = req.body;

        const user = await User.findOne({ email });
        if (!user || user.length == 0) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        }

        const activity = await Activity.findById(activity_id);

        if(!activity || activity.length == 0) {
            return res.status(404).json({ massege: '해당 게시물을 찾을 수 없습니다.' })
        }

        const calendar_id = user.calendar;

        if(!calendar_id){
            const calendar = new Calendar({
                calendarCategory: user.userType,
                activitys: [activity_id]
            });
            await calendar.save();

            user.calendar = calendar._id;
            await user.save();
        }
        else {
            const calendar = await Calendar.findById(calendar_id);
            if (!calendar) {
                return res.status(404).json({ message: '사용자의 캘린더를 찾을 수 없습니다.' });
            }

            calendar.activitys.push(activity_id);
            await calendar.save();
        }

        res.status(200).json({ message: '관심활동이 추가되었습니다.' });
    }
    catch (err) {
        next(err);
    }
};

async function listBookmark(req, res, next) {
    try {
        const email = req.query.email;

        const user = await User.findOne({ email });
        if (!user || user.length == 0) {
            return res.status(401).json({ message: '사용자 확인이 불가능합니다.' });
        }

        const calendarId = user.calendar;

        if (!calendarId) {
            return res.status(404).json({ message: '사용자의 캘린더 정보가 없습니다.' });
        }

        const calendar = await Calendar.findById(calendarId);
        if (!calendar || calendar.length == 0) {
            return res.status(404).json({ message: '사용자의 캘린더를 찾을 수 없습니다.' });
        }

        const activityPromises = calendar.activitys.map(async activityId => {
            const activity = await Activity.findById(activityId);
            return activity;
          });
          
        const activitiesUTC = await Promise.all(activityPromises);

        const activities = setFunc(activitiesUTC, ['registeredAt', 'updatedAt', 'startedAt', 'endedAt'], toKST);
        
        res.status(200).json({ activities });
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    addBookmark,
    listBookmark
};
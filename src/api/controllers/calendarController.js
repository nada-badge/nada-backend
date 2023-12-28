const { Calendar } = require('../../models/calendar');
const { User } = require('../../models/user');
const { Activity } = require('../../models/activity');
const { toKST, setFunc } = require('../../common/utils/converter');
const { isWithinInterval, isSameMonth, isSameYear } = require('date-fns');

async function addBookmark(req, res, next) {
    try {
        const { email, _id } = req.body;
        const activity_id = _id;

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
                activities: [activity_id]
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

            if (calendar.activities.includes(activity_id)) {
                return res.status(400).json({ message: '이미 해당 활동이 캘린더에 추가되어 있습니다.' });
            }

            calendar.activities.push(activity_id);
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

        const { email, start, end } = req.query;

        if ((start && !end) || (!start && end)) {
            return res.status(400).json({ message: '시작 일자와 종료 일자를 함께 입력해주세요.' });
        }

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

        let activitiesPromises = calendar.activities.map(async activityId => {
            const activity = await Activity.findById(activityId);
            return activity;
        });
        
        let activitiesUTC = (await Promise.all(activitiesPromises)).filter(activity => activity !== null);

        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
    
            activitiesUTC = activitiesUTC.filter(activity => {
                const activityStartDate = new Date(activity.startedAt);
                const activityEndDate = new Date(activity.endedAt);
 
                if ((activityStartDate >= startDate && activityStartDate <= endDate) ||
                    (activityEndDate >= startDate && activityEndDate <= endDate) ||
                    (activityStartDate <= startDate && activityEndDate >= endDate))
                {
                    return true;
                }
                return false;
            });
        }

        if (!activitiesUTC || activitiesUTC.length == 0) {
            return res.status(404).json({ message: '북마크된 일정을 찾을 수 없습니다.' });
        }

        const activities = setFunc(activitiesUTC, ['registeredAt', 'updatedAt', 'startedAt', 'endedAt'], toKST);

        res.status(200).json({ activities });
    }
    catch (err) {
        next(err);
    }
}

async function removeBookmark(req, res, next) {
    try {
        const email = req.query.email;
        const bookmark_id = req.query._id;

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

        const bookmarkToRemove = calendar.activities.find(activity => activity.toString() === bookmark_id);

        if (!bookmarkToRemove) {
            return res.status(404).json({ message: '해당 활동을 찾을 수 없습니다.' });
        } else {
            calendar.activities = calendar.activities.filter(activity => activity.toString() !== bookmark_id);
            await calendar.save();
        }

        res.status(200).json({ message: '관심활동이 해제되었습니다.' });
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    addBookmark,
    listBookmark,
    removeBookmark
};
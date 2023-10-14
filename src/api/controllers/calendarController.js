const { Calendar } = require('../../models/calendar');
const { User } = require('../../models/user');
const { Activity } = require('../../models/activity');
const { toKST, setFunc } = require('../../common/utils/converter');
const { isWithinInterval, isSameMonth, isSameYear } = require('date-fns');

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
        const email = req.query.email;
        const targetYear = req.query.year;
        const targetMonth = req.query.month;
        
        if ((targetYear && !targetMonth) || (!targetYear && targetMonth)) {
            return res.status(400).json({ message: '기준 연도와 월을 함께 입력해주세요.' });
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
        
        let activitiesUTC = await Promise.all(activitiesPromises);
   
        if (targetMonth && targetYear) {
            activitiesUTC = activitiesUTC.filter(activity => {
                const activityStartDate = new Date(activity.startedAt);
                const activityEndDate = new Date(activity.endedAt);
    
                // 시작일과 종료일 사이에 targetMonth 및 targetYear가 있는 경우 선택
                if (
                    (isWithinInterval(new Date(targetYear, targetMonth - 1, 1), { start: activityStartDate, end: activityEndDate }) ||
                    isSameMonth(new Date(targetYear, targetMonth - 1, 1), activityStartDate)) &&
                    isSameYear(new Date(targetYear, targetMonth - 1, 1), activityStartDate)
                ) {
                    return true;
                }
                return false;
            });
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
        const bookmark_id = req.query.bookmark_id;

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
// 시간 기준을 UTC에서 KST로 변환
const toKST = (time) => {
    const timeKST = new Date(time);
    timeKST.setHours(timeKST.getHours() + 9);

    return timeKST;
};

const setFunc = (objects, properties, converter) => {
    const updatedObj = JSON.parse(JSON.stringify(objects));
    
    properties.forEach((prop) => {
        if (prop in updatedObj) {
            updatedObj[prop] = converter(updatedObj[prop]);
        }
    });
    
    return updatedObj;
};

module.exports = {
    toKST,
    setFunc
};
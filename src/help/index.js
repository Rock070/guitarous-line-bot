const moment = require("moment-timezone");

// 拿時間
exports.getTime = () => {
  let options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  return new Date().toLocaleDateString("zh-tw", options);
};

exports.getOffsetNowTime = (startTime, endTime) => {
  if (!startTime && !endTime) return "尚未選擇時間";
  if (!startTime) return "尚未選擇開始時間";
  if (!endTime) return "尚未選擇結束時間";
  const startTimeStamp = Date.parse(startTime);
  const endTimeStamp = Date.parse(endTime);

  const offset = (endTimeStamp - startTimeStamp) / 1000;
  const totalMin = Math.floor(offset / 60);
  const second = offset % 60;

  const totalHour = Math.floor(totalMin / 60);
  const min = totalMin % 60;

  const totalDay = Math.floor(totalHour / 24);
  const hour = totalHour % 24;

  const timeOffsetLog = `${totalDay} 天, ${hour} 小時, ${min} 分鐘, ${second} 秒`;
  return timeOffsetLog;
};

exports.formDictionary = {
  startTime: "開始時間",
  endTime: "結束時間",
  totalTime: "時長",
  purpose: "使用目的",
  signPerson: "登記人",
};

exports.getFee = (data) => {
  if (!data) return "";
  let totalHour = 0;
  data.split(",").forEach((item, index) => {
    const splitStr = item.split(" ");
    if (!splitStr[0]) splitStr.shift();
    const unit = splitStr[splitStr.length - 1];
    switch (unit) {
      case "天":
        totalHour += Number(splitStr[0]) * 24;
        break;
      case "小時":
        totalHour += Number(splitStr[0]);
        break;
      case "分鐘":
        totalHour += parseFloat((Number(splitStr[0]) / 60).toFixed(2));
        break;
    }
  });
  return Math.round(totalHour * 5);
};

exports.getNowTime = () => {
  const stamp = new Date().getTime();
  const result = new Date(stamp + 8 * 60 * 60 * 1000);
  return moment.utc(new Date(result)).local().format("YYYY-MM-DD HH:mm");
};

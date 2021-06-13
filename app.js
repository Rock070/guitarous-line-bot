const { getTime, getOffsetNowTime, formDictionary } = require("./src/help");
const {
  getSheetData,
  addSheetData,
  isRepeatRowData,
} = require("./googleSheet.js");
const {
  PURPOSE_CONFIG,
  IMAGE_CAROUSEL_CONFIG,
  CAROUSEL_CONFIG,
  CONFIRM_CONFIG,
  URL_CONFIG,
  FORM_CONFIG,
  getUrlConfig,
} = require("./src/messageAPI/config");
const { bot } = require("./src/config");
const moment = require("moment");

const form = {
  startTime: "",
  endTime: "",
  totalTime: "",
  purpose: "",
  signPerson: "",
  remark: "還沒做",
};
const cache = {};

let count = 30;
let countUserID = [];

bot.on("postback", async function (event) {
  // console.log(event);
  const userId = event.source.userId;

  // 抓使用者資料
  await event.source.profile().then((res) => {
    form.signPerson = res.displayName;
  });

  switch (event.postback.data) {
    // 時間
    case "start":
      form.startTime = moment(event.postback.params.datetime).format(
        "YYYY-MM-DD HH:mm"
      );
      event.reply(`開始時間: ${form.startTime}`);
      break;
    case "end":
      form.endTime = moment(event.postback.params.datetime).format(
        "YYYY-MM-DD HH:mm"
      );
      event.reply(`結束時間: ${form.endTime}`);
      break;
    case "totalTime":
      event.reply(`總時長：${getOffsetNowTime(form.startTime, form.endTime)}`);
      break;
    // 目的
    case "purpose":
      event
        .reply(PURPOSE_CONFIG)
        .then((res) => {
          console.log("success");
        })
        .catch((err) => {
          console.log("err", err);
        });
      break;
    case "purpose:練習":
      form.purpose = event.postback.data.replace("purpose:", "");
      event.reply(`目的：${form.purpose}`);
      break;
    case "purpose:錄音、混音、拍 MV":
      form.purpose = event.postback.data.replace("purpose:", "");
      event.reply(`目的：${form.purpose}`);
      break;
    case "purpose:教學":
      form.purpose = event.postback.data.replace("purpose:", "");
      event.reply(`目的：${form.purpose}`);
      break;
    // 確認提交
    case "confirm:yes":
      form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
      // 驗證每個欄位是否都有值

      // 阻擋多次點擊按鈕：Cache 快取機制
      const setCache = (name) => {
        cache[name] = name;
      };
      const isInCache = (name) => {
        return cache[name];
      };
      const clearCache = (name) => {
        delete cache[name];
      };
      if (isInCache(form.signPerson)) {
        event.reply("3 秒內不能重複送出答案！");
        break;
      }
      setCache(form.signPerson);
      setTimeout(() => {
        clearCache(form.signPerson);
      }, 3000);

      // ------------------------------------------------------------

      const FORM = {
        signPerson: form.signPerson ? form.signPerson : "無",
        purpose: form.purpose ? form.purpose : "無",
        startTime: form.startTime ? form.startTime : "無",
        endTime: form.endTime ? form.endTime : "無",
        totalTime: form.totalTime ? form.totalTime : "無",
      };
      if (
        !form.startTime ||
        !form.endTime ||
        !form.totalTime ||
        !form.purpose ||
        !form.signPerson ||
        !form.remark
      ) {
        const emptyDataArr = [];
        for (data in form) {
          if (data === "totalTime" || data === "signPerson") continue;
          if (!form[data] && data) emptyDataArr.push(data);
        }
        let response = "";
        for (data of emptyDataArr) {
          response += `${formDictionary[data]}\n`;
        }
        event.reply([getUrlConfig(FORM), "尚有未填寫的問題，無法提交"]);
        break;
      }

      // 判斷是否有重複資料
      await isRepeatRowData(form)
        .then((res) => {
          if (res) {
            event.reply([getUrlConfig(FORM), "試算表中已有此紀錄！"]);
            return;
          }
        })
        .catch((err) => {
          console.log("is Repeat Error:", err);
        });

      // 新增資料
      await addSheetData(form).then((res) => {
        event.reply([getUrlConfig(FORM), "成功新增一筆使用紀錄！"]);
      });
      break;
    case "confirm:no":
      event.reply("取消提交");
      break;
    case "showData":
      form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
      const FORM_VIEW = {
        signPerson: form.signPerson ? form.signPerson : "無",
        purpose: form.purpose ? form.purpose : "無",
        startTime: form.startTime ? form.startTime : "無",
        endTime: form.endTime ? form.endTime : "無",
        totalTime: form.totalTime ? form.totalTime : "無",
      };
      event
        .reply(getUrlConfig(FORM_VIEW))
        .then((res) => {
          console.log("success", res);
        })
        .catch((err) => {
          console.log("err", err);
        });
      break;
  }
});

// 當有人傳送訊息給Bot時
bot.on("message", function (event) {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  const userId = event.source.userId;
  const message = event.message.text;
  const replyMsg = `Hello, 你剛剛說的是: ${message}`;
  switch (message) {
    case "我要登記":
      event
        .reply(CAROUSEL_CONFIG)
        .then((res) => {
          console.log("success");
        })
        .catch((err) => {
          console.log("err", err);
        });
      break;
    case "測試":
      if (count < 30) {
        event
          .reply(`30 秒內不可再遞出資料，還剩 ${count} 秒`)
          .then((res) => {
            console.log("success", res);
          })
          .catch((err) => {
            console.log("err", err);
          });
        break;
      }
      countUserID.push(userId);
      function myfunc() {
        count -= 1;
        console.log(count);
      }
      const myInterval = setInterval(myfunc, 1000);
      function stopInterval() {
        clearTimeout(myInterval);
        count = 30;
        countUserID = countUserID.filter((item) => item !== userId);
      }
      setTimeout(stopInterval, 30000);
      break;
    default:
      event
        .reply("......抱歉，我聽不懂你說的。")
        .then(function (data) {
          // 當訊息成功回傳後的處理
        })
        .catch(function (error) {
          // 當訊息回傳失敗後的處理
        });
      break;
  }
});

const PORT = process.env.PORT || 3000;
// Bot所監聽的webhook路徑與port
bot.listen("/linewebhook", PORT, function () {
  console.log("[BOT已準備就緒]", ":", PORT);
});

const { getTime, getOffsetNowTime, formDictionary } = require("./src/help");
const { getSheetData, addSheetData } = require("./googleSheet.js");
const {
  PURPOSE_CONFIG,
  IMAGE_CAROUSEL_CONFIG,
  CAROUSEL_CONFIG,
  CONFIRM_CONFIG,
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

// 初始化
const init = () => {
  console.log(getTime());
};

init();

bot.on("postback", async function (event) {
  console.log(event);
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
      event.reply(getOffsetNowTime(form.startTime, form.endTime));
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
    case "purpose:錄音":
      form.purpose = event.postback.data.replace("purpose:", "");
      event.reply(`目的：${form.purpose}`);
      break;
    case "purpose:教學":
      form.purpose = event.postback.data.replace("purpose:", "");
      event.reply(`目的：${form.purpose}`);
      break;
    // 提交
    case "confirm":
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
        event
          .reply([`${response}\n以上問題尚未填寫\n請繼續填寫`, CAROUSEL_CONFIG])
          .then((res) => {
            console.log("success");
          })
          .catch((err) => {
            console.log("err", err);
          });
        break;
      }
      // 計算選取時間與現在的時間差
      form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
      event.reply(form);
      await addSheetData(form);
      break;
    // 確認提交
    case "confirm:yes":
      // 抓取使用者名稱填入 form
      if (!form.signPerson) {
        await event.source.profile().then((res) => {
          form.signPerson = res.displayName;
        });
      }
      form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
      // 待做驗證
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
        const replyMessage = `登記人: ${
          form.signPerson ? form.signPerson : "無"
        }
使用目的: ${form.purpose ? form.purpose : "無"}
開始時間: ${form.startTime ? form.startTime : "無"}
結束時間: ${form.endTime ? form.endTime : "無"} 
時長: ${form.totalTime ? form.totalTime : "無"}`;
        event.reply([
          CAROUSEL_CONFIG,
          `${replyMessage}\n\n尚有未填寫的問題，無法提交`,
        ]);

        break;
      }
      // 計算選取時間與現在的時間差)
      event.reply(form);
      console.log("add");
      await addSheetData(form);
      break;
    case "confirm:no":
      event.reply("取消提交");
      break;
    case "showData":
      form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
      // 抓取使用者名稱填入 form
      if (!form.signPerson) {
        await event.source.profile().then((res) => {
          form.signPerson = res.displayName;
        });
      }
      const replyMessage = `登記人: ${form.signPerson ? form.signPerson : "無"}
使用目的: ${form.purpose ? form.purpose : "無"}
開始時間: ${form.startTime ? form.startTime : "無"}
結束時間: ${form.endTime ? form.endTime : "無"} 
時長: ${form.totalTime ? form.totalTime : "無"}`;
      event
        .reply(replyMessage)
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
  const message = event.message.text;
  const replyMsg = `Hello, 你剛剛說的是: ${message}`;
  switch (message) {
    case "冷氣登記表":
      event
        .reply(CAROUSEL_CONFIG)
        .then((res) => {
          console.log("success");
        })
        .catch((err) => {
          console.log("err", err);
        });
      break;
    case "還沒想到":
      event
        .reply("原來是還沒想到的部分")
        .then(function (data) {
          console.log("success", data);
          // 當訊息成功回傳後的處理
        })
        .catch(function (error) {
          console.log("error:", error);
          // 當訊息回傳失敗後的處理
        });
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

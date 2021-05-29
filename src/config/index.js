// 引用linebot SDK
const linebot = require("linebot");

// 用於辨識Line Channel的資訊
exports.bot = linebot({
  channelId: "1656041722",
  channelSecret: "0a37654320d3952387f187d8c9c6de12",
  channelAccessToken:
    "z1yyCPCam4DKBNSa+peVRvjOUpDYMac0MaFVFq3HJclE4FwLfqLj0CYAy73X9SQlW1nyzDGDd4xzhQ4r3Iixm5OHFjHHjdzbVkUK7xUACmqirXnaub8aanUPVD6i04wGa5Arbqxz6RlbDn9ZWej8ngdB04t89/1O/w1cDnyilFU=",
});

exports.FILE_PATH = "./data.json";
exports.ENCODED = "utf-8";

const axios = require("axios");
const { channelAccessToken } = require("../config");

const getUser = (userId) =>
  axios({
    method: "get",
    url: `https://api.line.me/v2/bot/profile/${userId}`,
    headers: {
      Authorization: `Bearer ${channelAccessToken}`,
    },
  });
module.exports = {
  getUser,
};

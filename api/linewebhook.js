'use strict';

var lineBot = require('@line/bot-sdk');
var dotenv = require('dotenv');
var moment = require('moment-timezone');
var googleSpreadsheet = require('google-spreadsheet');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var getOffsetNowTime = function (startTime, endTime) {
    if (!startTime && !endTime)
        return '尚未選擇時間';
    if (!startTime)
        return '尚未選擇開始時間';
    if (!endTime)
        return '尚未選擇結束時間';
    var startTimeStamp = Date.parse(startTime);
    var endTimeStamp = Date.parse(endTime);
    var offset = (endTimeStamp - startTimeStamp) / 1000;
    var totalMin = Math.floor(offset / 60);
    var second = offset % 60;
    var totalHour = Math.floor(totalMin / 60);
    var min = totalMin % 60;
    var totalDay = Math.floor(totalHour / 24);
    var hour = totalHour % 24;
    var timeOffsetLog = "".concat(totalDay, " \u5929, ").concat(hour, " \u5C0F\u6642, ").concat(min, " \u5206\u9418, ").concat(second, " \u79D2");
    return timeOffsetLog;
};
var getFee = function (data) {
    if (!data)
        return 0;
    var totalHour = 0;
    data.split(',').forEach(function (item) {
        var splitStr = item.split(' ');
        if (!splitStr[0])
            splitStr.shift();
        var unit = splitStr[splitStr.length - 1];
        switch (unit) {
            case '天':
                totalHour += Number(splitStr[0]) * 24;
                break;
            case '小時':
                totalHour += Number(splitStr[0]);
                break;
            case '分鐘':
                totalHour += parseFloat((Number(splitStr[0]) / 60).toFixed(2));
                break;
        }
    });
    return Math.round(totalHour * 5);
};
var getNowTime = function () {
    var stamp = new Date().getTime();
    var result = new Date(stamp + 8 * 60 * 60 * 1000);
    return moment.utc(new Date(result)).local().format('YYYY-MM-DD HH:mm');
};

dotenv.config();
/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 * @param  {String} credentialsPath the credentials path defalt is './credentials.json'
 */
var docID = '1a2nJqFHLXNP78Mq5QUKxuVpC1QmAmFw3c8xZ55gpH54';
var sheetID = '0';
// 用法
// getSheetRowData("signPerson", "王建雄").then(res => {
// console.log(res)
// });
var addSheetData = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var doc, sheet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                doc = new googleSpreadsheet.GoogleSpreadsheet(docID);
                return [4 /*yield*/, doc.useServiceAccountAuth({
                        client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
                        private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, doc.loadInfo()];
            case 2:
                _a.sent();
                sheet = doc.sheetsById[sheetID];
                return [2 /*return*/, sheet.addRow(data)];
        }
    });
}); };
// 判斷是否有重複資料
var isRepeatRowData = function (form) { return __awaiter(void 0, void 0, void 0, function () {
    var doc, sheet, rows, headerRow, headerRowNum, _loop_1, _i, rows_3, row, state_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                doc = new googleSpreadsheet.GoogleSpreadsheet(docID);
                return [4 /*yield*/, doc.useServiceAccountAuth({
                        client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
                        private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, doc.loadInfo()];
            case 2:
                _a.sent();
                sheet = doc.sheetsById[sheetID];
                return [4 /*yield*/, sheet.getRows()];
            case 3:
                rows = _a.sent();
                headerRow = rows[0]._sheet.headerValues;
                headerRowNum = headerRow.length;
                _loop_1 = function (row) {
                    if (row._rowNumber === 2)
                        return "continue";
                    var tempNum = 0;
                    headerRow.forEach(function (item) {
                        if (item !== 'registerTime' && item !== 'paymentStatus') {
                            if (row[item] === form[item])
                                tempNum += 1;
                        }
                    });
                    // -2 減掉登記時間、繳費狀況
                    if (tempNum >= headerRowNum - 2)
                        return { value: true };
                };
                for (_i = 0, rows_3 = rows; _i < rows_3.length; _i++) {
                    row = rows_3[_i];
                    state_1 = _loop_1(row);
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                }
                return [2 /*return*/, false];
        }
    });
}); };
// 用法
// const form = {
//   startTime: "2021-06-14 16:55",
//   endTime: "2021-06-14 16:55",
//   totalTime: "0 天, 0 小時, 0 分鐘, 0 秒",
//   purpose: "練習",
// signPerson: "茂己",
//   registerTime: "2021-06-14 08:56",
//   fee: "0 元",
//   paymentStatus: "FALSE",
// };
// isRepeatRowData(form).then((res) => {
//   console.log(res);
// });

var PURPOSE_CONFIG = {
    type: 'template',
    altText: 'This is a buttons template',
    template: {
        type: 'buttons',
        thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
        imageAspectRatio: 'rectangle',
        imageSize: 'cover',
        imageBackgroundColor: '#FFE4B8',
        title: 'Menu',
        text: 'Please select',
        // defaultAction: {
        //   type: '',
        //   label: "View detail",
        //   uri: "http://example.com/page/123",
        // },
        actions: [
            {
                type: 'postback',
                label: '練習',
                data: 'purpose:練習'
            },
            {
                type: 'postback',
                label: '作品相關：錄音、混音、拍 MV',
                data: 'purpose:作品相關：錄音、混音、拍 MV'
            },
            {
                type: 'postback',
                label: '教學',
                data: 'purpose:教學'
            },
        ]
    }
};
var CAROUSEL_CONFIG = {
    type: 'template',
    altText: 'this is a carousel template',
    template: {
        type: 'carousel',
        columns: [
            {
                thumbnailImageUrl: 'https://i.imgur.com/XYa0p9u.png',
                imageBackgroundColor: '#FDC25D',
                title: '選擇時間',
                text: '使用冷氣的時間',
                actions: [
                    {
                        type: 'datetimepicker',
                        label: '開始時間',
                        data: 'start',
                        mode: 'datetime'
                    },
                    {
                        type: 'datetimepicker',
                        label: '結束時間',
                        data: 'end',
                        mode: 'datetime'
                    },
                    {
                        type: 'postback',
                        label: '總使用時長',
                        data: 'totalTime'
                    },
                ]
            },
            {
                thumbnailImageUrl: 'https://i.imgur.com/oSCurWe.png',
                imageBackgroundColor: '#FDC25D',
                title: '使用目的',
                text: '你使用錄音室來做什麼',
                actions: [
                    {
                        type: 'postback',
                        label: '練習',
                        data: 'purpose:練習'
                    },
                    {
                        type: 'postback',
                        label: '錄音、混音、拍 MV',
                        data: 'purpose:錄音、混音、拍 MV'
                    },
                    {
                        type: 'postback',
                        label: '教學',
                        data: 'purpose:教學'
                    },
                ]
            },
            {
                thumbnailImageUrl: 'https://stickershop.line-scdn.net/stickershop/v1/product/8763/LINEStorePC/main.png;compress=true',
                imageBackgroundColor: '#FDC25D',
                title: '提交',
                text: '確定要提交嗎',
                actions: [
                    {
                        type: 'postback',
                        label: '確定',
                        data: 'confirm:yes'
                    },
                    {
                        type: 'postback',
                        label: '看一下目前資料',
                        data: 'showData'
                    },
                    {
                        type: 'message',
                        label: '無',
                        text: ' '
                    },
                ]
            },
        ],
        imageAspectRatio: 'square',
        imageSize: 'contain'
    }
};
var getUrlConfig = function (form) {
    return {
        type: 'flex',
        altText: 'this is a flex message',
        contents: {
            type: 'bubble',
            body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                    {
                        type: 'text',
                        // @ts-expect-error good
                        text: '登記資料',
                        weight: 'bold',
                        size: 'xl',
                        contents: []
                    },
                    {
                        type: 'separator',
                        margin: 'sm'
                    },
                    {
                        type: 'box',
                        layout: 'vertical',
                        margin: 'md',
                        spacing: 'sm',
                        contents: [
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '登記人：',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: form.signPerson,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 5
                                    },
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '使用目的：',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: form.purpose,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 5
                                    },
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '開始時間：',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: form.startTime,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 5
                                    },
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '結束時間：',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: form.endTime,
                                        wrap: true,
                                        color: '#666666',
                                        size: 'sm',
                                        flex: 5
                                    },
                                ]
                            },
                            {
                                type: 'box',
                                layout: 'baseline',
                                spacing: 'sm',
                                contents: [
                                    {
                                        type: 'text',
                                        text: '總時長：',
                                        color: '#aaaaaa',
                                        size: 'sm',
                                        flex: 2
                                    },
                                    {
                                        type: 'text',
                                        text: form.totalTime,
                                        wrap: true,
                                        color: '#666666',
                                        size: '13px',
                                        flex: 5
                                    },
                                ]
                            },
                        ]
                    },
                ]
            }
        }
    };
};

dotenv.config();
var form = {
    startTime: '',
    endTime: '',
    totalTime: '',
    purpose: '',
    signPerson: '',
    registerTime: '',
    fee: 0,
    paymentStatus: '未繳費'
};
var cache = {};
var count = 30;
var countUserID = [];
var main = function (req, res) {
    // eslint-disable-next-line no-console
    console.log('req body.events:', req.body.events);
    // 用於辨識Line Channel的資訊
    var config = {
        channelId: process.env.CHANNEL_ID,
        channelSecret: process.env.CHANNEL_SECRET,
        channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
    };
    var client = new lineBot.Client(config);
    // client.replyMessage()
    function handleEvent(event) {
        var _this = this;
        if (!['text', 'message', 'postback'].includes(event.type))
            return Promise.resolve(null);
        var userId = event.source.userId;
        // eslint-disable-next-line no-console
        console.log('userId: ', userId);
        // 當有人傳送訊息給Bot時
        var messageHandler = function (event) {
            // event.message.text是使用者傳給bot的訊息
            var userId = event.source.userId;
            var message = 'text' in event.message ? event.message.text : '';
            switch (message) {
                case '我要登記': {
                    return client.replyMessage(event.replyToken, CAROUSEL_CONFIG)
                        .then(function (res) {
                        // eslint-disable-next-line no-console
                        console.log('success');
                        return res;
                    })["catch"](function (err) {
                        // eslint-disable-next-line no-console
                        console.log('err', err);
                        return err;
                    });
                }
                case '測試': {
                    if (count < 30) {
                        return client.replyMessage(event.replyToken, {
                            type: 'text',
                            text: "30 \u79D2\u5167\u4E0D\u53EF\u518D\u905E\u51FA\u8CC7\u6599\uFF0C\u9084\u5269 ".concat(count, " \u79D2")
                        })
                            .then(function (res) {
                            // eslint-disable-next-line no-console
                            console.log('success', res);
                        })["catch"](function (err) {
                            // eslint-disable-next-line no-console
                            console.log('err', err);
                        });
                    }
                    countUserID.push(userId);
                    function myfunc() {
                        count -= 1;
                        // eslint-disable-next-line no-console
                        console.log(count);
                    }
                    var myInterval_1 = setInterval(myfunc, 1000);
                    function stopInterval() {
                        clearTimeout(myInterval_1);
                        count = 30;
                        countUserID = countUserID.filter(function (item) { return item !== userId; });
                    }
                    setTimeout(stopInterval, 30000);
                    break;
                }
                default:
                    return client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: '......抱歉，我聽不懂你說的。'
                    })
                        .then(function (data) {
                        return data;
                        // 當訊息成功回傳後的處理
                    })["catch"](function (error) {
                        return error;
                        // 當訊息回傳失敗後的處理
                    });
            }
        };
        var postbackHandler = function (event) { return __awaiter(_this, void 0, void 0, function () {
            var userId, _a, params, setCache, isInCache, clearCache_1, FORM_1, FORM_VIEW;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = (_b = event.source.userId) !== null && _b !== void 0 ? _b : '';
                        // eslint-disable-next-line no-console
                        console.log('event.source: ', event.source);
                        // 抓使用者資料
                        return [4 /*yield*/, client.getProfile(userId).then(function (profile) {
                                form.signPerson = profile.displayName;
                                // eslint-disable-next-line no-console
                                console.log(profile);
                                // eslint-disable-next-line no-console
                                console.log('form: ', form);
                            })];
                    case 1:
                        // 抓使用者資料
                        _c.sent();
                        _a = event.postback.data;
                        switch (_a) {
                            case 'start': return [3 /*break*/, 2];
                            case 'end': return [3 /*break*/, 3];
                            case 'totalTime': return [3 /*break*/, 4];
                            case 'purpose': return [3 /*break*/, 5];
                            case 'purpose:練習': return [3 /*break*/, 6];
                            case 'purpose:錄音、混音、拍 MV': return [3 /*break*/, 7];
                            case 'purpose:教學': return [3 /*break*/, 8];
                            case 'confirm:yes': return [3 /*break*/, 9];
                            case 'confirm:no': return [3 /*break*/, 11];
                            case 'showData': return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 13];
                    case 2:
                        {
                            params = event.postback.params;
                            if (params && 'datetime' in params) {
                                form.startTime = moment(params.datetime).format('YYYY-MM-DD HH:mm');
                                return [2 /*return*/, client.replyMessage(event.replyToken, {
                                        type: 'text',
                                        text: "\u958B\u59CB\u6642\u9593: ".concat(form.startTime)
                                    })];
                            }
                            return [3 /*break*/, 13];
                        }
                    case 3:
                        {
                            if (event.postback.params && 'datetime' in event.postback.params) {
                                form.endTime = moment(event.postback.params.datetime).format('YYYY-MM-DD HH:mm');
                                return [2 /*return*/, client.replyMessage(event.replyToken, {
                                        type: 'text',
                                        text: "\u7D50\u675F\u6642\u9593: ".concat(form.endTime)
                                    })];
                            }
                            return [3 /*break*/, 13];
                        }
                    case 4:
                        {
                            return [2 /*return*/, client.replyMessage(event.replyToken, {
                                    type: 'text',
                                    text: "\u7E3D\u6642\u9577\uFF1A".concat(getOffsetNowTime(form.startTime, form.endTime))
                                })];
                        }
                    case 5: return [2 /*return*/, client.replyMessage(event.replyToken, PURPOSE_CONFIG)
                            .then(function () {
                            // eslint-disable-next-line no-console
                            console.log('success');
                        })["catch"](function (err) {
                            // eslint-disable-next-line no-console
                            console.log('err', err);
                        })];
                    case 6:
                        form.purpose = event.postback.data.replace('purpose:', '');
                        return [2 /*return*/, client.replyMessage(event.replyToken, {
                                type: 'text',
                                text: "\u76EE\u7684\uFF1A".concat(form.purpose)
                            })];
                    case 7:
                        form.purpose = event.postback.data.replace('purpose:', '');
                        return [2 /*return*/, client.replyMessage(event.replyToken, {
                                type: 'text',
                                text: "\u76EE\u7684\uFF1A".concat(form.purpose)
                            })];
                    case 8:
                        form.purpose = event.postback.data.replace('purpose:', '');
                        return [2 /*return*/, client.replyMessage(event.replyToken, {
                                type: 'text',
                                text: "\u76EE\u7684\uFF1A".concat(form.purpose)
                            })
                            // 確認提交
                        ];
                    case 9:
                        form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
                        form.registerTime = getNowTime();
                        form.fee = getFee(form.totalTime);
                        setCache = function (name) {
                            cache[name] = name;
                        };
                        isInCache = function (name) {
                            return cache[name];
                        };
                        clearCache_1 = function (name) {
                            delete cache[name];
                        };
                        if (isInCache(form.signPerson)) {
                            return [2 /*return*/, client.replyMessage(event.replyToken, {
                                    type: 'text',
                                    text: '3 秒內不能重複送出答案！'
                                })];
                        }
                        setCache(form.signPerson);
                        setTimeout(function () {
                            clearCache_1(form.signPerson);
                        }, 3000);
                        FORM_1 = {
                            signPerson: form.signPerson ? form.signPerson : '無',
                            purpose: form.purpose ? form.purpose : '無',
                            startTime: form.startTime ? form.startTime : '無',
                            endTime: form.endTime ? form.endTime : '無',
                            totalTime: form.totalTime ? form.totalTime : '無'
                        };
                        // eslint-disable-next-line no-console
                        console.log('FORM: ', FORM_1);
                        if (!form.startTime
                            || !form.endTime
                            || !form.totalTime
                            || !form.purpose
                            || !form.signPerson) {
                            return [2 /*return*/, client.replyMessage(event.replyToken, [
                                    getUrlConfig(FORM_1), {
                                        type: 'text',
                                        text: '尚有未填寫的問題，無法提交'
                                    },
                                ])];
                        }
                        return [4 /*yield*/, isRepeatRowData(form)
                                .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            console.log('isRepeatRowData: ', res);
                                            if (!res) return [3 /*break*/, 1];
                                            return [2 /*return*/, client.replyMessage(event.replyToken, [
                                                    getUrlConfig(FORM_1), {
                                                        type: 'text',
                                                        text: '試算表中已有此紀錄！'
                                                    },
                                                ])];
                                        case 1: 
                                        // 新增資料
                                        return [4 /*yield*/, addSheetData(form)
                                                .then(function () {
                                                // eslint-disable-next-line no-console
                                                console.log('新增！');
                                                return client.replyMessage(event.replyToken, [
                                                    getUrlConfig(FORM_1), {
                                                        type: 'text',
                                                        text: '成功新增一筆使用紀錄！'
                                                    },
                                                ]);
                                            })["catch"](function (err) {
                                                // eslint-disable-next-line no-console
                                                console.log('新增失敗：', err);
                                                return err;
                                            })];
                                        case 2:
                                            // 新增資料
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/, res];
                                    }
                                });
                            }); })["catch"](function (err) {
                                // eslint-disable-next-line no-console
                                console.log('is Repeat Error:', err);
                                return err;
                            })];
                    case 10: 
                    // 判斷是否有重複資料
                    return [2 /*return*/, _c.sent()];
                    case 11: return [2 /*return*/, client.replyMessage(event.replyToken, {
                            type: 'text',
                            text: '取消提交'
                        })];
                    case 12:
                        {
                            form.totalTime = getOffsetNowTime(form.startTime, form.endTime);
                            FORM_VIEW = {
                                signPerson: form.signPerson ? form.signPerson : '無',
                                purpose: form.purpose ? form.purpose : '無',
                                startTime: form.startTime ? form.startTime : '無',
                                endTime: form.endTime ? form.endTime : '無',
                                totalTime: form.totalTime ? form.totalTime : '無'
                            };
                            return [2 /*return*/, client.replyMessage(event.replyToken, getUrlConfig(FORM_VIEW))
                                    .then(function (res) {
                                    // eslint-disable-next-line no-console
                                    console.log('success', res);
                                    return res;
                                })["catch"](function (err) {
                                    // eslint-disable-next-line no-console
                                    console.log('err', err);
                                    return err;
                                })];
                        }
                    case 13: return [2 /*return*/, client.replyMessage(event.replyToken, CAROUSEL_CONFIG)];
                }
            });
        }); };
        if (event.type === 'message')
            return messageHandler(event);
        if (event.type === 'postback')
            return postbackHandler(event);
    }
    Promise.all(req.body.events.map(handleEvent))
        .then(function (result) { return res.json(result); })["catch"](function (err) {
        return err;
    });
};

module.exports = main;

import lineBot from '@line/bot-sdk'
import dotenv from 'dotenv'
import moment from 'moment-timezone'
import type { MessageEvent, PostbackEvent, WebhookEvent } from '@line/bot-sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

import {
  getFee,
  getNowTime,
  getOffsetNowTime,
} from '../src/help/index'

import {
  addSheetData,
  isRepeatRowData,
} from './service/googleSheet'

import {
  CAROUSEL_CONFIG,
  PURPOSE_CONFIG,
  getUrlConfig,
} from './messageAPI/config'

dotenv.config()

const form = {
  startTime: '',
  endTime: '',
  totalTime: '',
  purpose: '',
  signPerson: '',
  registerTime: '',
  fee: 0,
  paymentStatus: '未繳費',
}

const cache: Record<string, string> = {}

let count = 30
let countUserID: any[] = []

interface Req extends VercelRequest {
  body: {
    events: WebhookEvent[]
  }
}

const main = (req: Req, res: VercelResponse) => {
  console.log('req body.events:', req.body.events)

  // 用於辨識Line Channel的資訊
  const config = {
    channelId: process.env.CHANNEL_ID,
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  }

  const client = new lineBot.Client(config)

  function handleEvent(event: WebhookEvent) {
    if (!['text', 'message', 'postback'].includes(event.type))
      return Promise.resolve(null)

    const userId = event.source.userId

    console.log('userId: ', userId)

    // 當有人傳送訊息給Bot時
    const messageHandler = (event: MessageEvent) => {
      // event.message.text是使用者傳給bot的訊息
      const userId = event.source.userId
      const message = 'text' in event.message ? event.message.text : ''

      switch (message) {
        case '我要登記': {
          return client.replyMessage(event.replyToken, CAROUSEL_CONFIG)
            .then((res) => {
              console.log('success')
              return res
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
        case '測試': {
          if (count < 30) {
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: `30 秒內不可再遞出資料，還剩 ${count} 秒`,
            })
              .then((res) => {
                console.log('success', res)
              })
              .catch((err) => {
                console.log('err', err)
              })
          }
          countUserID.push(userId)
          const myfunc = () => {
            count -= 1

            console.log(count)
          }
          const myInterval = setInterval(myfunc, 1000)
          const stopInterval = () => {
            clearTimeout(myInterval)
            count = 30
            countUserID = countUserID.filter(item => item !== userId)
          }
          setTimeout(stopInterval, 30000)
          break
        }
        default:
          return client.replyMessage(event.replyToken,
            {
              type: 'text',
              text: '......抱歉，我聽不懂你說的。',
            })
            .then((data) => {
              return data
              // 當訊息成功回傳後的處理
            })
            .catch((error) => {
              // 當訊息回傳失敗後的處理
              console.log(error)
            })
      }
    }

    const postbackHandler = async (event: PostbackEvent) => {
      const userId = event.source.userId ?? ''

      console.log('event.source: ', event.source)

      // 抓使用者資料
      await client.getProfile(userId).then((profile) => {
        form.signPerson = profile.displayName

        console.log(profile)

        console.log('form: ', form)
      })

      switch (event.postback.data) {
        // 時間
        case 'start': {
          const params = event.postback.params
          if (params && 'datetime' in params) {
            form.startTime = moment(params.datetime).format(
              'YYYY-MM-DD HH:mm',
            )
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: `開始時間: ${form.startTime}`,
            })
          }
          break
        }
        case 'end': {
          if (event.postback.params && 'datetime' in event.postback.params) {
            form.endTime = moment(event.postback.params.datetime).format(
              'YYYY-MM-DD HH:mm',
            )
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: `結束時間: ${form.endTime}`,
            })
          }
          break
        }
        case 'totalTime': {
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `總時長：${getOffsetNowTime(form.startTime, form.endTime)}`,
          })
        }
        // 目的
        case 'purpose':
          return client.replyMessage(event.replyToken, PURPOSE_CONFIG)
            .then(() => {
              console.log('success')
            })
            .catch((err) => {
              console.log('err', err)
            })
        case 'purpose:練習':
          form.purpose = event.postback.data.replace('purpose:', '')
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `目的：${form.purpose}`,
          })

        case 'purpose:錄音、混音、拍 MV':
          form.purpose = event.postback.data.replace('purpose:', '')
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `目的：${form.purpose}`,
          })
        case 'purpose:教學':
          form.purpose = event.postback.data.replace('purpose:', '')
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `目的：${form.purpose}`,
          })
        // 確認提交
        case 'confirm:yes': {
          form.totalTime = getOffsetNowTime(form.startTime, form.endTime)

          form.registerTime = getNowTime()
          form.fee = getFee(form.totalTime)
          // 驗證每個欄位是否都有值

          // 阻擋多次點擊按鈕：Cache 快取機制
          const setCache = (name: string) => {
            cache[name] = name
          }
          const isInCache = (name: string) => {
            return cache[name]
          }
          const clearCache = (name: string) => {
            delete cache[name]
          }
          if (isInCache(form.signPerson)) {
            return client.replyMessage(event.replyToken, {
              type: 'text',
              text: '3 秒內不能重複送出答案！',
            })
          }
          setCache(form.signPerson)
          setTimeout(() => {
            clearCache(form.signPerson)
          }, 3000)

          // ------------------------------------------------------------

          const FORM = {
            signPerson: form.signPerson ? form.signPerson : '無',
            purpose: form.purpose ? form.purpose : '無',
            startTime: form.startTime ? form.startTime : '無',
            endTime: form.endTime ? form.endTime : '無',
            totalTime: form.totalTime ? form.totalTime : '無',
          }

          console.log('FORM: ', FORM)

          if (
            !form.startTime
            || !form.endTime
            || !form.totalTime
            || !form.purpose
            || !form.signPerson
          ) {
            return client.replyMessage(event.replyToken, [
              getUrlConfig(FORM), {
                type: 'text',
                text: '尚有未填寫的問題，無法提交',
              },
            ])
          }

          // 判斷是否有重複資料
          return await isRepeatRowData(form)
            .then(async (res) => {
              console.log('isRepeatRowData: ', res)

              if (res) {
                return client.replyMessage(event.replyToken, [
                  getUrlConfig(FORM), {
                    type: 'text',
                    text: '試算表中已有此紀錄！',
                  },
                ])
              }
              else {
                // 新增資料
                await addSheetData(form)
                  .then(() => {
                    console.log('新增！')
                    return client.replyMessage(event.replyToken, [
                      getUrlConfig(FORM), {
                        type: 'text',
                        text: '成功新增一筆使用紀錄！',
                      },
                    ])
                  })
                  .catch((err) => {
                    console.log('新增失敗：', err)
                  })
              }
              return res
            })
            .catch((err) => {
              console.log('is Repeat Error:', err)
            })
        }
        case 'confirm:no':
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: '取消提交',
          })
        case 'showData': {
          form.totalTime = getOffsetNowTime(form.startTime, form.endTime)
          const FORM_VIEW = {
            signPerson: form.signPerson ? form.signPerson : '無',
            purpose: form.purpose ? form.purpose : '無',
            startTime: form.startTime ? form.startTime : '無',
            endTime: form.endTime ? form.endTime : '無',
            totalTime: form.totalTime ? form.totalTime : '無',
          }
          return client.replyMessage(event.replyToken, getUrlConfig(FORM_VIEW))
            .then((res) => {
              console.log('success', res)
              return res
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
      }

      return client.replyMessage(event.replyToken, CAROUSEL_CONFIG)
    }

    if (event.type === 'message')
      return messageHandler(event)
    if (event.type === 'postback')
      return postbackHandler(event)
  }

  Promise.all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch((err) => {
      console.log(err)
    })
}

export default main

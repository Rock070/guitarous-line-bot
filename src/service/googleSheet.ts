import type { GoogleSpreadsheetRow, WorksheetBasicProperties } from 'google-spreadsheet'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import dotenv from 'dotenv'

interface Form {
  startTime: string
  endTime: string
  totalTime: string
  purpose: string
  signPerson: string
  registerTime: string
  fee: number
  paymentStatus: string
}

interface Row extends GoogleSpreadsheetRow {
  _sheet: WorksheetBasicProperties
  _rawData: Record<string, string>
}

dotenv.config()

/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 * @param  {String} credentialsPath the credentials path defalt is './credentials.json'
 */

const docID = '1a2nJqFHLXNP78Mq5QUKxuVpC1QmAmFw3c8xZ55gpH54'
const sheetID = '0'

export const getSheetAllData = async () => {
  const result: Record<string, string>[] = []
  const doc = new GoogleSpreadsheet(docID)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY,
  })
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]
  const rows = await sheet.getRows() as Row[]
  for (const row of rows) {
    console.log('row: ', row)

    result.push(row._rawData)
  }

  return result
}
// 輸入欄位名稱、值，可以搜尋到全部資料
export const getSheetRowData = async (column: string, value) => {
  const result: Record<string, string>[] = []
  const doc = new GoogleSpreadsheet(docID)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY,

  })
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]

  const rows = await sheet.getRows() as Row[]
  const headerRow = rows[0]._sheet.headerValues
  // 錯誤處理
  if (!headerRow.includes(column))
    return '欄位輸入錯誤'

  for (const row of rows) {
    if (row[column] === value)
      result.push(row._rawData)
  }
  if (result.length === 0)
    return '你輸入的值目前並沒有相關資料'

  console.log(result)
  return result
}
// 用法
// getSheetRowData("signPerson", "王建雄").then(res => {
// console.log(res)
// });

export const addSheetData = async (data: Record<string, string | number>) => {
  const doc = new GoogleSpreadsheet(docID)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY,
  })
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]

  return sheet.addRow(data)
}

// 判斷是否有重複資料
export const isRepeatRowData = async (form: Form) => {
  const doc = new GoogleSpreadsheet(docID)

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEET_PRIVATE_KEY,

  })
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]

  const rows = await sheet.getRows() as Row[]
  const headerRow = rows[0]._sheet.headerValues
  // 錯誤處理
  const headerRowNum = headerRow.length
  for (const row of rows) {
    if (row._rowNumber === 2)
      continue
    let tempNum = 0
    headerRow.forEach((item) => {
      if (item !== 'registerTime' && item !== 'paymentStatus') {
        if (row[item] === form[item])
          tempNum += 1
      }
    })
    // -2 減掉登記時間、繳費狀況
    if (tempNum >= headerRowNum - 2)
      return true
  }
  return false
}

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

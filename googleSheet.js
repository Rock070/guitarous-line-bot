// googleSheet.js

const { GoogleSpreadsheet } = require("google-spreadsheet");

/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 * @param  {String} credentialsPath the credentials path defalt is './credentials.json'
 */

const docID = "1a2nJqFHLXNP78Mq5QUKxuVpC1QmAmFw3c8xZ55gpH54";
const sheetID = "0";
const credentialsPath = "./credentials.json";

async function getSheetData() {
  const result = [];
  const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetID];
  const rows = await sheet.getRows();
  for (row of rows) {
    result.push(row._rawData);
  }
  return result;
}

async function addSheetData(data) {
  const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetID];
  await sheet.addRow(data);
}

module.exports = {
  getSheetData,
  addSheetData,
};

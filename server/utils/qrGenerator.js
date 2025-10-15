const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function generateQRAndSaveTempFile(data) {
  const fileName = `${uuidv4()}.png`;
  const filePath = path.join(__dirname, '../tmp', fileName); // make sure /tmp exists

  await QRCode.toFile(filePath, JSON.stringify(data)); // save as file
  return filePath;
}

module.exports = { generateQRAndSaveTempFile };

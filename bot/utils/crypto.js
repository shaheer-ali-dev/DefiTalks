const crypto = require('crypto');
const { ENCRYPTION_KEY } = require('../../config/env');

const algorithm = 'aes-256-cbc';
const IV_LENGTH = 16; // AES block size

// Convert the hex key into a buffer
const key = Buffer.from(ENCRYPTION_KEY, 'hex');

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return iv.toString('base64') + ':' + encrypted;
};

const decrypt = (data) => {
  const [ivText, encryptedText] = data.split(':');
  const iv = Buffer.from(ivText, 'base64');
  const encrypted = Buffer.from(encryptedText, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
module.exports = {encrypt,decrypt}
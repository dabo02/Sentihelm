var CryptoJS = require('node-cryptojs-aes').CryptoJS;

var ivLength = 16;

// Initialize class
var EncryptionManager = function(keySize, iterationCount) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

//Encrypt a plaintext with a password. Create
//random salt and iv, generate a key, encrypt
//the plaintext and put everything together
//into a base64 string.
EncryptionManager.prototype.encrypt = function(password, plainText) {
  var saltSize = Math.floor(Math.random() * 99) + 1;
  var salt = this.getRandomHexString(saltSize*2);
  var iv = this.getRandomHexString(ivLength*2);
  var key = this.generateKey(salt, password);
  var encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });

  var array = new Buffer(1 + saltSize + ivLength + encrypted.ciphertext.sigBytes);
  array[0] = saltSize;

  var encryptedB64String = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  var encryptedBuf = new Buffer(encryptedB64String, 'base64');

  var saltBytes = CryptoJS.enc.Hex.parse(salt);
  var saltB64string = CryptoJS.enc.Base64.stringify(saltBytes);
  var saltBuf = new Buffer(saltB64string, 'base64');

  var ivBytes = CryptoJS.enc.Hex.parse(iv);
  var ivB64string = CryptoJS.enc.Base64.stringify(ivBytes);
  var ivBuf = new Buffer(ivB64string, 'base64');

  for(var j = 0; j < saltSize; j++) {
    array[j+1] = saltBuf[j];
  }

  for(var j = 0; j < ivBuf.length; j++) {
    array[saltSize+1+j] = ivBuf[j];
  }

  for(var j = 0; j < encryptedBuf.length; j++) {
    array[saltSize+1+ivLength+j] = encryptedBuf[j];
  }

  console.log(array.toString('base64'));

  return array.toString('base64');
};

//Decrypt. Receives the encryption as a base64
//string, populate the salt and iv used for
//encryption, and generate the key to decrypt.
EncryptionManager.prototype.decrypt = function(password, arrayBase64) {

  var array =  new Buffer(arrayBase64, 'base64');

  var saltSize = array[0];
  var saltBuf = array.slice(1, saltSize+1);
  var ivBuf = array.slice(saltSize+1, saltSize+1+ivLength);
  var cipherBuf = array.slice(saltSize+1+ivLength, array.length);

  //Convert array of bytes to hex string (Ex. "A2B50986A1")
  function bufToHexStr(bytesArr) {
    var hexString = "";
    var hex = "";
    for(var i = 0; i < bytesArr.length; i++) {
      hex = Number(bytesArr[i]).toString(16);
      if(hex.length == 1) {
       hex = "0" + hex;
      }
      hexString += hex;
    }
    return hexString;
  };

  var salt = bufToHexStr(saltBuf);
  var iv = bufToHexStr(ivBuf);
  var ciphertext = cipherBuf.toString('base64');

  var key = this.generateKey(salt, password);
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  });
  var decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

//Generator the key with salt and password
EncryptionManager.prototype.generateKey = function(salt, password) {
  var key = CryptoJS.PBKDF2(
      password,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
  return key;
};

//Creates random hex string of length 'len'
EncryptionManager.prototype.getRandomHexString = function(len) {
    var text = "";
    var characters = "ABCDEF0123456789";
    for( var i=0; i < len; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return text;

};

//=========================================
//  EXPORT CLASS
//=========================================
module.exports = EncryptionManager;

var CryptoJS = require('crypto-js');

var crypto = require('crypto');
var sjcl = require('sjcl');

var ivLength = 16;
var defaultKeySize = 128;
var defaultIterations = iterationCount = 1000;

sjcl.hash.sha1 = function (hash) {
  if (hash) {
    this._h = hash._h.slice(0);
    this._buffer = hash._buffer.slice(0);
    this._length = hash._length;
  } else {
    this.reset();
  }
};

/**
 * Hash a string or an array of words.
 * @static
 * @param {bitArray|String} data the data to hash.
 * @return {bitArray} The hash value, an array of 5 big-endian words.
 */
sjcl.hash.sha1.hash = function (data) {
  return (new sjcl.hash.sha1()).update(data).finalize();
};

sjcl.hash.sha1.prototype = {
  /**
   * The hash's block size, in bits.
   * @constant
   */
  blockSize: 512,
   
  /**
   * Reset the hash state.
   * @return this
   */
  reset:function () {
    this._h = this._init.slice(0);
    this._buffer = [];
    this._length = 0;
    return this;
  },
  
  /**
   * Input several words to the hash.
   * @param {bitArray|String} data the data to hash.
   * @return this
   */
  update: function (data) {
    if (typeof data === "string") {
      data = sjcl.codec.utf8String.toBits(data);
    }
    var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data),
        ol = this._length,
        nl = this._length = ol + sjcl.bitArray.bitLength(data);
    for (i = this.blockSize+ol & -this.blockSize; i <= nl;
         i+= this.blockSize) {
      this._block(b.splice(0,16));
    }
    return this;
  },
  
  /**
   * Complete hashing and output the hash value.
   * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
   */
  finalize:function () {
    var i, b = this._buffer, h = this._h;

    // Round out and push the buffer
    b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1,1)]);
    // Round out the buffer to a multiple of 16 words, less the 2 length words.
    for (i = b.length + 2; i & 15; i++) {
      b.push(0);
    }

    // append the length
    b.push(Math.floor(this._length / 0x100000000));
    b.push(this._length | 0);

    while (b.length) {
      this._block(b.splice(0,16));
    }

    this.reset();
    return h;
  },

  /**
   * The SHA-1 initialization vector.
   * @private
   */
  _init:[0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0],

  /**
   * The SHA-1 hash key.
   * @private
   */
  _key:[0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6],

  /**
   * The SHA-1 logical functions f(0), f(1), ..., f(79).
   * @private
   */
  _f:function(t, b, c, d) {
    if (t <= 19) {
      return (b & c) | (~b & d);
    } else if (t <= 39) {
      return b ^ c ^ d;
    } else if (t <= 59) {
      return (b & c) | (b & d) | (c & d);
    } else if (t <= 79) {
      return b ^ c ^ d;
    }
  },

  /**
   * Circular left-shift operator.
   * @private
   */
  _S:function(n, x) {
    return (x << n) | (x >>> 32-n);
  },
  
  /**
   * Perform one cycle of SHA-1.
   * @param {bitArray} words one block of words.
   * @private
   */
  _block:function (words) {  
    var t, tmp, a, b, c, d, e,
    w = words.slice(0),
    h = this._h;
   
    a = h[0]; b = h[1]; c = h[2]; d = h[3]; e = h[4]; 

    for (t=0; t<=79; t++) {
      if (t >= 16) {
        w[t] = this._S(1, w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16]);
      }
      tmp = (this._S(5, a) + this._f(t, b, c, d) + e + w[t] +
             this._key[Math.floor(t/20)]) | 0;
      e = d;
      d = c;
      c = this._S(30, b);
      b = a;
      a = tmp;
   }

   h[0] = (h[0]+a) |0;
   h[1] = (h[1]+b) |0;
   h[2] = (h[2]+c) |0;
   h[3] = (h[3]+d) |0;
   h[4] = (h[4]+e) |0;
  }
};


var hmacSHA1 = function (key) {
    var hasher = new sjcl.misc.hmac( key, sjcl.hash.sha1 );
    this.encrypt = function () {
        return hasher.encrypt.apply( hasher, arguments );
    };
};

// Initialize class
var EncryptionManager = function(crypto) {
  this.crypto = crypto;
  this.keySize = defaultKeySize;
  this.iterationCount = defaultIterations;
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

  // console.log(array.toString('base64'));

  return array.toString('base64');
};

//Decrypt. Receives the encryption as a base64
//string, populate the salt and iv used for
//encryption, and generate the key to decrypt.
EncryptionManager.prototype.decrypt = function(password, arrayBase64) {
  
  var start = new Date().getTime();
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

  var sjclSalt = sjcl.codec.hex.toBits( salt );

//  var key1 = CryptoJS.PBKDF2(
//      password,
//      CryptoJS.enc.Hex.parse(salt),
//      { keySize: this.keySize/32, iterations: this.iterationCount });
  
  var key = sjcl.codec.hex.fromBits(sjcl.misc.pbkdf2( password, sjclSalt, this.iterationCount, this.keySize, hmacSHA1));
  
  
//  console.log('cryptojs:    ' + key1);
//  console.log('pbkdf2 SJCL: ' +  key + '\n');
  var key2 = CryptoJS.enc.Hex.parse(key);
//  console.log('pbkdf2 SJCL: ' +  key + '\n');
  if (key2.toString() !== key) {
    console.log("Error creating word array."); 
  }
  
  return key2;
  
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

;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		exports.CryptoJS = factory(require("cloud/crypto-js/core").CryptoJS, require("cloud/crypto-js/x64-core").CryptoJS, require("cloud/crypto-js/lib-typedarrays").CryptoJS, require("cloud/crypto-js/enc-utf16").CryptoJS, require("cloud/crypto-js/enc-base64").CryptoJS, require("cloud/crypto-js/md5").CryptoJS, require("cloud/crypto-js/sha1").CryptoJS, require("cloud/crypto-js/sha256").CryptoJS, require("cloud/crypto-js/sha224").CryptoJS, require("cloud/crypto-js/sha512").CryptoJS, require("cloud/crypto-js/sha384").CryptoJS, require("cloud/crypto-js/sha3").CryptoJS, require("cloud/crypto-js/ripemd160").CryptoJS, require("cloud/crypto-js/hmac").CryptoJS, require("cloud/crypto-js/pbkdf2").CryptoJS, require("cloud/crypto-js/evpkdf").CryptoJS, require("cloud/crypto-js/cipher-core").CryptoJS, require("cloud/crypto-js/mode-cfb").CryptoJS, require("cloud/crypto-js/mode-ctr").CryptoJS, require("cloud/crypto-js/mode-ctr-gladman").CryptoJS, require("cloud/crypto-js/mode-ofb").CryptoJS, require("cloud/crypto-js/mode-ecb").CryptoJS, require("cloud/crypto-js/pad-ansix923").CryptoJS, require("cloud/crypto-js/pad-iso10126").CryptoJS, require("cloud/crypto-js/pad-iso97971").CryptoJS, require("cloud/crypto-js/pad-zeropadding").CryptoJS, require("cloud/crypto-js/pad-nopadding").CryptoJS, require("cloud/crypto-js/format-hex").CryptoJS, require("cloud/crypto-js/aes").CryptoJS, require("cloud/crypto-js/tripledes").CryptoJS, require("cloud/crypto-js/rc4").CryptoJS, require("cloud/crypto-js/rabbit").CryptoJS, require("cloud/crypto-js/rabbit-legacy").CryptoJS);
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS;

}));

;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		exports.CryptoJS = factory(require("cloud/crypto-js/core"), require("cloud/crypto-js/x64-core"), require("cloud/crypto-js/sha512"), require("cloud/crypto-js/sha384"), require("cloud/crypto-js/hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./sha512", "./sha384", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA384;

}));
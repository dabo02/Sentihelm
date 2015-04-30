;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		exports.CryptoJS = factory(require("cloud/crypto-js/core"), require("cloud/crypto-js/sha256"), require("cloud/crypto-js/sha224"), require("cloud/crypto-js/hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha256", "./sha224", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA224;

}));
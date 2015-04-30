;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		exports.CryptoJS = factory(require("cloud/crypto-js/core"), require("cloud/crypto-js/cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.pad.Pkcs7;

}));
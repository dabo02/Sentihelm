;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		exports.CryptoJS = factory(require("cloud/crypto-js/core").CryptoJS, require("cloud/crypto-js/cipher-core").CryptoJS);
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

	/**
	 * A noop padding strategy.
	 */
	CryptoJS.pad.NoPadding = {
	    pad: function () {
	    },

	    unpad: function () {
	    }
	};


	return CryptoJS.pad.NoPadding;

}));

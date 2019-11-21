export class Utility {
	//closure + IIFE
	static genInteger = (() => {
		let seed = 100;

		return () => seed++;
	})();

	static notEmpty(value) {
		return value && String(value).trim().length > 0;
	}
}

export default Utility;

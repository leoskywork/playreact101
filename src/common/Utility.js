export class Utility {
	//closure + IIFE
	static genInteger = (() => {
		let seed = 100;

		return () => seed++;
	})();
}

export default Utility;

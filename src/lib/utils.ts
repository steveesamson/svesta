/* eslint-disable @typescript-eslint/no-explicit-any */
export const makeName = function (str: string) {
	str = str + '';
	const index = str.indexOf('_');
	if (index < 0) {
		return str === 'id' ? str.toUpperCase() : str.charAt(0).toUpperCase() + str.substring(1);
	}
	const names = str.split('_');
	let new_name = '';

	names.forEach(function (s) {
		new_name += new_name.length > 0 ? ' ' + makeName(s) : makeName(s);
	});

	return new_name;
};

// export const debounce = function (func: () => void, wait: number) {
// 	let timeout: number;
// 	return (...args: any) => {
// 		clearTimeout(timeout);
// 		timeout = setTimeout(() => func.apply(this, args), wait);
// 	};
// };

export const debounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
	let timeoutTimer: ReturnType<typeof setTimeout>;

	return (...args: T) => {
		clearTimeout(timeoutTimer);

		timeoutTimer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
};

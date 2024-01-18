/* eslint-disable @typescript-eslint/ban-types */
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

export const debounce = function (func: Function, wait: number) {
    let timeout: number;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};
const hasOwn = Object.prototype.hasOwnProperty;
const toStr = Object.prototype.toString;

const isArray = (arr) => {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    }
    return toStr.call(arr) === '[object Array]';
};

let isPlainObject = (obj) => {
    if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
    }

    let hasOwnConstructor = hasOwn.call(obj, 'constructor');
    let hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    // Not own constructor property must be Object
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    let key;
    for (key in obj) {
        // ...
    }

    return typeof key === 'undefined' || hasOwn.call(obj, key);
};
/* eslint-disable complexity */
export default function extend(...args) {
    let options;
    let name;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    let target = args[0];
    let i = 1;
    let length = args.length;
    let deep = false;
    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        target = args[1] || {};
        // skip the boolean and the target
        i = 2;
    } else if ((typeof target !== 'object' && typeof target !== 'function') || (target === null || target === undefined)) {
        target = {};
    }

    for (; i < length; ++i) {
        options = args[i];
        // Only deal with non-null/undefined values
        if (options !== null && options !== undefined) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target !== copy) {
                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = extend(deep, clone, copy);

                    // Don't bring in undefined values
                    } else if (typeof copy !== 'undefined') {
                        target[name] = copy;
                    }
                }
            }
        }
    }
    return target;
}

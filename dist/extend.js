'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = extend;
var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    }
    return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
    if (!obj || toStr.call(obj) !== '[object Object]') {
        return false;
    }

    var hasOwnConstructor = hasOwn.call(obj, 'constructor');
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
    // Not own constructor property must be Object
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
        return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.
    var key = void 0;
    for (key in obj) {
        // ...
    }

    return typeof key === 'undefined' || hasOwn.call(obj, key);
};
/* eslint-disable complexity */
function extend() {
    var options = void 0;
    var name = void 0;
    var src = void 0;
    var copy = void 0;
    var copyIsArray = void 0;
    var clone = void 0;
    var target = arguments.length <= 0 ? undefined : arguments[0];
    var i = 1;
    var length = arguments.length;
    var deep = false;
    // Handle a deep copy situation
    if (typeof target === 'boolean') {
        deep = target;
        target = (arguments.length <= 1 ? undefined : arguments[1]) || {};
        // skip the boolean and the target
        i = 2;
    } else if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && typeof target !== 'function' || target === null || target === undefined) {
        target = {};
    }

    for (; i < length; ++i) {
        options = arguments.length <= i ? undefined : arguments[i];
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BehaviorSubject = exports.BehaviorSubject = function () {
    function BehaviorSubject(initData) {
        _classCallCheck(this, BehaviorSubject);

        this.data = initData;
        this.observers = [];
    }

    _createClass(BehaviorSubject, [{
        key: "subscribe",
        value: function subscribe(observer) {
            var _this = this;

            this.observers.push(observer);
            return {
                unsubscribe: function unsubscribe() {
                    _this.observers = _this.observers.filter(function (item) {
                        return item !== observer;
                    });
                }
            };
        }
    }, {
        key: "next",
        value: function next(nextData) {
            this.observers.forEach(function (itemObserver) {
                itemObserver(nextData);
            });
        }
    }]);

    return BehaviorSubject;
}();
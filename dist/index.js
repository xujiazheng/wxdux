'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dispatch = exports.connect = exports.createStore = undefined;

var _BehaviorSubject = require('./BehaviorSubject');

var _extend = require('./extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 获取订阅主体
var getSubject = function getSubject() {
    if (!getSubject.subject) {
        getSubject.subject = new _BehaviorSubject.BehaviorSubject();
    }
    return getSubject.subject;
};

// 更新state
var updateState = function updateState(reducers, preState) {
    var action = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return Object.keys(reducers).reduce(function (nextState, key) {
        nextState[key] = reducers[key](preState[key], action);
        return nextState;
    }, {});
};

// 创建store
var createStore = exports.createStore = function createStore(reducers, preloadedState) {
    var currentState = updateState(reducers, preloadedState);
    // 触发action更新state
    var dispatch = function dispatch(action) {
        currentState = updateState(reducers, currentState, action);
        getSubject().next(currentState);
    };

    var getState = function getState() {
        return currentState;
    };
    return {
        dispatch: dispatch,
        getState: getState
    };
};

// 判断state是否改变 
var isModifyState = function isModifyState(state, nextState) {
    for (var key in state) {
        if (state[key] !== nextState[key]) {
            return true;
        }
    }
    return false;
};

var noop = function noop() {};
// 封装小程序对象
var connect = exports.connect = function connect(pageOptions) {
    var newPageOptions = (0, _extend2.default)(true, {}, pageOptions);
    var appInstance = getApp();
    var store = appInstance.globalData.store;
    var currentState = store.getState();
    var subject = getSubject();
    var subscription = void 0;
    var mapStateToProps = newPageOptions.$useState.bind(newPageOptions);
    var state = mapStateToProps(currentState);

    // 劫持onLoad和onUnload
    var oldOnLoad = newPageOptions.onLoad ? newPageOptions.onLoad.bind(newPageOptions) : noop;
    var oldOnUnload = newPageOptions.onUnload ? newPageOptions.onUnload.bind(newPageOptions) : noop;
    newPageOptions.onLoad = function (options) {
        var _this = this;

        this.setData(state);
        var observer = function observer(nextState) {
            if (isModifyState(state, nextState)) {
                state = mapStateToProps(nextState);
                _this.setData(state);
            }
        };

        subscription = subject.subscribe(observer);

        oldOnLoad(options);
    };

    newPageOptions.onUnload = function () {
        if (subscription) {
            subscription.unsubscribe();
        }
        oldOnUnload();
    };

    return newPageOptions;
};

// 触发action
var dispatch = exports.dispatch = function dispatch(action) {
    var appInstance = getApp();
    var store = appInstance.globalData.store;
    var dispatch = store.dispatch;

    dispatch(action);
};
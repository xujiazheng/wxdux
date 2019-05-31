import {BehaviorSubject} from './BehaviorSubject';
import extend from './extend';
// 获取订阅主体
const getSubject = () => {
    if (!getSubject.subject) {
        getSubject.subject = new BehaviorSubject();
    }
    return getSubject.subject;
};

// 获取store
const getStore = () => {
    const appInstance = getApp();
    return appInstance.globalData.store;
}

// 更新state
const transformToStateByObject = (reducers, preState, action = {}) => Object.keys(reducers).reduce((nextState, key) => {
    nextState[key] = reducers[key](preState[key], action);
    return nextState;
}, {});

const transformToStateByFunction = (reduceHandler, preState, action = {}) => reduceHandler(preState, action);

const reducerGenerater = (reducers) => {
    let _reducerGenerater = typeof reducers === 'function' ? transformToStateByFunction : transformToStateByObject;
    
    return (preState, action = {}) => _reducerGenerater(reducers, preState, action);
};

// 创建store
export const createStore = (reducers, preloadedState) => {
    const transformToState = reducerGenerater(reducers);
    let currentState = transformToState(preloadedState);
    // 触发action更新state
    const dispatch = (action) => {
        currentState = transformToState(currentState, action);
        getSubject().next(currentState);
    };

    const getState = () => currentState;
    return {
        dispatch,
        getState,
    }
};

// 判断state是否改变 
const isModifyState = (state, nextState) => {
    for (let key in state) {
        if (state[key] !== nextState[key]) {
            return true;
        }
    }
    return false;
};

const noop = () => {};
// 封装小程序对象
export const connect = (pageOptions) => {
    const newPageOptions = extend(true, {}, pageOptions);

    const store = getStore();
    let currentState = store.getState();
    let subject = getSubject();
    let subscription;

    let mapStateToProps = newPageOptions.$useState.bind(newPageOptions);
    let state = mapStateToProps(currentState);

    // 劫持onLoad和onUnload
    let oldOnLoad = newPageOptions.onLoad ? newPageOptions.onLoad.bind(newPageOptions) : noop;
    let oldOnUnload = newPageOptions.onUnload ? newPageOptions.onUnload.bind(newPageOptions) : noop;
    newPageOptions.onLoad = function (options) {
        this.setData(state);
        const observer = (nextState) => {
            if (isModifyState(state, nextState)) {
                state = mapStateToProps(nextState);
                this.setData(state);
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
    }

    return newPageOptions;
};

// 触发action
export const dispatch = (action) => {
    const store = getStore();
    const {dispatch} = store;
    dispatch(action);
};

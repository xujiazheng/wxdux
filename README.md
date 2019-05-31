## wxdux

一个类似于redux的小程序状态管理方案

+ [安装](#安装)
+ [引入](#引入)
+ [基础](#基础)
    + [action](#action)
    + [reducer](#reducer)
    + [store](#store)
+ [API](#API)
    + [createStore](#createStore)
    + [connect](#connect)
    + [dispatch](#dispatch)
+ [完整示例](#完整示例)
+ [联系我](#联系我)


### 安装

```bash
git clone https://github.com/xujiazheng/wxdux.git
```

### 引入

将dist目录下的文件复制到小程序项目中

```bash
# 假如小程序项目中有common文件夹
cd common

mkdir wxdux

cp 克隆下来的目录/dist/* ./wxdux/

```

### 基础

#### action

> action 是把数据从应用传到 `store` 的有效载荷。它是 `store` 数据的唯一来源。一般来说你会通过 `dispatch()` 将 action 传到 store。

注：wxdux的action不像redux一样单独去定义去维护。当然如果想那样书写也可以。

修改姓名action示例：

```javascript
// 定义action
const action = {
    type: 'update_name',
    name: '张三',
};
// dispatch触发action
dispatch(action);
```

#### reducer

> reducers 指定了应用状态的变化如何响应 `actions` 并发送到 `store` 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。

像redux一样，actions只关心触发某一事情，reducers关心state是如何改变的，reducers写法与redux类似。

reducers有两种写法：

1. 函数，一个函数处理所有的action行为带来的state变化

```javascript

const reducers = (state = {
    user = {},
    posts = {},
}, action) => {
    switch (action) {
        // ...
    }
};
export default reducers;

```

2. 对象，多个函数分别处理不同数据的state变化

```javascript
// reducers.js

const userReducer = (state = {}, action) => {
    // ...
}

const postReducer = (state = [], action) => {
    // ...
};

const reducers = {
    user: userReducer,
    posts: postReducer,
};

export default reducers;

```

以上两种写法生成的state是相同的都是

```
{
    user: {},
    posts: []
}
```

推荐第二种写法，拆分reducer

#### store

store是createStore返回的对象，store需要挂在到globalData中去

```
globalData: {
    store: createStore(reducer)
}
```

store提供两个方法：

* getState：获取当前state
* dispatch：触发action达到更新state的目的

## API

wxdux暴露了三个方法：createStore（创建store）、connect（连接小程序页面）、dispatch（改变state）；

#### createStore

创建store

传参：

* reducers: `Function|Object` 必需
* preloadedState： `All` 非必须， 初始state值

返回：

`store`

返回的store必须挂在到globalData中

```javascript
import {createStore} from './common/wxdux/index';
import reducer from './reducer';
const store = createStore(reducer);

App({
    globalData: {
        store,
    },
});

```

#### connect

将小程序页面与wxdux连接起来，使页面可以使用store中的响应式state

使用此方法有两步：

1. 第一步： page的配置对象添加$useState方法获取store中的state
2. 第二步：connect函数处理page的配置对象

如下示例：
```javascript
import {connect} from './wxdux/index';

Page(connect({
    data: {
        sex: '男',
    },
    onLoad() {
        // ...
    },
    $useState(state) {
        return {
            name: state.name,
        },
    },
}))
```

#### dispatch

dispatch触发action从而更新state，dispatch可以在任何地方使用。

```javascript
import {connect, dispatch} from './wxdux/index';

Page(connect({
    data: {
        sex: '男',
    },
    onLoad() {
        // ...
    },
    $useState(state) {
        return {
            name: state.name,
        },
    },
    // 某点击事件触发，更新姓名为“张三”
    onClick() {
        const updateName = {
            type: 'update_name',
            name: '张三'
        };
        dispatch(updateName);
    }
}))
```

### 完整示例

小程序主入口app.js注册store

```javascript
// 小程序主入口app.js
import {createStore} from './wxdux/index';
import reducer from './reducer';
const store = createStore(reducer);

App({
    globalData: {
        store,
    },
});
```

reducer.js中暴露一个对象，处理所有state更新

```javascript
// reducer.js中返回一个对象

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'update_name': {
            return Object.assign({}, state, {
                name: action.name,
            });
        }
        default: {
            return state;
        }
    }
};

const postsReducer = (state = [], action) => {
    switch (action.type) {
        case 'add_post': {
            state.push(action.post);
            return state;
        }
        default: {
            return state;
        }
    }
};

export default {
    user: userReducer,
    posts: postsReducer,
};
```

home页面中连接wxdux Store

```javascript
// home.js

import {connect, dispatch} from '../../common/wxdux/index';

Page(connect({
    data: {
        sex: '男',
    },
    $useState(state) {
        return {
            name: state.user.name,
        },
    },
    onClick() {
        dispatch({
            type: 'update_name',
            name: '张三'
        })
    }
}));
```

wxml中使用state

```html
<view>{{name}}</view>
```

### 联系我 

* 邮箱：18397968326@163.com
* issue: [https://github.com/xujiazheng/wxdux/issues](https://github.com/xujiazheng/wxdux/issues)
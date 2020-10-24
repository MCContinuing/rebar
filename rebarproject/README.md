# rebarproject

## 安装
```
npm install
```

### 运行
```
npm run serve
```

### 编译
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 路由
1. index中创建路由对象
2. 使用按钮替换 (无返回)
```
      itemClick(){
        this.$router.replace(this.path)
      }
```
### 解决非父子组件之间的通信
- 使用vuex集中式存储管理
- 解决多个状态在多个页面共享问题
- 访问状态：this.$store.state
- 修改状态：this.$store.commit('mutations方法名',其他参数)
- 注意：vuex可以追踪状态变化，不要直接使用this.$store.state改变状态，否则会无法追踪

### 数据请求
1. 可直接用已封装的request.js拓展使用
2. 安装
```
npm install axios --save
```
### 使用vant框架 具体见vant官方中文文档
1. 安装
    ```
    npm i vant -S
    ```
2. 引入main.js
3. 添加配置babel.config.js
    ```
    module.exports = {
      presets: [
        '@vue/cli-plugin-babel/preset'
      ],
      "plugins": [
        ["import", {
          "libraryName": "vant",
          "libraryDirectory": "es",
          "style": true
        }]
      ]
    }
    ```
4.安装插件
    ```
    npm i babel-plugin-import -D
    ```
### 使用BetterScroll，解决移动端滚动卡顿现象
1. 安装
    ```
    npm install better-scroll --save
    ```
2. 引入 import BScorll from 'better-scroll'

### 使用fastclick补丁解决移动端存在的300ms延迟问题
1. 安装
    ```
    npm install fastclick --save
    ```
2. main.js中引入
    ```
    import FastClick from 'fastclick'
    ```
3. main.js中将fastclick附加到Body
    ```
    FastClick.attach(document.body)
    ```
### 使用webpack插件px2vw-css单位转化，移动端不同手机类型转换
1. 安装插件
    ```
   npm install postcss-px-to-viewport --save-dev
    ```
2. 在项目postcss.config.js中设置相关配置 如下：
    ```js
    module.exports = {
      plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport":{
          viewportWidth: 375,//视窗宽度
          viewportHeight: 667,//视窗高度
          unitPrecision: 5,//指定px转换为视窗单位值的小数位数
          viewportUnit: 'vw',//指定需要转换的视窗单位，建议使用vw
          selectorBlackList:['ignore','tab-bar','tab-bar-item'] ,//指定不需要转换的类
          minPixelValue: 1,//小与或等于1px不转换为视窗单位
          mediaQuery: false,//允许在媒体查询中转换px
          exclude:[/TabBar/]//转换会排除有吧TabBar的文件
        }
      }
    }
    ```
3. 若要卸载插件
    ```
    npm uninstall postcss-px-to-viewport
    ```
### 使用font-awesome
- 使用网站 [font-awesome](http://www.fontawesome.com.cn/faicons/)
1. 安装
    ```
    npm install font-awesome --save
    ```
2. main.js中引入
    ```
    import "font-awesome/css/font-awesome.css"
    ```

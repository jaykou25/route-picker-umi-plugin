# route-picker-umi-plugin
<p>
  <a href="https://www.npmjs.com/package/route-picker-umi-plugin"><img src="https://badgen.net/npm/v/route-picker-umi-plugin" alt="Version" /></a>
  <a href="https://www.npmjs.com/package/route-picker-umi-plugin"><img src="https://badgen.net/npm/dm/route-picker-umi-plugin" alt="Downloads" /></a>
  <a href="https://www.npmjs.com/package/route-picker-umi-plugin"><img src="https://badgen.net/npm/license/route-picker-umi-plugin" alt="License" /></a>
</p>

该插件仅用于本地开发, 不会影响生产打包.

该插件仅适用于 umi4.

## 缘由
在开发一些大型项目时, 由于页面较多, 热更新的效率比较慢, 往往一个改动需大十几秒的时间.

有两个主要的原因会影响热更新的速度:

1. 当使用约定式路由时, 每次热更新时 umi 都会遍历 src 文件夹来生成一份路由表. 当文件夹中的文件很多时, 每次遍历都会花费好几秒的时间.

2. 项目越大路由越多, webpack 需要编译的时间肯定越多, 热更新时间自然变长.

本插件会从这两方面来着手. 

对于第 1 点, umi 在开发模式下每次监听到文件变化后都会执行一个 `getRoutes` 方法. 在这个方法里如果用户使用的约定式路由则会执行一个 `getConventionRoutes` 方法, 而如果用户使用的是配置式路由则会执行 `getConfigRoutes` 方法. 目测 `getConventionRoutes` 方法由于需要访问文件系统, 它的执行效率肯定要比 `getConfigRoutes` 这种纯粹的 js 方法要低很多[^1]. umi 之所以每次都要走这个方法, 是希望路由表能得到最及时的更新. 但是我们平时在开发时其实大部分的时间都是在开发页面, 而改动路由的概率并不大, 真的改动了路由, 重启一下服务就可以了.

```js
// 代码有简化, 仅用于示意.
export function getRoutes(opts) {
  let routes;

  if (opts.api.config.routes) { 
    routes = getConfigRoutes(...)
  } else {
    routes = getConventionRoutes(...)
  }

  return routes;
}
```

所以我的想法很简单, 在某一个时机根据约定式路由生成一份配置式路由, 然后把它赋给 api.config.routes. 那么每次 umi 监听到文件变化后就只会走 `getConfigRoutes` 方法了, 而不会走 `getConventionRoutes` 方法了. 相当于在配置文件中给它加上了 routes 配置.

那在哪个时机做这件事呢? 我们知道 umi 在启动时会经历几个阶段: resolveConfig -> collectAppData -> onCheck ...

在 collectAppData 阶段执行完成后, umi 会把路由信息存进 api.appData.routes.

当然这个 routes 跟配置表中的 routes 并不是同一个东西, 需要经过一定的转化, 然后把转化后的值赋给配置表. 插件就在 `modifyAppData` 这个回调里工作.

对于第 2 点, 当我们在开发项目的时候其实并不需要全部的路由, 大部分的时间往往只会专注在某几个路由上, 那么项目中的其它路由就可以忽略, 从而减少编译的时间.

通过指定那几个路由, 插件会自动忽略掉其它的路由, 同时又不会影响生产的打包. 

做到了以上两点后, 热更新速度大约可以快一倍 (约定式路由模式下)[^2].


## 如何使用
1. 安装插件
```
yarn add route-picker-umi-plugin --dev
```

2. 在配置文件中注册插件. (`.umi.rc` 或者 `config/config.ts` 等)

```js
// umi 配置文件
export default defineConfig({
  plugins: ["route-picker-umi-plugin"],
});
```

3. 指定你想要保留的路由
```js
// umi 配置文件
export default defineConfig({
  plugins: ["route-picker-umi-plugin"],
  routePicker: ['your-route']
});
```

## 注意点
1. routePicker 里指定的路由并不需要完全匹配, 部分匹配就可以生效. 比如你可以指定 'user', 那么像 'user/login', 'user/add' 等一系列路由都将被保留.
2. routePicker 若为空或者是空数组, 则所有路由都会被保留. 
3. 即使你并不想要过滤掉任何路由, 这个插件仍然值得开启, 因为对于约定式路由的热更新, 插件还是能够为你减少很多的时间. (上文的第一点) 

[^1]: 测试 590 个路由, `getConventionRoutes` 耗时 6.9 秒, `getConfigRoutes` 耗时 0.005 秒.
[^2]: 测试 590 个路由, 未开启插件时热更新 27 秒, 开启插件不指定路由热更新 12 秒, 开启插件指定一个路由热更新 6 秒

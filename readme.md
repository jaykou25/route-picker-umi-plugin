# route-picker-umi-plugin
<p>
  <a href="https://www.npmjs.com/package/route-picker-umi-plugin"><img src="https://badgen.net/npm/v/route-picker-umi-plugin" alt="Version" /></a>
  <a href="https://www.npmjs.com/package/route-picker-umi-plugin"><img src="https://badgen.net/npm/dm/route-picker-umi-plugin" alt="Downloads" /></a>
  <a href="https://www.npmjs.com/package/route-picker-umi-plugin"><img src="https://badgen.net/npm/license/route-picker-umi-plugin" alt="License" /></a>
</p>

该插件仅用于本地开发, 不会影响生产打包.

该插件仅适用于 umi4.

## 缘由
在开发一些大型项目时, 由于页面较多, 热更新的效率比较慢, 往往一个改动需要好几秒的时间.

但是大多数开发的时候我们往往只会专注在某几个页面上, 那么项目中的其它路由就会影响编译的速度.

使用这个插件, 你可以指定你关注的那几个页面, 插件会自动忽略掉其它的路由, 从而大大提高编译的速度. 

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
1. routePicker 里指定的路由并不需要完全匹配, 部分匹配就可以生效.

## 写在最后
umi 插件本质上就是一个函数. 

umi 约定在项目根目录中如果有 plugin.ts 文件或者 plugin.js 文件, umi 会自动将其注册成插件.

如果你不想安装 npm 包, 也可以将插件源码中的函数拷贝到本地的 plugin.ts 或 plugin.js 中来使用.
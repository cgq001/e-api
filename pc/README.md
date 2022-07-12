# E-API(客户端)
[E-API官网](http://e-api.nodebook.top/#/)
# 1、安装
```bash
npm i # 必须npm 安装，不可以使用cnpm
# 如果启动不了，安装一下插件
yarn add vue-cli-plugin-electron-builder -D --tilde
```
# 一、启动项目：
### 1、启动网页版
```bash
npm run serve
```
### 2、启动客户端版
```bash
npm run electron:serve
```
# 二、启动和私有化部署说明：
### 1、环境变量（启动和打包参数配置）
```
VUE_APP_publicPath='http://127.0.0.1:7001' // 部署API地址
VUE_APP_Electron=1  // 1是客户端  0 是插件
```
### 2、插件
将打包好的文件放在一下目录中
```bash
根目录\e-api\e-api
```
> 启动白屏？请仔细按照第一、二步骤操作 

# Morkdown笔记系统 ——前端
[后端链接](https://github.com/edpeg/mdnote_java.git)

## Morkdown笔记系统简介
* 类似有道云笔记的一个Markdown格式笔记系统，使用前后端分离设计。
* 支持图片的本地上传与七牛云上传两种方式
* 支持笔记关键字搜索与高亮展示

## 预览图
![登录页面](readme\login.png)
![笔记页面](readme\note.png)

## 编译部署
### 安装依赖
```bash
npm install
```
### 本地调试运行
```bash
npm run dev
```
### 打包
```bash
npm run build
```

## 依赖项
* Vue3
* Vue Router
* Mavon-Editor
* Element-Plus
* LogLevel
* unplugin-icons 
* unplugin-auto-import
* js-md5

## 代码模块
```bash
./src
├── App.vue
├── assets
│   └── image // 图片资源 
├── components
│   ├── note // 笔记检索及高亮
│   └── user // 用户注册及登录
├── main.js
├── router.js // 路由配置
└── utils // fetch请求封装，异常类，时间类等常用组件
```
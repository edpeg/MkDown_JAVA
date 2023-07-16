import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { router } from './router'

// 请求过滤
import * as fetch from './utils/fetch.js'
import { log } from './utils/log.js'
import * as toast from './utils/toast.js'
import * as backendAPI from './utils/backendAPI.js'

const app = createApp(App).use(router)
// 配置全局js的全局引用
// 引入请求封装
app.config.globalProperties.$fetch = fetch;
// 添加日志
app.config.globalProperties.$log = log;
// 警告提示
app.config.globalProperties.$toast = toast;
// 后端api接口
app.config.globalProperties.$backendAPI = backendAPI;

app.use(ElementPlus)
app.mount('#app')

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

<script>
import { log } from './utils/log.js'
import * as timeutil from './utils/time.js'

export default {
  name: "App",
  created() {

    this.$router.beforeEach(async (to, from) => {
      const userName = localStorage.getItem("userName");
      log.debug(userName)
      // 原地刷新登录页
      if (userName != null && to.name == "login") {
        log.debug("原地刷新登录页")
        return {
          name: "note"
        }
      }

      // 注册页
      if (to.name == "register") {
        if (userName == null) {
          log.debug("注册页允许跳转")
          return true
        } else {
          return {
            name: "note"
          }
        }
      }

      // 未登录状态禁止跳转
      if (userName == null && to.name != "login") {
        log.debug("App 未登录拦截")
        const redirect = to.fullPath
        log.info(timeutil.now() + ':用户未登录，跳转登录页  ')
        return {
          path: '/passport/login',
          query: {
            // 获取当前url链接
            redirect: redirect
          }
        }
        // return false
      }

      // 允许登录状态的跳转
      return true
    })
  }
};
</script>

<template>
  <div style="height: 100%; width: 100%;">
    <router-view></router-view>
  </div>
</template>

<style>
html,body,#app {height: 100%;}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

body {
  margin: 0;
  padding: 0;
  border: 0
}
</style>
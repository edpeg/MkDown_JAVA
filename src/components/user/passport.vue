<script>
import { BackEndCode } from '../../utils/MkdownNoteErrro.js'
import { gotoNext } from '../../utils/passport.js'

export default {
  async mounted() {
    // 获取用户未登录前访问的最后一个页面，用户登录后直接跳转至此页面
    // 清空sessionStorage缓存数据
    sessionStorage.clear()
    // 清空localStorage缓存数据
    localStorage.clear()

    // 判断用户是否已经登录
    const result = await this.$fetch.diyFetchCheckStatus(this.$backendAPI.api.passport_isLogin, 'GET', '')
    if (result.code != BackEndCode.SUCCESS) {
      return
    }
    gotoNext(this);
  }
}
</script>

<template>
  <div id='building'>
    <div id="passport">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
#building {
  background: url("../../assets/image/notebook.svg");
  width: 100%;
  height: 100%;
  background-position: left;
  background-color: #2f2035;
  background-repeat: no-repeat;
  position: fixed;
  background-size: auto 100%;
}
</style>

<style>
.box-card {
  margin: auto auto;
  width: 400px;
  background-color: white;
  border-style: none;
  opacity: 85%;

  float: right;
  margin-top: 15%;
  margin-right: 15%;
}
</style>
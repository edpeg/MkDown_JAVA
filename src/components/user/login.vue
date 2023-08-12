<script>
import { md5Passowrd } from "../../utils/md5Parameter.js";
import { gotoNext } from "../../utils/passport.js";
import { MkdownNoteError, BackEndCode } from "../../utils/MkdownNoteErrro.js";

export default {
  data() {
    return {
      // 登录信息
      loginForm: {
        // 账户名
        userName: "",
        // 账户密码
        password: "",
      },
      rules: {
        userName: [{ required: true, message: "用户名不能为空！", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空！", trigger: "blur" }],
      },
    };
  },
  mounted() {
    //光标锁定
    this.$refs.inputName.focus();

    // 设置默认账户
    this.loginForm.userName = "demo"
    this.loginForm.password = "123456"
  },
  methods: {
    // 登录操作
    async login() {
      // 设置传参格式
      const loginForm = {
        userName: this.loginForm.userName,
        // 对密码进行加盐(加密)处理
        password: md5Passowrd(this.loginForm.password),
      };
      const data = await this.fetchWithoutLogin(
        this.$backendAPI.api.passport_login,
        "POST",
        loginForm
      );
      localStorage.setItem("userName", data.userName);
      gotoNext(this);
      // 显示后端响应的成功信息
      this.$toast.success("登录成功");
    },
    goRegister() {
      this.$router.push({
        path: "/passport/register",
        query: this.$route.query,
      });
    },
    async fetchWithoutLogin(url, method, data) {
      // 发送请求
      const result = await this.$fetch.diyFetchCheckStatus(url, method, data);
      if (result.code != BackEndCode.SUCCESS) {
        if (result.code == BackEndCode.USER_ID_NOT_EXIST) {
          this.$toast.warningWithCode(result.message, result.code);
          throw new MkdownNoteError("用户ID不存在: ", result.code);
        }
        if (result.code == BackEndCode.USER_PASSWORD_FAIL) {
          this.$toast.warningWithCode(result.message, result.code);
          throw new MkdownNoteError("账户密码错误: ", result.code);
        }
        log.error(":未知错误,异常编码为  " + result.code);
        this.$toast.warning("服务器以罢工(太忙了)，请稍后再试");
        throw new MkdownNoteError(result.message, result.code);
      }
      return result.data;
    },
  },
};
</script>

<template>
  <div id="loginForm">
    <el-card class="box-card">
      <h2>Mkdown笔记本</h2>
      <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-position="left" label-width="70px"
        class="loginForm">
        <el-form-item label="用户名" prop="userName" color="black">
          <el-input ref="inputName" placeholder="请输入用户名" v-model="loginForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="loginForm.password" autocomplete="off" show-password
            @keydown.enter="login"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" style="width: 55%; margin-left: 10%" size="large" @click="login">登录</el-button>
        <el-button type="" style="float: right; margin-top: 4%" size="small" @click="goRegister">注册</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.loginForm {
  margin: auto auto;
}
</style>

<style>
label.el-form-item__label {
  color: rgb(0, 0, 0);
  font-weight: 3000;
}
</style>
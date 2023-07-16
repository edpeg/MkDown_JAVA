<script>
import { md5Passowrd } from "../../utils/md5Parameter.js";
import { MkdownNoteError, BackEndCode } from "../../utils/MkdownNoteErrro.js";
import { gotoNext } from "../../utils/passport.js";

export default {
  data() {
    // 密码格式验证
    const validatePass = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        callback(new Error("密码长度限制6-20位"));
        return;
      }
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPass !== "") {
          this.$refs.registerForm.validateField("checkPass");
        }
        callback();
      }
    };
    // 密码格式验证
    const validatePass2 = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        callback(new Error("密码长度限制6-20位"));
        return;
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.passwordVerify) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 用户名格式验证
    const limitUesrName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户名不能为空！"));
      } else {
        if (value.length > 6) {
          callback(new Error("用户名不能超过6个字符"));
        } else {
          callback();
        }
      }
    };
    return {
      // 注册信息
      registerForm: {
        // 账户名
        userName: "",
        // 账户密码
        password: "",
        // 账户确认密码
        passwordVerify: "",
      },
      rules: {
        //格式验证
        userName: [{ required: true, validator: limitUesrName, trigger: "blur" }],
        //格式验证
        passwordVerify: [{ required: true, validator: validatePass, trigger: "blur" }],
        //格式验证
        password: [{ required: true, validator: validatePass2, trigger: "blur" }],
      },
      // 用户未登录状态下访问的最后一个页面
      redirect: null,
    };
  },
  mounted() {
    //光标锁定
    this.$refs.inputName.focus();
    // 获取用户未登录前访问的最后一个页面，用户登录后直接跳转至此页面
    if (this.$route.query.redirect != null) {
      this.redirect = this.$route.query.redirect;
    }
  },
  methods: {
    // 提交注册账号信息表单验证
    submitFormValidate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交注册账号
          this.register();
        } else {
          return false;
        }
      });
    },
    // 提交注册账号
    async register() {
      // 设置传参格式
      const loginForm = {
        userName: this.registerForm.userName,
        // 对密码进行加盐(加密)处理
        password: md5Passowrd(this.registerForm.passwordVerify),
      };
      try {
        const response = await fetch(this.$backendAPI.api.passport_register, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginForm),
        });
        if (!response?.ok) {
          this.$toast.warning("服务器忙碌，请稍后重试")
          throw new MkdownNoteError("服务器异常: ", response.status);
        }
        // 获取回传信息,将内容转换为json格式
        const result = await response.json();
        const data = result.data;
        // 判断业务是否正常
        if (result.code != BackEndCode.SUCCESS) {
          // 当响应的编码不为 0 时，说明登录失败
          // 显示后端响应的失败信息
          this.$toast.warning(result.message)
          this.$log.warn(":注册失败,异常编码为  " + result.code);
        }

        // 显示后端响应的成功信息
        this.$toast.success(result.message)
        localStorage.setItem("userName", data.userName);
        // 跳转页面到首页
        gotoNext(this);
      } catch (err) {
        this.$toast.warning(err.error)
        this.$log.error(err);
        throw err;
      }
    },
    // 返回登录页
    goLogin() {
      this.$router.push({
        path: "/passport/login",
        query: this.$route.query,
      });
    },
  },
};
</script>

<template>
  <div id="building">
    <el-card class="box-card">
      <h2>注册账户</h2>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm" label-position="left"
        label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input placeholder="请输入用户名" v-model="registerForm.userName" ref="inputName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwordVerify">
          <el-input placeholder="请输入密码" type="password" v-model="registerForm.passwordVerify" autocomplete="off"
            show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="registerForm.password" autocomplete="off" show-password
            @keydown.enter="submitFormValidate('registerForm')"></el-input>
        </el-form-item>
      </el-form>
      <div class="btnGroup">
        <el-button type="primary" style="width: 200px; margin-left: 16%" size="large"
          @click="submitFormValidate('registerForm')">注册</el-button>
        <el-button style="float: right; margin-top: 4%; font-size: 12px" size="small" @click="goLogin">登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-from {
  margin: auto auto;
}

a {
  color: #4f1b7e;
  text-decoration: underline;
}
</style>

<style>
label.el-form-item__label {
  color: rgb(0, 0, 0);
  font-weight: 3000;
}
</style>

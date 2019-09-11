<template>
  <div id="login">
    <div class="box">
      <el-form :label-position="labelPosition" label-width="50px">
        <h3>影院售票管理系统</h3>
        <el-form-item label="用户">
          <el-input v-model="adminName" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" size="medium" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../../api";
import Vue from "vue";
import { Input, Button, Message, Form, FormItem } from "element-ui";
Vue.use(Input);
Vue.use(Button);
export default {
  name: "Login",
  data() {
    return {
      labelPosition: "right",
      adminName: "",
      password: ""
    };
  },
  methods: {
    reset() {
      this.adminName = "";
      this.password = "";
    },
    async login() {
      if (!this.adminName) {
        Message.error("请输入用户名！");
      } else if (!this.password) {
        Message.error("请输入密码！");
      } else {
        let json = await login(this.adminName, this.password);
        if (json.success_code === 200) {
          this.$router.push({ path: "/home" });
          Message.success("登录成功!");
        } else {
          Message.error(json.message);
        }
      }
    }
  }
};
</script>

<style>
#login {
  width: 100%;
  height: 100%;
  background: url('./images/bg_admin.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: #fff;
}
.box {
  width: 500px;
  height: 400px;
  background-color: rgba(255, 255, 255, .8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  border-radius: 4px;
  box-shadow: 0 0 8px 8px #ccc;
}
h3 {
  margin-bottom: 40px;
  font-size: 36px;
  letter-spacing: 2px;
  color: #888;
  text-align: center
}
</style>

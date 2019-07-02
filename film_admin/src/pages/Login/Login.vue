<template>
    <div id="login">
      <div class="box">
        <h3>影院售票管理系统</h3>
        <el-input v-model="adminName" clearable placeholder="请输入用户名" style="width: 260px;margin-bottom: 20px"></el-input>
        <el-input placeholder="请输入密码" v-model="password" show-password style="width: 260px;margin-bottom: 20px"></el-input>
        <div>
          <el-button size="medium" @click="reset">重置</el-button>
          <el-button type="primary" size="medium" @click="login">登录</el-button>
        </div>
      </div>
    </div>
</template>

<script>
    import {login} from "../../api";
    import Vue from 'vue'
    import {Input,Button,Message} from 'element-ui'
    Vue.use(Input);
    Vue.use(Button);
    export default {
        name: "Login",
        data(){
          return{
            adminName:'',
            password:'',
          }
        },
        methods:{
          reset(){
            this.adminName = '';
            this.password = '';
          },
          async login(){
            if (!this.adminName){
              Message.error('请输入用户名！');
            } else if(!this.password){
              Message.error('请输入密码！');
            } else {
              let json = await login(this.adminName,this.password);
              if (json.success_code===200){
                this.$router.push({path:'/home'});
                Message.success('登录成功!');
              } else{
                Message.error(json.message);
              }
            }
          }
        }
    }
</script>

<style>
  #login{
    width:100%;
    height:100%;
    background:#304156;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    color: #fff;
  }
  .box{
    width: 550px;
    height: 400px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    border-radius: 5px;
  }
  h3{
    margin-bottom: 40px;
    font-size: 36px;
    letter-spacing: 8px;
    color: #304156;
  }
</style>

<template>
    <div id="login">
      <div class="top">
        <span class="icon-close" @click="$router.go(-1)"></span>
      </div>
      <div class="login-container">
        <div class="login-header logo">
          <span class="icon icon-film-logo"></span>
          <p class="title">淘气电影</p>
          <i class="eng-title">Monkey Movie</i>
        </div>
        <div class="login-content">
          <div class="login-type">
            <span :class="{active:loginType}" @click="changeLoginType">验证码登录</span>
            <span :class="{active:!loginType}" @click="changeLoginType">密码登录</span>
          </div>
          <div class="login-main">
            <form>
              <!--手机验证码登录部分-->
              <div v-show="loginType " class="login-phone">
                <section class="login-info">
                  <input type="tel" placeholder="手机号" v-model="phone">
                  <button
                    v-if="countDown===0"
                    :class="{phone_right:checkPhone}"
                    @click.prevent="getValidateCode"
                  >
                    获取验证码
                  </button>
                  <button v-else class="phone_right">
                    重新获取({{countDown}}s)
                  </button>
                </section>
                <section class="login-info login-verification">
                  <input type="tel" placeholder="验证码" v-model="phoneCode">
                </section>
                <section class="login-info login-hint">
                  温馨提示：未注册的手机号，验证后将自动注册账户，且代表已同意
                  <a href="javascript:;">《服务协议与隐私政策》</a>
                </section>
              </div>
              <!--账号登录部分-->
              <div v-show="!loginType" class="login-password">
                <section class="login-info">
                  <input type="text" placeholder="用户名" v-model="userName">
                </section>
                <section class="login-info login-verification">
                  <input type="password" placeholder="密码" v-show="!isShowPassword" v-model="password">
                  <input type="text" placeholder="密码" v-show="isShowPassword" v-model="password">
                  <div class="switch-show">
                    <span
                      class="icon-eye-close-fill"
                      v-show="!isShowPassword"
                      @click="changePwdShow"
                    >
                    </span>
                    <span
                      class="icon-eye-open-fill"
                      v-show="isShowPassword"
                      @click="changePwdShow"
                    >
                    </span>
                  </div>
                </section>
                <section class="login-info">
                  <input type="text" placeholder="验证码" v-model="captcha">
                  <img
                    class="captcha"
                    :src="captchaSrc"
                    alt="captcha"
                    @click="refreshCaptcha"
                  >
                </section>
              </div>
              <button
                class="login-submit"
                @click.prevent="login"
              >
                登录
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {getPhoneCode,phoneLogin,pwdLogin} from '../../api/index'
    import {Toast,MessageBox} from 'mint-ui'
    export default {
        name: "Login",
        data(){
          return{
            phone:'',//手机号码
            phoneCode:'',//手机验证码
            userName:'',//用户名
            password:'',//密码
            captcha:'',//图形验证码
            loginType:true,//登录方式
            countDown:0, //倒计时
            isShowPassword:false,//密码显示方式
            captchaSrc:'http://localhost:3000/api/captcha',
          }
        },
        methods:{
          //选择登录类型
          changeLoginType(){
            this.loginType = !this.loginType
          },
          //选择密码显示方式
          changePwdShow(){
            this.isShowPassword = !this.isShowPassword
          },
          //获取验证码
          async getValidateCode(){
            if (this.checkPhone) {
              this.countDown = 60;
              let timer = setInterval(()=>{
                this.countDown--;
                if (this.countDown===0) {
                  clearInterval(timer);
                }
              },1000);
              let json = await getPhoneCode(this.phone);
              if(json.success_code===200){ //获取手机验证码成功
                MessageBox.alert('手机验证码为：'+json.data);
              }else{ //获取手机验证码失败
                MessageBox.alert('获取手机验证码失败');
                clearInterval(timer);
                this.countdown = 0;
              }
            }
          },
          //刷新图形验证码
          refreshCaptcha(){
            this.captchaSrc = 'http://localhost:3000/api/captcha?time='+new Date();
          },
          //登录
          async login(){
            //判断登录模式
            if (this.loginType){
              //手机登录
              if (this.phone===''){
                MessageBox.alert('请输入手机号码');
              }else if(!this.checkPhone){
                MessageBox.alert('请输入正确的手机号码');
              }else if(this.phoneCode===''){
                MessageBox.alert('请输入手机验证码');
              }else{
                let json = await phoneLogin(this.phone,this.phoneCode);
                if (json.success_code===200){
                  Toast({
                    message: '登录成功',
                    position: 'middle',
                    duration: 2000
                  });
                  this.$router.go(-1);
                } else{
                  MessageBox.alert(json.message);
                }
              }
            } else{
              //账号密码登录
              if (this.userName===''){
                MessageBox.alert('请输入用户名')
              } else if(this.password===''){
                MessageBox.alert('请输入密码')
              } else if (this.captcha===''){
                MessageBox.alert('请输入验证码')
              } else{
                let json = await pwdLogin(this.userName,this.password,this.captcha);
                if (json.success_code===200){
                  Toast({
                    message: '登录成功',
                    position: 'middle',
                    duration: 2000
                  });
                  this.$router.go(-1);
                } else{
                  MessageBox.alert(json.message);
                  this.refreshCaptcha();
                }
              }
            }
          }
        },
        computed:{
          //检查手机格式
          checkPhone(){
            return /^1[3|4|5|6|7|8][0-9]{9}$/.test(this.phone);
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #login
    width 100%
    height 100%
    color #000
    font-size .3125rem
    .top
      width 100%
      height 1rem
      display flex
      justify-content center
      align-items center
      position fixed
      top 0
      left 0
      color #dd2727
      .icon-close
        font-size .6rem
        position absolute
        left .3rem
      .name
        width 60%
    .login-container
      margin-top 1.2rem
      display flex
      justify-content center
      align-items center
      flex-flow column
      .login-header
        display flex
        flex-flow column
        justify-content center
        align-items center
        margin-bottom .2rem
        .icon
          font-size 2rem
        .title , .eng-title
          font-size .3125rem
          font-weight bolder
          text-align center
          color #dd2727
        .title
          text-indent .2rem
          letter-spacing .14rem
          margin-bottom .04rem
        .eng-title
          letter-spacing .02rem
          font-size .21rem
      .login-content
        width 100%
        background-color #fff
        .login-type
          width 100%
          font-size .25rem
          font-weight 700
          display flex
          justify-content center
          align-items center
          margin-bottom .25rem
          span
            margin .25rem
            padding-bottom .25rem
            box-sizing border-box
          .active
            color #dd2727
            border-bottom .04rem solid #dd2727
        .login-main
          width 100%
          display flex
          justify-content center
          align-items center
          form
            width 100%
            .login-phone,.login-password
              display flex
              justify-content center
              align-items center
              flex-flow column
              .login-info
                position relative
                margin-bottom .25rem
                width 70%
                input
                  width 100%
                  height .8rem
                  padding-left .2rem
                  box-sizing border-box
                  border .02rem solid #888
                  border-radius .12rem
                  outline 0
                  &:focus
                    border: 0.02rem solid #dd2727;
              .login-info > button
                position absolute
                top 50%
                right .2rem
                height 80%
                transform translateY(-50%)
                border 0
                color #ccc
                font-size .25rem
                background transparent
                outline none
                &.phone_right
                  color #e02e24
              .login-info > .switch-show , .login-info > .captcha
                position absolute
                top 50%
                right .2rem
                transform translateY(-50%)
              .login-info > .captcha
                height 68%
              .login-hint
                color #888
                font-size .24rem
                line-height 20px
                > a
                  color #dd2727
            .login-submit
              display block
              width 70%
              height .8rem
              margin .16rem auto
              border-radius .12rem
              background #dd2727
              color #fff
              text-align center
              font-size .3125rem
              line-height .8rem
              border 0
</style>

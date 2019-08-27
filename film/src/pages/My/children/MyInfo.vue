<template>
    <div id="my-info">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">我的资料</span>
      </div>
      <div class="info-container">
        <div class="list">
          <div class="item">头像 <div class="right">
            <img :src="avatar" alt="" style="width: 1rem;height: 1rem;border-radius: 50%"><i class="icon-more"></i></div></div>
          <div class="item" @click.prevent="$router.push({name:'modify_username',params:{userName:userName}})">
            <span>昵称</span>
            <span class="right">{{userName?userName:'未填写'}}<i class="icon-more"></i></span>
          </div>
          <div class="item" @click.prevent="showSexPanel=true">
            <span>性别</span>
            <span class="right">{{userSex?userSex:'未填写'}}<i class="icon-more"></i></span>
          </div>
          <div class="item" @click="showDatePicker=true">
            <span>生日</span>
            <span class="right">{{birthday}}<i class="icon-more"></i></span>
          </div>
          <div class="item sign" @click.prevent="$router.push({name:'modify_usersign',params:{sign:sign}})">
            <span>个人签名</span>
            <span class="right"><span class="ellipsis sign">{{sign?sign:'未填写'}}</span><i class="icon-more"></i></span>
          </div>
        </div>
        <div
          class="logout"
        ><span class="logout-btn" @click="logout()">退出</span></div>
      </div>
      <div class="modify_sex" v-show="showSexPanel" @click="showSexPanel=false">
        <div class="container" @click.stop="">
          <div class="content">
            <div class="title">修改性别</div>
            <div class="item" @click="modifyUserSex('男')"><i class="icon-male"></i>男</div>
            <div class="item" @click="modifyUserSex('女')"><i class="icon-female"></i>女</div>
          </div>
        </div>
      </div>
      <date-picker
        :show-picker-model = "showDatePicker"
        :default-date = "new Date(birthday)"
        @cancel = "handleCancel"
        @confirm = "handleConfirm"
      />
    </div>
</template>

<script>
    import Vue from 'vue'
<<<<<<< HEAD
    import {Actionsheet,DatetimePicker,MessageBox,Indicator} from 'mint-ui';
=======
    import {DatetimePicker,MessageBox,Indicator} from 'mint-ui';
>>>>>>> develop
    import moment from 'moment'
    import {Input} from 'element-ui'
    import DatePicker from '../../../components/DatePicker/DatePicker' //引入日期选择器组件
    Vue.use(Input);
    Vue.component(DatetimePicker.name, DatetimePicker);
    import {getUserInfo,updateUserInfo,updateUserSex,updateUserBirthday} from '../../../api/index'
    export default {
        name: "MyInfo",
        components:{
          DatePicker //注册日期选择器组件
        },
        data(){
          return{
            userName:'',
            userPwd:'',
            userSex:'',
            avatar:'',
            avatarSrc:'',
            birthday:'',
            sign:'',
            jsonData:{},
            showDatePicker:false,
            showSexPanel:false,
          }
        },
        created(){
          Indicator.open('Loading...');
          this.loadUserInfo();
        },
        methods:{
          //更新用户信息
          updateUserInfo(){
            if (this.jsonData){
              this.avatarSrc = this.jsonData.avatar
              this.avatar = 'http://localhost:3000'+ this.avatarSrc;
              this.jsonData.user_name?this.userName=this.jsonData.user_name:this.userName='';
              this.jsonData.password?this.userPwd=this.jsonData.password:this.userPwd='';
              this.jsonData.sex?this.userSex=this.jsonData.sex:this.userSex='';
              this.jsonData.birthday?this.birthday=this.jsonData.birthday:this.birthday='';
              this.jsonData.sign?this.sign=this.jsonData.sign:this.sign='';
            }
          },
          async modifyUserSex(sex){
            if (this.$cookies.get('user_id')&&sex){
              let json = await updateUserSex(this.$cookies.get('user_id'),sex);
              if (json.success_code==200){
                this.showSexPanel = false;
                this.userSex = sex;
              }
            }
          },
          //加载用户信息
          async loadUserInfo(){
            if (this.$cookies.get('user_id')) {
              let json = await getUserInfo(this.$cookies.get('user_id'));
              if (json.success_code===200) {
                this.jsonData = json.data;
                this.updateUserInfo();
              } else {
                this.jsonData = {};
              }
            } else{
              this.jsonData = {};
            }
            Indicator.close();
          },
          //取消按钮
          handleCancel(){
            this.showDatePicker = false;
          },
          //确定按钮
          async handleConfirm(selectedDate){
            if (this.$cookies.get('user_id')&&selectedDate){
              let json = await updateUserBirthday(this.$cookies.get('user_id'),selectedDate);
              if (json.success_code==200){
                this.showDatePicker = false;
                this.birthday = selectedDate;
              }
            }
          },
          disableDate(item){
            if(new Date(item)-new Date('1900-10-10')>=0&&new Date('1990-10-10')-new Date(item)>=0){
              return true;
            }
          },
          //修改用户名
          changeUserName(){
            MessageBox.prompt('修改用户名').then(({ value, action }) => {
              if (value){
                this.userName = value;
              }
            });
          },
          //修改密码
          changeUserPwd(){
            MessageBox.prompt('修改密码(1-6位)').then(({ value, action }) => {
              if (value&&/^[\w_-]{1,6}$/.test(value)){
                this.userPwd = value;
              } else {
                MessageBox.alert('请输入1到6位密码！');
              }
            });
          },
          //退出登录
          logout(){
            if (this.$cookies.get('user_id')){
              this.$cookies.remove('user_id');
              this.$router.push('my');
            }
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #my-info
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
      background-color #dd2727
      color #fff
      .icon-back
        font-size .4rem
        position absolute
        left .3rem
      .name
        width 60%
        font-size .345rem
        text-align center
      .save-btn
        position absolute
        right .3rem
    .info-container
      font-size .3125rem
      position fixed
      top 1rem
      left 0
      bottom 0
      width 100%
      background-color: #f1f1f1;
      .list
        background-color #fff
        margin-top .4rem
        /deep/ .item
          display flex
          justify-content space-between
          align-items center
<<<<<<< HEAD
          padding .36rem
          border-bottom .02rem solid #f1f1f1
          &:last-child
            padding-top 0
          .el-textarea
            font-size .3125rem
            border none
            outline none
            textarea
              padding 0
              border none
              outline none
=======
          padding .3rem .36rem
          border-bottom .02rem solid #f1f1f1
>>>>>>> develop
          .right
            display flex
            justify-content flex-end
            align-items center
            color #888
            width 60%
            .sign
              display inline-block
              width 100%
              text-align right
      .logout
        position fixed
        bottom 0
        width 100%
        left 0
        line-height .8rem
        text-align center
        display flex
        justify-content center
        align-items center
        padding .25rem
        box-sizing border-box
        .logout-btn
          width 100%
          height 100%
          background-color #dd2727
          color #fff
          border-radius .1rem
    .modify_sex
      position fixed
      left 0
      top 0
      bottom 0
      width 100%
      height 100%
      background-color rgba(0,0,0,.5)
      display flex
      justify-content center
      align-items center
      z-index 2040
      .container
        position fixed
        width 5rem
        height 3rem
        background-color #fff
        display flex
        justify-content center
        align-items center
        border-radius .08rem
        z-index 2041
        .content
          width 80%
          .title
            font-size .345rem
            font-weight 700
            margin-bottom .6rem
          .item
            margin-bottom .2rem
            height .6rem
            display flex
            align-items center
            i
              font-size .375rem
              margin-right .24rem
</style>

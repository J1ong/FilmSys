<template>
    <div id="my-info">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">我的资料</span>
        <span class="save-btn" @click.prevent=saveUserInfo()>保存</span>
      </div>
      <div class="info-container">
        <div class="list">
          <div class="item">头像 <div class="right"><img :src="avatar" alt="" width="100%" height="100%"></div></div>
          <div class="item" @click.prevent="changeUserName">
            <span>昵称</span>
            <span>{{userName?userName:'未填写'}}</span>
          </div>
          <div class="item" @click.prevent="changeUserPwd">
            <span>密码</span>
            <span>{{userPwd}}</span>
          </div>
          <div class="item" @click.prevent="sheetVisible=true">
            <span>性别</span>
            <span>{{userSex?userSex:'未填写'}}</span>
          </div>
          <div class="item" @click.prevent="$refs.datePicker.open();">
            <span>生日</span>
            <span>{{birthday?birthday:'未填写'}}</span>
          </div>
          <div class="item sign">
            <span>个人签名</span>
          </div>
          <div class="item sign">
            <el-input
              type="textarea"
              v-model="sign"
              :rows="6"
              placeholder="同学有点懒，还没有写签名"
            >
            </el-input>
          </div>
        </div>
        <div
          class="logout"
        ><span class="logout-btn" @click="logout()">退出</span></div>
      </div>
      <mt-actionsheet
        :actions="actions"
        v-model="sheetVisible">
      </mt-actionsheet>
      <mt-datetime-picker
        ref="datePicker"
        v-model="pickerVisible"
        type="date"
        :start-date=this.startDate
        :end-date=this.endDate
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="handleBirthday"
      >
      </mt-datetime-picker>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Actionsheet,DatetimePicker,MessageBox} from 'mint-ui';
    import moment from 'moment'
    import {Input} from 'element-ui'
    Vue.use(Input);
    Vue.component(Actionsheet.name, Actionsheet);
    Vue.component(DatetimePicker.name, DatetimePicker);
    import {getUserInfo,updateUserInfo} from '../../../api/index'
    export default {
        name: "MyInfo",
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

            //选择性别
            actions:[
              {name:'男',method:this.selectSex},
              {name:'女',method:this.selectSex}
            ],
            sheetVisible:false,
            //选择日期
            pickerVisible:new Date('1990-06-16'),
            startDate:new Date('1900-01-01'),
            endDate:new Date()
          }
        },
        created(){
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
          },
          //保存用户信息
          async saveUserInfo(){
            if (this.$cookies.get('user_id')){
              let json = await updateUserInfo(this.$cookies.get('user_id'),this.userName,this.avatarSrc,this.userPwd,this.userSex,this.sign,this.birthday);
              if (json.success_code===200){
                MessageBox.alert('保存成功');
              } else if (json.error_code===1) {
                MessageBox.alert(json.message);
              }
            }
          },
          //选择性别
          selectSex(props){
            this.userSex = props.name;
          },
          //选择日期
          //选择日期
          handleBirthday(props){
            this.birthday = moment(props).format('YYYY-MM-DD');
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
      .list
        background-color #fff
        /deep/ .item
          display flex
          justify-content space-between
          align-items center
          padding .3rem
          border-bottom .04rem solid #f1f1f1
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
          .right
            width 1.2rem
            height 1.2rem
            display flex
            justify-content flex-end
            align-items center
            border-radius 50%
            overflow hidden
        .sign
          border-bottom 0
      .logout
        position fixed
        bottom 0
        width 100%
        height .8rem
        left 0
        line-height .8rem
        text-align center
        display flex
        justify-content center
        align-items center
        .logout-btn
          width 100%
          height 100%
          background-color #dd2727
          color #fff
          border-radius .1rem
</style>

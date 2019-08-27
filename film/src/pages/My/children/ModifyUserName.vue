<template>
    <div id="modify_username">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">修改昵称</span>
        <span class="sure-btn" @click="modifyUserName">确定</span>
      </div>
      <div class="container">
        <el-input
          class="input"
          placeholder="4-12个字符支持中英文、数字"
          v-model="input"
          spellcheck="false"
          clearable>
        </el-input>
        <p>添加昵称，获得更多关注</p>
      </div>
    </div>
</template>

<script>
    import {Input} from 'element-ui'
    import {Toast} from 'mint-ui'
    import {updateUserName} from '../../../api/index'
    export default {
        name: "ModifyUserName",
        components:{
          Input
        },
        data(){
          return{
            input:null
          }
        },
        created() {
              this.input = this.$route.params.userName;
            },
        methods:{
          async modifyUserName(){
            if (!this.input){
              Toast({
                message: '用户名不能为空！',
                position: 'bottom',
                duration: 2000
              });
              return;
            }else if (!(/^[a-zA-Z\u4e00-\u9fa5][0-9a-zA-Z\u4e00-\u9fa5]*$/.test(this.input))) {
              Toast({
                message: '用户名应为中文或字母开头！',
                position: 'bottom',
                duration: 2000
              });
              return;
            }else if (!(/^[a-zA-Z\u4e00-\u9fa5]{1}[0-9a-zA-Z\u4e00-\u9fa5]{3,11}$/.test(this.input))) {
              Toast({
                message: '用户名应为4到12个字符！',
                position: 'bottom',
                duration: 2000
              });
              return;
            } else{
              if(this.$cookies.get('user_id')){
                let json = await updateUserName(this.$cookies.get('user_id'),this.input);
                if(json.success_code==200){
                  this.$router.go(-1);
                }
              }
            }
          },
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #modify_username
    width 100%
    height 100%
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
      .sure-btn
        position absolute
        right .3rem
        font-size .3125rem
    .container
      font-size .3125rem
      position fixed
      top 1rem
      left 0
      bottom 0
      width 100%
      background-color: #f1f1f1;
      /deep/ .el-input
        margin-top .4rem
        input
          border none
          outline none
          font-size .3125rem
      p
        font-size .24rem
        color #888
        margin .2rem
</style>

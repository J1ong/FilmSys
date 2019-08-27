<template>
  <div id="modify_usersign">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">修改签名</span>
      <span class="sure-btn" @click="modifyUserSign">确定</span>
    </div>
    <div class="container">
      <el-input
        class="input"
        placeholder="20个字以内"
        v-model="input"
        spellcheck="false"
        clearable>
      </el-input>
      <p>添加签名，了解有趣的你</p>
    </div>
  </div>
</template>

<script>
    import {Input} from 'element-ui'
    import {updateUserSign} from '../../../api/index'
    export default {
        name: "ModifyUserSign",
        components:{
          Input
        },
        data(){
          return{
            input:null
          }
        },
      created() {
        this.input = this.$route.params.sign;
      },
      watch: {
        input: {
          handler(newSign,oldSign) {
            if (newSign&&newSign.length>20){
              this.input = oldSign;
            }
          },
          immediate: true
        },

      },
      methods:{
        async modifyUserSign(){
          if(this.$cookies.get('user_id')){
            let json = await updateUserSign(this.$cookies.get('user_id'),this.input);
            if (json.success_code==200){
              this.$router.go(-1);
            }
          }
        }
      }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #modify_usersign
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

<template>
    <div id="comment-panel">
      <div class="top">
        <span class="icon-close" @click="$router.go(-1)"></span>
        <span class="title">看过</span>
        <span class="btn" @click="commentBtnHandle">发布</span>
      </div>
      <div class="mark">
        <span class="score"><span class="number">{{score}}</span>分</span>
        <span class="text">{{handleScoreText}}</span>
        <el-rate
          v-model="starValue"
          allow-half
          @change="changeScore"
        />
      </div>
      <textarea class="comment-text" placeholder="好看吗？快来写下你的感受吧!" v-model="textarea">
      </textarea>
    </div>
</template>

<script>
    import {getUserComment,updateUserComment} from '../../../api/index'
    import moment from 'moment'
    import Vue from 'vue'
    import {Rate} from 'element-ui'
    Vue.use(Rate);
    import {Toast,MessageBox} from 'mint-ui'
    export default {
        name: "CommentPanel",
        data(){
          return{
            textarea:'',
            score:0,
            starValue:0,
          }
        },
        created(){
          this.loadUserComment();
        },
        methods:{
          //改变分数
          changeScore(score){
            this.score = score*2;
          },
          //获取用户评论
          async loadUserComment(){
            let json = await getUserComment(this.$cookies.get('user_id'),this.$route.query.movie_id);
            if (json.success_code===200){
              this.starValue = json.data.user_score*0.5;
              this.score = json.data.user_score;
              this.textarea = json.data.comment_content;
            }
          },
          async commentBtnHandle(){
            if (this.textarea){
              let commentDate = moment().format('YYYY-MM-DD HH:mm:ss');
              let json = await updateUserComment(this.$cookies.get('user_id'),this.$route.query.movie_id,this.score,this.textarea,commentDate);
              if (json.success_code===200){
                MessageBox.alert('评论成功，待管理员审核！').then(action => {
                  this.$router.go(-1);
                });
              }
            } else{
              Toast({
                message: '请输入评论内容',
                position: 'bottom',
                duration: 2000
              });
            }
          }
        },
        computed:{
          //处理分数文本
          handleScoreText(){
            if (this.score===1||this.score===2){
              return '超烂啊'
            } else if(this.score===3||this.score===4){
              return '比较差'
            } else if(this.score===5||this.score===6){
              return '一般般'
            } else if(this.score===7||this.score===8){
              return '还不错'
            } else if(this.score===9||this.score===10){
              return '棒极了'
            }
          },
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #comment-panel
    width 100%
    background-color #fff
    font-size .3125rem
    .top
      display flex
      justify-content center
      align-items center
      height 1rem
      background-color #f9f9f9
      position relative
      .icon-close
        position absolute
        left 0
        font-size .6rem
        color #888
        padding .25rem
        font-weight lighter
      .title
        font-size .3rem
        letter-spacing .04rem
      .btn
        position absolute
        right .25rem
        padding .16rem .24rem
        background-color #dd2727
        color white
        border-radius .1rem
        font-size .25rem
    /deep/ .mark
      width 100%
      height 100%
      padding .25rem
      padding-bottom .5rem
      box-sizing border-box
      display flex
      flex-flow column
      justify-content center
      align-items center
      font-size .25rem
      border-bottom 0.0125rem solid #f1f1f1
      .score
        color #ffb400
        padding .25rem
        .number
          font-size .8rem
      .text
        margin-bottom .3rem
        color #888
      .el-rate
        display flex
        justify-content center
        align-items center
        i
          font-size .8rem
    .comment-text
      font-size .3125rem
      line-height .4rem
      padding .4rem
      text-align justify
      width 100%
      height 6rem
      box-sizing border-box
      border none
      outline none
      resize none
</style>

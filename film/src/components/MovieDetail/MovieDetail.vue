<template>
    <div id="movie-detail">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name">{{jsonData.name}}</span>
      </div>
      <div class="info">
        <img :src="server+jsonData.poster" alt="">
        <div class="describe">
          <div class="name">{{jsonData.name}}</div>
          <div class="small type">类型：{{jsonData.type}}</div>
          <div class="small ellipsis">主演：{{jsonData.actor}}</div>
          <div class="small play-time">片长：{{jsonData.movie_long}}</div>
          <div class="small show-time">上映：{{jsonData.public_date}}上映</div>
        </div>
      </div>
      <div class="action">
        <div class="btn" :class="{'active':!notWishMovie}" @click="wishBtnHandle"><span class="icon-like-fill"></span><span>想看</span></div>
        <div class="btn" @click="watchedBtnHandle"><span class="icon-star-fill"></span><span>看过</span></div>
      </div>
      <div class="public-praise">
        <div class="header">
          <div class="title">口碑</div>
          <div class="wish" v-if="isShowMovie">
            <span v-if="jsonData.wish_num">{{jsonData.wish_num}}人想看</span>
            <span v-else>暂无想看</span>
          </div>
        </div>
          <div class="mark" v-if="isShowMovie">
            <div class="left">
              <el-rate
                v-model="starValue"
                allow-half
                :disabled="true"
              />
            </div>
            <div class="right">
              <div class="score">{{this.averageScore?this.averageScore:0}}<span class="small">分</span></div>
              <div class="score-people">{{commentNum?commentNum:'暂无'}}人评</div>
            </div>
          </div>
          <div class="wish" v-else>
            <span class="wish-number"><span v-if="jsonData.wish_num" style="font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;font-size: .6rem">{{jsonData.wish_num}}</span><span v-else>暂无</span></span>人想看
          </div>
      </div>
      <div class="intro">
        <div class="title">简介</div>
        <div class="content">
          {{jsonData.intro}}
        </div>
      </div>
      <div class="comment">
        <div class="header">
          <span class="title">评论</span><span class="join" @click="watchedBtnHandle">参与评论</span>
        </div>
        <div class="content">
          <div class="comment-container" v-if="currentUserCommentDate.length">
            <span class="title">我的讨论</span>
            <div class="comment-item">
              <div class="left"><img :src="server+currentUserCommentDate[0].avatar" alt=""></div>
              <div class="right">
                <div class="user-name">{{currentUserCommentDate[0].user_name}}</div>
                <div class="scored">给这部作品打了{{currentUserCommentDate[0].user_score}}分</div>
                <div class="comment-content">{{currentUserCommentDate[0].comment_content}}</div>
                <div class="bottom">
                  <span class="comment-date">{{formatCommentDate(currentUserCommentDate[0].comment_date)}}</span>
                  <span class="support" :class="{'active':userIsSupportComment(currentUserCommentDate[0].support_user)}" @click="supportBtnHandle(currentUserCommentDate[0].comment_id)"><span class="icon-support"></span><span class="number">{{currentUserCommentDate[0].support_num}}</span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="comment-container comment-list-container" v-if="otherUserCommentDate.length">
            <span class="title">精选评论</span>
            <div class="comment-item" v-for="(item,index) in otherUserCommentDate" :key="index">
              <div class="left"><img :src="server+item.avatar" alt=""></div>
              <div class="right">
                <div class="user-name">{{item.user_name}}</div>
                <div class="scored">给这部作品打了{{item.user_score}}分</div>
                <div class="comment-content">{{item.comment_content}}</div>
                <div class="bottom">
                  <span class="comment-date">{{formatCommentDate(item.comment_date)}}</span>
                  <span class="support" :class="{'active':userIsSupportComment(item.support_user)}" @click="supportBtnHandle(item.comment_id)"><span class="icon-support"></span><span class="number">{{item.support_num}}</span></span>
                </div>
              </div>
            </div>
          </div>
          <span class="tips" v-if="!currentUserCommentDate.length&&!otherUserCommentDate.length">暂无评论！</span>
        </div>
      </div>
      <div class="buy">
        <div class="btn" @click="$router.push({path:'/select_cinema',query:{movie_id:$route.query.movie_id}})">特惠购票</div>
      </div>
    </div>
</template>

<script>
    import {
      getMovieDetail,
      isWishMovie,
      wishMovie,
      cancelWishMovie,
      getAllUserPassComment,
      getCommentById,
      updateUserSupport
    } from '../../api/index'
    import Vue from 'vue'
    import {Indicator} from 'mint-ui'
    import {Rate} from  'element-ui'
    import moment from 'moment';
import { formatDate } from '../../common/util/util';
    Vue.use(Rate)
    export default {
        name: "MovieDetail",
        data(){
          return{
            starValue:0,
            averageScore:0,
            commentNum:0,
            //服务器地址
            server:'http://localhost:3000',
            jsonData:[],
            isShowMovie:false,
            notWishMovie:true,
            currentUserCommentDate:[],
            otherUserCommentDate:[],
          }
        },
        created(){
          Indicator.open('Loading...');
          this.loadMovieDetail();
        },
        methods:{
          //加载电影详细信息
          async loadMovieDetail(){
            if(this.$route.query.movie_id){
              let json = await getMovieDetail(this.$route.query.movie_id);
              if (json.success_code===200){
                this.jsonData = json.data[0];
                //判断电影是否上映
                new Date()-new Date(this.jsonData.public_date)>=0?this.isShowMovie = true:this.isShowMovie = false;
                if (this.isShowMovie){
                  this.starValue = this.jsonData.score*0.5.toFixed(1);
                }
                if(this.$cookies.get('user_id')){
                  //判断用户是否喜欢该电影
                  let json = await isWishMovie(this.$cookies.get('user_id'),this.$route.query.movie_id);
                  if (json.success_code===200){
                    this.notWishMovie = false;
                  } else{
                    this.notWishMovie = true;
                  }
                  //
                }
                //获取所有用户通过审核的评论
                let commentJson = await getAllUserPassComment(this.$route.query.movie_id);
                if (commentJson.success_code===200&&commentJson.data.length){
                  let currentIndex=-1,sum=0;
                  this.commentNum = commentJson.data.length;
                  commentJson.data.forEach((value,index)=>{
                    if (value.user_id==this.$cookies.get('user_id')){
                      currentIndex = index;
                    }
                    sum+=value.user_score;
                  });
                  this.averageScore = sum/(commentJson.data.length);
                  if (this.averageScore!==0&&this.averageScore!==10){
                    this.averageScore = this.averageScore.toFixed(1);
                  }
                  this.starValue = this.averageScore*0.5;
                  if (currentIndex===-1){
                    this.currentUserCommentDate = [];
                  } else{
                    this.currentUserCommentDate = commentJson.data.splice(currentIndex,1);
                  }
                  this.otherUserCommentDate = commentJson.data;
                  this.otherUserCommentDate.sort((a, b)=>{
                    return b.support_num-a.support_num
                  });
                }
              }
            }
            Indicator.close();
          },
          //想看按钮处理
          async wishBtnHandle(){
            if (this.$cookies.get('user_id')){
              //不想看
              if (this.notWishMovie){
                let json = await wishMovie(this.$cookies.get('user_id'),this.$route.query.movie_id);
                if (json.success_code===200){
                  this.notWishMovie = false;
                  this.loadMovieDetail();
                }
              } else {
                let json = await cancelWishMovie(this.$cookies.get('user_id'),this.$route.query.movie_id);
                if (json.success_code===200){
                  this.notWishMovie = true;
                  this.loadMovieDetail();
                }
              }
            } else{
              this.$router.push('/login');
            }
          },
          //看过按钮处理
          watchedBtnHandle(){
            //用户已登录
            if (this.$cookies.get('user_id')){
              this.$router.push({path:'/comment_panel',query:{movie_id:this.$route.query.movie_id}});
            } else{
              this.$router.push('/login');
            }
          },
          //点赞按钮处理
          async supportBtnHandle(commentId){
            if (this.$cookies.get('user_id')){
              let json = await getCommentById(commentId);
              let supportUser,supportNum;
              //请求成功
              if (json.success_code===200){
                //有点赞数据
                if (json.data.support_user) {
                  supportUser = JSON.parse(json.data.support_user);
                  //当前用户已点赞
                  if (supportUser.indexOf(Number(this.$cookies.get('user_id')))>-1) {
                    //取消点赞
                    supportUser.splice(supportUser.indexOf(Number(this.$cookies.get('user_id'))),1);
                    supportNum = supportUser.length;
                    if (!supportUser.length) {
                      supportUser = undefined;
                    }
                  } else {
                    //点赞
                    supportUser.push(Number(this.$cookies.get('user_id')));
                    supportNum = supportUser.length;
                  }
                } else {
                  //无点赞数据
                  supportUser = [];
                  supportUser.push(Number(this.$cookies.get('user_id')));
                  supportNum = supportUser.length;
                }
                json = await updateUserSupport(commentId,supportNum,JSON.stringify(supportUser));
                if (json.success_code===200){
                  //获取所有用户通过审核的评论
                  let commentJson = await getAllUserPassComment(this.$route.query.movie_id);
                  if (commentJson.success_code===200&&commentJson.data.length){
                    let currentIndex=-1,sum=0;
                    this.commentNum = commentJson.data.length;
                    commentJson.data.forEach((value,index)=>{
                      if (value.user_id==this.$cookies.get('user_id')){
                        currentIndex = index;
                      }
                      sum+=value.user_score;
                    });
                    this.averageScore = sum/(commentJson.data.length);
                    if (this.averageScore!==0&&this.averageScore!==10){
                      this.averageScore = this.averageScore.toFixed(1);
                    }
                    this.starValue = this.averageScore*0.5;
                    console.log(currentIndex);
                    if (currentIndex===-1){
                      this.currentUserCommentDate = [];
                    } else{
                      this.currentUserCommentDate = commentJson.data.splice(currentIndex,1);
                    }
                    this.otherUserCommentDate = commentJson.data;
                    this.otherUserCommentDate.sort((a, b)=>{
                      return b.support_num-a.support_num
                    });
                  }
                }
              }
            } else{
              this.$router.push('/login');
            }
          },
          //判断用户是否点赞
          userIsSupportComment(supportStrArr){
            if (supportStrArr&&JSON.parse(supportStrArr).indexOf(Number(this.$cookies.get('user_id')))>-1) {
              return true;
            } else {
              return false;
            }
          },
          //处理评论日期
          formatCommentDate(date){
            return formatDate(new Date(moment(date).format('YYYY-MM-DD HH:mm:ss')),false);
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #movie-detail
    width 100%
    height 100%
    background linear-gradient(to bottom, #242342 0%,#11182B 100%)
    color #fff
    font-size .3125rem
    .top
      width 100%
      height 1rem
      display flex
      justify-content center
      align-items center
      margin-bottom .2rem
      position fixed
      top 0
      left 0
      background-color #242342
      z-index 999
      .icon-back
       font-size .4rem
       position absolute
       left .3rem
    .info
      width 90%
      padding .2rem
      box-sizing border-box
      height 3rem
      margin 1rem auto 0
      background-color #fff
      display flex
      justify-content space-around
      align-items center
      color #333
      border-radius .2rem
      img
        width 28%
        box-sizing border-box
        border-radius .05rem
      .describe
        width 62%
        .name
          font-size .345rem
          font-weight 700
          margin-bottom .12rem
        .small
          font-size .28rem
          margin-bottom .12rem
    .action
      width 90%
      height 1rem
      margin 0 auto
      background-color #fff
      display flex
      justify-content space-around
      align-items center
      border-radius .2rem
      .btn
        font-size .4rem
        width 36%
        height .6rem
        border-radius .3rem
        background-color #ffb400
        display flex
        justify-content center
        align-items center
        &.active
          background-color #fff1d4
          color #fe9a02
        span:last-child
          font-size .25rem
          margin-left .1rem
    .public-praise
      width 90%
      height auto
      margin .2rem auto
      box-sizing border-box
      padding .25rem
      background-color #3a3a52
      border-radius .2rem
      .header
        display flex
        justify-content space-between
        align-items center
        margin-bottom .25rem
        .title
          font-weight bolder
        .wish
          font-size .25rem
          padding .04rem 0
      /deep/ .mark
        width 100%
        display flex
        justify-content space-between
        align-items flex-start
        .right
          display flex
          flex-direction column
          justify-content center
          align-items center
          .score
            font-size .68rem
            font-weight bolder
            color #ffb400
            margin-bottom .1rem
            .small
              font-size .25rem
          .score-people
            font-size .2rem
            color #ffb400
        .left
          display flex
          justify-content center
          align-items center
          color #ffb400
          i
            font-size .6rem
      .wish
        font-size .4rem
        padding .2rem 0
        vertical-align text-bottom
        line-height .48rem
        letter-spacing .04rem
        .wish-number
          font-size .48rem
          color #ffb400
          font-weight bolder
    .intro
      width 90%
      height auto
      margin .2rem auto
      box-sizing border-box
      padding .25rem
      background-color #3a3a52
      border-radius .2rem
      .title
        font-weight bolder
        color #fff
        margin-bottom .25rem
      .content
        text-align justify
        font-size .28rem
        line-height .4rem
    .comment
      width 100%
      box-sizing border-box
      padding .25rem
      height auto
      margin 0 auto
      background-color #fff
      color #333
      border-top-left-radius .2rem
      border-top-right-radius .2rem
      .header
        display flex
        justify-content space-between
        align-items center
        height 1rem
        .title
          font-weight bolder
          padding .25rem
        .join
          padding .14rem
          background-color #dd2727
          margin-right .25rem
          color #fff
          border-radius .12rem
          font-size .24rem
      .content
        width 100%
        padding .25rem
        padding-bottom 0
        box-sizing border-box
        margin-bottom 1rem
        .comment-container
          width 100%
          .title
            font-weight lighter
            font-size .25rem
            padding-bottom .25rem
          .comment-item
            display flex
            padding-top .25rem
            .left
              width 10%
              height 10%
              border-radius 50%
              overflow hidden
              img
                width 100%
                height 100%
            .right
              margin 0 .25rem .25rem
              font-size .3125rem
              width 100%
              .user-name
                font-size .25rem
                font-weight bolder
                margin-bottom .1rem
              .scored
                font-size .2rem
                font-weight lighter
                margin-bottom .1rem
              .comment-content
                font-size .28rem
                line-height .4rem
                margin-bottom .1rem
                text-align justify
              .bottom
                display flex
                justify-content space-between
                align-items center
                font-size .28rem
                .comment-date
                  font-size .24rem
                .support
                  padding .1rem
                  border 0.01rem solid #ccc
                  border-radius .24rem
                  &.active
                    color #dd2727
                    border 0.01rem solid #dd2727
                  .number
                    font-weight lighter
                    margin-left .1rem
                    font-size .25rem
        .tips
          font-size .25rem
    .buy
      position fixed
      bottom 0
      width 100%
      height 1rem
      background-color #fff
      color #fff
      display flex
      justify-content center
      align-items center
      .btn
        width 90%
        height .8rem
        background-color #dd2727
        display flex
        justify-content center
        align-items center
        border-radius .4rem
        font-weight light
</style>

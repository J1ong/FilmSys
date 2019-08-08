<template>
    <div id="my-movie">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">我的电影</span>
      </div>
      <div class="movie">
        <div class="option">
          <span :class="{active:!isWatched}" @click="isWatched=false;">想看</span>
          <span :class="{active:isWatched}" @click="isWatched=true;">看过</span>
        </div>
        <div v-show="!isWatched" class="want">
          <movie-item :movie-list="wishMovie"></movie-item>
          <div class="tips" v-if="wishMovie.length===0">
            <span class="icon icon-empty-content"></span>
            <span class="text">暂时木有内容呀</span>
          </div>
        </div>
        <div v-show="isWatched" class="watched">
          <div class="item" v-for="(item,index) in isWatchedMovie" :key="index" @click="$router.push({path:'movie_detail',query:{'movie_id':item.movie_id}})">
            <img :src="server+item.poster" alt="">
            <div class="info">
              <div class="name">{{item.name}}</div>
              <div class="my-score">
                <span>我评：</span>
                <el-rate
                  v-model="item.user_score/2"
                  allow-half
                  :disabled="true"
                />
              </div>
              <div class="my-comment ellipsis">{{item.commentContent}}</div>
            </div>
          </div>
          <div class="tips" v-if="isWatchedMovie.length===0">
            <span class="icon icon-empty-content"></span>
            <span class="text">暂时木有内容呀</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {getWishMovieByUserId,getIsWatchedMovieByUserId} from '../../../api'
    import Vue from 'vue'
    import {Rate} from 'element-ui'
    import {Indicator} from 'mint-ui'
    Vue.use(Rate);
    import MovieItem from '../../../components/MovieItem/MovieItem'
    export default {
        name: "MyMovie",
        components:{
          MovieItem
        },
        data(){
          return{
            isWatched:false,
            //服务器地址
            server:'http://localhost:3000',
            wishMovie:[],
            isWatchedMovie:[],
          }
        },
        created(){
          Indicator.open('Loading...');
          this.loadInfo();
        },
        methods:{
          async loadInfo(){
            if (!this.$route.query.wish_movie){
              this.isWatched = true;
            }
            if (this.$route.query.user_id){
              let json = await getWishMovieByUserId(this.$route.query.user_id);
              if (json.success_code===200){
                this.wishMovie = json.data;
                this.wishMovie.sort((a,b)=>{
                  return new Date(a.public_date)-new Date(b.public_date);
                });
              }
              json = await getIsWatchedMovieByUserId(this.$route.query.user_id);
              if (json.success_code===200){
                this.isWatchedMovie = json.data;
                this.isWatchedMovie.sort((a,b)=>{
                  return new Date(b.comment_date)- new Date(a.comment_date)
                })
              }
            }
            Indicator.close();
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #my-movie
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
        font-size .345rem
    .movie
      margin-top 1rem
      .option
        display flex
        justify-content center
        align-items center
        border-bottom .12rem solid #f1f1f1
        position fixed
        left 0
        width 100%
        background-color #fff
        height .8rem
        span
          padding .25rem
          box-sizing border-box
          font-size .3rem
          border-bottom .04rem solid transparent
        .active
          color #dd2727
          border-bottom .04rem solid #dd2727
      .want,.watched
        padding 0 .3rem
        padding-top 1rem
        .item
          display flex
          align-items center
          padding .2rem 0
          img
            display inline-block
            width 20%
          .info
            width 70%
            display flex
            flex-flow column
            padding .25rem
            font-size .25rem
            color #9d9d9d
            overflow hidden
            .name
              font-weight 700
              font-size .345rem
              padding-bottom .2rem
              color #333
            .my-score
              display flex
              align-items center
              color #ffb400
              padding-bottom .2rem
              font-size .28rem
              span
                margin-right .12rem
            .my-comment
              padding-bottom .3rem
            .actors
              padding-bottom .2rem
            .people
              padding-bottom .2rem
              .number
                color #ffb400
            .score
              padding-bottom .2rem
              .number
                color #ffb400
          .buy
            width 10%
            padding .16rem .12rem
            text-align center
            background-color #dd2727
            border-radius 20%
            font-size .25rem
            color #fff
          .presell
            background-color #2d98f3
            width 10%
            padding .16rem .12rem
            text-align center
            border-radius 20%
            font-size .25rem
            color #fff
        .tips
          display flex
          justify-content center
          align-items center
          flex-flow column
          font-size .28rem
          padding-top 4rem
          border-top .04rem solid #f1f1f1
          .icon
            font-size 1.6rem
            margin-bottom .25rem
          .text
            color #ccc
</style>

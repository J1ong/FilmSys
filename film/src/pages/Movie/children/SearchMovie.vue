<template>
  <div class="search-movie">
      <div class="header">
        <div class="search">
          <span class="icon-search"></span>
          <input type="text" placeholder="搜影片" v-model.trim="name"/>
        </div>
        <span class="cancel-btn" @click="$router.go(-1)">取消</span>
      </div>
    <div class="content">
      <div class="movie-container" v-if="movieInfo.length">
        <!--<div class="title">影片</div>-->
        <movie-item :movie-list="movieInfo" :search-name="name"></movie-item>
      </div>
      <div class="tips" v-else-if="name">
        <span class="icon icon-empty-content"></span>
        <span class="text">暂时木有内容呀</span>
      </div>
    </div>
  </div>
</template>

<script>
    import {matchMovieByName} from '../../../api/index'
    import MovieItem from '../../../components/MovieItem/MovieItem'
    export default {
        name: "SearchMovie",
        components:{
          MovieItem
        },
        data(){
          return{
            name:'',
            movieInfo:[],
            //服务器地址
            server:'http://localhost:3000',
            timer:''
          }
        },
        watch:{
          name(newVal,oldVal){
              this.movieInfo = [];
              clearTimeout(this.timer);
              if (newVal){
                this.timer = setTimeout(async() => {
                let json =await matchMovieByName(newVal);
                if (json.success_code===200){
                  this.movieInfo = json.data;
                }
              }, 500);
            }
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  .search-movie
    width 100%
    background-color #f5f5f5
    .header
      width 100%
      height 1rem
      display flex
      justify-content center
      align-items center
      background-color #fff
      box-shadow 0 0 .002rem #888
      .search
        flex 4
        display flex
        align-items center
        border-radius .5rem
        margin-left .25rem
        padding .125rem .25rem
        background-color #f5f5f5
        .icon-search
          font-size .375rem
        input
          width 100%
          border none
          outline none
          background-color #f5f5f5
          caret-color #dd2727
          margin-left .25rem
          font-size .3rem !important
      .cancel-btn
        flex 1
        font-size .3rem
        color #dd2727
        text-align center
    .content
      width 100%
      background-color #fff
      .movie-container
        width 100%
        font-size .3125rem
        padding .3rem
        box-sizing border-box
        border-top .04rem solid #f1f1f1
        .title
          font-size .28rem
          padding-bottom .25rem
          border-bottom .03rem solid #f1f1f1
        .item
          display flex
          justify-content space-around
          align-items center
          padding .25rem 0
          border-bottom .03rem solid #f1f1f1
          img
            display inline-block
            width 20%
            border-radius .1rem
          .info
            width 68%
            display flex
            flex-flow column
            padding .25rem
            font-size .25rem
            color #9d9d9d
            .name
              font-weight bolder
              padding-bottom .2rem
              color #333
            .type
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
            width 12%
            padding .16rem .12rem
            text-align center
            background-color #dd2727
            border-radius 24%
            font-size .25rem
            color #fff
          .presell
            background-color #2d98f3
            width 12%
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

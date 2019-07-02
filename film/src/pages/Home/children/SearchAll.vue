<template>
  <div class="search-all">
      <div class="header">
        <div class="search">
          <span class="icon-search"></span>
          <input type="text" placeholder="搜影片、影院" v-model="name"/>
        </div>
        <span class="cancel-btn" @click="$router.go(-1)">取消</span>
      </div>
    <div class="content">
      <div class="movie-container" v-if="movieInfo.length">
        <div class="title">影片</div>
        <div class="item" v-for="(item,index) in movieInfo" :key="index">
          <img :src="server+item.poster" alt="" @click="$router.push({path:'/movie_detail',query:{movie_id:item.movie_id}})">
          <div class="info">
            <div class="name">{{item.name}}</div>
            <div class="score">评分 <span class="number">{{item.score?(item.score).toFixed(1):'暂无'}}</span></div>
            <div class="type">{{item.type}}</div>
            <div class="actors ellipsis">主演:<span>{{item.actor}}</span></div>
          </div>
          <span class="buy" v-if="Boolean(new Date(item.public_date)-new Date()<=0)" @click="$router.push({path:'/select_cinema',query:{movie_id:item.movie_id}})">购票</span>
          <span class="presell" v-else @click="$router.push({path:'/select_cinema',query:{movie_id:item.movie_id}})">预售</span>
        </div>
      </div>
      <div class="cinema-container" v-if="cinemaInfo.length">
        <div class="title">影院</div>
        <div class="item" v-for="(item,index) in cinemaInfo" :key="index" @click="$router.push({path:'/cinema_detail',query:{cinema_id:item.cinema_id}})">
          <div class="left">
            <div class="name ellipsis">{{item.cinema_name}}</div>
            <div class="address ellipsis">{{item.specified_address}}</div>
            <div class="label-block"><span>4D厅</span><span>杜比全景声厅</span><span>巨幕厅</span></div>
          </div>
          <!--<div class="right">-->
            <!--<div class="price-block"><span class="price">23</span>元起</div>-->
          <!--</div>-->
        </div>
      </div>
      <div class="tips" v-if="name&&!movieInfo.length&&!cinemaInfo.length">
        <span class="icon icon-empty-content"></span>
        <span class="text">暂时木有内容呀</span>
      </div>
    </div>
  </div>
</template>

<script>
    import {matchCinemaByName,matchMovieByName} from '../../../api/index'
    export default {
        name: "SearchAll",
        data(){
          return{
            name:'',
            movieInfo:[],
            cinemaInfo:[],
            //服务器地址
            server:'http://localhost:3000',
          }
        },
        watch:{
          async name(){
            if (this.name){
              let json = await matchMovieByName(this.name);
              if (json.success_code===200){
                this.movieInfo = json.data;
              }
              json = await matchCinemaByName(this.name);
              if (json.success_code===200){
                this.cinemaInfo = json.data;
              }
            }
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  .search-all
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
          text-indent .125rem
          font-size .3rem !important
      .cancel-btn
        flex 1
        font-size .3rem
        color #dd2727
        text-align center
    .content
      width 100%
      background #fff
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
          padding .25rem
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
      .cinema-container
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
          justify-content center
          align-items center
          box-sizing border-box
          padding .25rem
          width 100%
          border-bottom .03rem solid #f1f1f1
          margin-bottom .25rem
          .left
            width 100%
            .name
              font-size .34rem
              margin-bottom .25rem
            .address
              font-size .28rem
              color #666
              margin-bottom .25rem
            .label-block
              display flex
              span
                padding .06rem
                font-size .1rem
                border .01rem solid #f90
                margin-right .1rem
                border-radius .04rem
                color #f90
          .right
            width 20%
            text-align center
            .price-block
              color #dd2727
              .price
                font-size .38rem
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

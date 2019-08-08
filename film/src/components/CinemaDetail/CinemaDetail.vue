<template>
    <div id="cinema-detail">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">{{currentCinemaInfo.cinema_name}}</span>
      </div>
      <div class="cinema-info">
        <span class="name">{{currentCinemaInfo.cinema_name}}</span>
        <span class="address"><span class="icon icon-address"></span>{{currentCinemaInfo.specified_address}}</span>
        <span class="tel"><span class="icon icon-tel"></span>{{currentCinemaInfo.cinema_phone}}</span>
      </div>
      <el-carousel
        :autoplay=false
        type="card"
        height="5rem"
        arrow="never"
        :loop=false
        :initial-index=initMovieId
        indicator-position="none"
        @change="changeCarousel"
        v-if="carouselReset"
      >
        <el-carousel-item v-for="(item,index) in hasMovieInfo" :key="index">
          <a href="#" @click.prevent="$router.push({path:'/movie_detail',query:{movie_id:item.movie_id}})"><img :src="server+item.poster" alt=""></a>
        </el-carousel-item>
      </el-carousel>
      <div class="movie-info" v-for="(item,index) in hasMovieInfo" :key="index" v-show="movieIndex===Number(index)">
        <span class="arrow"></span>
        <span class="main"><span class="name">{{item.name}}</span><span class="score"><span class="num" v-if="item.score">{{item.score.toFixed(1)}}分</span><span v-else style="font-size: .28rem">暂无评分</span></span></span>
        <span class="intro">
        <span class="time">{{item.movie_long}}</span><span class="split">|</span><span class="type">{{item.type}}</span><span class="split">|</span><span class="actors">{{item.actor}}</span>
        </span>
      </div>
      <ly-tab
        v-model="selectedId"
        :items="items"
        :options="options"
        class="ly-tab"
        v-if="hackReset"
        @change="changeLyTabItem"
      />
      <div class="ticket-container">
        <div class="item" v-for="(item,index) in movieDaySchedule" :key="index">
          <div class="left">
            <span class="start-date">{{item.show_time}}</span>
            <span class="end-date">{{endDate(item)}}散场</span>
          </div>
          <div class="center">
            <div class="info">
              <span class="language">{{item.language}}3D</span>
              <span class="hall">{{item.hall_name}}</span>
            </div>
            <div class="price">{{item.price.toFixed(2)}}元</div>
          </div>
          <div class="right">
            <span class="buy-btn" @click="$router.push({path:'/select_seat',query:{cinema_id:item.cinema_id,movie_id:item.movie_id,schedule_id:item.schedule_id,}})">购票</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {getCurrentCinemaDetail,getCurrentCinemaMovieSchedule} from '../../api/index'
    import Vue from 'vue'
    import {Indicator} from 'mint-ui';
    import {Carousel,CarouselItem} from 'element-ui'
    import LyTab from 'ly-tab'
    import { formatDate } from '../../common/util/util';
    Vue.use(Carousel);
    Vue.use(CarouselItem);
    Vue.use(LyTab);
    export default {
        name: "CinemaDetail",
        data(){
          return{
            initMovieId:0,
            //当前影院信息
            currentCinemaInfo:{},
            //影院的电影信息
            hasMovieInfo:[],
            //所有的电影安排
            allMovieSchedule:[],
            //电影某天的安排
            movieDaySchedule:[],
            hackReset:false,
            carouselReset:true,
            movieIndex:0,
            //服务器地址
            server:'http://localhost:3000',
            selectedId:0,
            items:[],
            options:{
              activeColor: '#dd2727',
            },
          }
        },
        created() {
          Indicator.open('Loading...');
          this.loadCinemaDetail();
        },
        methods:{
          async loadCinemaDetail(){
            if (this.$route.query.cinema_id) {
              let json = await getCurrentCinemaDetail(this.$route.query.cinema_id);
              if (json.success_code===200){
                this.currentCinemaInfo = json.data;
              }
              json = await getCurrentCinemaMovieSchedule(this.$route.query.cinema_id);
              if (json.success_code===200){
                this.hasMovieInfo = json.data.hasMovieInfo;
                if(this.$route.query.movie_id){
                  this.hasMovieInfo.forEach((val,index)=>{
                    if (this.$route.query.movie_id==val.movie_id) {
                      this.initMovieId = index;
                      this.carouselReset = false;
                      this.$nextTick(() => {
                        this.carouselReset = true;
                      });
                    }
                  });
                }
                let movieScheduleInfo = json.data.movieScheduleInfo;
                let allMovieSchedule = [];
                movieScheduleInfo.forEach((value,index)=>{
                  let movieDate = [];
                  let movieInfo = [];
                  value.forEach((val)=>{
                    if(new Date()-new Date(val.show_date+','+val.show_time)<=0){
                      let flag = true;
                      movieDate.forEach((value)=>{
                        if (value.label===val.show_date) {
                          flag = false;
                        }
                      });
                      if (flag){
                        movieDate.push({label:formatDate(new Date(val.show_date),true),date:val.show_date});
                      }
                      movieInfo.push({
                        cinema_id:val.cinema_id,
                        movie_id:val.movie_id,
                        schedule_id:val.schedule_id,
                        show_date:val.show_date,
                        show_time:val.show_time,
                        language:val.language,
                        movie_long:val.movie_long,
                        hall_name:val.hall_name,
                        price:val.price
                      });
                    }
                  });
                  movieDate.sort((a,b)=>{
                    return a.date-b.date;
                  });
                  movieInfo.sort((a,b)=>{
                    return a.date-b.date;
                  });
                  this.allMovieSchedule[index]={movieDate,movieInfo};
                });
                this.items = this.allMovieSchedule[0].movieDate;
                this.hackReset = false;
                this.$nextTick(() => {
                  this.hackReset = true;
                });
                this.allMovieSchedule[0].movieInfo.forEach((value)=>{
                  if (value.show_date === this.allMovieSchedule[0].movieDate[0].date){
                    this.movieDaySchedule.push(value);
                  }
                });
                this.movieDaySchedule.sort((a,b)=>{
                  return new Date(a.show_date+','+a.show_time)-new Date(b.show_date+','+b.show_time);
                });
              }
            }
            Indicator.close();
          },
          //切换轮播图
          changeCarousel(index){
            this.movieIndex = index;
            this.items = this.allMovieSchedule[index].movieDate;
            this.hackReset = false;
            this.$nextTick(() => {
              this.hackReset = true;
            });
            this.selectedId = 0;
            this.movieDaySchedule = [];
            this.allMovieSchedule[index].movieInfo.forEach((value)=>{
              if (value.show_date === this.allMovieSchedule[index].movieDate[0].date){
                this.movieDaySchedule.push(value);
              }
            });
            this.movieDaySchedule.sort((a,b)=>{
              return new Date(a.show_date+','+a.show_time)-new Date(b.show_date+','+b.show_time);
            });
          },
          //切换日期
          changeLyTabItem(item){
            this.movieDaySchedule = [];
            this.allMovieSchedule[this.movieIndex].movieInfo.forEach((value)=>{
              if (value.show_date === item.date){
                this.movieDaySchedule.push(value);
              }
            });
            this.movieDaySchedule.sort((a,b)=>{
              return new Date(a.show_date+','+a.show_time)-new Date(b.show_date+','+b.show_time);
            });
          },
          //影片结束时间
          endDate(item){
            let h = parseInt(Number(item.show_time.split(':')[0])+(parseInt(item.movie_long)/60));
            let m = Number(item.show_time.split(':')[1])+parseInt(item.movie_long)%60;
            if (m>59){
              return ((h+parseInt(m/60))<10?'0'+(h+parseInt(m/60)):(h+parseInt(m/60)))+':'+((m%60)<10?'0'+(m%60):(m%60));
            } else{
              return (h<10?'0'+h:h)+':'+(m<10?'0'+m:m);
            }
          }
        },
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #cinema-detail
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
      z-index 999
      .icon-back
        font-size .4rem
        position absolute
        left .3rem
      .name
        width 60%
        font-size .375rem
        text-align center
        line-height .375rem
    .cinema-info
      margin-top 1rem
      color #888
      display flex
      flex-flow column
      padding .25rem
      .name
        color #000
        font-size .345rem
        font-weight 700
        margin-bottom .25rem
      .address,.tel
        margin-bottom .12rem
        font-size .28rem
        line-height .375rem
        display flex
        letter-spacing .02rem
        align-items flex-start
        .icon
          font-size .375rem
          margin-right .08rem
    .movie-info
      height 1.4rem
      display flex
      flex-flow column
      align-items center
      .arrow
        border .2rem solid transparent
        border-bottom .2rem solid #fff
        margin-top -.38rem
        z-index 999
      .main
        font-size .345rem
        .name
          line-height .8rem
          font-weight 700
        .score
          color #ffb400
          margin-left .25rem
          font-size .1rem
          .num
            font-size .3125rem
            font-weight 700
            font-family PingFangSC-Regular, Hiragino Sans GB, sans-serif
      .intro
        font-size .25rem
        color #888
        .split
          margin 0 .08rem
    .el-carousel
      background linear-gradient(to bottom, #242342 0%,#11182B 100%)
      .el-carousel__item
        margin-top .25rem
        height 90%
        a
          font-size .3125rem
          padding-top .04rem
          img
            width 100%
            height 100%
            box-sizing border-box
            border 0.06rem solid #fff
    .ly-tab
      color #000
      border none
    .ticket-container
      padding .25rem
      .item
        display flex
        justify-content space-around
        align-items center
        border-bottom 0.02rem solid #f1f1f1
        padding .25rem 0
        .left
          flex 1
          display flex
          flex-flow column
          justify-content center
          .start-date
            font-weight bolder
            font-size .375rem
            margin-bottom .12rem
          .end-date
            color #888
            font-size .25rem
        .center
          flex 3
          display flex
          justify-content space-between
          align-items center
          margin 0 .25rem
          .info
            display flex
            flex-flow column
            justify-content center
            align-items center
            margin-left .25rem
            .language
              font-size .28rem
              margin-bottom .12rem
            .hall
              color #888
              font-size .25rem
          .price
            color #dd2727
            margin-right .25rem
        .right
          flex 1
          text-align center
          border 0.0125rem solid #dd2727
          padding .12rem 0
          border-radius .25rem
          color #dd2727
          font-size .25rem
</style>

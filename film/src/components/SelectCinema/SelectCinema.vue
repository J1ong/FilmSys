<template>
    <div id="select-cinema">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">{{movieInfo.name}}</span>
      </div>
      <ly-tab
        v-model="selectedId"
        :items="items"
        :options="options"
        class="ly-tab"
        v-if="hackReset"
        @change="changeLyTabItem"
      />
      <div class="content">
        <div class="item" v-for="(item,index) in dateCinemaSchedule" :key="index" @click="$router.push({path:'/cinema_detail',query:{movie_id:$route.query.movie_id,cinema_id:item.cinema_id}})">
          <div class="left">
            <div class="name ellipsis">{{item.cinema_name}}</div>
            <div class="address ellipsis">{{item.specified_address}}</div>
            <div class="label-block"><span>小吃</span><span>4D厅</span><span>杜比全景声厅</span><span>巨幕厅</span></div>
          </div>
          <!--<div class="right">-->
            <!--<div class="price-block"><span class="price">23</span>元起</div>-->
          <!--</div>-->
        </div>
      </div>
    </div>
</template>

<script>
    import {getMovieDetail,getCurrentMovieSchedule} from '../../api/index'
    import {formatDate} from '../../common/util/util'
    import {Indicator} from 'mint-ui'
    import Vue from 'vue'
    import LyTab from 'ly-tab'
    Vue.use(LyTab);
    export default {
        name: "SelectCinema",
        data(){
          return{
            movieInfo:'',
            selectedId:0,
            hasCinemaInfo:[],
            cinemaScheduleInfo:[],
            dateCinemaSchedule:[],
            hackReset:true,
            items:[],
            options:{
              activeColor: '#dd2727',
            },
          }
        },
        created() {
          Indicator.open('Loading...');
          this.loadInfo();
        },
        methods:{
          async loadInfo(){
            let json =await getMovieDetail(this.$route.query.movie_id);
            if (json.success_code===200){
              this.movieInfo = json.data[0];
            }
            json = await getCurrentMovieSchedule(this.$route.query.movie_id);
            if (json.success_code===200){
              this.hasCinemaInfo = json.data.hasCinemaInfo;
              this.cinemaScheduleInfo = json.data.cinemaScheduleInfo;
              this.cinemaScheduleInfo.forEach((value)=>{
                this.removeRepeat(value, 'cinema_id');
              });
              this.hasCinemaInfo.forEach((value)=>{
                this.items.push({label:formatDate(new Date(value[0].show_date),true),date:value[0].show_date});
              });
              this.hackReset = false;
              this.$nextTick(() => {
                this.hackReset = true;
              });
              this.dateCinemaSchedule = this.cinemaScheduleInfo[0];
            }
            Indicator.close();
          },
          //切换日期
          changeLyTabItem(item){
            this.hasCinemaInfo.forEach((value,index)=>{
              if (value[0].show_date===item.date){
                this.dateCinemaSchedule = this.cinemaScheduleInfo[index];
              }
            });
          },
          //去除重复的影院
          removeRepeat(arr, key){
            for(let i = 0; i < arr.length; i++) {
              for(let j = i+1; j < arr.length; j++) {
                if(arr[i][key] === arr[j][key]){
                  arr.splice(j, 1); j = j-1;
                }
              }
            }
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #select-cinema
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
        font-size .375rem
        line-height .375rem
        text-align center
    .ly-tab
      position fixed
      top 1rem
      left 0
    .select
      position fixed
      left 0
      top 1.68rem
      width 100%
      height .8rem
      display flex
      justify-content space-around
      align-items center
      border-bottom .03rem solid #f1f1f1
      border-top .03rem solid #f1f1f1
      box-sizing border-box
      background-color #fff
      .option
        width 33.33%
        box-sizing border-box
        padding .1rem .6rem
        display flex
        justify-content center
        align-items flex-end
        font-size .28rem
        border-right .02rem solid #f1f1f1
        &:last-child
          border-right none
        .arrow
          margin-left .1rem
          padding-bottom .05rem
          &::after
            content ''
            width 0
            height 0
            overflow hidden
            font-size 0
            line-height 0
            border-width .1rem
            border-style solid
            border-color #888 transparent transparent transparent
    .content
      margin-top 2rem
      font-size .3125rem
      .item
        display flex
        justify-content center
        align-items center
        box-sizing border-box
        padding .25rem
        width 100%
        margin-bottom .25rem
        .left
          width 100%
          .name
            font-size .345rem
            line-height .36rem
            font-weight 700
            margin-bottom .25rem
          .address
            font-size .28rem
            height .3rem
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
</style>

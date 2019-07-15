<template>
  <div id="select-seat">
    <div class="top">
      <span class="icon-back" @click="$router.go(-1)"></span>
      <span class="name ellipsis">{{cinemaInfo.cinema_name}}</span>
    </div>
    <div class="movie-info">
      <div class="name">{{movieInfo.name}}</div>
      <div class="intro"><span class="date">{{scheduleInfo.show_date|dateFilter}}</span><span class="time">{{scheduleInfo.show_time}}</span><span class="language">{{movieInfo.language}}3D</span></div>
    </div>
    <div class="seat-block">
      <div class="screen">{{scheduleInfo.hall_name}}银幕</div>
      <div class="center">银幕中央</div>
      <div class="screen-line"></div>
      <div class="row-container">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
      </div>
      <div class="seat-container">
        <div class="row" v-if="hackReset" v-for="(itemI,indexI) in seatIJ" :key="indexI">
          <span class="seat"
            v-for="(itemJ,indexJ) in itemI"
            :key="indexJ"
            :class="{'icon-sold-seat':itemJ===1,'icon-empty-seat':itemJ===0,'icon-selected-seat':itemJ===2}"
            @click.prevent="handleSelectSeat(indexI,indexJ)"
          ></span>
        </div>
      </div>
      <div class="seat-example">
        <div class="example empty-example"><span class="icon icon-empty-seat"></span>可选</div>
        <div class="example sold-example"><span class="icon icon-sold-seat"></span>不可选</div>
        <div class="example selected-example"><span class="icon icon-selected-seat"></span>已选</div>
      </div>
    </div>
    <div class="bottom">
      <div class="title" v-if="selectedSeat">已选座位</div>
      <div class="selected-seat" v-if="selectedSeat">
        <div class="seat-item" v-for="(item,index) in selectedSeatInfo" :key="index">
          <div class="left">
            <span class="seat">{{item[0]+1}}排{{item[1]+1}}座</span>
            <span class="price">{{(scheduleInfo.price).toFixed(2)}}元</span>
          </div>
          <span class="right icon-close" @click="cancelSelectedSeat(item[0],item[1])"></span>
        </div>
      </div>
      <span class="btn" v-if="!selectedSeat">请先选座</span>
      <span class="btn active" v-else @click="ensureSeatBtn">确认选座</span>
    </div>
  </div>
</template>

<script>
    import {Toast,Indicator,MessageBox} from 'mint-ui'
    import {getMovieDetail,getCurrentCinemaDetail,getScheduleById,updateScheduleSeat} from '../../api/index'
    export default {
        name: "SelectSeat",
        data(){
          return{
            cinemaInfo:{},
            movieInfo:{},
            scheduleInfo:{},
            seatInfo:'',
            seatCount:0,
            selectedSeat:false,
            hackReset:true,
            selectedSeatInfo:[],
            seatIJ:[
              [0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0,0]
            ],
          }
        },
        created() {
          Indicator.open('Loading...');
          this.loadInfo();
        },
        methods:{
          //加载信息
          async loadInfo(){
            if (this.$route.query.cinema_id&&this.$route.query.movie_id&&this.$route.query.schedule_id){
              let json = await getCurrentCinemaDetail(this.$route.query.cinema_id);
              if (json.success_code===200) {
                this.cinemaInfo = json.data;
              }
              json = await getMovieDetail(this.$route.query.movie_id);
              if (json.success_code===200) {
                this.movieInfo = json.data[0];
              }
              json = await getScheduleById(this.$route.query.schedule_id);
              if (json.success_code===200) {
                this.scheduleInfo = json.data;
                this.seatInfo = this.scheduleInfo.seat_info;
                if (this.seatInfo){
                  this.seatInfo = JSON.parse(this.seatInfo);
                  this.seatInfo.forEach((value)=>{
                    if (value%10!==0){
                      this.seatIJ[parseInt(value/10)][value%10-1] = 1;
                    } else{
                      this.seatIJ[parseInt(value/10)-1][9] = 1;
                    }
                  });
                }
              }
            }
            Indicator.close();
          },
          //选择座位
          handleSelectSeat(indexI,indexJ){
            if (this.seatCount===4&&this.seatIJ[indexI][indexJ]===0){
              MessageBox.alert('一次最多选择4个座位哦！');
            } else{
              if (this.seatIJ[indexI][indexJ]===0){
                this.seatIJ[indexI][indexJ]=2;
                this.selectedSeatInfo.push([indexI,indexJ]);
                this.seatCount+=1;
                if (!this.selectedSeat){
                  this.selectedSeat = true;
                }
              }
              else if (this.seatIJ[indexI][indexJ]===2){
                this.seatIJ[indexI][indexJ]=0;
                this.seatCount-=1;
                let currentIndex;
                this.selectedSeatInfo.forEach((value,index)=>{
                  if (indexI===value[0]&&indexJ===value[1]){
                    currentIndex = index;
                  }
                });
                this.selectedSeatInfo.splice(currentIndex,1);
                if (this.seatCount===0){
                  this.selectedSeat = false;
                }
              }
              this.hackReset = false;
              this.$nextTick(() => {
                this.hackReset = true;
              });
            }
          },
          //取消选座
          cancelSelectedSeat(indexI,indexJ){
            this.seatIJ[indexI][indexJ]=0;
            this.seatCount-=1;
            let currentIndex;
            this.selectedSeatInfo.forEach((value,index)=>{
              if (indexI===value[0]&&indexJ===value[1]){
                currentIndex = index;
              }
            });
            this.selectedSeatInfo.splice(currentIndex,1);
            if (this.seatCount===0){
              this.selectedSeat = false;
            }
          },
          //确认选座
          async ensureSeatBtn(){
            if (this.$cookies.get('user_id')){
              if (!this.seatInfo) {
                this.seatInfo = [];
              }
              this.selectedSeatInfo.forEach((value,index)=>{
                this.seatInfo.push(value[0]*10+value[1]+1);
                this.$cookies.set('seat_'+(index+1),value[0]*10+value[1]+1);
              });
              this.$cookies.set('seat_count',this.selectedSeatInfo.length);
              this.seatInfo = JSON.stringify(this.seatInfo);
              let json = await updateScheduleSeat(this.$route.query.schedule_id,this.seatInfo);
              if (json.success_code===200){
                Toast({
                  message: '锁定座位成功',
                  position: 'middle',
                  duration: 2000
                });
                this.$router.push({path:'/submit_order',query:{cinema_id:this.$route.query.cinema_id,movie_id:this.$route.query.movie_id,schedule_id:this.$route.query.schedule_id,}});
              }
            } else{
              this.$router.push('./login');
            }
          }
        },
        filters:{
          dateFilter(props){
            props = props+'';
            return props.split('-')[0]+'年'+props.split('-')[1]+'月'+props.split('-')[2]+'日';
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #select-seat
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
        font-size .375rem
    .movie-info
      margin-top 1rem
      display flex
      flex-flow column
      padding .25rem
      .name
        margin-bottom .25rem
        font-size .345rem
        font-weight 700
      .intro
        font-size .28rem
        margin-bottom .25rem
        color #888
        span
          margin-right .12rem
    .seat-block
      width 100%
      background: #f1f1f1
      position absolute
      left 0
      top 2.5rem
      bottom 0
      .screen
        width 4rem
        margin 0 auto
        text-align center
        background #dcdcdc
        font-size .25rem
        padding .08rem 0
        border-bottom-left-radius .4rem
        border-bottom-right-radius .4rem
        position relative
        left .28rem
      .center
        font-size .2rem
        width 1rem
        position absolute
        text-align center
        padding .08rem .1rem
        top 1.2rem
        left 50%
        margin-left -.3125rem
        letter-spacing .02rem
        background-color #fff
        color #888
        border-radius .12rem
      .screen-line
        width 0
        height 4.8rem
        border .02rem dashed #dcdcdc
        position absolute
        top 1.6rem
        left 50%
        margin-left .28rem
      .row-container
        position absolute
        top 1.4rem
        left .25rem
        width .4rem
        height 4rem
        padding .6rem 0
        background-color rgba(168,168,168,.8)
        display flex
        flex-flow column
        text-align center
        justify-content space-between
        align-items center
        color #fff
        border-radius .2rem
        font-size .25rem
      .seat-container
        padding .12rem 0
        position absolute
        top 1.8rem
        left .8rem
        .row
          margin-bottom .25rem
          .seat
            font-size .5rem
            margin-left .134rem
      .seat-example
        position absolute
        top .6rem
        width 80%
        margin-left 10%
        display flex
        justify-content center
        align-items center
        .example
          font-size .25rem
          color #888
          margin-right .25rem
          display flex
          justify-content center
          align-items center
          .icon
            font-size .3rem
            margin-right .12rem
    .bottom
      position fixed
      width 100%
      left 0
      bottom 0
      background #fff
      z-index 999
      display flex
      flex-flow column
      padding .25rem
      padding-top .32rem
      box-sizing border-box
      .title
        font-size .28rem
        font-weight 700
        margin-bottom .25rem
      .btn
        height .8rem
        line-height .8rem
        background-color #f7dbb3
        color #fff
        text-align center
        border-radius .12rem
        font-size .28rem
        &.active
          background-color #fe9900
      .selected-seat
        height 1rem
        display flex
        .seat-item
          width 25%
          height .8rem
          display flex
          box-sizing border-box
          justify-content space-around
          align-items center
          border 0.02rem solid #f1f1f1
          margin-right .25rem
          &:last-child
            margin-right 0
          .left
            display flex
            flex-flow column
            font-size .25rem
            .seat
              font-size .28rem
              color #666
              margin-bottom .12rem
            .price
              color #dd2727
              font-size .24rem
          .right
            font-size .25rem
</style>

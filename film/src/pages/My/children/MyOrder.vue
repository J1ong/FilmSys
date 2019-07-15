<template>
    <div id="my-order">
      <div class="top">
        <span class="icon-back" @click="$router.go(-1)"></span>
        <span class="name ellipsis">我的订单</span>
      </div>
      <div class="order-container" v-if="myOrderInfo.length">
        <div class="item" v-for="(item,value) in myOrderInfo">
          <div class="item-top">
            <span class="cinema-name">{{item.cinema_name}}</span><span class="status">已完成</span>
          </div>
          <div class="item-center">
            <div class="left">
              <img :src="server+item.poster" alt="" width="100%" height="100%">
            </div>
            <div class="right">
              <div class="movie">{{item.name}}<span class="num">{{item.ticket_num}}张</span></div>
              <div class="date"><span class="day">{{item.show_date.split('-')[1]+'月'+item.show_date.split('-')[2]+'日'}}</span><span class="time">{{item.show_time}}</span></div>
              <div class="cinema"><span class="hall">{{item.hall_name}}</span><span class="seat" v-for="(itemSeat,valueSeat) in JSON.parse(item.order_seat_info)" :key="valueSeat">{{formatSeat(itemSeat)}}</span></div>
            </div>
          </div>
          <div class="item-bottom">
            <div class="price">总价:<span>{{item.ticket_total_price}}元</span></div>
          </div>
        </div>
      </div>
      <div class="tips" v-else>
        <span class="icon icon-empty-content"></span>
        <span class="text">暂时木有内容呀</span>
      </div>
    </div>
</template>

<script>
    import {getOrderByUserId} from '../../../api'
    import {Indicator} from 'mint-ui'
    export default {
        name: "MyOrder",
        data(){
          return{
            myOrderInfo:[],
            //服务器地址
            server:'http://localhost:3000',
          }
        },
        created() {
          Indicator.open('Loading...');
          this.loadInfo();
        },
        methods:{
          //加载信息
          async loadInfo(){
            if (this.$route.query.user_id){
              let json = await getOrderByUserId(this.$route.query.user_id);
              if (json.success_code===200){
                this.myOrderInfo = json.data;
                this.myOrderInfo.sort((a,b)=>{
                  return new Date(b.order_date)-new Date(a.order_date);
                });
              }
            }
            Indicator.close();
          },
          //格式座位
          formatSeat(num){
            if (num%10===0){
              return (num/10)+'排'+10+'座';
            } else{
              return parseInt(num/10)+1+'排'+num%10+'座';
            }
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #my-order
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
    .order-container
      display flex
      flex-flow column
      margin-top 1rem
      width 100%
      background #f1f1f1
      .item
        display flex
        justify-content center
        align-items center
        flex-flow column
        padding .3rem
        background #fff
        border-bottom .03rem solid #f1f1f1
        .item-top, .item-center,.item-bottom
          width 100%
          display flex
          justify-content space-between
          align-items center
          font-size .28rem
          color #333
        .item-top
          padding-bottom .12rem
        .item-center
          width 100%
          justify-content flex-start
          padding .12rem 0
          .left
            width 16%
          .right
            align-self flex-start
            .movie
              font-weight bolder
              font-size .25rem
              margin .2rem
              margin-bottom .3rem
              .num
                margin-left .12rem
            .date,.cinema,.price
              margin .2rem
              span
                margin-right .12rem
        .item-bottom
          margin-top .12rem
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

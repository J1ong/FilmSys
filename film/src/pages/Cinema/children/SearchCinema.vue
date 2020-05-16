<template>
  <div class="search-cinema">
      <div class="header">
        <div class="search">
          <span class="icon-search"></span>
          <input type="text" placeholder="搜影院" v-model.trim="name"/>
        </div>
        <span class="cancel-btn" @click="$router.go(-1)">取消</span>
      </div>
    <div class="content">
      <div class="cinema-container" v-if="cinemaInfo.length">
        <!--<div class="title">影院</div>-->
        <div class="item" v-for="(item,index) in cinemaInfo" :key="index" @click="$router.push({path:'/cinema_detail',query:{cinema_id:item.cinema_id}})">
          <div class="left">
            <div class="name ellipsis" v-html="ruleName(item.cinema_name)"></div>
            <div class="address ellipsis">{{item.specified_address}}</div>
            <div class="label-block"><span>小吃</span><span>4D厅</span><span>杜比全景声厅</span><span>巨幕厅</span></div>
          </div>
          <!--<div class="right">-->
            <!--<div class="price-block"><span class="price">23</span>元起</div>-->
          <!--</div>-->
        </div>
      </div>
      <div class="tips" v-else-if="name">
        <span class="icon icon-empty-content"></span>
        <span class="text">暂时木有内容呀</span>
      </div>
    </div>
  </div>
</template>

<script>
    import {matchCinemaByName} from '../../../api'
    export default {
        name: "SearchCinema",
        data(){
          return{
            name:'',
            cinemaInfo:[],
            timer:''
          }
        },
        watch:{
          name(newVal,oldVal){
            this.cinemaInfo = [];
            clearTimeout(this.timer);
            if(newVal){
              this.timer = setTimeout(async() => {
              let json = await matchCinemaByName(newVal);
              if (json.success_code===200){
                this.cinemaInfo = json.data;
              }
            }, 500);
            }
          }
        },
        computed:{
          ruleName(){
            return (nameString)=>{
              let replaceReg = new RegExp(this.name,'g');
              let replaceString = `<span style="color: #dd2727">${this.name}</span>`;
              return nameString.replace(replaceReg,replaceString);
            }
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  .search-cinema
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
              font-size 0.345rem
              line-height 0.36rem
              margin-bottom 0.25rem
              font-weight 700
            .address
              font-size 0.28rem
              line-height 0.3rem
              color #666
              margin-bottom 0.25rem
            .label-block
              display flex
              span
                padding 0.06rem
                font-size 0.2rem
                border 0.01rem solid #f90
                margin-right 0.1rem
                border-radius 0.04rem
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

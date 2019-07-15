<template>
    <div id="tab-bar">
      <span class="tab-item" @click="switchTo('/home')">
        <img :src="$route.path.includes('/home') ? tabBarImgArr[0].active:tabBarImgArr[0].normal">
        <span :class="{on:$route.path.includes('/home')}">首页</span>
      </span>
      <span class="tab-item" @click="switchTo('/movie')">
        <img :src="$route.path.includes('/movie') ? tabBarImgArr[1].active:tabBarImgArr[1].normal">
        <span :class="{on:$route.path.includes('/movie')}">电影</span>
      </span>
      <span class="tab-item" @click="switchTo('/cinema')">
        <img :src="$route.path.includes('/cinema') ? tabBarImgArr[2].active:tabBarImgArr[2].normal">
        <span :class="{on:$route.path.includes('/cinema')}">影院</span>
      </span>
      <span class="tab-item" @click="switchTo('/my')">
        <img :src="$route.path.includes('/my') ? tabBarImgArr[3].active:tabBarImgArr[3].normal">
        <span :class="{on:$route.path.includes('/my')}">我的</span>
      </span>
    </div>
</template>

<script>
    export default {
        name: "TabBar",
        data(){
          return{
            tabBarImgArr:[
              {normal:require('./images/home_light.svg'),active:require('./images/home_fill_light.svg')},
              {normal:require('./images/movie_light.svg'),active:require('./images/movie_fill_light.svg')},
              {normal:require('./images/cinema_light.svg'),active:require('./images/cinema_fill_light.svg')},
              {normal:require('./images/my_light.svg'),active:require('./images/my_fill_light.svg')},
            ]
          }
        },
        methods:{
          switchTo(path){
            this.$router.replace(path);
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #tab-bar
    width 100%
    height 1.041rem
    position fixed
    left 0
    bottom 0
    right 0
    z-index 999
    display flex
    background-color: #fff;
    border-top 1px solid #f1f1f1
    .tab-item
        display flex
        flex 1
        justify-content center
        align-items center
        flex-direction column
        font-size 0.21rem
        margin-bottom 0.041rem
        color #333
        img
          margin-bottom 0.041rem
          width 32%
        .on
          color red
</style>

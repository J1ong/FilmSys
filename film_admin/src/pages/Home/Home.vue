<template>
    <div id="home">
      <el-row class="nav">
        <el-col :span="3" >
          <el-menu
            class="el-menu-vertical-demo"
            background-color="#304156"
            text-color="#fff">
            <el-menu-item index="0" disabled style="cursor: default;opacity: 1">
              <div>
                <i class="icon-film-logo" style="font-size: 48px;margin-right: 5px;"></i>
                <span slot="title" style="font-size: 16px;font-weight: bolder">淘气电影</span>
              </div>
            </el-menu-item>
            <router-link index="1" tag="el-menu-item" to="user_manage">
              <div>
                <i class="el-icon-user-solid"></i>
                <span slot="title">用户管理</span>
              </div>
            </router-link>
            <router-link index="2" tag="el-menu-item" to="movie_manage">
              <div>
                <i class="el-icon-s-kpi"></i>
                <span slot="title">电影管理</span>
              </div>
            </router-link>
            <router-link index="3" tag="el-menu-item" to="cinema_manage">
              <div>
                <i class="el-icon-video-camera-solid"></i>
                <span slot="title">影院管理</span>
              </div>
            </router-link>
            <router-link index="4" tag="el-menu-item" to="hall_manage">
              <div>
                <i class="el-icon-bangzhu"></i>
                <span slot="title">影厅管理</span>
              </div>
            </router-link>
            <router-link index="5" tag="el-menu-item" to="movie_schedule">
              <div>
                <i class="el-icon-s-fold"></i>
                <span slot="title">电影排片</span>
              </div>
            </router-link>
            <router-link index="6" tag="el-menu-item" to="comment_manage" >
              <div>
                <i class="el-icon-s-comment"></i>
                <span slot="title">评论管理</span>
              </div>
            </router-link>
            <router-link index="7" tag="el-menu-item" to="order_manage">
              <div>
                <i class="el-icon-s-ticket"></i>
                <span slot="title">订单管理</span>
              </div>
            </router-link>
          </el-menu>
        </el-col>
        <el-col :span="21" :offset="3">
          <div class="nav-bar">
            <el-col :offset="18" :span="6" style="display: flex;justify-content: center;align-items: center;text-align: right" v-if="adminInfo.name">
              <img :src="server+adminInfo.avatar" class="user-avatar" width="40px" height="40px" style="border-radius: 20px">
              <span style="font-size: 12px;margin: 0 20px">{{adminInfo.name}}</span>
              <el-button size="mini" @click="logout" type="primary">退出</el-button>
            </el-col>
          </div>
          <router-view style="padding: 50px 100px;"/>
        </el-col>
      </el-row>
    </div>
</template>

<script>
    import {getAdminInfo} from "../../api";
    import {Message} from 'element-ui'
    export default {
        name: "Home",
        data() {
          return {
            //服务器地址
            server:'http://localhost:3000',
            adminInfo:{}
          };
        },
        created(){
          this.loadAdminInfo();
        },
        methods: {
          async loadAdminInfo(){
            if (this.$cookies.get('admin_id')){
              let json = await getAdminInfo(this.$cookies.get('admin_id'));
              if (json.success_code===200){
                this.adminInfo = json.data;
                console.log(this.adminInfo);
              }
            } else{
              this.$router.push({path:'/login'});
              Message.error('请先登录！');
            }
          },
          logout(){
            this.$cookies.remove('admin_id');
            this.$router.push('/login');
            Message.success('退出成功！');
          },
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #home
    width 100%
    /deep/ .nav
      position fixed
      top 0
      left 0
      bottom 0
      width 100%
      .el-col-3
        position fixed
        top 0
        left 0
        bottom 0
        padding-left 0
        .el-menu-vertical-demo
          height 100%
          .router-link-active
            background-color rgb(38,52,69)!important
          .icon-film-logo::before
            color #fff
      .el-col-21
        background-color #fff
        .nav-bar
          height 56px
          overflow hidden
          position relative
          background #fff
          -webkit-box-shadow 0 1px 4px rgba(0,21,41,.08)
          box-shadow 0 1px 4px rgba(0,21,41,.08)
          box-sizing border-box
          display flex
          align-items center
          .avatar-container
            height 50px
            float right
            .avatar-wrapper
              height 50px !important
              .user-avatar
                height 100%

</style>

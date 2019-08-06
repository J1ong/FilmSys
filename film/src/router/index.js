import Vue from 'vue'
import Router from 'vue-router'


const Login = ()=> import('../components/Login/Login');
import Home from '../pages/Home/Home'
import SearchAll from '../pages/Home/children/SearchAll'
import Movie from '../pages/Movie/Movie'
import SearchMovie from '../pages/Movie/children/SearchMovie'
import MovieDetail from '../components/MovieDetail/MovieDetail'
import CommentPanel from '../components/MovieDetail/children/CommentPanel'
import Cinema from '../pages/Cinema/Cinema'
import CinemaDetail from '../components/CinemaDetail/CinemaDetail'
import SearchCinema from '../pages/Cinema/children/SearchCinema'
import SelectCinema from '../components/SelectCinema/SelectCinema'
import SelectSeat from '../components/SelectSeat/SelectSeat'
import SubmitOrder from '../components/SubmitOrder/SubmitOrder'
import Pay from '../components/Pay/Pay'
import My from '../pages/My/My'
import MyInfo from '../pages/My/children/MyInfo'
import MyOrder from '../pages/My/children/MyOrder'
import MyMovie from '../pages/My/children/MyMovie'
import ModifyUserName from '../pages/My/children/ModifyUserName'
import ModifyUserSign from '../pages/My/children/ModifyUserSign'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/home'
    },
    {
      path: '/home',
      name:'home',
      component: Home,
      meta:{
        showTabBar:true,
      }
    },
    {
      path:'/movie',
      name:'movie',
      component: Movie,
      meta:{showTabBar:true}
    },
    {
      path:'/cinema',
      name:'cinema',
      component:Cinema,
      meta:{showTabBar:true}
    },
    {
      path:'/my',
      name:'my',
      component:My,
      meta:{showTabBar:true}
    },
    {
      path:'/my_info',
      name:'my_info',
      component:MyInfo
    },
    {
      path:'/my_order',
      name:'my_order',
      component:MyOrder
    },
    {
      path:'/my_movie',
      name:'my_movie',
      component:MyMovie
    },
    {
      path:'/modify_username',
      name:'modify_username',
      component:ModifyUserName
    },
    {
      path:'/modify_usersign',
      name:'modify_usersign',
      component:ModifyUserSign
    },
    {
      path:'/search_all',
      component:SearchAll
    },
    {
      path:'/search_movie',
      component:SearchMovie
    },
    {
      path:'/movie_detail',
      name:'movie_detail',
      component:MovieDetail
    },
    {
      path:'/cinema_detail',
      component:CinemaDetail
    },
    {
      path:'/select_cinema',
      component:SelectCinema
    },
    {
      path:'/select_seat',
      component:SelectSeat
    },
    {
      path:'/comment_panel',
      component:CommentPanel
    },
    {
      path:'/search_cinema',
      component:SearchCinema
    },
    {
      path:'/submit_order',
      component:SubmitOrder
    },
    {
      path:'/pay',
      component:Pay
    },
    {
      path:'/login',
      component:Login
    },
  ]
})

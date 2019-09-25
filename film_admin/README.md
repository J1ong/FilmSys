# 淘气电影

> ### 淘气电影后台管理项目

## 预览

<img src="https://img-blog.csdnimg.cn/2019092514452441.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl80MTM4MjE4Nw==,size_16,color_FFFFFF,t_70" width="600px">

## 目录

    |-- .gitignore  #git中忽略的文件
    |-- index.html  #根文件
    |-- package.json  #项目描述文件
    |-- README.md  #项目介绍文件
    |-- build  #webpack开发和打包的配置文件
    |-- config  #vue-cli的配置文件
    |-- src  #资源文件夹
    |   |-- App.vue  #页面入口文件
    |   |-- main.js  #程序入口文件
    |   |-- api  #请求接口文件
    |   |   |-- ajax.js  #基于axios封装ajax文件
    |   |   |-- index.js  #调用接口文件
    |   |-- common  #公共资源文件
    |   |   |-- css
    |   |       |-- style.css  #字体图标样式文件
    |   |       |-- fonts  #字体图标文件
    |   |-- components  #组件文件
    |   |-- pages  #页面文件
    |   |   |-- Home  #主页
    |   |   |   |-- Home.vue
    |   |   |   |-- children
    |   |   |       |-- CinemaManage.vue  #影院管理页
    |   |   |       |-- CommentManage.vue  #评论管理页
    |   |   |       |-- HallManage.vue  #影厅管理页
    |   |   |       |-- MovieManage.vue  #电影管理页
    |   |   |       |-- MovieSchedule.vue  #电影排片页
    |   |   |       |-- OrderManage.vue  #订单管理页
    |   |   |       |-- UserManage.vue  #用户管理页
    |   |   |-- Login  #登录页
    |   |       |-- Login.vue
    |   |-- router  #路由
    |       |-- index.js  #路由配置
    |-- static  #静态文件
        |-- css
            |-- reset.css  #兼容性样式

## 启动项目

**注意！注意！注意！启动后台管理项目前需部署并启动好接口项目 [film_api](https://github.com/J1ong/FilmSys/tree/master/film_api)**  

```bash
#输入命令前需要进入到film_admin中,即在film_admin目录下输入以下命令
npm install  #安装依赖包
npm start  #启动
```

## 最后

**启动成功后，在浏览器地址栏输入http://localhost:8081/ 可进入后台管理登录页，输入管理员账号密码（均为admin）即可登录**
# 淘气电影

> A Vue project to film

## Preview

### 前端展示

<img src="https://img-blog.csdnimg.cn/20190715155903552.gif" width="200px">

### 后台管理-电影管理

<img src="https://img-blog.csdnimg.cn/2019071516584577.gif" width="400px">

## Description  

### File      

├── film 前端页面项目文件   
├── film_admin 后台管理系统    
├── film_api 前后台接口文件       
├── db_film.sql 数据库文件  
### Build Setup

1. 拉取项目

```bash
#依次执行以下命令
git clone https://github.com/J1ong/FilmSys.git
cd FilmSys
cd film
npm install
cd ../film_admin
npm install
cd ../film_api
npm install
```

2. 导入数据文件db_film.sql (我这里使用的数据库是mysql,用户：root,密码：123456)

3. 项目细节

    - [前端页面项目](https://github.com/J1ong/FilmSys/tree/master/film)
    - [后台管理项目](https://github.com/J1ong/FilmSys/tree/master/film_admin)
    - [前后台接口项目](https://github.com/J1ong/FilmSys/tree/master/film_api)

4. 启动项目

    1. 启动前后台接口项目

    ```bash
    #输入命令前要先进入到film_api中
    nodemon app.js
    ```

    2. 启动前端页面项目

    ```bash
    #输入命令前同样需要进入到film中
    npm start
    ```

    3. 启动后台管理项目

    ```bash
    #输入命令前同样需要进入到film_admin中
    npm start
    ```

5. 最后

    - 浏览器地址栏输入http://localhost:8080/ 可看前端页面，切换到移动设备就可以正常看到移动版页面了
    - 浏览器地址栏输入http://localhost:3000/ 可到后台登录界面（账号：admin，密码：admin）   
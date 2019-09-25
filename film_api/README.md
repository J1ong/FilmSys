# 淘气电影

> ### 淘气电影前后台接口

## 目录

    |-- .gitignore  #git中忽略的文件
    |-- app.js  #启动文件
    |-- package.json  #项目描述文件
    |-- README.md  #项目介绍文件
    |-- bin  #存放可执行文件
    |   |-- www
    |-- db  #数据库连接文件
    |   |-- db.js
    |-- public  存放静态资源文件
    |   |-- images
    |       |-- admin  #存放管理员图片文件
    |       |-- avatar  #存放用户图片文件
    |       |-- movie  #存放电影海报图片文件
    |-- routes  #路由
    |   |-- index.js
    |-- util  #工具包
    |   |-- util.js
    |-- views  #视图
        |-- error.ejs
        |-- index.ejs

## 启动前

1. 安装好mysql文件
2. 导入数据文件[db_film.sql](https://github.com/J1ong/FilmSys/blob/master/db_film.sql)或者自己新建名为db_film数据库，然后复制数据文件[db_film.sql](https://github.com/J1ong/FilmSys/blob/master/db_film.sql)的内容，执行sql语句。
3. 根据自己数据库的信息修改数据库配置信息[db.js](https://github.com/J1ong/FilmSys/blob/master/film_api/db/db.js)的内容

## 启动项目

```bash
#输入命令前需要进入到film_api中,即在film_api目录下输入以下命令
npm install  #安装依赖包
nodemon app.js  #启动
```

## 最后

**在浏览器地址栏输入http://localhost:3000/ 可以看到Express框架的启动页面，那就表明你应该部署启动成功了**
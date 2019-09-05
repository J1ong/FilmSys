const express = require('express');
const router = express.Router();
const conn = require('../db/db');
const svgCaptcha = require('svg-captcha');
const util = require('../util/util');
const multer = require('multer');

// 用户API
let user = {};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//获取手机验证码
router.get('/api/getPhoneCode', function(req, res) {
  let phone = req.query.phone;
  let phoneCode = util.randomCode(4);
  if (!phoneCode) {
    res.json({error_code:1,message:'获取验证码失败'});
  }else{
    user[phone] = phoneCode;
    res.json({success_code:200,data:phoneCode});
  }
});
//获取图形验证码
router.get('/api/captcha', function (req, res) {
  let captcha = svgCaptcha.create({
    size: 4, // size of random string
    ignoreChars: '0o1i',// filter out some characters like 0o1i
    noise: 3 ,// number of noise lines
    color: true, //, characters will have distinct colors instead of grey, true if background option is set
    background: '#fff', // background color of the svg image
  });
  //保存图形验证码文本
  req.session.captcha = captcha.text.toLowerCase();
  //返回验证码数据
  res.type('svg');
  res.status(200).send(captcha.data);
});
//手机登录
router.post('/api/phoneLogin',function(req, res){
  let phone = req.body.phone;
  let phoneCode = req.body.phoneCode;
  //判断手机验证码是否正确
  if (user[phone]===phoneCode) {
    let sqlStr = 'SELECT * from t_user WHERE phone = ? LIMIT 1 ;';
    conn.query(sqlStr,[phone],(error,result,field)=>{
      if (error){
        res.json({error_code: 1,message: '请求数据失败'})
      } else{
        result = JSON.parse(JSON.stringify(result));
        //用户存在
        if (result[0]){
          req.session.userId = result[0].user_id;
          res.cookie('user_id',result[0].user_id);
          res.json({success_code: 200});
        } else{
          //用户不存在
          let sqlStr = 'INSERT INTO t_user(user_name,phone,avatar,password) VALUES(?,?,?,?)';
          let avatarSrc = '/images/avatar/monkey.png';
          conn.query(sqlStr,[phone,phone,avatarSrc,123456],(error,result,field)=>{
            if (error){
              console.log(error);
              res.json({error_code:1,message:'创建用户失败'});
            } else{
              res.cookie('user_id',result.insertId);
              res.json({success_code:200})
            }
          })
        }
      }
    })
  } else{
    res.json({error_code:1,message:'验证码不正确'})
  }
});
//密码登录
router.post('/api/pwdLogin',function(req,res){
  let name = req.body.userName;
  let pwd = req.body.password;
  let captcha = req.body.captcha;
  //判断验证码是否正确
  if (captcha.toLowerCase()!==req.session.captcha){
    res.json({error_code:1,message:'验证码不正确'})
  } else{
    delete req.session.captcha;
    let sqlStr = 'SELECT * from t_user WHERE user_name =? LIMIT 1 ;'
    conn.query(sqlStr,[name],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'查询用户失败'});
      } else{
        result = JSON.parse(JSON.stringify(result));
        if (result[0]){
          if (result[0].password===pwd){
            //保存用户id
            req.session.userId = result[0].user_id;
            res.cookie('user_id',result[0].user_id);
            res.json({success_code:200})
          } else{
            res.json({error_code:1,message:'密码错误'});
          }
        } else{
          res.json({error:1,message:'用户不存在'});
        }
      }
    })
  }
});
//获取用户信息
router.get('/api/getUserInfo',function(req,res){
  let userId = req.query.userId;
  if (userId){
    let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
    conn.query(sqlStr,[userId],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'获取用户信息失败'});
      } else{
        result = JSON.parse(JSON.stringify(result));
        if (result[0]){
          res.json({success_code:200,data:result[0]})
        } else{
          res.json({error_code:1,message:'用户信息不存在'});
        }
      }
    })
  }
});
//更新用户头像
router.post('/api/updateUserAvatar',function(req,res){
  let {
      userId,
      avatar,
  } = req.body;
  if (userId){
      let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
      conn.query(sqlStr,[userId],(error,result,field)=>{
          if (error){
              res.json({error_code:1,message:'用户不存在'});
          } else{
              //更新数据库
              let sqlStr = 'UPDATE t_user SET avatar = ? WHERE user_id = ?;';
              conn.query(sqlStr,[avatar,userId],(error,result,field)=>{
                  if (error){
                      res.json({error_code:1,message:'更新用户头像失败'});
                  } else{
                      res.json({success_code:200});
                  }
              });
          }
      })
  }
});
//更新用户名
router.post('/api/updateUserName',function(req,res){
  let {
    userId,
    userName,
  } = req.body;
  if (userId){
    let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
    conn.query(sqlStr,[userId],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'用户不存在'});
      } else{
        sqlStr = 'SELECT * FROM t_user WHERE user_name = ? AND user_id <> ? LIMIT 1 ;';
        conn.query(sqlStr,[userName,userId],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            result = JSON.parse(JSON.stringify(result));
            if (result[0]){
              res.json({error_code:1,message:'用户名已存在！'});
            } else{
              //更新数据库
              let sqlStr = 'UPDATE t_user SET user_name = ? WHERE user_id = ?;';
              conn.query(sqlStr,[userName,userId],(error,result,field)=>{
                if (error){
                  res.json({error_code:1,message:'更新用户名失败'});
                } else{
                  res.json({success_code:200});
                }
              });
            }
          }
        });
      }
    })
  }
});
//更新用户性别
router.post('/api/updateUserSex',function(req,res){
    let {
        userId,
        sex,
    } = req.body;
    if (userId){
        let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
        conn.query(sqlStr,[userId],(error,result,field)=>{
            if (error){
                res.json({error_code:1,message:'用户不存在'});
            } else{
                //更新数据库
                let sqlStr = 'UPDATE t_user SET sex = ? WHERE user_id = ?;';
                conn.query(sqlStr,[sex,userId],(error,result,field)=>{
                    if (error){
                        res.json({error_code:1,message:'更新用户性别失败'});
                    } else{
                        res.json({success_code:200});
                    }
                });
            }
        })
    }
});
//更新用户生日
router.post('/api/updateUserBirthday',function(req,res){
  let {
    userId,
    birthday,
  } = req.body;
  if (userId){
    let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
    conn.query(sqlStr,[userId],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'用户不存在'});
      } else{
        //更新数据库
        let sqlStr = 'UPDATE t_user SET birthday = ? WHERE user_id = ?;';
        conn.query(sqlStr,[birthday,userId],(error,result,field)=>{
          if (error){
            res.json({error_code:1,message:'更新用户生日失败'});
          } else{
            res.json({success_code:200});
          }
        });
      }
    })
  }
});
//更新用户签名
router.post('/api/updateUserSign',function(req,res){
  let {
    userId,
    sign,
  } = req.body;
  if (userId){
    let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
    conn.query(sqlStr,[userId],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'用户不存在'});
      } else{
        //更新数据库
        let sqlStr = 'UPDATE t_user SET sign = ? WHERE user_id = ?;';
        conn.query(sqlStr,[sign,userId],(error,result,field)=>{
          if (error){
            res.json({error_code:1,message:'更新用户签名失败'});
          } else{
            res.json({success_code:200});
          }
        });
      }
    })
  }
});
//更新用户信息
router.post('/api/updateUserInfo',function(req,res){
  let {
    userId,
    userName,
    avatar,
    password,
    sex,
    sign,
    birthday
  } = req.body;
  if (userId){
    let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
    conn.query(sqlStr,[userId],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'用户不存在'});
      } else{
        sqlStr = 'SELECT * FROM t_user WHERE user_name = ? AND user_id <> ? LIMIT 1 ;';
        conn.query(sqlStr,[userName,userId],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            result = JSON.parse(JSON.stringify(result));
            if (result[0]){
              res.json({error_code:1,message:'用户名已存在！'});
            } else{
              //更新数据库
              let sqlStr = 'UPDATE t_user SET user_name = ?,avatar = ?,password = ?,sex = ? ,birthday = ?,sign = ?WHERE user_id = ?;';
              conn.query(sqlStr,[userName,avatar,password,sex,birthday,sign,userId],(error,result,field)=>{
                if (error){
                  res.json({error_code:1,message:'更新用户信息失败'});
                } else{
                  res.json({success_code:200})
                }
              });
            }
          }
        });
      }
    })
  }
});
//加载电影列表
router.get('/api/getMovieList',function (req,res) {
  let sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id;';
  conn.query(sqlStr,(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'获取电影列表失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result.length){
        result = result.filter((value)=>{
          return new Date(value.show_date+','+value.show_time)-new Date()>0;
        });
        for(let i = 0; i < result.length; i++) {
          for(let j = i+1; j < result.length; j++) {
            if(result[i]['movie_id'] === result[j]['movie_id']){
              result.splice(j, 1); j = j-1;
            }
          }
        }
        res.json({success_code:200,data:result})
      } else{
        res.json({error_code:1,message:'电影列表为空'})
      }
    }
  });
});
//加载电影详细信息
router.get('/api/getMovieDetail',function (req,res) {
  let movieId = req.query.movieId;
  let sqlStr = 'SELECT * FROM t_movie WHERE movie_id = ? LIMIT 1;';
  conn.query(sqlStr,[movieId],(error,result,field)=>{
    if (error){
      res.json({error_code:1,message:'获取电影信息失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({success_code:200,data:result})
      } else{
        res.json({error_code:1,message:'该电影不存在'})
      }
    }
  });
});
//是否想看电影
router.post('/api/isWishMovie',function (req,res) {
  let {
    userId,
    movieId
  } = req.body;
  let sqlStr = 'SELECT * FROM t_wishmovie WHERE user_id = ? AND movie_id = ? LIMIT 1;';
  conn.query(sqlStr,[userId,movieId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'操作失败'});
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({success_code:200});
      } else {
        res.json({error_code:1,message:'不想看'});
      }
    }
  })
});
//想看电影
router.post('/api/wishMovie',function (req,res) {
  let {
    userId,
    movieId
  } = req.body;
  let sqlStr = 'INSERT INTO t_wishmovie(user_id,movie_id) VALUES(?,?)';
  conn.query(sqlStr,[userId,movieId],(error,result,field)=>{
    if (error){
      res.json({error_code:1,message:'操作失败'});
    } else{
      let sqlStr = 'SELECT wish_num from t_movie WHERE movie_id = ? LIMIT 1;';
      conn.query(sqlStr,[movieId],(error,result,field)=>{
        if (error){
          res.json({error_code:1,message:'操作失败'});
        } else{
          result = JSON.parse(JSON.stringify(result));
          if (result[0]){
            //更新数据库
            let sqlStr = 'UPDATE t_movie SET wish_num = ? WHERE movie_id = ?;';
            conn.query(sqlStr,[result[0].wish_num+1,movieId],(error,result,field)=>{
              if (error){
                res.json({error_code:1,message:'更新信息失败'});
              } else{
                res.json({success_code:200})
              }
            })
          }
        }
      })
    }
  })
});
//取消想看电影
router.post('/api/cancelWishMovie',function (req,res) {
  let {
    userId,
    movieId
  } = req.body;
  let sqlStr = 'DELETE FROM t_wishmovie WHERE user_id = ? AND movie_id =? ;';
  conn.query(sqlStr,[userId,movieId],(error,result,field)=>{
    if (error){
      res.json({error_code:1,message:'操作失败'});
    } else{
      let sqlStr = 'SELECT wish_num from t_movie WHERE movie_id = ? LIMIT 1;';
      conn.query(sqlStr,[movieId],(error,result,field)=>{
        if (error){
          res.json({error_code:1,message:'操作失败'});
        } else{
          result = JSON.parse(JSON.stringify(result));
          if (result[0]){
            //更新数据库
            let sqlStr = 'UPDATE t_movie SET wish_num = ? WHERE movie_id = ?;';
            conn.query(sqlStr,[result[0].wish_num-1,movieId],(error,result,field)=>{
              if (error){
                res.json({error_code:1,message:'更新信息失败'});
              } else{
                res.json({success_code:200})
              }
            })
          }
        }
      })
    }
  })
});
//获取当前用户评论
router.get('/api/getUserComment',function (req,res) {
  let {
    userId,
    movieId
  } = req.query;
  let sqlStr = 'SELECT * FROM t_comment WHERE user_id = ? AND movie_id= ? LIMIT 1;';
  conn.query(sqlStr,[userId,movieId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'操作失败'});
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({success_code:200,data:result[0]});
      } else{
        res.json({error_code:1,message:'用户未评论'});
      }
    }
  })
});
//获取所有用户通过审核的评论
router.get('/api/getAllUserPassComment',function (req,res) {
  let {
    movieId
  } = req.query;
  let sqlStr = 'SELECT * FROM t_user user INNER JOIN t_comment comment ON user.user_id = comment.user_id WHERE comment.movie_id = ? AND comment.is_pass = ? ;';
  conn.query(sqlStr,[movieId,1],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'操作失败'});
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result){
        res.json({success_code:200,data:result});
      } else{
        res.json({error_code:1,message:'未评论'});
      }
    }
  })
});
//更新用户评论
router.post('/api/updateUserComment',function (req,res) {
  let{
    userId,
    movieId,
    score,
    commentContent,
    commentDate
  } = req.body;
  let sqlStr = 'SELECT comment_id from t_comment WHERE user_id = ? AND movie_id = ? LIMIT 1';
  conn.query(sqlStr,[userId,movieId],(error,result,field)=>{
    if (error){
      res.json({error_code:1,message:'操作失败'});
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        //评论存在
        //更新
        let sqlStr = 'UPDATE t_comment SET user_score = ?, comment_content = ?, comment_date = ?,support_num = ?,is_pass = ?,support_user = ? WHERE comment_id = ? ;';
        conn.query(sqlStr,[score,commentContent,commentDate,0,0,undefined,result[0].comment_id],(error,result,field)=>{
          if (error){
            res.json({error_code:1,message:'更新评论失败'});
          } else{
            res.json({success_code:200})
          }
        })
      } else{
        //评论不存在
        let sqlStr = 'INSERT INTO t_comment(user_id,movie_id,user_score,comment_content,comment_date,support_num,is_pass) VALUES(?,?,?,?,?,?,?)';
        conn.query(sqlStr,[userId,movieId,score,commentContent,commentDate,0,0],(error,result,field)=>{
          if (error){
            console.log(error);
            res.json({error_code:1,message:'操作失败'});
          } else{
            res.json({success_code:200})
          }
        })
      }
    }
  })
});
//获取当前评论
router.get('/api/getCommentByID',function (req,res) {
  let {
    commentId
  } = req.query;
  let sqlStr = 'SELECT * FROM t_comment WHERE comment_id = ? LIMIT 1;';
  conn.query(sqlStr,[commentId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'操作失败'});
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({success_code:200,data:result[0]});
      } else{
        res.json({error_code:1,message:'用户未评论'});
      }
    }
  })
});
//更新当前评论的用户点赞
router.post('/api/updateUserSupport',function (req,res) {
  let {
    commentId,
    supportNum,
    supportUser
  } = req.body;
  let sqlStr = 'UPDATE t_comment SET support_num = ? , support_user = ? WHERE comment_id = ?;';
  conn.query(sqlStr,[supportNum,supportUser,commentId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'操作失败'});
    } else{
        res.json({success_code:200});
    }
  })
});
//加载影院列表
router.get('/api/getCinemaList',function (req,res) {
  let sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_cinema ON t_schedule.cinema_id = t_cinema.cinema_id INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id;';
  conn.query(sqlStr,(error,result,field)=>{
    if (error){
      res.json({error_code:1,message:'获取影院列表失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result.length){
        result = result.filter((value)=>{
          return new Date(value.show_date+','+value.show_time)-new Date()>0;
        });
        for(let i = 0; i < result.length; i++) {
          for(let j = i+1; j < result.length; j++) {
            if(result[i]['cinema_id'] === result[j]['cinema_id']){
              result.splice(j, 1); j = j-1;
            }
          }
        }
      }
      res.json({success_code:200,data:result})
    }
  });
});
//加载当前影院详细信息
router.get('/api/getCurrentCinemaDetail',function (req,res) {
  let cinemaId = req.query.cinemaId;
  let sqlStr = 'SELECT * FROM t_cinema WHERE cinema_id = ? LIMIT 1;';
  conn.query(sqlStr,[cinemaId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'获取当前影院信息失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({success_code:200,data:result[0]})
      } else{
        res.json({error_code:1,message:'影院不存在'})
      }
    }
  });
});
//加载当前影院排片
router.get('/api/getCurrentCinemaMovieSchedule',function (req,res) {
  let cinemaId = req.query.cinemaId;
  console.log(cinemaId);
  let sqlStr = 'SELECT * FROM t_schedule WHERE cinema_id = ?;';
  conn.query(sqlStr,[cinemaId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'获取当前影院排片信息失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result){
        let tempMovieArr = [];
        result.forEach((value)=>{
          if (new Date()-new Date(value.show_date+','+value.show_time)<=0){
            tempMovieArr.push(value.movie_id);
          }
        });
        tempMovieArr = Array.from(new Set(tempMovieArr));
        let movieArray = [];
        let movieScheduleArray = [];
        tempMovieArr.forEach((value)=>{
          sqlStr = 'SELECT * FROM t_movie WHERE movie_id = ? LIMIT 1;';
          conn.query(sqlStr,[value],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              result = JSON.parse(JSON.stringify(result));
              if (result[0]){
                movieArray.push(result[0]);
              }
            }
          });
          sqlStr = 'SELECT * FROM t_schedule schedule INNER JOIN t_movie movie ON schedule.movie_id = movie.movie_id WHERE schedule.movie_id = ? AND schedule.cinema_id = ?;';
          conn.query(sqlStr,[value,cinemaId],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              result = JSON.parse(JSON.stringify(result));
              if (result){
                movieScheduleArray.push(result);
              }
            }
          })
        });
        setTimeout(()=>{
          res.json({
            success_code:200,
            data:{
              hasMovieInfo:movieArray,
              movieScheduleInfo:movieScheduleArray,
            }
          });
        },500);
      } else{
        res.json({error_code:1,message:'当前影院排片信息为空'})
      }
    }
  });
});
//加载当前影院详细信息
router.get('/api/getScheduleById',function (req,res) {
  let scheduleId = req.query.scheduleId;
  let sqlStr = 'SELECT * FROM t_schedule WHERE schedule_id = ? LIMIT 1;';
  conn.query(sqlStr,[scheduleId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'获取当前排片信息失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({success_code:200,data:result[0]})
      } else{
        res.json({error_code:1,message:'排片信息不存在'})
      }
    }
  });
});
//加载当前影院详细信息
router.post('/api/updateScheduleSeat',function (req,res) {
  let {
    scheduleId,
    seatInfo
  } = req.body;
  let sqlStr = 'UPDATE t_schedule SET seat_info = ? WHERE schedule_id = ? LIMIT 1;';
  conn.query(sqlStr,[seatInfo,scheduleId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'更新排片座位信息失败'})
    } else{
      res.json({success_code:200,data:result[0]})
    }
  });
});
//加载当前电影排片
router.get('/api/getCurrentMovieSchedule',function (req,res) {
  let movieId = req.query.movieId;
  let sqlStr = 'SELECT * FROM t_schedule WHERE movie_id = ?;';
  conn.query(sqlStr,[movieId],(error,result,field)=>{
    if (error){
      console.log(error);
      res.json({error_code:1,message:'获取当前影院排片信息失败'})
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result){
        let tempDateArr = [];
        result.forEach((value)=>{
          if (new Date()-new Date(value.show_date+','+value.show_time)<=0){
            tempDateArr.push(value.show_date);
          }
        });
        tempDateArr = Array.from(new Set(tempDateArr));
        tempDateArr.sort((a,b)=>{
          return new Date(a)-new Date(b);
        });
        let cinemaArray = [];
        let cinemaScheduleArray = [];
        tempDateArr.forEach((value)=>{
          sqlStr = 'SELECT * FROM t_schedule WHERE show_date = ?';
          conn.query(sqlStr,[value],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              result = JSON.parse(JSON.stringify(result));
              if (result){
                cinemaArray.push(result);
              }
            }
          });
          sqlStr = 'SELECT * FROM t_schedule schedule INNER JOIN t_cinema cinema ON schedule.cinema_id = cinema.cinema_id WHERE schedule.movie_id = ? AND schedule.show_date = ?;';
          conn.query(sqlStr,[movieId,value],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              result = JSON.parse(JSON.stringify(result));
              if (result){
                cinemaScheduleArray.push(result);
              }
            }
          });
        });
        setTimeout(()=>{
          res.json({
            success_code:200,
            data:{
              hasCinemaInfo:cinemaArray,
              cinemaScheduleInfo:cinemaScheduleArray,
            }
          });
        },500);
      } else{
        res.json({error_code:1,message:'当前电影排片信息为空'})
      }
    }
  });
});
//根据名字匹配电影
router.get('/api/matchMovieByName',function (req,res) {
  let movieName = req.query.movieName;
  let sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id WHERE name LIKE ?;';
  conn.query(sqlStr,['%'+movieName+'%'],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result.length){
        result = result.filter((value)=>{
          return new Date(value.show_date+','+value.show_time)-new Date()>0;
        });
        for(let i = 0; i < result.length; i++) {
          for(let j = i+1; j < result.length; j++) {
            if(result[i]['movie_id'] === result[j]['movie_id']){
              result.splice(j, 1); j = j-1;
            }
          }
        }
      }
      res.json({success_code:200,data:result});
    }
  });
});
//根据名字匹配影院
router.get('/api/matchCinemaByName',function (req,res) {
  let cinemaName = req.query.cinemaName;
  let sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_cinema ON t_schedule.cinema_id = t_cinema.cinema_id INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id WHERE cinema_name LIKE ?;';
  conn.query(sqlStr,['%'+cinemaName+'%'],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result.length){
        result = result.filter((value)=>{
          return new Date(value.show_date+','+value.show_time)-new Date()>0;
        });
        for(let i = 0; i < result.length; i++) {
          for(let j = i+1; j < result.length; j++) {
            if(result[i]['cinema_id'] === result[j]['cinema_id']){
              result.splice(j, 1); j = j-1;
            }
          }
        }
      }
      res.json({success_code:200,data:result});
    }
  });
});
//用户下单
router.post('/api/order',function (req,res) {
  let {
    userId,
    scheduleId,
    orderPhone,
    orderDate,
    ticketNum,
    totalPrice,
    orderSeatInfo,
    payType
  } = req.body;
  let phoneCode = util.randomCode(6);
  let sqlStr = 'INSERT INTO t_order(user_id,schedule_id,order_phone,order_date,ticket_num,ticket_total_price,order_seat_info,pay_type,phone_code) VALUES(?,?,?,?,?,?,?,?,?); ';
  conn.query(sqlStr,[userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType,phoneCode],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      res.json({success_code:200,data:{phone_code:phoneCode}});
    }
  });
});
//获取个人订单信息
router.get('/api/getOrderByUserId',function (req,res) {
  let userId = req.query.userId;
  let sqlStr = 'SELECT * FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id INNER JOIN t_movie ON t_movie.movie_id = t_schedule.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id WHERE user_id = ?;';
  conn.query(sqlStr,[userId],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result});
    }
  });
});
//获取个人想看电影
router.get('/api/getWishMovieByUserId',function(req,res){
  let userId = req.query.userId;
  let sqlStr = 'SELECT * FROM t_wishmovie INNER JOIN t_movie ON t_wishmovie.movie_id = t_movie.movie_id WHERE user_id = ?;';
  conn.query(sqlStr,[userId],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result});
    }
  })
});
//获取个人看过的电影
router.get('/api/getIsWatchedMovieByUserId',function(req,res){
  let userId = req.query.userId;
  let sqlStr = 'SELECT * FROM t_comment INNER JOIN t_movie ON t_comment.movie_id = t_movie.movie_id WHERE user_id = ? AND is_pass = 1;';
  conn.query(sqlStr,[userId],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result});
    }
  })
});


//管理员API
//获取当前页用户

//密码登录
router.post('/api/admin/login',function(req,res){
  let name = req.body.name;
  let password = req.body.password;
  let sqlStr = 'SELECT * FROM t_admin WHERE name = ? LIMIT 1 ;';
  conn.query(sqlStr,[name,password],(error,result,field)=>{
      if (error){
        res.json({error_code:1,message:'查询用户失败'});
      } else{
        result = JSON.parse(JSON.stringify(result));
        if (result[0]){
          if (result[0].password===password){
            //保存用户id
            req.session.adminId = result[0].admin_id;
            res.cookie('admin_id',result[0].admin_id);
            res.json({success_code:200})
          } else{
            res.json({error_code:1,message:'密码错误'});
          }
        } else{
          res.json({error:1,message:'用户不存在'});
        }
      }
    })
});
//获取用户信息
router.get('/api/admin/getAdminInfo',function(req,res){
  let adminId = req.query.adminId;
  let sqlStr = 'SELECT * FROM t_admin WHERE admin_id = ? LIMIT 1 ;';
  conn.query(sqlStr,[adminId],(error,result,field)=>{
    if (error){
      res.json({error_code:1,message:'查询用户失败'});
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
          res.json({success_code:200,data:result[0]});
      } else{
        res.json({error:1,message:'用户不存在'});
      }
    }
  })
});
router.get('/api/admin/getCurrentPageUser',function(req,res){
  let {
    currentPage, pageSize,input
  } = req.query;
  let start = Number((currentPage-1)*pageSize);
  pageSize = Number(pageSize);
  let sqlStr = 'SELECT * FROM t_user WHERE user_name LIKE ? ORDER BY user_id;';
  let total;
  conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      total = result.length;
    }
  })
  sqlStr = 'SELECT * FROM t_user WHERE user_name LIKE ? ORDER BY user_id LIMIT ?,?;';
  conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result,total:total});
    }
  })
});

var datatime = './public/images/avatar/';
//将图片放到服务器
var storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  // //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, new Date().getTime()+'.jpg');
  }
});
var upload = multer({
  storage: storage
});
// let upload = multer({dest:'./public/images/avatar'}).any();
router.post('/api/admin/upLoadImg',upload.any(),function (req,res) {
  res.json({success_code:200,data:req.files});
  console.log(req.files);
});

//更新用户信息
router.post('/api/admin/updateUserInfo',function(req,res){
    let {
        userId,
        userName,
        avatar,
        password,
        sex,
        phone,
        sign,
        birthday
    } = req.body;
    if (userId){
        let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;';
        conn.query(sqlStr,[userId],(error,result,field)=>{
            if (error){
                res.json({error_code:1,message:'用户不存在'});
            } else{
              let sqlStr = 'SELECT * FROM t_user WHERE user_name = ? AND user_id <> ? LIMIT 1;';
              conn.query(sqlStr,[userName,userId],(error,result,field)=>{
                if (error){
                  console.log(error);
                } else{
                  result = JSON.parse(JSON.stringify(result));
                  if (result[0]){
                    res.json({error_code:1,message:'用户名已存在！'});
                  } else{
                    sqlStr = 'SELECT * FROM t_user WHERE phone = ? AND user_id <> ? LIMIT 1;';
                    conn.query(sqlStr,[phone,userId],(error,result,field)=>{
                      if (error){
                        console.log(error);
                      } else{
                        result = JSON.parse(JSON.stringify(result));
                        if (result[0]){
                          res.json({error_code:1,message:'手机号码已注册！'});
                        } else{
                          //更新数据库
                          let sqlStr = 'UPDATE t_user SET user_name = ?,avatar = ?,password = ?,sex = ? ,phone = ?,birthday = ?,sign = ? WHERE user_id = ?;';
                          conn.query(sqlStr,[userName,avatar,password,sex,phone,birthday,sign,userId],(error,result,field)=>{
                            if (error){
                              res.json({error_code:1,message:'更新用户信息失败'});
                              console.log(error);
                            } else{
                              res.json({success_code:200})
                            }
                          });
                        }
                      }
                    })
                  }
                }
              });
            }
        })
    }
});
//删除用户信息
router.post('/api/admin/deleteUserInfo',function(req,res){
    let {
        userId
    } = req.body;
    if (userId){
        let sqlStr = 'SELECT t_schedule.schedule_id, t_schedule.seat_info,order_seat_info FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id WHERE user_id = ?';
        conn.query(sqlStr,[userId],(error,result,field)=>{
            if (error){
                console.log(error);
            } else{
                result = JSON.parse(JSON.stringify(result));
                console.log(result);
                if (result){
                    result.forEach((value)=>{
                        let tempArr = [];
                        value.seat_info = JSON.parse(value.seat_info);
                        value.order_seat_info = JSON.parse(value.order_seat_info);
                        value.seat_info.forEach((v)=>{
                            if(value.order_seat_info.indexOf(v)===-1){
                                tempArr.push(v);
                            }
                        });
                        tempArr = JSON.stringify(tempArr);
                        sqlStr = 'UPDATE t_schedule SET seat_info = ? WHERE schedule_id = ?;';
                        conn.query(sqlStr,[tempArr,value.schedule_id],(error,result,field)=>{
                            if (error){
                                console.log(error);
                            }
                        })
                    })
                }
                sqlStr = 'DELETE FROM t_user WHERE user_id =?';
                conn.query(sqlStr,[userId],(error,result,field)=>{
                    if (error){
                        console.log(error);
                    } else {
                        res.json({success_code:200});
                    }
                })
            }
        })
    }
});
//添加用户信息
router.post('/api/admin/addUserInfo',function(req,res){
    let {
        userName,
        avatar,
        phone,
        password,
        sex,
        sign,
        birthday
    } = req.body;
        if (!avatar){
            avatar = '/images/avatar/monkey.png'
        }
        let sqlStr = 'SELECT * FROM t_user WHERE user_name = ? LIMIT 1;';
        conn.query(sqlStr,[userName],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            result = JSON.parse(JSON.stringify(result));
            if (result[0]){
              res.json({error_code:1,message:'用户名已存在！'});
            } else{
              sqlStr = 'SELECT * FROM t_user WHERE phone = ? LIMIT 1';
              conn.query(sqlStr,[phone],(error,result,field)=>{
                if (error){
                  console.log(error);
                } else{
                  result = JSON.parse(JSON.stringify(result));
                  if (result[0]){
                    res.json({error_code:1,message:'手机号码已注册！'});
                  } else{
                    sqlStr = 'INSERT INTO t_user(user_name,avatar,phone,password,sex,sign,birthday) VALUES(?,?,?,?,?,?,?);';
                    conn.query(sqlStr,[userName, avatar,phone, password, sex, sign, birthday],(error,result,field)=>{
                      if (error){
                        console.log(error);
                      } else{
                        res.json({success_code:200});
                      }
                    })
                  }
                }
              });
            }
          }
        });
});
//获取当前页电影
router.get('/api/admin/getCurrentPageMovie',function(req,res){
    let {
        currentPage, pageSize,input
    } = req.query;
    let start = Number((currentPage-1)*pageSize);
    pageSize = Number(pageSize);
    let sqlStr = 'SELECT * FROM t_movie WHERE name LIKE ? ORDER BY movie_id';
    let total;
    conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
        if (error){
            console.log(error);
        } else{
            result = JSON.parse(JSON.stringify(result));
            total = result.length;
        }
    });
    sqlStr = 'SELECT * FROM t_movie WHERE name LIKE ? ORDER BY movie_id LIMIT ?,?;';
    conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
        if (error){
            console.log(error);
        } else{
            result = JSON.parse(JSON.stringify(result));
            res.json({success_code:200,data:result,total:total});
        }
    })
});
//更新电影信息
router.post('/api/admin/updateMovieInfo',function(req,res){
    let {
        movieId,
        movieName,
        poster,
        director,
        actor,
        long,
        type,
        language,
        publicDate,
        intro
    } = req.body;
    let sqlStr = 'SELECT * FROM t_movie WHERE name = ? AND movie_id <> ? LIMIT 1;';
    conn.query(sqlStr,[movieName,movieId],(error,result,field)=>{
      if (error){
        console.log(error);
      } else{
        result = JSON.parse(JSON.stringify(result));
        if (result[0]){
          res.json({error_code:1,message:'电影名已存在！'});
        } else{
          //更新数据库
          let sqlStr = 'UPDATE t_movie SET name = ?,poster = ?,director = ?,actor = ? ,movie_long = ?,type = ?,language = ?,public_date = ?,intro = ? WHERE movie_id = ?;';
          conn.query(sqlStr,[movieName,poster,director,actor,long,type,language,publicDate,intro,movieId],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              res.json({success_code:200})
            }
          })
        }
      }
    });
});
//添加电影信息
router.post('/api/admin/addMovieInfo',function(req,res){
    let {
        movieName,
        poster,
        director,
        actor,
        long,
        type,
        language,
        publicDate,
        intro
    } = req.body;
    let sqlStr = 'SELECT * FROM t_movie WHERE name = ? LIMIT 1;';
    conn.query(sqlStr,[movieName],(error,result,field)=>{
      if (error){
        console.log(error);
      } else{
        result = JSON.parse(JSON.stringify(result));
        if (result[0]){
          res.json({error_code:1,message:'电影名已存在！'});
        } else{
          let sqlStr = 'INSERT INTO t_movie(name,poster,director,actor,movie_long,type,language,public_date,intro) VALUES(?,?,?,?,?,?,?,?,?);';
          conn.query(sqlStr,[movieName,poster,director,actor,long,type,language,publicDate,intro],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              res.json({success_code:200});
            }
          })
        }
      }
    });
});

 datatime = './public/images/movie/';
//将图片放到服务器
 storage = multer.diskStorage({
    // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
    destination: datatime,
    // //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        cb(null, new Date().getTime()+'.jpg');
    }
});
 upload = multer({
    storage: storage
});
router.post('/api/admin/upLoadMovieImg',upload.any(),function (req,res) {
    res.json({success_code:200,data:req.files});
    console.log(req.files);
});
//删除电影信息
router.post('/api/admin/deleteMovieInfo',function(req,res){
    let {
        movieId
    } = req.body;
    let sqlStr = 'DELETE FROM t_movie WHERE movie_id =?';
    conn.query(sqlStr,[movieId],(error,result,field)=>{
        if (error){
            console.log(error);
        } else {
            res.json({success_code:200});
        }
    })
});
//获取当前页影院
router.get('/api/admin/getCurrentPageCinema',function(req,res){
  let {
    currentPage, pageSize,input
  } = req.query;
  let start = Number((currentPage-1)*pageSize);
  pageSize = Number(pageSize);
  let sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name LIKE ? ORDER BY cinema_id ;';
  let total;
  conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      total = result.length;
    }
  });
  sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name LIKE ? ORDER BY cinema_id LIMIT ?,?;';
  conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result,total:total});
    }
  })
});
//更新影院信息
router.post('/api/admin/updateCinemaInfo',function(req,res){
  let {
    cinemaId,
    cinemaName,
    cinemaPhone,
    address
  } = req.body;
  if (cinemaId){
    let sqlStr = 'SELECT * from t_cinema WHERE cinema_id = ? LIMIT 1;';
    conn.query(sqlStr,[cinemaId],(error,result,field)=>{
      if (error){
        console.log(error);
      } else{
        sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name = ? AND cinema_id <> ? LIMIT 1 ;';
        conn.query(sqlStr,[cinemaName,cinemaId],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            result = JSON.parse(JSON.stringify(result));
            if (result[0]){
              res.json({error_code:1,message:'影院名已存在！'});
            } else{
              //更新数据库
              let sqlStr = 'UPDATE t_cinema SET cinema_name = ?,cinema_phone = ?,specified_address = ? WHERE cinema_id = ?;';
              conn.query(sqlStr,[cinemaName,cinemaPhone,address,cinemaId],(error,result,field)=>{
                if (error){
                  res.json({error_code:1,message:'更新影院信息失败'});
                  console.log(error);
                } else{
                  res.json({success_code:200})
                }
              })
            }
          }
        });
      }
    })
  }
});
//删除影院信息
router.post('/api/admin/deleteCinemaInfo',function(req,res){
  let {
    cinemaId
  } = req.body;
    if (cinemaId){
      let sqlStr = 'DELETE FROM t_cinema WHERE cinema_id =?';
      conn.query(sqlStr,[cinemaId],(error,result,field)=>{
        if (error){
          console.log(error);
        } else {
          res.json({success_code:200});
        }
      })
    }
});
//添加影院信息
router.post('/api/admin/addCinemaInfo',function(req,res){
  let {
    cinemaName,
    cinemaPhone,
    address
  } = req.body;
  sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name = ? LIMIT 1 ;';
  conn.query(sqlStr,[cinemaName],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({error_code:1,message:'影院名已存在！'});
      } else{
        let sqlStr = 'INSERT INTO t_cinema(cinema_name,cinema_phone,specified_address) VALUES(?,?,?);';
        conn.query(sqlStr,[cinemaName,cinemaPhone,address],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            res.json({success_code:200});
          }
        })
      }
    }
  });
});
//获取当前页评论
router.get('/api/admin/getCurrentPageComment',function(req,res){
    let {
        currentPage, pageSize,input
    } = req.query;
    let start = Number((currentPage-1)*pageSize);
    pageSize = Number(pageSize);
    let sqlStr = 'SELECT * FROM t_comment INNER JOIN t_movie ON t_comment.movie_id = t_movie.movie_id INNER JOIN t_user ON t_user.user_id=t_comment.user_id WHERE t_movie.name LIKE ? ORDER BY comment_id;';
    let total;
    conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
        if (error){
            console.log(error);
        } else{
            result = JSON.parse(JSON.stringify(result));
            total = result.length;
        }
    });
    sqlStr = 'SELECT * FROM t_comment INNER JOIN t_movie ON t_comment.movie_id = t_movie.movie_id INNER JOIN t_user ON t_user.user_id=t_comment.user_id WHERE t_movie.name LIKE ? ORDER BY comment_id LIMIT ?,?;';
    conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
        if (error){
            console.log(error);
        } else{
            result = JSON.parse(JSON.stringify(result));
            res.json({success_code:200,data:result,total:total});
        }
    })
});
//通过当前评论
router.post('/api/admin/passCurrentComment',function (req,res) {
   let commentId = req.body.commentId;
   let movieId = req.body.movieId;
   if (commentId){
       let sqlStr = 'UPDATE t_comment SET is_pass = 1 WHERE comment_id = ?;';
       conn.query(sqlStr,[commentId],(error,result,field)=>{
           if (error){
               console.log(error);
           } else{
             sqlStr = 'SELECT user_score FROM t_comment WHERE movie_id = ? AND is_pass = ?;';
             conn.query(sqlStr,[movieId,1],(error,result,field)=>{
               if (error){
                 console.log(error);
               } else {
                 result = JSON.parse(JSON.stringify(result));
             let avgScore = 0;
             if (result.length){
               result.forEach((val)=>{
                 avgScore += (Number(val.user_score));
               });
               avgScore = (avgScore/Number(result.length)).toFixed(1);
             }
             sqlStr = 'UPDATE t_movie SET score = ? WHERE movie_id = ?;';
             conn.query(sqlStr,[avgScore,movieId],(error,result,field)=>{
               if (error){
                 console.log(error);
               } else{
                 res.json({success_code:200});
               }
             })
           }
       });
           }
       })
   }
});
//删除当前评论
router.post('/api/admin/deleteCurrentComment',function (req,res) {
    let commentId = req.body.commentId;
    let movieId = req.body.movieId;
    if (commentId){
        let sqlStr = 'DELETE FROM t_comment WHERE comment_id = ?;';
        conn.query(sqlStr,[commentId],(error,result,field)=>{
            if (error){
                console.log(error);
            } else{
              sqlStr = 'SELECT user_score FROM t_comment WHERE movie_id = ? AND is_pass = ?;';
              conn.query(sqlStr,[movieId,1],(error,result,field)=>{
                if (error){
                  console.log(error);
                } else {
                  result = JSON.parse(JSON.stringify(result));
                  let avgScore = 0;
                  if (result.length){
                    result.forEach((val)=>{
                      avgScore += (Number(val.user_score));
                    });
                    avgScore = (avgScore/Number(result.length)).toFixed(1);
                  }
                  sqlStr = 'UPDATE t_movie SET score = ? WHERE movie_id = ?;';
                  conn.query(sqlStr,[avgScore,movieId],(error,result,field)=>{
                    if (error){
                      console.log(error);
                    } else{
                      res.json({success_code:200});
                    }
                  })
                }
              });
            }
        })
    }
});
//获取当前页订单
router.get('/api/admin/getCurrentPageOrder',function(req,res){
  let {
    currentPage, pageSize,input
  } = req.query;
  let start = Number((currentPage-1)*pageSize);
  pageSize = Number(pageSize);
  let sqlStr = 'SELECT * FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id INNER JOIN t_movie ON t_movie.movie_id = t_schedule.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id INNER JOIN t_user ON t_order.user_id = t_user.user_id WHERE t_movie.name LIKE ? ORDER BY order_id;';
  let total;
  conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      total = result.length;
    }
  });
  sqlStr = 'SELECT * FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id INNER JOIN t_movie ON t_movie.movie_id = t_schedule.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id INNER JOIN t_user ON t_order.user_id = t_user.user_id WHERE t_movie.name LIKE ? ORDER BY order_id LIMIT ?,?;';
  conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result,total:total});
    }
  })
});
//删除订单
router.post('/api/admin/deleteOrder',function(req,res){
  let {
    orderId,
    scheduleId,
    orderSeatInfo
  } = req.body;
  if (orderId){
    let sqlStr = 'SELECT seat_info FROM t_schedule WHERE schedule_id = ?';
    conn.query(sqlStr,[scheduleId],(error,result,field)=>{
      if (error){
        console.log(error);
      } else{
        result = result[0].seat_info;
        result = JSON.parse(result);
        orderSeatInfo = JSON.parse(orderSeatInfo);
        console.log(typeof result);
        console.log(typeof orderSeatInfo);
        let tempArr = [];
        result.forEach((value)=>{
          if (orderSeatInfo.indexOf(value)===-1){
            tempArr.push(value);
          }
        });
        console.log(tempArr);
        result = JSON.stringify(tempArr);
        sqlStr = 'UPDATE t_schedule SET seat_info = ? WHERE schedule_id = ?;';
        conn.query(sqlStr,[result,scheduleId],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            sqlStr = 'DELETE FROM t_order WHERE order_id =?';
            conn.query(sqlStr,[orderId],(error,result,field)=>{
              if (error){
                console.log(error);
              } else {
                res.json({success_code:200});
              }
            })
          }
        })
      }
    })
  }
});
//获取当前页影厅
router.get('/api/admin/getCurrentPageHall',function(req,res){
  let {
    currentPage, pageSize,input
  } = req.query;
  let start = Number((currentPage-1)*pageSize);
  pageSize = Number(pageSize);
  let sqlStr = 'SELECT * FROM t_hall INNER JOIN t_cinema ON t_cinema.cinema_id = t_hall.cinema_id WHERE t_cinema.cinema_name LIKE ? ORDER BY hall_id;';
  let total;
  conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      total = result.length;
    }
  });
  sqlStr = 'SELECT * FROM t_hall INNER JOIN t_cinema ON t_cinema.cinema_id = t_hall.cinema_id WHERE t_cinema.cinema_name LIKE ? ORDER BY hall_id LIMIT ?,?;';
  conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result,total:total});
    }
  })
});
//删除影厅
router.post('/api/admin/deleteHall',function(req,res){
  let {
    cinemaId,
    hallName
  } = req.body;
  if (cinemaId){
    let sqlStr = 'SELECT schedule_id FROM t_schedule WHERE cinema_id = ? AND hall_name = ?;';
    conn.query(sqlStr,[cinemaId,hallName],(error,result,field)=>{
      if (error){
        console.log(error);
      } else{
        result = JSON.parse(JSON.stringify(result));
        console.log(result);
        if (result.length){
          result.forEach((value)=>{
            sqlStr = 'DELETE FROM t_schedule WHERE schedule_id = ?;';
            conn.query(sqlStr,[value.schedule_id],(error,result,field)=>{
              if (error){
                console.log(error);
              }
            })
          })
        }
        sqlStr = 'DELETE FROM t_hall WHERE cinema_id = ? AND name = ?';
        conn.query(sqlStr,[cinemaId,hallName],(error,result,field)=>{
          if (error){
            console.log(error);
          } else {
            res.json({success_code:200});
          }
        })
      }
    });
  }
});
//更新影厅信息
router.post('/api/admin/updateHallInfo',function(req,res){
  let {
    hallId,
    cinemaId,
    hallOldName,
    hallNewName
  } = req.body;
  if (cinemaId){
    let sqlStr = 'SELECT * FROM t_hall WHERE name = ? AND cinema_id = ? AND hall_id <> ? LIMIT 1;';
    conn.query(sqlStr,[hallNewName,cinemaId,hallId],(error,result,field)=>{
      if (error){
        console.log(error);
      } else{
        result = JSON.parse(JSON.stringify(result));
        if (result[0]){
          res.json({error_code:1,message:'该影院的影厅已存在！'});
        } else{
          sqlStr = 'UPDATE t_schedule SET hall_name = ? WHERE cinema_id = ? AND hall_name = ?';
          conn.query(sqlStr,[hallNewName,cinemaId,hallOldName],(error,result,field)=>{
            if (error){
              console.log(error);
            } else{
              //更新数据库
              let sqlStr = 'UPDATE t_hall SET name = ? WHERE cinema_id = ? AND name = ?;';
              conn.query(sqlStr,[hallNewName,cinemaId,hallOldName],(error,result,field)=>{
                if (error){
                  res.json({error_code:1,message:'更新影影厅信息失败'});
                  console.log(error);
                } else{
                  res.json({success_code:200})
                }
              })
            }
          });
        }
      }
    });
  }
});
//获取所有影院
router.get('/api/admin/getAllCinema',function(req,res){
  let sqlStr = 'SELECT cinema_id,cinema_name FROM t_cinema;';
  conn.query(sqlStr,(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result});
    }
  })
});
//添加影厅信息
router.post('/api/admin/addHallInfo',function(req,res){
  let {
    cinemaId,
    hallName
  } = req.body;
  let sqlStr = 'SELECT * FROM t_hall WHERE name = ? AND cinema_id = ? LIMIT 1;';
  conn.query(sqlStr,[hallName,cinemaId],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      if (result[0]){
        res.json({error_code:1,message:'该影院的影厅已存在！'});
      } else{
        let sqlStr = 'INSERT INTO t_hall(cinema_id,name) VALUES(?,?);';
        conn.query(sqlStr,[cinemaId,hallName],(error,result,field)=>{
          if (error){
            console.log(error);
          } else{
            res.json({success_code:200});
          }
        });
      }
    }
  });
});
//获取当前页电影
router.get('/api/admin/getCurrentPageMovieSchedule',function(req,res){
  let {
    currentPage, pageSize,input
  } = req.query;
  let start = Number((currentPage-1)*pageSize);
  pageSize = Number(pageSize);
  let sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id WHERE t_movie.name LIKE ? ORDER BY schedule_id ';
  let total;
  conn.query(sqlStr,["%"+input+"%"],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      total = result.length;
    }
  });
  sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id WHERE t_movie.name LIKE ? ORDER BY schedule_id LIMIT ?,?;';
  conn.query(sqlStr,["%"+input+"%",start,pageSize],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result,total:total});
    }
  })
});
//获取所有电影
router.get('/api/admin/getAllMovie',function(req,res){
  let sqlStr = 'SELECT * FROM t_movie;';
  conn.query(sqlStr,(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result});
    }
  })
});
//获取影院的影厅
router.get('/api/admin/getHallByCinemaId',function(req,res){
  let cinemaId = req.query.cinemaId;
  console.log(cinemaId);
  let sqlStr = 'SELECT hall_id,name FROM t_hall WHERE cinema_id = ?;';
  conn.query(sqlStr,[cinemaId],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      console.log(result);
      res.json({success_code:200,data:result});
    }
  })
});
//获取排片的某天的时间段安排
router.get('/api/admin/getHasScheduleDateTime',function(req,res){
  let {
    cinemaId,hallName,showDate
  } = req.query;
  let sqlStr = 'SELECT show_time FROM t_schedule WHERE cinema_id = ? AND hall_name = ? AND show_date = ?;';
  conn.query(sqlStr,[cinemaId,hallName,showDate],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      result = JSON.parse(JSON.stringify(result));
      res.json({success_code:200,data:result});
    }
  })
});
//添加影院信息
router.post('/api/admin/addScheduleInfo',function(req,res){
  let {
    movieId,cinemaId,hallName,showDate,showTime,price
  } = req.body;
  let sqlStr = 'INSERT INTO t_schedule(movie_id,cinema_id,hall_name,show_date,show_time,price) VALUES(?,?,?,?,?,?);';
  conn.query(sqlStr,[movieId,cinemaId,hallName,showDate,showTime,price],(error,result,field)=>{
    if (error){
      console.log(error);
    } else{
      res.json({success_code:200});
    }
  })
});
//删除影厅
router.post('/api/admin/deleteMovieSchedule',function(req,res){
  let {
    scheduleId
  } = req.body;
  if (scheduleId){
    let sqlStr = 'DELETE FROM t_schedule WHERE schedule_id = ?';
    conn.query(sqlStr,[scheduleId],(error,result,field)=>{
      if (error){
        console.log(error);
      } else {
        res.json({success_code:200});
      }
    })
  }
});
module.exports = router;

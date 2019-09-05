import ajax from './ajax'


//获取验证码
export const getPhoneCode = (phone)=>ajax('/api/getPhoneCode',{phone});
//手机登录
export const phoneLogin = (phone,phoneCode)=>ajax('/api/phoneLogin',{phone,phoneCode},'POST');
//账号密码登录
export const pwdLogin = (userName,password,captcha)=>ajax('/api/pwdLogin',{userName,password,captcha},'POST');
//获取用户信息
export const getUserInfo = (userId)=>ajax('/api/getUserInfo',{userId});
//更新用户头像
export const updateUserAvatar = (userId,avatar)=>ajax('/api/updateUserAvatar',{userId,avatar},'POST');
//更新用户名
export const updateUserName = (userId,userName)=>ajax('/api/updateUserName',{userId,userName},'POST');
//更新用户性别
export const updateUserSex = (userId,sex)=>ajax('/api/updateUserSex',{userId,sex},'POST');
//更新用户生日
export const updateUserBirthday = (userId,birthday)=>ajax('/api/updateUserBirthday',{userId,birthday},'POST');
//更新用户签名
export const updateUserSign = (userId,sign)=>ajax('/api/updateUserSign',{userId,sign},'POST');
//上传图片到服务器
export const upLoadImg = (formData)=>ajax('/api/admin/upLoadImg',formData,'POST');
//更新用户信息
export const updateUserInfo = (userId,userName,avatar,password,sex,sign,birthday)=>ajax('/api/updateUserInfo',{userId,userName,avatar,password,sex,sign,birthday},'POST');
//获取电影列表
export const getMovieList = ()=>ajax('/api/getMovieList');
//获取电影详情
export const getMovieDetail = (movieId)=>ajax('/api/getMovieDetail',{movieId});
//判断用户是否想看电影
export const isWishMovie = (userId,movieId)=>ajax('/api/isWishMovie',{userId,movieId},'POST');
//想看电影
export const wishMovie = (userId,movieId)=>ajax('/api/wishMovie',{userId,movieId},'POST');
//取消想看电影
export const cancelWishMovie = (userId,movieId)=>ajax('/api/cancelWishMovie',{userId,movieId},'POST');
//获取当前用户评论
export const getUserComment = (userId,movieId)=>ajax('/api/getUserComment',{userId,movieId});
//更新当前用户评论
export const updateUserComment = (userId,movieId,score,commentContent,commentDate)=>ajax('/api/updateUserComment',{userId,movieId,score,commentContent,commentDate},'POST');
//获取所有用户通过审核的评论
export const getAllUserPassComment = (movieId)=>ajax('/api/getAllUserPassComment',{movieId});
//获取当前评论
export const getCommentById = (commentId)=>ajax('/api/getCommentById',{commentId});
//更新当前评论的用户点赞
export const updateUserSupport = (commentId,supportNum,supportUser)=>ajax('/api/updateUserSupport',{commentId,supportNum,supportUser},'POST');
//获取电影列表
export const getCinemaList = ()=>ajax('/api/getCinemaList');
//获取当前影院详情
export const getCurrentCinemaDetail = (cinemaId)=>ajax('/api/getCurrentCinemaDetail',{cinemaId});
//获取当前影院的排片
export const getCurrentCinemaMovieSchedule = (cinemaId)=>ajax('/api/getCurrentCinemaMovieSchedule',{cinemaId});
//获取排片详情
export const getScheduleById = (scheduleId)=>ajax('/api/getScheduleById',{scheduleId});
//更新排片座位信息
export const updateScheduleSeat = (scheduleId,seatInfo)=>ajax('/api/updateScheduleSeat',{scheduleId,seatInfo},'POST');
//获取当前电影的排片
export const getCurrentMovieSchedule = (movieId)=>ajax('/api/getCurrentMovieSchedule',{movieId});
//根据名字模糊匹配电影
export const matchMovieByName = (movieName)=>ajax('/api/matchMovieByName',{movieName});
//根据名字模糊匹配影院
export const matchCinemaByName = (cinemaName)=>ajax('/api/matchCinemaByName',{cinemaName});
//用户下单
export const order = (userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType)=>ajax('/api/order',{userId,scheduleId,orderPhone,orderDate,ticketNum,totalPrice,orderSeatInfo,payType},'POST');
//获取个人订单信息
export const getOrderByUserId = (userId)=>ajax('/api/getOrderByUserId',{userId});
//获取个人想看电影
export const getWishMovieByUserId = (userId)=>ajax('/api/getWishMovieByUserId',{userId});
//获取个人评论的电影
export const getIsWatchedMovieByUserId = (userId)=>ajax('/api/getIsWatchedMovieByUserId',{userId});

import ajax from './ajax'

//登录
export const login = (name,password)=>ajax('/api/admin/login',{name,password},'POST');
//获取管理员信息
export const getAdminInfo = (adminId)=>ajax('/api/admin/getAdminInfo',{adminId});
//获取当前页用户
export const getCurrentPageUser = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageUser',{currentPage,pageSize,input});
//上传图片到服务器
export const upLoadImg = (formData)=>ajax('/api/admin/upLoadImg',formData,'POST');
//更新用户信息
export const updateUserInfo = (userId,userName,avatar,password,sex,phone,sign,birthday)=>ajax('/api/admin/updateUserInfo',{userId,userName,avatar,password,sex,phone,sign,birthday},'POST');
//删除用户信息
export const deleteUserInfo = (userId)=>ajax('/api/admin/deleteUserInfo',{userId},'POST');
//添加用户信息
export const addUserInfo = (userName,avatar,phone,password,sex,sign,birthday)=>ajax('/api/admin/addUserInfo',{userName,avatar,phone,password,sex,sign,birthday},'POST');
//获取当前页电影
export const getCurrentPageMovie = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageMovie',{currentPage,pageSize,input});
//更新电影信息
export const updateMovieInfo = (movieId,movieName,poster,director,actor,long,type,language,publicDate,intro)=>ajax('/api/admin/updateMovieInfo',{movieId,movieName,poster,director,actor,long,type,language,publicDate,intro},'POST');
//添加电影信息
export const addMovieInfo = (movieName,poster,director,actor,long,type,language,publicDate,intro)=>ajax('/api/admin/addMovieInfo',{movieName,poster,director,actor,long,type,language,publicDate,intro},'POST');
//上传图片到服务器
export const upLoadMovieImg = (formData)=>ajax('/api/admin/upLoadMovieImg',formData,'POST');
//删除电影信息
export const deleteMovieInfo = (movieId)=>ajax('/api/admin/deleteMovieInfo',{movieId},'POST');
//获取当前页影院
export const getCurrentPageCinema = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageCinema',{currentPage,pageSize,input});
//更新影院信息
export const updateCinemaInfo = (cinemaId,cinemaName,cinemaPhone,address)=>ajax('/api/admin/updateCinemaInfo',{cinemaId,cinemaName,cinemaPhone,address},'POST');
//删除影院信息
export const deleteCinemaInfo = (cinemaId)=>ajax('/api/admin/deleteCinemaInfo',{cinemaId},'POST');
//添加影院信息
export const addCinemaInfo = (cinemaName,cinemaPhone,address)=>ajax('/api/admin/addCinemaInfo',{cinemaName,cinemaPhone,address},'POST');
//获取当前页用户评论
export const getCurrentPageComment = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageComment',{currentPage,pageSize,input});
//通过当前评论
export const passCurrentComment = (commentId,movieId)=>ajax('/api/admin/passCurrentComment',{commentId,movieId},'POST');
//删除当前评论
export const deleteCurrentComment = (commentId,movieId)=>ajax('/api/admin/deleteCurrentComment',{commentId,movieId},'POST');
//获取当前页订单
export const getCurrentPageOrder = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageOrder',{currentPage,pageSize,input});
//删除订单
export const deleteOrder = (orderId,scheduleId,orderSeatInfo)=>ajax('/api/admin/deleteOrder',{orderId,scheduleId,orderSeatInfo},'POST');
//获取当前页影厅
export const getCurrentPageHall = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageHall',{currentPage,pageSize,input});
//删除影厅
export const deleteHall = (cinemaId,hallName)=>ajax('/api/admin/deleteHall',{cinemaId,hallName},'POST');
//更新影厅信息
export const updateHallInfo = (hallId,cinemaId,hallOldName,hallNewName)=>ajax('/api/admin/updateHallInfo',{hallId,cinemaId,hallOldName,hallNewName},'POST');
//获取所有影院
export const getAllCinema = ()=>ajax('/api/admin/getAllCinema');
//添加影厅信息
export const addHallInfo = (cinemaId,hallName)=>ajax('/api/admin/addHallInfo',{cinemaId,hallName},'POST');
//获取当前页排片
export const getCurrentPageMovieSchedule = (currentPage,pageSize,input)=>ajax('/api/admin/getCurrentPageMovieSchedule',{currentPage,pageSize,input});
//获取所有影院
export const getAllMovie = ()=>ajax('/api/admin/getAllMovie');
//获取所有影院
export const getHallByCinemaId = (cinemaId)=>ajax('/api/admin/getHallByCinemaId',{cinemaId});
//获取排片的某天的时间段安排
export const getHasScheduleDateTime = (cinemaId,hallName,showDate)=>ajax('/api/admin/getHasScheduleDateTime',{cinemaId,hallName,showDate});
//添加排片信息
export const addScheduleInfo = (movieId,cinemaId,hallName,showDate,showTime,price)=>ajax('/api/admin/addScheduleInfo',{movieId,cinemaId,hallName,showDate,showTime,price},'POST');
//删除电影排片
export const deleteMovieSchedule = (scheduleId)=>ajax('/api/admin/deleteMovieSchedule',{scheduleId},'POST');

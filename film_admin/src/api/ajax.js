import axios from 'axios'

//封装ajax
export default function ajax(url='',params={},type='GET'){
  let promise;
  return new Promise(((resolve, reject) => {
    //1.判断请求方式
    if ('GET'===type){
      //1.1拼接字符串
      let str = '';
      Object.keys(params).forEach((value,index) => {
        if (index+1===Object.keys(params).length){
          str+=value+'='+params[value];
        }else{
          str+=value+'='+params[value]+'&';
        }
      });
      //1.2完整路径
      url+='?'+str;
      //1.3发送get请求
      promise = axios.get(url);
    }else if('POST'===type){
      //1.3发送post请求
      promise = axios.post(url,params);
    }
    //2.返回请求结果
    promise.then((response)=>{
      resolve(response.data);
    }).catch((error)=>{
      reject(error);
    });
  }))
}

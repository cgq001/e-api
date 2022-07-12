import axios from 'axios'
import { MessageBox, ElMessage  } from 'element-plus'
import store from '../store/index'
import { getToken } from '@/utils/auth';
import Cookie from 'js-cookie';
import router from '../router/index'
var csrftoken = Cookie.get('csrfToken')

let isShow = true
let isShowLogin = true
axios.defaults.withCredentials = true;
// 创建axios实例
const service = axios.create({
    baseURL:  store.state.userApi.urlAPi , //process.env.VUE_APP_BASE_API, //URL地址   环境变量文件 .env.development
    timeout: 1000 * 60,//超时
    withCredentials: true,  //跨域时若要发生cookie,需要设置该选项withCredentials: false
    credentials: true,
})

// 请求拦截器
service.interceptors.request.use(
   
    config => {
        // if(store.getters.token){
        //     // 设置令牌请求头
            // config.headers['x-csrf-token'] = '' 
        // }
        let token = store.state.userApi.token || getToken() 
        if(token){
            config.headers = {
                "Authorization": token,
                ...config.headers
            }
        }
        return config 
        
    },
    error => {
        
        return Promise.reject(error)
    }
)

// 响应拦截
service.interceptors.response.use(
    // 通过自定义code 判定响应状态 也可以通过HTTP状态码判断
    response =>{
        const res = response.data
       
        // code 不为0 则判断为一个错误
        if(res.status !== 200){


            // 假设 10008 非法令牌  10012 其他客户端已经登陆 10015 未登录
            if((res.status === 10008 || res.status === 10015) && isShowLogin){
                isShowLogin = false 

                setTimeout(()=>{
                    isShowLogin = true
                },1000 * 60)
                // 重新登陆
                MessageBox.confirm(
                    '登陆状态异常,请重新登陆',
                    "确认登陆信息",
                    {
                        confirmButtonText: '重新登陆',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(()=>{
                    // store.dispatch('user/resetToken')
                      

                    router.push('/login')
                })
            }else{
                ElMessage .error(res.message || '请求错误')
            }

            

            // return Promise.reject(new Error(res.message || 'Error'));
            return res
    
        }else{
            return res;
        }
    },
    error =>{
        
        ElMessage.error('网络错误')
        router.push('/login')
        return Promise.reject(error)
        
    }
)

export default service;
import { getToken, setToken, removeToken } from '@/utils/auth';
// E-API自身的 数据状态
export default {
	namespaced: true,
	state: {
        token: getToken() || null,
		userInfo:{
			
		},
		urlAPi: process.env.VUE_APP_publicPath //'http://e-api-egg.nodebook.top/release' // 'https://service-g8qsbxqg-1253297781.gz.apigw.tencentcs.com/'//'http://127.0.0.1:7001', // 12
	},
	mutations: {
        setTokenState: (state, num) =>{
            state.token = num
            setToken(num)
        },
		setUserInfo: (state, num) =>{
            state.userInfo = num
        },
		outUserInfo:(state)=>{
			state.token = null
			state.userInfo = {}
			removeToken()
		}
	},
	actions: {

	}
}


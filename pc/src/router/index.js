import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/Index/Index.vue'
import store from '../store'
import { getToken } from '@/utils/auth';
const routes = [
	{
		path: '/',
		name: 'Index',
		component: Index,
		children: [
			{
				path: '',
				component: () => import('../views/Main/Index.vue'),
				children: [
					{
						path: '', // 主页
						component: () => import('../views/Main/Home/Index.vue')
					},
					{
						path: 'api', // 接口
						component: () => import('../views/Main/Api/Index.vue'),
						children: [
							{
								path: '',
								component: () => import('../views/Main/Api/Item/Index.vue'),
							}
						]
					},
					{
						path: 'project', // 项目
						component: () => import('../views/Main/Project/Index.vue')
					},
					{
						path: 'label', // 标签
						component: () => import('../views/Main/Label/Index.vue')
					},
					{
						path: 'need', // 待办
						component: () => import('../views/Main/Need/Index.vue')
					},
					{
						path: 'word', // 文档
						component: () => import('../views/Main/Word/Index.vue')
					}
				]
			}
		]
	},
	{
		path: '/team',  // 团队
		name: 'Team',
		component: () => import(/* webpackChunkName: "Team" */ '../views/Team/Index.vue')
	},
	{
		path: '/register', // 注册
		name: 'register',
		component: () => import(/* webpackChunkName: "register" */ '../views/Register/Index.vue')
	},
	{
		path: '/login',  // 登录
		name: 'Login',
		component: () => import(/* webpackChunkName: "Login" */ '../views/Login/Index.vue')
	},
	{
		path: '/chrome',  // 浏览器
		name: 'Chrome',
		component: () => import('../views/Chrome/Index.vue')
	}
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})
let notAuth = ['/login','/register']
router.beforeEach((to,from,next)=>{
	if(notAuth.includes(to.path)){
		next()
	}else{
		let token = store.state.userApi.token || getToken() 
		if(token){
			next()
		}else{
			next('/login')
		}
	}
	
})

export default router

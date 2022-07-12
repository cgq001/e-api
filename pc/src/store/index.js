import { createStore } from 'vuex'

import userApi from './userApi'
import ApiList from './apiList'
import Chrome from './chrome'

export default createStore({
	state: {
		isElectron: true
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		userApi,
		ApiList,
		Chrome
	}
})

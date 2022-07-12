import { searchTeamUserInfo } from '../api/item'
import { ElMessageBox } from 'element-plus'
import router from '../router/index'
// API接口数据
export default {
	namespaced: true,
	state: {
		// 当前活跃接口
		activeApi:{

		},
		// 前些活跃文件夹
		activeFile: {

		},
		// 目录的层次结构
		fileData: [],
		// 初始化数据
		itemInfo: {
				apiName: '新建接口' , // 接口名称
				apiMethod: 'get', // 接口请求方式
				apiLink: '' , // 接口地址
				apiQequestHeader: [], // 请求-请求头
				apiQequestParams: [], // 请求-GTE请求体
				apiQequestBody: '' , //  请求-Body
				apiQesponseHeader: {} ,// 响应-头
				apiQesponseReq: {} , // 响应请求头
				apiQesponseData: '' , // 响应体
				apiQesponseSuccess: '' , // 成功体
				apiQesponseFill: '' ,  // 失败体
				apiQesponseStatus: 0 , // 状态码
				apiQesponseUpdata: '' ,// 更新时间
				apiQesponseTime: 0 , // 耗时
				uuid: '' , // 唯一ID
				isSave: 0 , // 是否保存
				parentuuid: ''
		},
		// 选项卡
        apiList: [
			
		],
		apiActiveIndex: 0 ,// 当前激活的选项卡
		globalData: [] , // 全局参数
		globalValue: -1 , // 全局环境
		isAuthInfo: {} , // 项目权限
		teamInfo: {} , // 团队信息
	},
	mutations: {
        // 设置 当前激活状态
		setApiActiveIndex(state,index){
			
			state.apiActiveIndex = parseInt(index)
			
		},
		// 设置单一属性
		setAPiName(state,{name, value}){
			if(state.apiList.length > state.apiActiveIndex){
				state.apiList[parseInt(state.apiActiveIndex)][name] = value &&  typeof value == 'string' && value.length > 0   ? value.trim() : value
				state.apiList[parseInt(state.apiActiveIndex)].isSave = state.apiList[parseInt(state.apiActiveIndex)].isSave + 1
			}else{
				// state.apiList[parseInt(state.apiActiveIndex)].apiName = ''
			}
		},
		// 设置单一不需要改变isSave的属性
		setAPiIsSave(state,{name, value}){
			if(state.apiList.length > state.apiActiveIndex){
				state.apiList[parseInt(state.apiActiveIndex)][name] = value &&  typeof value == 'string' && value.length > 0   ? value.trim() : value
				
			}else{
				// state.apiList[parseInt(state.apiActiveIndex)].apiName = ''
			}
		},
		// 添加数组属性
		setAPiOption(state, {name, value}){
			if(state.apiList.length > state.apiActiveIndex){
				state.apiList[parseInt(state.apiActiveIndex)][name].push(value)
				state.apiList[parseInt(state.apiActiveIndex)].isSave = state.apiList[parseInt(state.apiActiveIndex)].isSave + 1
			}
		},
		// 设置数组属性
		setAPiOptionItem(state, {name, value,index, key}){
			if(state.apiList.length > state.apiActiveIndex){
				state.apiList[parseInt(state.apiActiveIndex)][name][index][key] = value
				state.apiList[parseInt(state.apiActiveIndex)].isSave = state.apiList[parseInt(state.apiActiveIndex)].isSave + 1
			}
		},
		// 删除数组属性
		deleteOptionItem(state, {name,index}){
			if(state.apiList.length > state.apiActiveIndex){
				state.apiList[parseInt(state.apiActiveIndex)][name].splice(index,1)
				state.apiList[parseInt(state.apiActiveIndex)].isSave = state.apiList[parseInt(state.apiActiveIndex)].isSave + 1
			}
		},
		// 增加Tag
		addOptionItem(state){

			if(state.apiList.length == 0){
				state.apiList.push({...state.itemInfo})
				state.apiActiveIndex = 0
			}else if(state.apiActiveIndex == state.apiList.length - 1){
				state.apiList.push({...state.itemInfo})
				state.apiActiveIndex = state.apiList.length - 1
			}else{
				state.apiList.splice(state.apiActiveIndex + 1, 0, {...state.itemInfo})
				state.apiActiveIndex = state.apiActiveIndex + 1
			}
		},
		// 点击侧边栏新增Tag
		asideAddOptionItem(state,itemInfo){

			if(state.apiList.length == 0){
				state.apiList.push({...itemInfo})
				state.apiActiveIndex = 0
			}else if(state.apiActiveIndex == state.apiList.length - 1){
				state.apiList.push({...itemInfo})
				state.apiActiveIndex = state.apiList.length - 1
			}else{
				state.apiList.splice(state.apiActiveIndex + 1, 0, {...itemInfo})
				state.apiActiveIndex = state.apiActiveIndex + 1
			}
		},
		// 接口刷新按钮
		refreshOptionItem(state,itemInfo){
			for(let i=0; i<state.apiList.length; i++){
				if(state.apiList[i].uuid == itemInfo.uuid){
					state.apiList[i] = {...itemInfo}
				}
			}
			
		},
		// 关闭标签
		closeOptionItem(state,index){
			if(state.apiActiveIndex == index){
				// 删除当前
				if(state.apiList.length == 1){
					// 如果只有一个
					state.apiList = [{...state.itemInfo}]
					state.apiActiveIndex = 0
				}else if(index == 0){
					state.apiList.splice(index, 1)
					state.apiActiveIndex = 0
				}else if(state.apiList.length - 1 == index){
					// 如果是最后一个
					state.apiList.pop()
					state.apiActiveIndex = state.apiActiveIndex - 1
				}else{
					// 如果在中间
					state.apiList.splice(index, 1)

				}
			}else{
				// 删除非当前
				if(index < state.apiActiveIndex){
					state.apiList.splice(index, 1)
					state.apiActiveIndex = state.apiActiveIndex - 1
				}else{
					state.apiList.splice(index, 1)
				}

			}
		},
		// 设置活跃文件夹
		setActiveFile(state, num){
			state.activeFile = num
		},
		// 设置目录的层递结构
		setFileData(state, num){
			state.fileData = num
		},
		// 设置全局变量
		setGlobalData(state, num){
			state.globalData = num
		},
		// 设置全局变量
		setGlobalDataOption(state, {index,value}){
			console.log(index)
			if(state.globalData[index] && state.globalData[index].headerdata){
				state.globalData[index].headerdata.push(value)
			}else{
				state.globalData[index].headerdata = [value]
			}
			
		},
		// 设置全局变量数组属性
		setGlobalDataItem(state, {zIndex, value,index, key}){
			if(state.globalData.length > zIndex){
				state.globalData[zIndex]['headerdata'][index][key] = value
				
			}
		},
		// 删除全局变量数组属性
		deleteGlobalDataItem(state, {zIndex,index}){
			if(state.globalData.length > zIndex){
				state.globalData[zIndex]['headerdata'].splice(index,1)
				
			}
		},
		// 设置全局环境活跃选项
		setGlobalValue(state, num){
			state.globalValue = num
		},
		// 设置项目权限
		setIsAuthInfo(state, num){
			state.isAuthInfo = { ...num}
			console.log(state.isAuthInfo)
		},
		// 设置团队信息
		setTeamInfo(state, num){
			state.teamInfo = num
		},
		// 一键清除
		clearStore(state){
			state.activeApi = {}
			state.activeFile = {}
			state.fileData = []
			state.apiList = []
			state.apiActiveIndex = 0
			state.globalData = []
			state.globalValue = -1
			state.isAuthInfo = {}
		}
	},
	actions: {
		removeApiItem({ commit, state }, uuid){
			let apiList = state.apiList
			let zIndex = -1
			for(let i=0; i<apiList.length; i++){
				if(apiList[i].uuid && apiList[i].uuid == uuid){
					zIndex = i
				}
			}
			if(zIndex > -1){
				commit('closeOptionItem',zIndex)
			}
		},
		getTeamInfo({ commit, state }, uuid){
			searchTeamUserInfo({
				uuid: uuid
			})
			.then(res => {
				if(res.status == 200){
					if(res.data && res.data.uuid){
						commit('setTeamInfo',res.data)
					}else{
						ElMessageBox.confirm(
							'你目前还没有该团队的权限,重现选择团队?',
							'警告',
							{
								confirmButtonText: '去选择团队',
								cancelButtonText: '你管我?',
								type: 'warning',
								showClose: false,
								closeOnClickModal: false,
								closeOnPressEscape: false,
								center: true,
							}
						)
							.then(() => {
								router.push('/team')
								commit('clearStore')
								window.localStorage.removeItem('projectValue')
								window.localStorage.removeItem('teamValue')
							})
							.catch(() => {
								router.push('/team')
								commit('clearStore')
								window.localStorage.removeItem('projectValue')
								window.localStorage.removeItem('teamValue')
							})
					}
				}
			})
		}
	},
	getters: {
		apiName(state){
			return  parseInt(state.apiActiveIndex)
		}
	}
}


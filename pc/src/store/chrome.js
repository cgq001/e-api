export default {
	namespaced: true,
	state: {
		chrome: null,
		// 初始化数据
		itemInfo: {
			like: 'https://www.baidu.com', // URL地址
            ico: '' , // ICO
            title: '新建窗口', // Title
            type: '1' , // 0：外部连接， 1：内部连接
            id: new Date().getTime()
		},
		// 选项卡
        apiList: [
			
		],
		apiActiveIndex: 0 ,// 当前激活的选项卡
	},
	mutations: {
        // 设置 当前激活状态
		setApiActiveIndex(state,index){
			
			state.apiActiveIndex = parseInt(index)
			
		},
        setTitleIcon(state,num){
            state.apiList[num.zIndex].ico = num.ico
        },
        setTitleTitle(state,num){
            state.apiList[num.zIndex].title = num.title
        },
		// 增加Tag
		addOptionItem(state,link){
            let itemInfo = {...state.itemInfo}
            if(link){
                itemInfo.like = link
            }
            itemInfo.id = new Date().getTime()


			if(state.apiList.length == 0){
                if(link){
                    state.apiList.push({...itemInfo})
				    state.apiActiveIndex = 0
                }else{
                    state.apiList.push({...itemInfo})
				    state.apiActiveIndex = 0
                }
				
			}else if(state.apiActiveIndex == state.apiList.length - 1){
                if(link){
                    state.apiList.push({...itemInfo})
				    state.apiActiveIndex = state.apiList.length - 1
                }else{
                    state.apiList.push({...itemInfo})
				    state.apiActiveIndex = state.apiList.length - 1
                }
				
			}else{
                
                if(link){
                   
                    state.apiList.splice(state.apiActiveIndex + 1, 0, {...itemInfo})

				    state.apiActiveIndex = state.apiActiveIndex + 1
          
                }else{
                    state.apiList.splice(state.apiActiveIndex + 1, 0, {...itemInfo})
                    state.apiActiveIndex = state.apiActiveIndex + 1
                }
				
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
		// 设置chrome
		setChrom(state, num){
			console.log(num)
			state.chrome = num
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
		}
	},
	getters: {
		apiName(state){
			return  parseInt(state.apiActiveIndex)
		}
	}
}
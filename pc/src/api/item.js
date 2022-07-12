import axios from './axios'

// 注册发送验证码
export const registerUserSendEmail = (data) => {
    return axios({
        url: '/pc/v1/user/registerUserSendEmail',
        method: 'post',
        data
    })
}

// 注册用户
export const registerUser = (data) => {
    return axios({
        url: '/pc/v1/user/add',
        method: 'post',
        data
    })
}


// 用户登录
export const userLand = (data) => {
    return axios({
        url: '/pc/v1/user/userLand',
        method: 'post',
        data
    })
}

// 获取用户信息
export const userInfo = (data) => {
    return axios({
        url: '/pc/v1/auth/user/userInfo',
        method: 'post',
        data
    })
}

// 新建团队
export const addTeam = (data) => {
    return axios({
        url: '/pc/v1/auth/team/addTeam',
        method: 'post',
        data
    })
}

// 查询用户所在团队
export const searchTeam = (data) => {
    return axios({
        url: '/pc/v1/auth/team/searchTeam',
        method: 'post',
        data
    })
}

// 批量查询用户信息
export const searchUserAllInfo = (data) => {
    return axios({
        url: '/pc/v1/auth/team/searchUserAllInfo',
        method: 'post',
        data
    })
}

// 修改团队名称
export const updataTeam = (data) => {
    return axios({
        url: '/pc/v1/auth/team/updataTeam',
        method: 'post',
        data
    })
}

// 添加项目
export const addProject = (data) => {
    return axios({
        url: '/pc/v1/auth/team/addProject',
        method: 'post',
        data
    })
}

// 查询项目
export const searchProject = (data) => {
    return axios({
        url: '/pc/v1/auth/team/searchProject',
        method: 'post',
        data
    })
}

// 根据项目ID查询用户列表
export const searchProjectUser = (data) => {
    return axios({
        url: '/pc/v1/auth/team/searchProjectUser',
        method: 'post',
        data
    })
}

// 根据项目ID修改用户信息（权限和名称）
export const updataProjectInfo = (data) => {
    return axios({
        url: '/pc/v1/auth/team/updataProjectInfo',
        method: 'post',
        data
    })
}

// 查询团队用户
export const searchTeamUser = (data) => {
    return axios({
        url: '/pc/v1/auth/team/searchTeamUser',
        method: 'post',
        data
    })
}

// 查询新建文件夹(接口)
export const addFileItem = (data) => {
    return axios({
        url: '/pc/v1/auth/team/addFileItem',
        method: 'post',
        data
    })
}

// 查询查询文件夹(接口)
export const searchFileItem = (data) => {
    return axios({
        url: '/pc/v1/auth/team/searchFileItem',
        method: 'post',
        data
    })
}

// 接口文件夹重命名
export const renameFileItem = (data) => {
    return axios({
        url: '/pc/v1/auth/team/renameFileItem',
        method: 'post',
        data
    })
}

// 删除接口文件夹
export const removeFileItem = (data) => {
    return axios({
        url: '/pc/v1/auth/team/removeFileItem',
        method: 'post',
        data
    })
}

// 新建接口
export const addApiItem = (data) => {
    return axios({
        url: '/pc/v1/auth/team/addApiItem',
        method: 'post',
        data
    })
}

// 更新接口
export const updataApiItem = (data) => {
    return axios({
        url: '/pc/v1/auth/team/updataApiItem',
        method: 'post',
        data
    })
}

// 查询所有接口
export const searchApiListArr = async (data) => {
     return await axios({
        url: '/pc/v1/auth/team/searchApiListArr',
        method: 'post',
        data
    })
}

// 查询单一接口
export const searchApiListOne = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/searchApiListOne',
       method: 'post',
       data
   })
}

// 删除接口(多个)
export const delectApiList = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/delectApiList',
       method: 'post',
       data
   })
}

// 添加环境变量
export const addGlobalItem = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/addGlobalItem',
       method: 'post',
       data
   })
}

// 查询环境变量
export const searchGlobalItem = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/searchGlobalItem',
       method: 'post',
       data
   })
}

// 修改环境变量
export const updataGlobalItem = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/updataGlobalItem',
       method: 'post',
       data
   })
}

// 修改环境变量请求头
export const updataGlobalItemOption = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/updataGlobalItemOption',
       method: 'post',
       data
   })
}

// 删除环境变量
export const removeGlobalItem = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/removeGlobalItem',
       method: 'post',
       data
   })
}

// 修改接口MOCK
export const updataApiListMock = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/updataApiListMock',
       method: 'post',
       data
   })
}

// 查询接口MOCK
export const searchApiListMock = async (data) => {
    return await axios({
       url: '/pc/v1/auth/team/searchApiListMock',
       method: 'post',
       data
   })
}

// 获取MOCK数据
export const getMock = async (data) => {
    return await axios({
       url: '/mock/' + data,
       method: 'get'
   })
}

// 修改接口Work
export const updataApiListWord = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/updataApiListWord',
        method: 'post',
        data
    })
}

// 查询接口Work
export const searchApiListWord = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/searchApiListWord',
        method: 'post',
        data
    })
}

// 搜索用户
export const searchTeamUserTeam = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/searchTeamUserTeam',
        method: 'post',
        data
    })
}

// 添加用户
export const addTeamUserItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/addTeamUserItem',
        method: 'post',
        data
    })
}

// 移除用户
export const removeTeamUserItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/removeTeamUserItem',
        method: 'post',
        data
    })
}

// 解散团队
export const removeTeamItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/removeTeamItem',
        method: 'post',
        data
    })
}

// 添加项目用户
export const addProjectUserItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/addProjectUserItem',
        method: 'post',
        data
    })
}

// 移除项目用户
export const removeProjectUserItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/removeProjectUserItem',
        method: 'post',
        data
    })
}

// 解散项目
export const removeProjectItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/removeProjectItem',
        method: 'post',
        data
    })
}

// 获取本人的项目信息
export const searchProjectUserAuth = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/searchProjectUserAuth',
        method: 'post',
        data
    })
}

// 获取团队信息
export const searchTeamUserInfo = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/searchTeamUserInfo',
        method: 'post',
        data
    })
}

// 添加便签
export const addTableItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/addTableItem',
        method: 'post',
        data
    })
}

// 修改便签
export const updataTableItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/updataTableItem',
        method: 'post',
        data
    })
}

// 查询所有便签
export const searchTable = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/searchTable',
        method: 'post',
        data
    })
}

// 删除便签
export const removeTableItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/removeTableItem',
        method: 'post',
        data
    })
}

// 添加待办
export const addNeedItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/addNeedItem',
        method: 'post',
        data
    })
}

// 查询今日代办
export const searchToadyNeed = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/searchToadyNeed',
        method: 'post',
        data
    })
}

// 修改今日代办
export const updateToadyNeed = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/updateToadyNeed',
        method: 'post',
        data
    })
}

// 删除今日代办
export const removeNeedItem = async (data) => {
    return await axios({
        url: '/pc/v1/auth/team/removeNeedItem',
        method: 'post',
        data
    })
}

// 修改密码
export const updataUserInfoPassword = async (data) => {
    return await axios({
        url: '/pc/v1/auth/user/updataUserInfoPassword',
        method: 'post',
        data
    })
}

// 修改昵称
export const updataUserInfo = async (data) => {
    return await axios({
        url: '/pc/v1/auth/user/updataUserInfo',
        method: 'post',
        data
    })
}

// 修改昵称
export const resultUserInfoPassword = async (data) => {
    return await axios({
        url: '/pc/v1/user/resultUserInfoPassword',
        method: 'post',
        data
    })
}
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // web版本
    router.get('/web', controller.web.web)
    router.get('/www', controller.web.www)
    // !开始注册用户
    /**
     * email: nodebook@qq.com   // 邮箱
     * code: 123456             // 验证码
     * password : 123456        // 密码
     * uuid: 123456             // 验证码返回的UUID
     * */ 
     router.post('/pc/v1/user/add', controller.pc.user.addUser)

     // !注册用户时发送验证码
     /** 
      * email: nodebook@qq.com
      * */ 
     router.post('/pc/v1/user/registerUserSendEmail', controller.pc.user.registerUserSendEmail)
 
     // !用户名和密码登录
     /**
      * email: nodebook@qq.com
      * password: 123456
      * */ 
     router.post('/pc/v1/user/userLand', controller.pc.user.userLand)
     // !重置密码
     /**
      * email: nodebook@qq.com
      * */ 
      router.post('/pc/v1/user/resultUserInfoPassword', controller.pc.user.resultUserInfoPassword)

     // !根据Token查询用户信息
     /**
      * */ 
      router.post('/pc/v1/auth/user/userInfo', controller.pc.user.userInfo)

      // !根据UUID查询用户信息
     /**
      * */ 
      router.post('/pc/v1/user/getUuisUserInfo', controller.pc.user.getUuisUserInfo)

       // !修改用户头像和昵称
     /**
      * */ 
      router.post('/pc/v1/auth/user/updataUserInfo', controller.pc.user.updataUserInfo)

       //
     /** !修改(登陆状态)密码
      * */ 
      router.post('/pc/v1/auth/user/updataUserInfoPassword', controller.pc.user.updataUserInfoPassword)

 
     /**  !新建团队
      * teamName: "碧莉"  团队名称
      * */ 
      router.post('/pc/v1/auth/team/addTeam', controller.pc.item.addTeam)

     /**  !查询用户所在团队
      * 
      * */ 
      router.post('/pc/v1/auth/team/searchTeam', controller.pc.item.searchTeam)

     /**  !批量查询用户信息
      * teamUserUuid: [] 用户ID
      * */ 
      router.post('/pc/v1/auth/team/searchUserAllInfo', controller.pc.item.searchUserAllInfo)

     /**  !修改团队名字
      * uuid , teamName
      * */ 
      router.post('/pc/v1/auth/team/updataTeam', controller.pc.item.updataTeam)
    /**  !新建项目
      * projectName 项目名称, projectTeamUuid 团队ID
      * */ 
    router.post('/pc/v1/auth/team/addProject', controller.pc.item.addProject)
    /**  !查询项目
      * projectTeamUuid 团队ID
      * */ 
     router.post('/pc/v1/auth/team/searchProject', controller.pc.item.searchProject)
     /**  !查询项目
      * projectUuid 项目ID
      * */ 
      router.post('/pc/v1/auth/team/searchProjectUser', controller.pc.item.searchProjectUser)
      /**  !修改项目（权限和名称）信息
      * projectUuid 项目ID projectName 项目名称 auth 权限
      * */ 
       router.post('/pc/v1/auth/team/updataProjectInfo', controller.pc.item.updataProjectInfo)
      /**  !查询团队用户
      * projectUuid 项目ID projectName 项目名称 auth 权限
      * */ 
       router.post('/pc/v1/auth/team/searchTeamUser', controller.pc.item.searchTeamUser)
     /**  !新建目录（接口）
      * projectuuid 项目ID foldername 文件夹名称 parentuuid 父ID
      * */ 
      router.post('/pc/v1/auth/team/addFileItem', controller.pc.item.addFileItem)  
      /**  !查询目录（接口）
      * projectuuid 项目ID
      * */ 
      router.post('/pc/v1/auth/team/searchFileItem', controller.pc.item.searchFileItem) 
       /**  !目录重命名（接口）
      * fileuuid 文件夹ID foldername 文件夹名字
      * */ 
      router.post('/pc/v1/auth/team/renameFileItem', controller.pc.item.renameFileItem) 
       /**  !删除目录（接口）
      * fileuuid 文件夹ID 
      * */ 
      router.post('/pc/v1/auth/team/removeFileItem', controller.pc.item.removeFileItem) 
      /**  !新建接口
      * 
      * */ 
      router.post('/pc/v1/auth/team/addApiItem', controller.pc.item.addApiItem) 
       /**  !更新接口
      * 
      * */ 
      router.post('/pc/v1/auth/team/updataApiItem', controller.pc.item.updataApiItem) 
       /**  !查询所有接口
      *   projectuuid　项目ID
      * */ 
      router.post('/pc/v1/auth/team/searchApiListArr', controller.pc.item.searchApiListArr) 
      /**  !查询单一接口
      *   uuid  接口ID
      * */ 
     router.post('/pc/v1/auth/team/searchApiListOne', controller.pc.item.searchApiListOne) 
     /**  !修改接口MOCK
      *   uuid  接口ID apiMock Mock数据(字符串)
      * */ 
      router.post('/pc/v1/auth/team/updataApiListMock', controller.pc.item.updataApiListMock) 
      /**  !查询接口MOCK
      *   uuid  接口ID 
      * */ 
      router.post('/pc/v1/auth/team/searchApiListMock', controller.pc.item.searchApiListMock) 
      /**  !MOCK数据
      *   uuid  接口ID 
      * */ 
       router.all('/mock/:uuid', controller.pc.item.getMock) 
       /**  !修改Work
      *   uuid  接口ID apiWork 富文本
      * */ 
      router.post('/pc/v1/auth/team/updataApiListWord', controller.pc.item.updataApiListWord)
       /**  !查询Work
      *   uuid  接口ID apiWork 富文本
      * */ 
      router.post('/pc/v1/auth/team/searchApiListWord', controller.pc.item.searchApiListWord)
      /**  !删除接口
      *   deleteArray  [接口ID]
      * */ 
      router.post('/pc/v1/auth/team/delectApiList', controller.pc.item.delectApiList) 
       /**  !添加全局环境
      *   projectuuid  项目ID globalname 变量名称 globallink 变量地址
      * */ 
     router.post('/pc/v1/auth/team/addGlobalItem', controller.pc.item.addGlobalItem) 
      /**  !查询全局环境
      *   projectuuid  项目ID
      * */ 
      router.post('/pc/v1/auth/team/searchGlobalItem', controller.pc.item.searchGlobalItem) 
     /**  !更新全局环境
      *   uuid ID globalname 变量名称 globallink 变量地址
      * */ 
      router.post('/pc/v1/auth/team/updataGlobalItem', controller.pc.item.updataGlobalItem) 
      /**  !更新全局环境
      *   uuid ID headerdata 请求头 
      * */ 
      router.post('/pc/v1/auth/team/updataGlobalItemOption', controller.pc.item.updataGlobalItemOption)
    /**  !删除全局环境
      *   uuid ID 
      * */ 
     router.post('/pc/v1/auth/team/removeGlobalItem', controller.pc.item.removeGlobalItem)
     /**  !搜索用户
      *   teamUser 排除的用户 email 账号
      * */ 
      router.post('/pc/v1/auth/team/searchTeamUserTeam', controller.pc.item.searchTeamUserTeam)
     /**  !向团队添加用户
      *   teamUser 排除的用户 uuid 团队账号
      * */ 
      router.post('/pc/v1/auth/team/addTeamUserItem', controller.pc.item.addTeamUserItem)    
     /**  !向团队移除用户
      *   teamUser 移除的用户 uuid 团队账号
      * */ 
      router.post('/pc/v1/auth/team/removeTeamUserItem', controller.pc.item.removeTeamUserItem)  
      /**  !解散团队
      *   uuid 团队账号
      * */ 
       router.post('/pc/v1/auth/team/removeTeamItem', controller.pc.item.removeTeamItem)
      /**  !添加项目用户
      *   uuid 项目账号 teamUser 项目用户
      * */ 
     router.post('/pc/v1/auth/team/addProjectUserItem', controller.pc.item.addProjectUserItem)
     /**  !移除项目用户
      *   uuid 项目账号 teamUser 项目用户
      * */ 
      router.post('/pc/v1/auth/team/removeProjectUserItem', controller.pc.item.removeProjectUserItem)
     /**  !删除项目
      *   uuid 项目账号 
      * */ 
      router.post('/pc/v1/auth/team/removeProjectItem', controller.pc.item.removeProjectItem)
    /**  !查询本人的项目信息
      *   uuid 项目账号 
      * */ 
     router.post('/pc/v1/auth/team/searchProjectUserAuth', controller.pc.item.searchProjectUserAuth)
     /**  !查询团队信息
      *   uuid 团队账号 
      * */ 
    router.post('/pc/v1/auth/team/searchTeamUserInfo', controller.pc.item.searchTeamUserInfo)
     /**  !添加便签
      *   
      * */ 
    router.post('/pc/v1/auth/team/addTableItem', controller.pc.item.addTableItem)
     /**  !添加便签
      *   
      * */ 
    router.post('/pc/v1/auth/team/searchTable', controller.pc.item.searchTable)
     /**  !修改便签
      *   
      * */ 
    router.post('/pc/v1/auth/team/updataTableItem', controller.pc.item.updataTableItem)
     /**  !删除便签
      *   
      * */ 
    router.post('/pc/v1/auth/team/removeTableItem', controller.pc.item.removeTableItem)
     /**  !添加待办
      *   
      * */ 
    router.post('/pc/v1/auth/team/addNeedItem', controller.pc.item.addNeedItem)
     /**  !查询今日代办
      *   
      * */ 
    router.post('/pc/v1/auth/team/searchToadyNeed', controller.pc.item.searchToadyNeed)
     /**  !修改今日代办
      *   
      * */ 
    router.post('/pc/v1/auth/team/updateToadyNeed', controller.pc.item.updateToadyNeed)
      /**  !删除今日代办
      *   
      * */ 
    router.post('/pc/v1/auth/team/removeNeedItem', controller.pc.item.removeNeedItem)
};

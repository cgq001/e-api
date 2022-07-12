'use strict';

const Controller = require('egg').Controller;
const Mock = require('mockjs')

class ItemController extends Controller {
    // todo创建团队
    async addTeam() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamName: { 
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { teamName } = ctx.request.body
        let result = await service.pc.item.addTeam({
            teamName: teamName,
            createTeamUser:  ctx.authUser.uuid,
            teamUserUuid: [ctx.authUser.uuid],
            createTime: ctx.helper.getTime()
        })
            ctx.body = ctx.helper.success({
                
            },200, '注册成功')          
    }
    // 查询团队
    async searchTeam() {
        const { ctx, service , app } = this;
        let result = await service.pc.item.searchTeam({
            uuid: ctx.authUser.uuid
        })
        ctx.body = ctx.helper.success(result,200, '查询成功') 
    }
    // 查询人员信息
    async searchUserAllInfo(){
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamUserUuid: { 
                    type: 'array' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { teamUserUuid } = ctx.request.body
        let result = await service.pc.item.searchUserAllInfo({
            teamUserUuid: teamUserUuid
        })
        ctx.body = ctx.helper.success(result,200, '查询成功') 
    }

    // 修改团队信息(根据UUID)
    async updataTeam(){
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: { 
                    type: 'string' ,
                    required: true
                },
                teamName: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { uuid,teamName } = ctx.request.body

        let result = await service.pc.item.updataTeam(uuid,{
            teamName: teamName
        })
        ctx.body = ctx.helper.success({},200, '修改成功') 
    }

    // todo添加项目
    async addProject() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectName: { 
                    type: 'string' ,
                    required: true
                },
                projectTeamUuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { projectName , projectTeamUuid } = ctx.request.body
        let result = await service.pc.item.addProject({
            projectName: projectName,
            projectTeamUuid: projectTeamUuid,
            createProjectUser:  ctx.authUser.uuid,
            projectUser: [{
                uuid: ctx.authUser.uuid,
                auth: 2 // 1 观察者  2 编辑者
            }],
            createTime: ctx.helper.getTime()
        })
            ctx.body = ctx.helper.success({
                
            },200, '创建成功')          
    }

    // 查询项目
    async searchProject() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectTeamUuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { projectTeamUuid } = ctx.request.body

        let result = await service.pc.item.searchProject({
            uuid: ctx.authUser.uuid,
            projectTeamUuid: projectTeamUuid
        })||[]
        ctx.body = ctx.helper.success(result,200, '查询成功') 
    }

    // 查询项目包含的用户
    async searchProjectUser() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectUuid: {  // 项目ID
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { projectUuid } = ctx.request.body

        let result = await service.pc.item.searchProjectUser({
            projectUuid: projectUuid
        })
        let projectUser = []
        let projectUserData = []
        if(result && result.projectUser){
            projectUser = result.projectUser
            projectUserData = projectUser.map(item =>  item.uuid)
        }
         if(projectUser.length > 0){
            let resultUser = await service.pc.item.searchUserAllInfo({
                teamUserUuid: projectUserData
            }) || []
            ctx.body = ctx.helper.success({
                dataUser: resultUser,
                authUser: projectUser
            },200, '查询成功') 
         }else{
            ctx.body = ctx.helper.success({},200, '查询成功') 
         }
    }

    // 修改项目信息
    async updataProjectInfo() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectUuid: {
                    type: 'string' ,
                    required: true
                },
                projectName: {
                    type: 'string' ,
                    required: false
                },
                auth: {
                    type: 'object' ,
                    required: false
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { projectUuid, projectName, auth } = ctx.request.body
        let result = await service.pc.item.updataProjectInfo({
            uuid: projectUuid,
            projectName: projectName,
            auth: auth
        })
        ctx.body = ctx.helper.success(result,200, '查询成功') 
    }

    // 查询团队成员
    async searchTeamUser() {
        const { ctx, service , app } = this;
        
        try {
            ctx.validate({
                projectTeamUuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { projectTeamUuid } = ctx.request.body
        

        let result = await service.pc.item.searchTeamUser({
            uuid: projectTeamUuid
        }) || {}
   
        let teamUserUuid = result.teamUserUuid || []

        let resultUser = await service.pc.item.searchUserAllInfo({
            teamUserUuid: teamUserUuid
        }) || []

        ctx.body = ctx.helper.success(resultUser,200, '查询成功') 
    }


    // todo新建文件夹
    async addFileItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                foldername: { 
                    type: 'string' ,
                    required: true
                },
                projectuuid: {
                    type: 'string' ,
                    required: true
                },
                parentuuid: {
                    type: 'string' ,
                    required: false
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { foldername , parentuuid , projectuuid } = ctx.request.body
        let result = await service.pc.item.addFileItem({
            projectuuid: projectuuid,
            foldername: foldername,
            parentuuid:  parentuuid,
            createTime: ctx.helper.getTime()
        })
            ctx.body = ctx.helper.success({
                
            },200, '创建成功')          
    }

    // todo查询项目文件夹
    async searchFileItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectuuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  projectuuid } = ctx.request.body
        
        let result = await service.pc.item.searchFileItem({
            projectuuid: projectuuid
        }) || []

            ctx.body = ctx.helper.success(result,200, '创建成功')          
    }

    // todo重命名项目文件夹
    async renameFileItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                fileuuid: {
                    type: 'string' ,
                    required: true
                },
                foldername: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  fileuuid, foldername } = ctx.request.body
        
        let result = await service.pc.item.renameFileItem({
            uuid: fileuuid,
            foldername
        }) || []

            ctx.body = ctx.helper.success(result,200, '修改成功')          
    }

    // todo重命名项目文件夹
    async removeFileItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                fileuuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  fileuuid } = ctx.request.body
        
        let result = await service.pc.item.removeFileItem({
            uuid: fileuuid
        }) || []

            ctx.body = ctx.helper.success(result,200, '修改成功')          
    }

    // todo新建接口
    async addApiItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectuuid: {
                    type: 'string' ,
                    required: false
                },
                apiName: { 
                    type: 'string' ,
                    required: false
                },
                apiMethod: { 
                    type: 'string' ,
                    required: false
                },
                apiLink: { 
                    type: 'string' ,
                    required: false
                },
                apiQequestHeader: { 
                    type: 'array' ,
                    required: false
                },
                apiQequestParams: { 
                    type: 'array' ,
                    required: false
                },
                apiQequestBody: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseHeader: { 
                    type: 'object' ,
                    required: false
                },
                apiQesponseReq: { 
                    type: 'object' ,
                    required: false
                },
                apiQesponseData: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseSuccess: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseFill: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseUpdata: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseTime: { 
                    type: 'number' ,
                    required: false
                },
                apiQesponseStatus: { 
                    type: 'number' ,
                    required: false
                },
                parentuuid: {
                    type: 'string' ,
                    required: false
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { 
               projectuuid,
                apiName,
                apiMethod,
                apiLink,
                apiQequestHeader,
                apiQequestParams,
                apiQequestBody,
                apiQesponseHeader,
                apiQesponseReq,
                apiQesponseData,
                apiQesponseSuccess , 
                apiQesponseFill , 
                apiQesponseStatus,
                apiQesponseUpdata,
                apiQesponseTime ,
                parentuuid 
            } = ctx.request.body
        let result = await service.pc.item.addApiItem({
                projectuuid,
                apiName,
                apiMethod,
                apiLink,
                apiQequestHeader,
                apiQequestParams,
                apiQequestBody,
                apiQesponseHeader,
                apiQesponseReq,
                apiQesponseData,
                apiQesponseSuccess , 
                apiQesponseFill , 
                apiQesponseStatus,
                apiQesponseUpdata,
                apiQesponseTime ,
                parentuuid ,
                createTime: ctx.helper.getTime(),
                apiUpdateUser: ctx.authUser.uuid,
                apiUpdateTime: ctx.helper.getTime()
        })

            ctx.body = ctx.helper.success({
                uuid: result.uuid
            },200, '添加成功')          
    }

     // todo更新接口
     async updataApiItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
                apiName: { 
                    type: 'string' ,
                    required: false
                },
                apiMethod: { 
                    type: 'string' ,
                    required: false
                },
                apiLink: { 
                    type: 'string' ,
                    required: false
                },
                apiQequestHeader: { 
                    type: 'array' ,
                    required: false
                },
                apiQequestParams: { 
                    type: 'array' ,
                    required: false
                },
                apiQequestBody: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseHeader: { 
                    type: 'object' ,
                    required: false
                },
                apiQesponseReq: { 
                    type: 'object' ,
                    required: false
                },
                apiQesponseData: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseSuccess: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseFill: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseUpdata: { 
                    type: 'string' ,
                    required: false
                },
                apiQesponseTime: { 
                    type: 'number' ,
                    required: false
                },
                apiQesponseStatus: { 
                    type: 'number' ,
                    required: false
                },
                parentuuid: {
                    type: 'string' ,
                    required: false
                },
                isParent: {
                    type: 'number' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { 
                uuid,
                apiName,
                apiMethod,
                apiLink,
                apiQequestHeader,
                apiQequestParams,
                apiQequestBody,
                apiQesponseHeader,
                apiQesponseReq,
                apiQesponseData,
                apiQesponseSuccess , 
                apiQesponseFill , 
                apiQesponseStatus,
                apiQesponseUpdata,
                apiQesponseTime ,
                parentuuid ,
                isParent
            } = ctx.request.body

            if(isParent == 0){
                // 不更新parentuuid
                let result = await service.pc.item.updataApiItem(uuid,{
                    apiName,
                    apiMethod,
                    apiLink,
                    apiQequestHeader,
                    apiQequestParams,
                    apiQequestBody,
                    apiQesponseHeader,
                    apiQesponseReq,
                    apiQesponseData,
                    apiQesponseSuccess , 
                    apiQesponseFill , 
                    apiQesponseStatus,
                    apiQesponseUpdata,
                    apiQesponseTime ,
                    apiUpdateUser: ctx.authUser.uuid,
                    apiUpdateTime: ctx.helper.getTime()
                })
            }else{
                let result2 = await service.pc.item.updataApiItem(uuid,{
                    apiName,
                    apiMethod,
                    apiLink,
                    apiQequestHeader,
                    apiQequestParams,
                    apiQequestBody,
                    apiQesponseHeader,
                    apiQesponseReq,
                    apiQesponseData,
                    apiQesponseSuccess , 
                    apiQesponseFill , 
                    apiQesponseStatus,
                    apiQesponseUpdata,
                    apiQesponseTime ,
                    parentuuid ,
                    apiUpdateUser: ctx.authUser.uuid,
                    apiUpdateTime: ctx.helper.getTime()
                })
            }
        

            ctx.body = ctx.helper.success({
               
            },200, '更新成功')          
    }

    // todo查询该项目的所有接口
    async searchApiListArr() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectuuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  projectuuid } = ctx.request.body
        
        let result = await service.pc.item.searchApiListArr({
            projectuuid,
            isRemove: 0
        }) || []

            ctx.body = ctx.helper.success(result,200, '查询成功')          
    }

    // todo查询单一接口
    async searchApiListOne() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.searchApiListOne({
            uuid,
            isRemove: 0
        }) || []

            ctx.body = ctx.helper.success(result,200, '查询成功')          
    }

    // !修改接口MOCK
    async updataApiListMock() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
                apiMock: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, apiMock } = ctx.request.body
        
        let result = await service.pc.item.updataApiItem(uuid,{
            apiMock
        }) || []



            ctx.body = ctx.helper.success({},200, '修改成功')          
    }
    
    // !查询接口MOCK
    async searchApiListMock() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.searchApiListMock({uuid}) || {}

            ctx.body = ctx.helper.success(result,200, '修改成功')          
    }
     // !模拟数据MOCK
     async getMock() {
        const { ctx, service , app } = this;
        
        const {  uuid } = ctx.params
        
        
        let result = await service.pc.item.searchApiListMock({uuid}) 
            if(result.apiMock){

                try{
                    // Mock
                    let mockData = JSON.parse(result.apiMock)
                    
                    let data = Mock.mock(mockData)
                    ctx.body = ctx.helper.success(data,200, '查询成功')  
                }
                catch(err){
                    ctx.body = ctx.helper.success('MOCK解析失败',200, '查询成功') 
                }
            }else{
                ctx.body = ctx.helper.success('暂无MOCK',200, '查询成功')  
            }

                    
    }

    // !修改接口Work
    async updataApiListWord() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
                apiWord: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, apiWord } = ctx.request.body
        
        let result = await service.pc.item.updataApiItem(uuid,{
            apiWord
        }) || []



            ctx.body = ctx.helper.success({},200, '修改成功')          
    }
    // !查询接口work
    async searchApiListWord() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.searchApiListWord({uuid}) || {}

            ctx.body = ctx.helper.success(result,200, '修改成功')          
    }

    // todo删除接口
    async delectApiList() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                deleteArray: {
                    type: 'array' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  deleteArray } = ctx.request.body
        
        let result = await service.pc.item.delectApiList(deleteArray) || []

            ctx.body = ctx.helper.success(result,200, '查询成功')          
    }
    // 添加环境变量
    async addGlobalItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectuuid: {
                    type: 'string' ,
                    required: true
                },
                globalname: {
                    type: 'string' ,
                    required: true
                },
                globallink: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  projectuuid, globalname, globallink } = ctx.request.body
        
        let result = await service.pc.item.addGlobalItem({
            projectuuid,
            globalname,
            globallink
        }) || []

            ctx.body = ctx.helper.success({},200, '添加成功')          
    }
    // 修改环境变量
    async updataGlobalItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
                globalname: {
                    type: 'string' ,
                    required: true
                },
                globallink: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, globalname, globallink } = ctx.request.body
        
        let result = await service.pc.item.updataGlobalItem(uuid,{
            globalname,
            globallink
        }) || []

            ctx.body = ctx.helper.success({},200, '修改成功')          
    }
    // 修改环境变量
    async updataGlobalItemOption() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
                headerdata: {
                    type: 'array' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, headerdata } = ctx.request.body
        
        let result = await service.pc.item.updataGlobalItem(uuid,{
            headerdata
        }) || []

            ctx.body = ctx.helper.success({},200, '修改成功')          
    }

    // 查询环境变量
    async searchGlobalItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                projectuuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  projectuuid  } = ctx.request.body
        
        let result = await service.pc.item.searchGlobalItem({
            projectuuid
        }) || []

            ctx.body = ctx.helper.success(result,200, '添加成功')          
    }

    // 删除环境变量
    async removeGlobalItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.removeGlobalItem({uuid})

            ctx.body = ctx.helper.success({},200, '删除成功')          
    }

    // 搜索团队可以添加的用户
    async searchTeamUserTeam() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamUser: {  // 已经添加的用户
                    type: 'array' ,
                    required: true
                },
                email: {    // 搜索关键词
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamUser, email } = ctx.request.body
        
        let result = await service.pc.item.searchTeamUserTeam({teamUser, email})

            ctx.body = ctx.helper.success(result,200, '搜索成功')          
    }

    // 添加团队用户
    async addTeamUserItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamUser: {  // 添加的用户
                    type: 'array' ,
                    required: true
                },
                uuid: {    // 团队名称
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamUser, uuid } = ctx.request.body
        
        let result = await service.pc.item.addTeamUserItem({teamUser, uuid})
            if(result.ok){
                ctx.body = ctx.helper.success({},200, '添加成功')   
            }else{
                ctx.body = ctx.helper.success({},400, '添加失败')   
            }     
    }

    // 移除团队用户
    async removeTeamUserItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamUser: {  // 移除的用户
                    type: 'string' ,
                    required: true
                },
                uuid: {    // 团队名称
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamUser, uuid } = ctx.request.body
        
        // 移除团队
        let resultTeam = await service.pc.item.removeTeamUserItem({teamUser, uuid})
        // 移除项目Project
        let result = await service.pc.item.removeProjectUserItem({teamUser, uuid})
     
            ctx.body = ctx.helper.success({},200, '移除成功')          
    }

    // 解散团队
    async removeTeamItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {    // 团队名称
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.removeTeamItem({uuid})
    
            ctx.body = ctx.helper.success({},200, '移除成功')   
         
                   
    }

    // 添加项目用户
    async addProjectUserItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamUser: {  // 添加的用户
                    type: 'array' ,
                    required: true
                },
                uuid: {    // 团队名称
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamUser, uuid } = ctx.request.body
        
        let result = await service.pc.item.addProjectUserItem({teamUser, uuid})
            if(result.ok){
                ctx.body = ctx.helper.success({},200, '添加成功')   
            }else{
                ctx.body = ctx.helper.success({},400, '添加失败')   
            }     
    }

    // 移除团队用户
    async removeProjectUserItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamUser: {  // 移除的用户
                    type: 'string' ,
                    required: true
                },
                uuid: {    // 团队名称
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamUser, uuid } = ctx.request.body
        
   
        let result = await service.pc.item.removeProjectUserItemOne({teamUser, uuid})
     
            ctx.body = ctx.helper.success({},200, '移除成功')          
    }

     // 解散项目
     async removeProjectItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {    // 项目ID
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.removeProjectItem({uuid})
    
            ctx.body = ctx.helper.success({},200, '移除成功')   
         
                   
    }

    // 解散项目
    async searchProjectUserAuth() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {    // 项目ID
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.searchProjectUserAuth(
            {
                uuid: uuid, // 项目ID
                useruuid: ctx.authUser.uuid, // 用户ID
            }
        )
        
            if(result && result.uuid){
                let bodyJson = { ...result._doc}
                let projectUser = result.projectUser
                    for(let i=0; i<projectUser.length; i++){
                        if(projectUser[i].uuid == ctx.authUser.uuid){
                            bodyJson.auth = projectUser[i]
                        }
                    }
                ctx.body = ctx.helper.success(bodyJson,200, '移除成功')
            }else{
                ctx.body = ctx.helper.success({
                    
                },200, '暂无权限')
            }               
    }

    // 查询团队信息
    async searchTeamUserInfo() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {    // 项目ID
                    type: 'string',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.searchTeamUserInfo(
            {
                uuid: uuid, // 项目ID
                useruuid: ctx.authUser.uuid
            }
        )
        
            
            ctx.body = ctx.helper.success(result,200, '查询成功')
                       
    }


    // 添加便签
    async addTableItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamuuid: {
                    type: 'string' ,
                    required: true
                },
                title: {
                    type: 'string' ,
                    required: true
                },
                content: {
                    type: 'string' ,
                    required: true
                },
                styleName: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamuuid, title, content, styleName } = ctx.request.body
        
        let result = await service.pc.item.addTableItem({
            teamuuid,
            title,
            content,
            styleName,
            useruuid: ctx.authUser.uuid,
            createTime: ctx.helper.getTime()
        }) || []

            ctx.body = ctx.helper.success({},200, '添加成功')          
    }

    // 查询便签
    async searchTable() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamuuid: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamuuid } = ctx.request.body
        
        let result = await service.pc.item.searchTable({
            teamuuid,
            useruuid: ctx.authUser.uuid
        }) || []

            ctx.body = ctx.helper.success(result,200, '查询成功')          
    }

    // 修改便签
    async updataTableItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
                title: {
                    type: 'string' ,
                    required: true
                },
                content: {
                    type: 'string' ,
                    required: true
                },
                styleName: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, title, content, styleName } = ctx.request.body
        
        let result = await service.pc.item.updataTableItem(uuid,{
            title,
            content,
            styleName
        }) 

            ctx.body = ctx.helper.success({},200, '添加成功')          
    }

    // 删除便签
    async removeTableItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, } = ctx.request.body
        
        let result = await service.pc.item.removeTableItem({
            uuid
        }) 

            ctx.body = ctx.helper.success({},200, '添加成功')          
    }

    // 添加待办
    async addNeedItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamuuid: {
                    type: 'string' ,
                    required: true
                },
                content: {
                    type: 'string' ,
                    required: true
                },
                startTime: {
                    type: 'string' ,
                    required: true
                },
                endTime: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamuuid, startTime, content, endTime } = ctx.request.body
        
        let result = await service.pc.item.addNeedItem({
            teamuuid,
            startTime: new Date(startTime).getTime(),
            content,
            endTime: new Date(endTime).getTime(),
            useruuid: ctx.authUser.uuid,
            createTime: ctx.helper.getTime()
        }) || []

            ctx.body = ctx.helper.success({},200, '添加成功')          
    }

    // 查询今日代办
    async searchToadyNeed() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                teamuuid: {
                    type: 'string' ,
                    required: true
                },
                searchTime: {
                    type: 'string' ,
                    required: true
                },
                index: {
                    type: 'number',
                    required: true
                }
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  teamuuid, searchTime, index } = ctx.request.body
        if(index == 0){
            let result = await service.pc.item.searchToadyNeed({
                teamuuid,
                searchTime,
                useruuid: ctx.authUser.uuid
            }) || []
                ctx.body = ctx.helper.success(result,200, '查询成功')     
        } else if(index == 1){
            let result = await service.pc.item.searchToadyNeedAll({
                teamuuid,
                searchTime,
                useruuid: ctx.authUser.uuid
            }) || []
                ctx.body = ctx.helper.success(result,200, '查询成功')  
        }  else if(index == 5){
            let result = await service.pc.item.searchToadyNeedNo({
                teamuuid,
                searchTime,
                useruuid: ctx.authUser.uuid
            }) || []
                ctx.body = ctx.helper.success(result,200, '查询成功')  
        }  else if(index == 2){
            let result = await service.pc.item.searchToadyNeedEd({
                teamuuid,
                searchTime,
                useruuid: ctx.authUser.uuid
            }) || []
                ctx.body = ctx.helper.success(result,200, '查询成功')  
        }   else if(index == 4){
            let result = await service.pc.item.searchToadyNeedNoEd({
                teamuuid,
                searchTime,
                useruuid: ctx.authUser.uuid
            }) || []
                ctx.body = ctx.helper.success(result,200, '查询成功')  
        } else{
            ctx.body = ctx.helper.success([],400, '查询失败')  
        }
             
    }

    // 修改今日代办
    async updateToadyNeed() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid } = ctx.request.body
        
        let result = await service.pc.item.updateToadyNeed(uuid,{
            stateActive: 1,
            saveTime: ctx.helper.getTime()
        }) 
            ctx.body = ctx.helper.success({},200, '更新成功')          
    }

    // 删除代办
    async removeNeedItem() {
        const { ctx, service , app } = this;
        try {
            ctx.validate({
                uuid: {
                    type: 'string' ,
                    required: true
                },
            })
        } catch (err) {
            
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        
        const {  uuid, } = ctx.request.body
        
        let result = await service.pc.item.removeNeedItem({
            uuid
        }) 

            ctx.body = ctx.helper.success({},200, '删除成功')          
    }
}

module.exports = ItemController;

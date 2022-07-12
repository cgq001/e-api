'use strict';

const Service = require('egg').Service;

class ItemService extends Service {
  // 添加团队
    async addTeam(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Team.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 查询团队
    async searchTeam(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Team.find({ 
                teamUserUuid: str.uuid
            });
            return results;
        } catch (err) {

      
            return JSON.stringify(err);
        }
    }

    // 查询批量用户信息(通过UUID)
    async searchUserAllInfo(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.UsersInfo.find({ 
                uuid: str.teamUserUuid
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    } 

    // 修改团队信息
    async updataTeam(uuid, str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Team.updateOne(
                { 
                    uuid: uuid
                },
                {
                    ...str
                }
            );
            return results;
        } catch (err) {


            return JSON.stringify(err);
        }
    }

    // 添加项目
    async addProject(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Project.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 查询项目(团队ID和用户ID)
    async searchProject(str){
        const { ctx, app } = this;
        try {
           
            let results = await  ctx.model.Project.aggregate(
                [   
                    {$match: {'projectTeamUuid': str.projectTeamUuid}},
                    {$unwind: "$projectUser"},
                    {$match: {"projectUser.uuid": str.uuid}}
                ]
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 查询项目(项目ID)
    async searchProjectUser(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Project.findOne({ 
                uuid: str.projectUuid
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 查询项目某用户权限
    async searchProjectUserAuth(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Project.findOne({ 
                uuid: str.uuid,
                "projectUser.uuid": str.useruuid
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 更新项目(权限)信息
    async updataProjectInfo(str){
        const { ctx, app } = this;
        try {
            let results
            if(str.auth && str.auth.uuid){
                results = await  ctx.model.Project.updateOne(
                    { 
                        uuid: str.uuid,
                        "projectUser.uuid": str.auth.uuid
                    },
                    {
                        $set: { // $inc 累加 
                           'projectUser.$.auth': str.auth.auth
                       }
                    }
                );
            }
            let results2
            if(str.projectName){
                results2 = await  ctx.model.Project.updateOne(
                    { 
                        uuid: str.uuid,
                    },
                    {
                        projectName: str.projectName
                    }
                );
            }
            
            return {results,results2};
        } catch (err) {
            return JSON.stringify(err);
        }
    }  

    // 查询团队用户
    async searchTeamUser(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Team.findOne(
                { 
                    uuid: str.uuid
                },{
                    teamUserUuid: 1
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 查询团队信息
    async searchTeamUserInfo(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Team.findOne(
                { 
                    uuid: str.uuid,
                    "teamUserUuid": {$in: [str.useruuid]}
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
     // todo新建文件夹
     async addFileItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.FileList.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

     // todo查询文件夹
     async searchFileItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.FileList.find({ 
                    ...str
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo重命名文件夹
    async renameFileItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.FileList.updateOne(
                { 
                    uuid: str.uuid
                },{
                    foldername: str.foldername
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo删除文件夹
    async removeFileItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.FileList.deleteOne(
                { 
                    uuid: str.uuid
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo新建接口
    async addApiItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo更新接口
    async updataApiItem(uuid,str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.updateOne(
                {
                    uuid: uuid
                },
                {
                    ...str
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
     // todo查询所有接口
     async searchApiListArr(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.find({ 
                    ...str
            },{
                uuid: 1,
                projectuuid: 1,
                parentuuid: 1,
                apiName: 1,
                apiMethod: 1
            }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // todo查询单一接口
    async searchApiListOne(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.findOne({ 
                    ...str
            },{
                uuid: 1,
                apiName: 1,
                apiMethod: 1,
                apiLink: 1,
                apiQequestHeader: 1,
                apiQequestParams: 1,
                apiQequestBody: 1,
                apiQesponseHeader: 1,
                apiQesponseReq: 1,
                apiQesponseData: 1,
                apiQesponseSuccess: 1,
                apiQesponseFill: 1,
                apiQesponseStatus: 1,
                apiQesponseUpdata: 1,
                apiQesponseTime: 1,
                parentuuid: 1
            }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo查询MOCK
    async searchApiListMock(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.findOne({ 
                    ...str
            },{
                uuid: 1,
                apiMock: 1
            }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo查询work
    async searchApiListWord(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.findOne({ 
                    ...str
            },{
                uuid: 1,
                apiWord: 1
            }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo删除接口
    async delectApiList(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.ApiList.updateMany(
                {
                    uuid: {$in: str}
                },
                {
                    $set:{
                        isRemove: 1
                    }
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo添加环境变量
    async addGlobalItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.GlobalApi.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo查询环境变量
    async searchGlobalItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.GlobalApi.find({ 
                projectuuid: str.projectuuid
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

     // todo更新环境变量
     async updataGlobalItem(uuid,str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.GlobalApi.updateOne(
                {
                    uuid: uuid
                },
                {
                    ...str
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo删除环境变量
    async removeGlobalItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.GlobalApi.deleteOne(
                { 
                    uuid: str.uuid
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo搜索用户
    async searchTeamUserTeam(str) {
        const { ctx, app } = this;

        const reg=new RegExp(str.email,'i')
        try {
            let results = await  ctx.model.UsersInfo.find(
                {   
                    email: {$regex:reg},
                    uuid:{ $nin: str.teamUser},
                    
                }
            ).limit(10)
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 向团队添加用户
    async addTeamUserItem(str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Team.updateOne(
                {   
                   uuid: str.uuid
                },{
                    $push: {
                        teamUserUuid: str.teamUser
                    }
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 移除团队用户
    async removeTeamUserItem(str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Team.updateOne(
                {   
                   uuid: str.uuid
                },{
                    $pull: {
                        teamUserUuid: str.teamUser
                    }
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 移除全部项目用户
    async removeProjectUserItem(str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Project.updateOne(
                {   
                    projectTeamUuid: str.uuid
                },{
                    $pull: {
                        projectUser: {
                            uuid: str.teamUser
                        }
                    }
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 移除单一项目用户
    async removeProjectUserItemOne(str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Project.updateOne(
                {   
                    uuid: str.uuid
                },{
                    $pull: {
                        projectUser: {
                            uuid: str.teamUser
                        }
                    }
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo删除团队
    async removeTeamItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Team.deleteOne(
                { 
                    uuid: str.uuid
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 向项目添加用户
    async addProjectUserItem(str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Project.updateOne(
                {   
                   uuid: str.uuid
                },{
                    $push: {
                        projectUser: str.teamUser
                    }
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

     // todo删除项目
     async removeProjectItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Project.deleteOne(
                { 
                    uuid: str.uuid
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo添加便签
    async addTableItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Label.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 查询团队信息
    async searchTable(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Label.find(
                { 
                    ...str
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 修改便签
    async updataTableItem(uuid,str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Label.updateOne(
                {   
                   uuid: uuid
                },{
                    ...str
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

     // todo删除便签
     async removeTableItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Label.deleteOne(
                { 
                    uuid: str.uuid
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo添加待办
    async addNeedItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 查询今日代办
    async searchToadyNeed(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.find(
                { 
                    teamuuid: str.teamuuid,
                    useruuid: str.useruuid,
                    endTime: {  // 
                        $gte: new Date(str.searchTime).getTime()
                    },
                    startTime: { // 
                        $lte:new Date(str.searchTime).getTime()
                    }
                }
            ).sort({stateActive: 1,createTime: -1 });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 查询全部代办
    async searchToadyNeedAll(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.find(
                { 
                    teamuuid: str.teamuuid,
                    useruuid: str.useruuid,
                }
            ).sort({  createTime: -1 , stateActive: 1});
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 未处理代办
    async searchToadyNeedNo(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.find(
                { 
                    teamuuid: str.teamuuid,
                    useruuid: str.useruuid,
                    stateActive: 0
                }
            ).sort({createTime: -1});
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 已处理代办
    async searchToadyNeedEd(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.find(
                { 
                    teamuuid: str.teamuuid,
                    useruuid: str.useruuid,
                    stateActive: 1
                }
            ).sort({createTime: -1});
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 已过期
    async searchToadyNeedNoEd(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.find(
                { 
                    teamuuid: str.teamuuid,
                    useruuid: str.useruuid,
                    stateActive: 0,
                    endTime: {  // 
                        $lt: new Date(str.searchTime).getTime()
                    }
                }
            ).sort({createTime: -1});
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 修改代办
    async updateToadyNeed(uuid,str) {
        const { ctx, app } = this;

        try {
            let results = await  ctx.model.Need.updateOne(
                {   
                   uuid: uuid
                },{
                    ...str
                }
            )
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // todo删除便签
    async removeNeedItem(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Need.deleteOne(
                { 
                    uuid: str.uuid
                }
            );
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
}

module.exports = ItemService;

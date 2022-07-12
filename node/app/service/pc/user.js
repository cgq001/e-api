'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    // 添加用户
    async addUser(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.UsersInfo.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId(),
                    qqId: 'qqId-' + ctx.helper.getuuId(),
                    openId: 'openId-' + ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    // 查询用户是否存在
    async searchUser(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.UsersInfo.findOne({ 
                email: str.email
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    } 

    // 查询用户是否存在(通过UUID)
    async searchUserUuid(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.UsersInfo.findOne({ 
                uuid: str.uuid
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    } 
    // 查询用户是否存在(通过UUID)
    async searchUserUuidEmail(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.UsersInfo.findOne({ 
                email: str.email
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 更新用户信息(通过UUID)
    async updataUserInfo(uuid,str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.UsersInfo.updateOne({ 
                uuid: uuid
            },{
                ...str
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    } 

    // 添加验证码
    async addCode(str) {
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Email.create({ 
                    ...str,
                    uuid: ctx.helper.getuuId()
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    }

    // 查询验证码是否存在(通过UUID)
    async searchCodeUuid(str){
        const { ctx, app } = this;
        try {
            let results = await  ctx.model.Email.findOne({ 
                uuid: str.uuid
            });
            return results;
        } catch (err) {
            return JSON.stringify(err);
        }
    } 

    
}

module.exports = UserService;

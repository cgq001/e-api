'use strict';

const Controller = require('egg').Controller;




// 发送验证码
const sendCode = (from, to, code)=>{
    return {
        from: from,
        to: to,
        subject: 'E-API-验证码',
        html: `
            你的验证码为: ${code}, 欢迎使用<a  style="color: red;" href='http://e-api.nodebook.top/#/'>E-API</a>接口管理工具,<span  style="color: blue;>本站基于ServeLess部署(接口免费额度有限)，仅用于功能演示</span>，验证码为系统发送,如非本人操作,请屏蔽
            `
    }
}
// 发送重置密码
const sendResult = (from, to, code)=>{
    return {
        from: from,
        to: to,
        subject: 'E-API-重置',
        html: `
            你的重置密码为: ${code}, 请尽快登录后修改密码，欢迎使用<a  style="color: red;" href='http://e-api.nodebook.top/#/'>E-API</a>接口管理工具,<span  style="color: blue;>本站基于ServeLess部署(接口免费额度有限)，仅用于功能演示</span>，验证码为系统发送,如非本人操作,请屏蔽
            `
    }
}

class UserController extends Controller {
    // todo添加用户
    async addUser() {
            const { ctx, service , app } = this;
            try {
                ctx.validate({
                    email: { 
                        type: 'email' ,
                        required: true
                    },
                    code: { 
                        type: 'string' ,
                        required: true
                    },
                    password: { 
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
            const { email , code , password , uuid } = ctx.request.body
 

            let resultCode = await service.pc.user.searchCodeUuid({
                uuid
            })
            let newDate =  new Date().getTime() + '' 
            if(!resultCode || !resultCode.code){
                ctx.body = ctx.helper.success({},402, '验证码错误')
            }else if(resultCode.code != code){
                ctx.body = ctx.helper.success({},402, '验证码错误')
            }else if(newDate - resultCode.createTime > (150 * 1000000) ){
                ctx.body = ctx.helper.success({},402, '验证码已过期')
            }else{
                 const userSrc = await service.pc.user.addUser({
                        nickName: await  ctx.helper.userNicks(),
                        email: email,
                        password: ctx.helper.bcryptData(password),
                        createData: ctx.helper.getTime()
                    })
            

                if(userSrc.uuid){
                    ctx.body = ctx.helper.success({
                  
                    },200, '注册成功')
                }else{
                    ctx.body = ctx.helper.success({
                  
                    },200, '注册失败')
                }
                
            }        
    }

    // todo注册用户时发送验证码(searchUser)
    async registerUserSendEmail(){
        const { ctx, service , app, config } = this;
        
        try {
            ctx.validate({
                email: { 
                type: 'email' ,
                required: true
              },
            })
        } catch (err) {
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }

        const { email } = ctx.request.body
        // 查询用户是否存在
        const result = await service.pc.user.searchUser({
            email: email
          })
        if(result){
            // 用户已存在
            ctx.body = ctx.helper.success({},410, '用户已存在,如忘记密码,请找回密码')
        }else {
            // 用户不存在
            let code = Math.random().toFixed(8) + '' 
            let codeData = code.substring(code.length- 6)
           
            app.email.sendMail(sendCode(config.email.client.auth.user, email, codeData), (error, response) => {
                app.email.close()
            });
             // 查询用户是否存在
             const result = await service.pc.user.addCode({
                email: email,
                code: codeData,
                createTime: ctx.helper.getTime()
            })
            if(result.uuid){
                ctx.body = ctx.helper.success({
                    uuid: result.uuid,
                    email: result.email
                },200, '验证码发送成功')
            }else{
                ctx.body = ctx.helper.success({},400, '验证码发送失败')
            }
            
        }
    }

    // todo 用户登录
    async userLand(){
        const { ctx, service , app } = this;
            try {
                ctx.validate({
                    email: { 
                        type: 'email' ,
                        required: true
                    },
                    password: { 
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

            const { email, password } = ctx.request.body 
            // 查询用户是否存在
            const result = await service.pc.user.searchUser({
                email: email
            })
            if(result){
                // 用户已存在
                let offs = await ctx.helper.comparePwd(password, result.password)
                    if(!offs){
                        ctx.body = ctx.helper.success({},410, '用户名或密码错误')
                    }else{
                        // let Token = app.jwt.sign({ uuid: result.uuid }, app.config.jwt.secret )
                        let Token =  ctx.helper.getToken({ uuid: result.uuid })

                        ctx.body = ctx.helper.success({
                            token: Token,
                        },200, '登陆成功')
                    }
            }else {
                // 账号不存在
                ctx.body = ctx.helper.success({},410, '账号不存在')
            }
    }

    // todo 根据Token获取用户信息
    async userInfo(){
        const { ctx, service , app } = this;

            const result = await service.pc.user.searchUserUuid({
                uuid:  ctx.authUser.uuid
            })
        

            if(result && result.uuid){
                delete result._doc.password // ...result._doc
                ctx.body = ctx.helper.success({...result._doc},200, '查询成功')
            }else{
                ctx.body = ctx.helper.success({},400, '查询失败')
            }     
    }

    //  修改用户昵称和头像
    async updataUserInfo(){
        const { ctx, service , app } = this;
        
        try {
            ctx.validate({
                nickName: { 
                    type: 'string' ,
                    required: true
                },
                headerImage: { 
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
        const { nickName,headerImage } = ctx.request.body
            const result = await service.pc.user.updataUserInfo(ctx.authUser.uuid ,{
                nickName,
                headerImage
            })
            
            ctx.body = ctx.helper.success({},200, '更新成功')
    }

    //  修改密码
    async updataUserInfoPassword(){
        const { ctx, service , app } = this;
        
        try {
            ctx.validate({
                newPassword: { 
                    type: 'string' ,
                    required: true
                },
                oldPassword: { 
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
        const { newPassword, oldPassword } = ctx.request.body
        
       
        const result = await service.pc.user.searchUserUuid({
            uuid:  ctx.authUser.uuid
        })
        let offs = await ctx.helper.comparePwd(oldPassword, result.password)
            if(offs){
                const resultUpdata = await service.pc.user.updataUserInfo(ctx.authUser.uuid ,{
                    password: ctx.helper.bcryptData(newPassword)
                })

                ctx.body = ctx.helper.success({},200, '更新成功')
            }else{
                ctx.body = ctx.helper.success({},400, '旧密码错误，修改失败')
            }    
    }

    //  重置
    async resultUserInfoPassword(){
        const { ctx, service , app , config} = this;
        
        try {
            ctx.validate({
                email: { 
                    type: 'email' ,
                    required: true
                },
            })
        } catch (err) {
            ctx.body = ctx.helper.validate({
                ...err.errors
            },400, '参数错误') ;
            return;
        }
        const { email } = ctx.request.body
        
       
        const result = await service.pc.user.searchUserUuidEmail({
            email:  email
        })
        if(result.uuid){
            let newPw = ['1','2','3','4','5','6','7','8','9',
                            'a','b','c','d','e','f','g','h','i','j','k',
                            'l','m','n','o','p','q','r','s','t','u','v',
                            'w','x','y','z']
            let newsData = []
                for(let i=0; i<6; i++){
                    newsData.push(newPw[parseInt(Math.random() * (newPw.length - 1))])
                }
            let password = newsData.join('')
            app.email.sendMail(sendResult(config.email.client.auth.user, email, password), (error, response) => {
                app.email.close()
            });
            const resultUpdata = await service.pc.user.updataUserInfo(result.uuid ,{
                password: ctx.helper.bcryptData(password)
            })

            ctx.body = ctx.helper.success({},200, '密码已重置,请查询邮件')

        }else{
            ctx.body = ctx.helper.success({},400, '账号不存在，修改失败')
        }
           
    }

    // todo 根据UUID获取用户信息
    async getUuisUserInfo(){
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

            const result = await service.pc.user.searchUserUuid({
                uuid:  uuid
            })
            if(result && result.uuid){
                delete result._doc.password

                ctx.body = ctx.helper.success({...result._doc},200, '查询成功')
            }else{
                ctx.body = ctx.helper.success({},300, '查询失败')
            }     
    }
}

module.exports = UserController;

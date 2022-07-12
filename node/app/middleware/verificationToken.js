const jwt = require('jsonwebtoken');

// 判断Token 中间件
module.exports = options => {
    return async function verificationToken(ctx,next){
        let token =ctx.request.headers["authorization"] // "Bearer " + 
            if(token){
                try{
                    const toeknItem = jwt.verify(token,options.pubText)
                    ctx.authUser = toeknItem;
                    await next()
                }catch(err){
                    ctx.body = {
                        status: 10008,
                        message: 'Token不正确或过期',
                        data: {}
                    }
                }
            }else{
                ctx.body = {
                    status: 10015,
                    message: '请携带token进行Ajax请求',
                    data: {}
                }
            }
    }
}
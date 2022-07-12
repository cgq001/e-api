// 引入加密插件
const bcrypt = require('bcryptjs')
const { nanoid   } =  require ('nanoid');

const jwt = require('jsonwebtoken')


module.exports = {
    /**
     * 密码加密助手函数
     * @param {String} password 原始密码
     * @return {String} 返回加密后的密码
     */
    bcryptData(password) {
        // 生成盐
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    },
    /**
     * 解密助手函数
     * @param {*} password 未加密的密码
     * @param {*} user_password 加密的密码
     * @return Promise 两个密码比对，比对成功返回true 失败返回 false
     */
     async comparePwd(password, user_password) {
      return await bcrypt.compare(password, user_password)
    },

    /**
     * 随机昵称
     * */ 
    async userNicks(){
        let name = '用户_' + parseInt(Math.random() * 10000)
        return await name
    },

    /**
     * 统一返回格式
     * */ 
    success (data = [], status=200, msg=''){
        return {
          status: status,
          message: msg,
          data: data
        }
    },
    /**
     * 统一返回格式
     * */ 
     validate (data = [], status=200, msg=''){

        let dataList = []
         for(let item in data){
             dataList.push(data[item])
         }
        return {
          status: status,
          message: msg,
          data: dataList
        }
    },
    /**
     * 生成统一的UUID
     * */ 
     getuuId (){
        return nanoid()
    },
    /**
     *  生产当前时间
     * */ 
     getTime (){
        return new Date().getTime() + ''
    },
    /**
     * 生成Token
     * */ 
    getToken (data){
        let token = jwt.sign(data,this.config.jwt.secret,{
            expiresIn: this.config.jwt.pubTime  // token时长 setToken
        })
        return token  // "Bearer " + 
    }
}
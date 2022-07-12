'use strict';
// 用户表
 
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    // 下面得操作是连接数据库
    const ArticleSchema = new Schema({
        // UID
        uuid: { 
            type: String,
            required: true,
            unique: true, // 设置唯一索引
            default: null
        },
        // 邮箱
        email: {
            type: String,
            unique: true, // 设置唯一索引
            default: null
        },
        // 密码
        password: {
            type: String,
            default: null
        },
        // APP 或者 PC端自定义昵称
        nickName: {
            type: String,
            default: 'API_'
        },
        // 小程序昵称
        wxNickName: {
            type: String,
            default: 'API_',
            trim: true // 左右去空格,
        },
        // 小程序的 openid
        openId: {
            type: String,
            unique: false, // 设置唯一索引
            default: ''
        },
        // QQ的 qqid
        qqId: {
            type: String,
            unique: false, // 设置唯一索引
            default: null
        },
        // 创建时间
        createData: {
            type: Date,
            default: ''
        },
        // 性别
        sex: {
            type: String,
            default: '男'
        },
        // 头像
        headerImage: {
            type: String,
            default: '/public/image/head/5.png'
        }

    }, { versionKey: false });
    
    return mongoose.model('UsersInfo', ArticleSchema, 'UsersInfo');
    

}

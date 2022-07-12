'use strict';
// 发送验证码记录
 
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
            required: true,
            unique: false, // 设置唯一索引
            default: null
        },
        // 验证码
        code: {
            type: String,
            default: null
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('Email', ArticleSchema, 'Email');
}

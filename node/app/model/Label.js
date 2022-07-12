'use strict';
// 便签表
 
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
        // 用户ID
        useruuid: { 
            type: String,
            required: true,
            index: true, // 设置普通索引
            default: null
        },
        // 团队ID
        teamuuid: { 
            type: String,
            required: true,
            index: true, // 设置普通索引
            default: null
        },
        // 便签名称
        title: {
            type: String,
            required: true,
            default: null
        },
        // 便签内容
        content: {
            type: String,
            default: null
        },
        // 便签样式
        styleName: {
            type: String,
            default: null
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('Label', ArticleSchema, 'Label');
}

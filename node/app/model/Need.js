'use strict';
// 待办表
 
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
        // 待办内容
        content: {
            type: String,
            default: null
        },
        // 待办状态
        stateActive: {
            type: Number,
            default: 0
        },
        // 开始时间
        startTime: {
            type: Number,
            default: null
        },
        // 结束时间
        endTime: {
            type: Number,
            default: null
        },
        // 完成时间
        saveTime: {
            type: Number,
            default: null
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('Need', ArticleSchema, 'Need');
}

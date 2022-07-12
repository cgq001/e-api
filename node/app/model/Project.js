'use strict';
// 项目表
 
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
        // 团队ID
        projectTeamUuid: {
            type: String,
            required: false,
            index: true , // 设置普通索引
            default: null
        },
        // 用户(+权限)
        projectUser: {
            type: Array,
            required: false,
            index: true , // 设置普通索引
            default: []
        },
        // 项目名称
        projectName: {
            type: String,
            default: null
        },
        // 创建者ID
        createProjectUser: {
            type: String,
            index: true , // 设置普通索引
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('Project', ArticleSchema, 'Project');
}

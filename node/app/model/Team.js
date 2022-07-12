'use strict';
// 团队表
 
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
        // 所有用户ID
        teamUserUuid: {
            type: Array,
            required: false,
            default: []
        },
        // 项目名称
        teamName: {
            type: String,
            default: null
        },
        // 创建者ID
        createTeamUser: {
            type: String,
            index: true , // 设置普通索引
            default: null
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('Team', ArticleSchema, 'Team');
}

'use strict';
// 环境变量表
 
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
        },
        // 项目ID
        projectuuid: { 
            type: String,
            required: true,
            index: true , // 设置普通索引
        },
        // 变量名称
        globalname: { 
            type: String,
            required: true,
        },
        // 变量地址
        globallink: { 
            type: String,
            required: true,
        },
        // 请求头参数
        headerdata: { 
            type: Array,
            required: false,
            default: []
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('GlobalApi', ArticleSchema, 'GlobalApi');
    

}

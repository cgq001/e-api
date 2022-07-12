'use strict';
// 项目文件表
 
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
        // 文件夹名称
        foldername: { 
            type: String,
            required: true,
        },
        parentuuid: { // 父级ID
            type: String,
            required: false,
            default: null
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('FileList', ArticleSchema, 'FileList');
    

}

'use strict';
// 接口名字
 
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
        parentuuid: { // 父级ID
            type: String,
            required: false,
            default: null
        },
        // 最后更改人
        apiUpdateUser: { 
            type: String,
            required: false,
            default: null
        },
        // 更新时间
        apiUpdateTime: { 
            type: String,
            required: false,
            default: null
        },
         // Mock数据
        apiMock: { 
            type: String,
            required: false,
            default: null
        },
         // 说明文档数据
         apiWord: { 
            type: String,
            required: false,
            default: null
        },
        // 接口名称
        apiName: {
            type: String, 
            default: ''
        },
        // 接口请求方式
        apiMethod: {
            type: String, 
            default: ''
        },
        // 接口请求地址
        apiLink: {
            type: String, 
            default: ''
        },
        // 请求-请求头
        apiQequestHeader: {
            type: Array,
            default: []
        },
        // 请求-GTE请求体
        apiQequestParams: {
            type: Array,
            default: []
        },
        // 请求-Body
        apiQequestBody: {
            type: String, 
            default: ''
        },
        // 响应-头
        apiQesponseHeader: {
            type: Object, 
            default: {}
        },
        // 响应请求头
        apiQesponseReq: {
            type: Object, 
            default: {}
        },
        // 响应体
        apiQesponseData: {
            type: String, 
            default: ''
        },
        // 成功体
        apiQesponseSuccess: {
            type: String, 
            default: ''
        },
        // 失败体
        apiQesponseFill: {
            type: String, 
            default: ''
        },
        // 状态码
        apiQesponseStatus: {
            type: Number, 
            default: ''
        },
        // 更新时间
        apiQesponseUpdata: {
            type: String, 
            default: ''
        },
        // 耗时
        apiQesponseTime: {
            type: Number, 
            default: ''
        },
        // 是否保存
        isSave: {
            type: Number, 
            default: 0
        },
        // 是否删除
        isRemove: {
            type: Number,
            required: false,
            default: 0
        },
        // 创建时间
        createTime: {
            type: String,
            default: null
        }

    }, { versionKey: false });
    
    return mongoose.model('ApiList', ArticleSchema, 'ApiList');
}

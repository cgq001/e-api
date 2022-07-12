<template>
<!-- 接口主页面 -->
    <div class="apiItem">
        <!-- 接口名字 -->
        <div class="apiItemName">
            <!-- 左侧 -->
            <div class="apiItemNameLeft">
                <el-input :modelValue="apiItem.apiName" spellcheck="false" @input="apiNameClick"  placeholder="请输入接口名称" />
            </div>
            <!-- 右侧 -->
            <div class="apiItemNameRight">
                <span class="iconfont icon-shuaxin apiItemNameRightIcon" 
                    v-show="apiItem.uuid"
                    @click="goNewsApi">同步</span>
                <span class="iconfont icon-jiekouzhongxin apiItemNameRightIcon" @click="mockDrawer = true" v-show="apiItem.uuid">Mock</span>
                <span class="iconfont icon-wendang apiItemNameRightIcon" @click="explainDrawer = true" v-show="apiItem.uuid">接口说明</span>
            </div>
        </div>
        <!-- 接口地址 -->
        <div class="apiItemapiItemUrl">
            <div class="apiItemapiItemUrlLeft">
                <el-select :modelValue="apiItem.apiMethod" @change="changeClick" class="apiItemapiItemUrlLeftSelect" placeholder="请选择请求类型" style="width: 120px;">
                    <el-option
                    v-for="item in methidOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-input :modelValue="apiItem.apiLink" spellcheck="false" @input="apiLinkClick"  placeholder="请输入接口地址" />
            </div>
            <div class="apiItemapiItemUrlRight">
                <el-button type="primary" size="small" 
                    class="apiItemapiItemUrlRightItem" 
                    :loading="isLoading"  
                    @click="goSend"
                    >发送</el-button>
                <el-dropdown size="small"  
                    v-if="isAuthInfo && isAuthInfo.auth && isAuthInfo.auth.auth == 2"
                    @command="saveCommand"
                    split-button type="danger" @click="goSave">
                   
                    <span class="apiItemapiItemUrlRightItemSave">保存</span>
                    <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :command="null"> 
                            <div class="apiItemapiItemUrlApiFill">
                                |--根目录
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item  
                            v-for="(item) in fileData" 
                            :key="item.uuid"
                            :command="item.uuid"> 
                            <div class="apiItemapiItemUrlApiFill">
                                {{item.name}}
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <!-- 接口 接口请求参数 -->
        <div class="apiItemapiItemHeader">
            <div class="apiItemapiItemHeaderItem"
                :class="[apiIndex == 0 && 'apiItemapiItemHeaderItemActive']"
                @click='tagApiRequest(0)'>
                Header
            </div>
            <div class="apiItemapiItemHeaderItem"
                :class="apiIndex == 1 && 'apiItemapiItemHeaderItemActive'"
                @click='tagApiRequest(1)'>
                Params
            </div>
            <div class="apiItemapiItemHeaderItem"
                :class="apiIndex == 2 && 'apiItemapiItemHeaderItemActive'"
                @click='tagApiRequest(2)'>
                Body
            </div>
            <div class="apiItemapiItemHeaderEmpty">
                <span v-if="apiIndex == 2">(Body为请求体载荷数据,为JSON格式，必须输入严格模式的JSON数据 )</span>
                <span v-if="apiIndex == 0 ">(Header为请求头数据，输入key值后会自动增加新行，无Key值的数据不会被添加到请求头 )</span>
                <span v-if="apiIndex == 1 ">(Params为Url拼接数据，输入key值后会自动增加新行，无Key值的数据不会被添加到请求头 )</span>
            </div>
            <!-- <div class="apiItemapiItemHeaderItem">
                Mock<span class="iconfont icon-xiangyou" style="margin-left: 3px;"></span>
            </div> -->
        </div>
        <!-- 接口 接口请求参数 -->
        <div class="apiItemapiItemQuery">
            <HeaderItem v-if="apiIndex == 0"></HeaderItem>
            <ParamsItem v-else-if="apiIndex == 1"></ParamsItem>
            <BodyItem v-else></BodyItem>
            <!-- <MockItem  v-if="apiIndex == 3"></MockItem> -->
        </div>
        <!-- 接口 接口返回参数 -->
        <div class="apiItemapiItemHeader">
            <div class="apiItemapiItemHeaderItem"
                :class="[responseIndex == 1 && 'apiItemapiItemHeaderItemActive', !apiItem.apiQesponseData && 'apiItemapiItemHeaderItemDisable' ]"
                @click="responseIndex = 1">
                响应
            </div>
            <div class="apiItemapiItemHeaderItem"
                :class="[responseIndex == 2 && 'apiItemapiItemHeaderItemActive',!apiItem.apiQesponseReq || Object.keys(apiItem.apiQesponseReq).length == 0 && 'apiItemapiItemHeaderItemDisable']"
                @click="() => {
                    let arr = Object.keys(apiItem.apiQesponseReq);
                   arr.length > 0 ? responseIndex = 2 : ''
                }">
                请求头
            </div>
            <div class="apiItemapiItemHeaderItem"
                :class="[responseIndex == 3 && 'apiItemapiItemHeaderItemActive',!apiItem.apiQesponseHeader || Object.keys(apiItem.apiQesponseHeader).length == 0 && 'apiItemapiItemHeaderItemDisable']"
                @click="() => {
                    let arr = Object.keys(apiItem.apiQesponseHeader);
                    arr.length > 0  ? responseIndex = 3 : ''
                }">
                响应头
            </div>
            <div class="apiItemapiItemHeaderItem"
                :class="[responseIndex == 4 && 'apiItemapiItemHeaderItemActive',!apiItem.apiQesponseSuccess && 'apiItemapiItemHeaderItemDisable']"
                @click="() => {apiItem.apiQesponseSuccess ? responseIndex = 4 : ''}">
                成功示例
            </div>
            <div class="apiItemapiItemHeaderItem"
                :class="[responseIndex == 5 && 'apiItemapiItemHeaderItemActive', !apiItem.apiQesponseFill && 'apiItemapiItemHeaderItemDisable']"
                @click="() => {apiItem.apiQesponseFill ? responseIndex = 5 : ''}">
                失败示例
            </div>
            <div class="apiItemapiItemHeaderEmpty">
                <span v-if="responseIndex == 2 || responseIndex == 3">( 点击可复制key/value的文本)</span>
            </div>
        </div>
        <!-- 接口 请求返回 -->
        <div class="apiItemapiItemResponse">
            <ResponseData v-if="responseIndex == 1"></ResponseData>
            <ResponseHeader v-if="responseIndex == 2"></ResponseHeader>
            <ResponseQuery v-if="responseIndex == 3"></ResponseQuery>
            <ResponseSuccess v-if="responseIndex == 4"></ResponseSuccess>
            <ResponseFill v-if="responseIndex == 5"></ResponseFill>
        </div>
        <!-- 说明文档 -->
        <el-drawer 
            v-model="explainDrawer" 
            size='800' 
            title="接口说明文档"
            :close-on-press-escape='false'
            :close-on-click-moda='false'
            :with-header='false'>
            <WordItem @closeDrawer='closeDrawer' v-if="explainDrawer"></WordItem>
        </el-drawer>
        <!-- Mock数据 -->
        <el-drawer 
            v-model="mockDrawer" 
            size='800' 
            title="Mock数据"
            :close-on-press-escape='false'
            :close-on-click-moda='false'
            :destroy-on-close="false"
            :lock-scroll='false'
            >
           <MockItem v-if="mockDrawer"></MockItem>
        </el-drawer>
    </div>
</template>

<script>

import { ArrowDown } from '@element-plus/icons-vue'
// import "codemirror/mode/javascript/javascript.js";

import HeaderItem from './components/HeaderItem.vue'
import ParamsItem from './components/ParamsItem.vue'
import BodyItem from './components/BodyItem.vue'
import MockItem from './components/MockItem.vue'

// 相应数据
import ResponseData from './components/ResponseData.vue'
import ResponseHeader from './components/ResponseHeader.vue'
import ResponseQuery from './components/ResponseQuery.vue'
import ResponseSuccess from './components/ResponseSuccess.vue'
import ResponseFill from './components/ResponseFill.vue'

// 接口说明文档
import WordItem from './components/Word.vue'
import {  ElNotification  } from 'element-plus'
import { 
        addApiItem,
        updataApiItem,
        searchApiListOne } from '../../../../api/item'

 const code = (``)   

 import axios from 'axios'

export default {
    data(){
        return {
            apiName:  '',
            apiLink: '',
            apiMethod: 'get',
            methidOptions: [
                {
                    value: 'get',
                    label: 'GET'
                },
                {
                    value: 'post',
                    label: 'POST'
                },
                {
                    value: 'put',
                    label: 'PUT'
                },
                {
                    value: 'delete',
                    label: 'DELETE'
                }
            ],
            code,
            cmOptions: {
                mode: "text/javascript", // 语言模式
                theme: "default", // 主题
                lineNumbers: true, // 显示行号
                smartIndent: true, // 智能缩进
                indentUnit: 4, // 智能缩进单位为4个空格长度
                tabSize: 4,
                lineWrapping: true,
                matchBrackets: true
            },
            apiIndex: 2,
            responseIndex: 1,
            explainDrawer: false,
            mockDrawer: false,
            isLoading: false,
            saveLoading: false
        }
    },
    created(){
        // this.$store.state.ApiList.apiItem[this.$store.getters['ApiList/apiName']].apiName ||
    },
    methods: {
        onChange(val, cm) {

        },
        tagApiRequest(index){
            this.apiIndex = index
        },
        closeDrawer(){
            this.explainDrawer = false
        },
        apiNameClick(e){
            this.$store.commit('ApiList/setAPiName',{name: "apiName", value: e})
        },
        changeClick(e){
            this.$store.commit('ApiList/setAPiName',{name: "apiMethod", value: e})
        },
        apiLinkClick(e){
            this.$store.commit('ApiList/setAPiName',{name: "apiLink", value: e})
        },
        goSend(){
            let global = {}
                if(this.globalValue > -1 && this.globalData.length > this.globalValue){
                    global = this.globalData[this.globalValue] 
                }
            this.getAxios(global)
        },
        getAxios(item){
            let This = this 
            let url = ''
            // 获取URL
            let apiLink = this.apiItem.apiLink
                if(apiLink.startsWith('http://') || apiLink.startsWith('https://')){
                    url = apiLink
                }else if(item && item.globallink){
                    url = item.globallink + apiLink
                }
           


            if(!url.startsWith('http://') && !url.startsWith('https://')){
                this.$toast.fail('请输入正确的RUL请求地址(http/https)')
                return
            }
            // 获取请求方式
            let method = this.apiItem.apiMethod
            if(!method){
                this.$toast.fail('请选择请求方式')
                return
            }

            // 获取Header
            
            let headers = {}

            /*全局的*/
            let  headerdata = item && item.headerdata ? item.headerdata : []
            for(let i=0; i<headerdata.length; i++){
                if(headerdata[i].itemVal){
                    headers[headerdata[i].itemKey] = this.switchType(headerdata[i].itemVal, headerdata[i].itemType)
                }
            }
            /*单个接口的*/
            let header = this.apiItem.apiQequestHeader

            for(let i=0; i<header.length; i++){
                if(header[i].itemVal){
                    headers[header[i].itemKey] = this.switchType(header[i].itemVal, header[i].itemType)
                }
                
            }
            



            // 获取Params
            let params = this.apiItem.apiQequestParams
            let paramsJson  = {}
            for(let i=0; i<params.length; i++){
                if(params[i].itemKey){
                    console.log(params[i].itemKey,'itemKey')
                    paramsJson[params[i].itemKey] = this.switchType(params[i].itemVal, params[i].itemType)
                }
                
            }

            // 获取Body参数
            let body = this.apiItem.apiQequestBody
            let bodyJson = null
                if(body){
                    try {
                        // bodyJson = eval('(' + body + ')')

                        bodyJson = JSON.parse(body)
                        
                    }catch(error){
                       ElNotification({
                                title: 'Body的JSON语法错误',
                                message: error + '',
                                type: 'error',
                            })
                        
                        return 
                    }
                }
                

                this.isLoading = true
                 let oldDate = new Date().valueOf()
                axios({
                    url: url,
                    method: method,
                    timeout: 1000 * 60, // 1分钟
                    withCredentials: true, //  是的携带cookie
                    headers: headers ? {
                        ...headers
                    }: {},
                    params: paramsJson ? {
                        ...paramsJson
                    } : {},
                    data: bodyJson ? {
                        ...bodyJson
                    } : {}
                })
                .then(res => {
                    console.log(res)
                    let newDate = new Date().valueOf()
                    if(typeof res.data == 'string'){
                         This.setApiItem('apiQesponseData', res.data)
                    }else{
                        This.setApiItem('apiQesponseData', JSON.stringify(res.data,null,4))
                    }

                    This.setApiItem('apiQesponseHeader', res.headers)
                    This.setApiItem('apiQesponseReq', res.config.headers)
                    This.setApiItem('apiQesponseStatus', res.status)
                    This.setApiItem('apiQesponseUpdata', (new Date()).toLocaleString())
                    
                    This.setApiItem('apiQesponseTime', newDate - oldDate )
                    
                   
                })
                .catch(error => {
                    console.log(error,'catch') 
                    let newDate = new Date().valueOf()
                    
                    if(typeof  error.message == 'string'){
                         This.setApiItem('apiQesponseData',  error.message)
                    }else{
                        This.setApiItem('apiQesponseData', JSON.stringify( error.message,null,4))
                    }

                    This.setApiItem('apiQesponseHeader', error.headers)
                    This.setApiItem('apiQesponseReq', error.config.headers)
                    This.setApiItem('apiQesponseStatus', 404)
                    This.setApiItem('apiQesponseUpdata', (new Date()).toLocaleString())
                    
                    This.setApiItem('apiQesponseTime', newDate - oldDate )
                })
                .finally((e)=>{
                     This.isLoading = false
                })


        },
        // 类型转换
        switchType(num, type){
            if(type == 2){
            try {
                
                let Num = Number(num)
                    if(!Num){
                        // console.log('数字')

                        Message.error(num + '不是一个合法的数字');
                    }
                    return Num

            } catch(err){
                return num
            }
            }else if(type == 3){
                try {
                    if(num == 'true'){
                        return true
                    }else if(num == 'false'){
                        return false
                    }else{
                        return Boolean(num)
                    }
        
                } catch(err){
                    return Boolean(num)
                }
            }else{
                return num
            }
        },
        // 设置值
        setApiItem(name,value ){
            if(this.$store.getters['ApiList/apiName'] < this.$store.state.ApiList.apiList.length){
                this.$store.commit('ApiList/setAPiName',{name:name, value: value})
            }else {
                return {}
            }
            
        },
        goSave(){
            this.apiSave(0)
        },
        saveCommand(num){
            this.apiSave(1,num)
        },
        // 保存按钮
        apiSave(number, parent){
            if(!window.localStorage.getItem('projectValue')) return

            if(this.saveLoading) return

            this.saveLoading = true
            if(this.apiItem.uuid && this.apiItem.uuid.length > 0){
                updataApiItem({
                    uuid: this.apiItem.uuid,
                    parentuuid: parent ? parent : null , // this.apiItem.parentuuid
                    isParent: number,
                    apiName: this.apiItem.apiName , // 接口名称
                    apiMethod: this.apiItem.apiMethod, // 接口请求方式
                    apiLink: this.apiItem.apiLink, // 接口地址
                    apiQequestHeader: this.apiItem.apiQequestHeader, // 请求-请求头
                    apiQequestParams: this.apiItem.apiQequestParams, // 请求-GTE请求体
                    apiQequestBody: this.apiItem.apiQequestBody , //  请求-Body
                    apiQesponseHeader: this.apiItem.apiQesponseHeader ,// 响应-头
                    apiQesponseReq: this.apiItem.apiQesponseReq, // 响应请求头
                    apiQesponseData: this.apiItem.apiQesponseData , // 响应体
                    apiQesponseSuccess: this.apiItem.apiQesponseSuccess , // 成功体
                    apiQesponseFill: this.apiItem.apiQesponseFill,  // 失败体
                    apiQesponseStatus: this.apiItem.apiQesponseStatus , // 状态码
                    apiQesponseUpdata: this.apiItem.apiQesponseUpdata ,// 更新时间
                    apiQesponseTime: this.apiItem.apiQesponseTime , // 耗时
                })
                .then(res => {
                    if(res.status == 200){
                        this.$toast.success(res.message)

                        this.$nextTick(()=>{
                            this.$store.commit('ApiList/setAPiIsSave',{name:'isSave', value: 0})
                        })
                        if(number == 1){
                            this.getOpenItem(parent)
                        }
                        
                    }else{

                    }
                    
                    this.saveLoading = false
                    this.updataAside()
                })
                .catch(()=>{
                    this.saveLoading = false
                })
            }else{
                
                addApiItem({
                    parentuuid: parent ? parent : this.activeFile.uuid,
                    projectuuid: window.localStorage.getItem('projectValue') ||  null,
                    apiName: this.apiItem.apiName , // 接口名称
                    apiMethod: this.apiItem.apiMethod, // 接口请求方式
                    apiLink: this.apiItem.apiLink, // 接口地址
                    apiQequestHeader: this.apiItem.apiQequestHeader, // 请求-请求头
                    apiQequestParams: this.apiItem.apiQequestParams, // 请求-GTE请求体
                    apiQequestBody: this.apiItem.apiQequestBody , //  请求-Body
                    apiQesponseHeader: this.apiItem.apiQesponseHeader ,// 响应-头
                    apiQesponseReq: this.apiItem.apiQesponseReq, // 响应请求头
                    apiQesponseData: this.apiItem.apiQesponseData , // 响应体
                    apiQesponseSuccess: this.apiItem.apiQesponseSuccess , // 成功体
                    apiQesponseFill: this.apiItem.apiQesponseFill,  // 失败体
                    apiQesponseStatus: this.apiItem.apiQesponseStatus , // 状态码
                    apiQesponseUpdata: this.apiItem.apiQesponseUpdata ,// 更新时间
                    apiQesponseTime: this.apiItem.apiQesponseTime , // 耗时
                })
                .then(res => {
                    if(res.status == 200){
                        this.$toast.success(res.message)
                        this.$store.commit('ApiList/setAPiName',{name:'uuid', value: res.data.uuid})
                        this.$nextTick(()=>{
                            this.$store.commit('ApiList/setAPiIsSave',{name:'isSave', value: 0})
                        })

                        this.getOpenItem(parent ? parent : this.activeFile.uuid)
                    }else{

                    }
                    this.saveLoading = false
                    this.updataAside()
                })
                .catch(()=>{
                    this.saveLoading = false
                })
            }
            
        },
        // 获取最新的API数据
        goNewsApi(){
            // console.log(this.apiItem.uuid)
            // return false
            searchApiListOne({
                uuid: this.apiItem.uuid
            })
            .then(res => {
                this.isLoading = false
                if(res.status == 200){
                    let interfaceApi = res.data
                        interfaceApi.isSave = 0

                    this.$store.commit('ApiList/refreshOptionItem',{...interfaceApi})
                }
            })
            .catch(()=>{
                this.isLoading = false
            })
        }
    },
    computed: {
        apiItem(){
            if(this.$store.getters['ApiList/apiName'] < this.$store.state.ApiList.apiList.length){
                return this.$store.state.ApiList.apiList[this.$store.getters['ApiList/apiName']]
            }else {
                return {}
            }
            
        },
        activeFile(){
            return this.$store.state.ApiList.activeFile
        },
        fileData(){
            return this.$store.state.ApiList.fileData
        },
        globalValue(){
            return this.$store.state.ApiList.globalValue
        },
        globalData(){
            return this.$store.state.ApiList.globalData
        },
        isAuthInfo(){
            return this.$store.state.ApiList.isAuthInfo
        }
    },
    inject: ['getOpenItem','updataAside'],
    components: {
        ArrowDown,
        HeaderItem,
        ParamsItem,
        BodyItem,
        MockItem,
        ResponseData,
        ResponseQuery,
        ResponseHeader,
        ResponseSuccess,
        ResponseFill,
        WordItem
    },
}
</script>

<style  scoped>
.apiItem{
    width: 100%;
    height: auto;
}
/* 接口名字 */
.apiItemName{
    width: 100%;
    height: 50px;
    background: #F7F7F7;
    border-bottom: 1px solid #E9ECEF;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.apiItemNameLeft{
    width: calc(100% - 300px);
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}
.apiItemNameLeft >>> .el-input__inner{
    background: #F7F7F7;
    border-color: transparent;
}
.apiItemNameLeft >>> .el-input__inner:hover{
    border-color: transparent;
    background: #ffffff;
    border-radius: none;
}
.apiItemNameRight{
    width: 300px;
    height: 100%;
    /* background: yellowgreen; */
    text-align: right;
    line-height: 50px;
    user-select: none;
}
.apiItemNameRightIcon{
    padding: 5px 8px;
    background: #E9ECEF;
    font-size: 12px;
    border-radius: 3px;
    color: #76797D;
    margin-right: 10px;
    cursor: pointer;
}
.apiItemNameRightIcon::before{
    margin-right: 5px;
}
/* 接口地址 */
.apiItemapiItemUrl{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
}
.apiItemapiItemUrlLeft{
    width: calc(100% - 300px);
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
}
.apiItemapiItemUrlLeft >>> .el-input__inner:hover{
    border-color: #DCDFE6;
    background: #ffffff;
}
.apiItemapiItemUrlRight{
    width: 300px;
    height: 100%;
    /* background: yellowgreen; */
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
}
.apiItemapiItemUrlRightItem{
    width: 100px;
    margin-left: 15px;
    letter-spacing: 0.5em;
    margin-right: 15px;
}
.apiItemapiItemUrlRightItemSave{
    width: 60px;
    display: inline-block;
}
.apiItemapiItemUrlApiFill{
    width: auto;
    padding: 0 10px;
    box-sizing: border-box;
}
.apiItemapiItemUrlLeft >>> .el-input__inner{
    border-radius: 0;
    user-select: none;
}
.apiItemapiItemUrlLeft >>> .el-input__inner:hover{
    border-color: #DCDFE6;
}
.apiItemapiItemUrlLeft >>> .el-input__inner:focus{
    border-color: #DCDFE6;
}
.apiItemapiItemUrlLeftSelect >>> .el-input__inner{
    border-right: none;
}
/* 接口请求参数 */
.apiItemapiItemHeader{
    width: 100%;
    height: 45px;
    background: #F7F7F7;
    padding: 0 20px;
    box-sizing: border-box;
    border-top: 1px solid #E9ECEF;
    border-bottom: 1px solid #E9ECEF;
    display: flex;
    user-select: none;
}
.apiItemapiItemHeaderItem{
    display: inline-block;
    height: 100%;
    width: auto;
    padding: 0 15px;
    box-sizing: border-box;
    line-height: 42px;
    font-size: 14px;
    border-bottom: 3px solid #F7F7F7;
    cursor: pointer;
    margin-right: 10px;
    /* font-weight: bold; */
    color: #545B62;
}
.apiItemapiItemHeaderItemDisable{
    cursor: not-allowed;
}
.apiItemapiItemHeaderItemActive{
    border-bottom-color: #F02A20;
}
.apiItemapiItemHeaderEmpty{
    flex: 1;
    height: 100%;
    color: #999;
    line-height: 45px;
    font-size: 10px;
}
/* 响应 */
.apiItemapiItemResponse{
    width: 100%;
    height: auto;
    min-height: 200px;
    background: #FFFFFF;
}
/* 接口请求参数 */
.apiItemapiItemQuery{
    width: 100%;
    height: 450px;
    /* background: #F02A20; */
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
}
.apiItemapiItemQuery::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.apiItem >>> .el-drawer__header{
    padding: 10px 20px;
    box-sizing: border-box;
    margin-bottom: 0;
    border-bottom: 1px solid #DCDFE6;
}
.apiItem >>> .el-drawer__body{
    padding: 0 ;
    box-sizing: border-box;
    overflow: auto;
}
</style>

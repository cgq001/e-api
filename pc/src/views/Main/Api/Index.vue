<template>
<!-- 接口 主页 -->
    <div class="apiIndex">
        <!-- 左侧 侧边栏 -->
        <div class="apiIndexAside">
            <!-- 项目名称 -->
            <div class="apiIndexAsideName">
                <div class="apiIndexAsideNameIcon">
                    <el-tooltip content="更新列表数据" placement="top">
                        <span class="iconfont icon-shuaxin" @click="refresh"></span>
                    </el-tooltip>
                </div>
                <div class="apiIndexAsideNameText">
                    {{isAuthInfo.projectName}}
                </div>
                <div class="apiIndexAsideNameIcon">
                    <!-- <el-tooltip content="新建根目录" placement="top"> -->
                        <span class="iconfont icon-xinjianwenjianjia1" @click="addFile"></span>
                    <!-- </el-tooltip> -->
                </div>
            </div>
            <!-- 菜单栏目 -->
            <div class="apiIndexAsideMenuBox">
                <el-scrollbar style="height:100%; width: 100%;">
                    <IndexList :listData='fileData' 
                        :zIndex='0'
                        :openData='openData'
                        :activeFile="activeFile"
                        ></IndexList>
                </el-scrollbar>
            </div>
        </div>
        <!-- 右侧 主内容 -->
        <div class="apiIndexContent">
            <!-- 接口Tab 切换 -->
            <div class="apiIndexContentTitle">
                <div class="apiIndexAsideNameLeft">
                    <TagList></TagList>
                </div>
                <div class="apiIndexAsideNameAdd">
                    <div class="apiIndexAsideNameAddIcon" @click="addItem">
                        <span class="iconfont icon-jiahao"></span>
                    </div>
                </div>
                <div class="apiIndexAsideNameRight">
                    <div class="apiIndexAsideNameRightIcon" style="margin-right: 12px"
                        @click="setGlobal">
                        <span class="iconfont icon-huanjingbianliang1"></span>
                    </div>
                    <div class="apiIndexAsideNameRightEnv">
                        <el-select :modelValue="globalValue"
                            @change="(val)=>{tagGlobalValue(val)}"
                             placeholder="Select" style="width: 100%;">
                            <el-option
                            :key="-1"
                            label="暂无环境"
                            :value="-1"
                            >
                            </el-option>
                            <el-option
                            v-for="(item,index) in globalData"
                            :key="item.uuid"
                            :label="item.globalname"
                            :value="index"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <!-- 接口文档 -->
            <div class="apiIndexContentMain">
                <!-- <router-view></router-view> -->
                <template  v-for="(item,index) in apiListData" :key="index">
                    <ItemList v-if="apiActiveIndex == index"></ItemList>
                </template>
                
            </div>
        </div>
        <el-drawer
            class="apiIndexDrawer"
            v-model="globalShow"
            title="设置全局变量"
            direction="rtl"
            size='1000px'
            :close-on-press-escape='false'
            :close-on-click-modal='false'
        >
            <div class="apiIndexDrawerAdd">
                <el-button type="primary" size='small'
                    @click="addGlobalTitle">添加环境</el-button>
            </div>
            <div class="apiIndexDrawerBox">
                <el-scrollbar style="height:100%; width: 100%;">
                    <div class="apiIndexDrawerItem"
                        v-for="(item , index) in globalData"
                        :key="item.uuid">
                        <div class="apiIndexDrawerItemName">
                            <div class="apiIndexDrawerItemNameLeft">
                                {{item.globalname}}
                            </div>
                            <div class="apiIndexDrawerItemNameLink">
                                {{item.globallink}}
                            </div>
                            <div class="apiIndexDrawerItemNameRight"
                                @click="updataGlobal(item)">
                                修改
                            </div>
                        </div>
                        <div class="apiIndexDrawerItemParent">
                            请求头
                        </div>
                        <GlobalHeader :zIndex='index' :uuid="item.uuid"></GlobalHeader>
                        <div class="apiIndexDrawerItemFoot">
                             <el-button type="primary" size='small'
                                @click="getUpdataGlobalItemOption(item.uuid,index)">确认修改全局请求头</el-button>
                        </div>

                    </div>
                </el-scrollbar>
            </div>
        </el-drawer>
        <!--  -->
            <el-dialog
                v-model="globalTitle"
                :title="globalForm.uuid ? '编辑环境变量':'添加环境变量'"
                width="500px"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
            >
                <el-form
                    ref="ruleGlobal"
                    :model="globalForm"
                    :rules="ruleGlobal"
                    label-width="80px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="变量名称" prop="globalname">
                        <el-input v-model="globalForm.globalname" placeholder="请输入变量名称" />
                    </el-form-item>
                    <el-form-item label="变量地址" prop="globallink">
                        <el-input v-model="globalForm.globallink" placeholder="请输入公共请求地址" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size='small'
                            style="width: 100px;" 
                            @click="submitForm('ruleGlobal')"
                            :loading='isGloabLoading'
                            >确定</el-button
                        >
                        
                        <el-button @click="globalTitle = false" 
                            style="width: 100px;" 
                            size='small'>取消</el-button>

                        <el-button type="danger" size='small'
                            v-if="globalForm.uuid"
                            style="width: 100px;" 
                            @click="removeGlobal(globalForm.uuid)"
                            :loading='isGloabLoading'
                            >删除</el-button
                        >
                    </el-form-item>
                </el-form>
            </el-dialog>
    </div>
</template>
<script>
import IndexList from './components/IndexList.vue'
import TagList from './components/Tag.vue'
import GlobalHeader from './components/GlobalHeader.vue'
import ItemList from './Item/Index.vue'

import { ElMessageBox } from 'element-plus'
import { addFileItem, 
        searchFileItem , 
        renameFileItem ,
        removeFileItem, 
        searchApiListArr,
        addApiItem,
        delectApiList,
        addGlobalItem,
        searchGlobalItem,
        updataGlobalItem , 
        updataGlobalItemOption,
        removeGlobalItem , 
        searchProjectUserAuth } from '../../../api/item'
export default {
    data(){
        const urlRG = (rule, value, callback) => {
             let urlData = ['http://', 'https://']
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
                callback(new Error("请输入http或者https开头的地址"))
            } else {
                callback()
            }
        }
        return {
            value: -1,
            options: [
                {
                    label: '105-测试服务器',
                    value: '123456'
                }
            ],
            projectValue: '', // 项目ID
            fileData: [],
            openData: [] ,// 展开的文件夹
            // activeFile: {} // 当前点击的文件夹
            globalShow: false,
            globalTitle: false,
            globalForm: {
                globalname: '',
                globallink: ''
            },
            ruleGlobal: {
                globalname: [
                    {
                        required: true, message: '请输入变量名称', trigger: 'blur'
                    }
                ],
                globallink: [
                    {
                        required: true, message: '请输入公共地址', trigger: 'blur'
                    },
                    { validator: urlRG, trigger: 'blur' }
                ]
            },
            isGloabLoading: false,
            isAuthInfo: {}
        }
    },
    created(){
       this.projectValue =  window.localStorage.getItem('projectValue') ||  null
       if(!this.projectValue){
            ElMessageBox.confirm(
                '你目前还没有选择项目,请先选择项目?',
                '警告',
                {
                    confirmButtonText: '去选择项目',
                    cancelButtonText: '去首页',
                    type: 'warning',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    center: true,
                }
            )
                .then(() => {
                    this.$router.replace('/project')
                })
                .catch(() => {
                    this.$router.replace('/')
                })
        }else{
            this.getAuth()
            // 查询文件夹
            this.getSearchFileItem()
            // 查询环境变量
            this.getSearchGlobalItem()
        }
    },
    mounted(){

    },
    methods: {
        // 刷新侧边栏
        refresh(){
            // 查询文件夹
            this.getSearchFileItem()
            // 查询环境变量
            this.getSearchGlobalItem()
        },
        // 查询本人权限
        getAuth(){
            searchProjectUserAuth({
                uuid: window.localStorage.getItem('projectValue') ||  null
            })
            .then(res => {
                if(res.status == 200){
                    if(res.data && res.data.uuid){
                        this.isAuthInfo = res.data
                        this.$store.commit('ApiList/setIsAuthInfo', this.isAuthInfo)
                    }else{
                        ElMessageBox.confirm(
                        '你目前没有该项目权限,请重新选择项目?',
                        '警告',
                        {
                            confirmButtonText: '去选择项目',
                            cancelButtonText: '去首页',
                            type: 'warning',
                            showClose: false,
                            closeOnClickModal: false,
                            closeOnPressEscape: false,
                            center: true,
                        }
                    )
                        .then(() => {
                            this.$router.replace('/project')
                        })
                        .catch(() => {
                            this.$router.replace('/')
                        })
                    }
                }
            })
        },
        // 新建接口
        addItem(){
            this.$store.commit('ApiList/addOptionItem')
        },
        // 添加文件夹
        addFile(){
            ElMessageBox.prompt('', '新建根目录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|[A-Za-z0-9]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                    inputErrorMessage: '名字必须是中文,英文或者数字',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    center: true,
                })
                .then(({ value }) => {
                    // 去空格
                    let val = value.replace(/(^\s*)|(\s*$)/g, "")
                    if(val){
                        val = val.length > 12 ? val.substring(0, 12) : val
                        this.getAddFileItem(val)
                    }
                    
                })
                .catch(() => {
                    
                })
        },
        // 新建文件夹
        getAddFileItem(name, parent){
            addFileItem({
                foldername: name,
                projectuuid: window.localStorage.getItem('projectValue') ||  null,
                parentuuid: parent
            })
            .then(res => {
                if(res.status == 200){
                   this.$toast.success(res.message)
                   this.getSearchFileItem()
                }else{
                    this.$toast.fail('创建失败')
                }
            })
            .catch(()=>{

            })
        },
        // 查询文件夹
        getSearchFileItem(){
            searchFileItem({
                projectuuid: window.localStorage.getItem('projectValue') ||  null,
            })
            .then(async res => {
                if(res.status == 200){
                    let apiList = res.data || []
                        apiList = apiList.map(item=> {
                            item.type = 'folder'
                            item.children = []
                            return item
                        })

                    let ApiData = await searchApiListArr({
                        projectuuid: window.localStorage.getItem('projectValue') ||  null,
                    })
                    let apiDataArray = []
                        if(ApiData.status == 200){
                            apiDataArray = ApiData.data
                            apiDataArray.map(item => {
                                item.type = 'Interface'
                                item.foldername = item.apiName
                                return item
                            })
                        }
                    
                    // 获取侧边栏
                    let allList = [...apiList,...apiDataArray]
                    let fileOne = []


                    
                    for(let i=0; i<allList.length; i++){
                        if(!allList[i].parentuuid){
                            fileOne.push(allList[i])
                            fileChild(allList, allList[i],allList[i].uuid)
                        }
                    }
                    
                    function fileChild(arr, parentItem, parentuuid){
                        parentItem.children = parentItem.children ? parentItem.children : []
                        arr.forEach(item => {
                            if(item.parentuuid == parentuuid){
                                parentItem.children.push(item)
                                fileChild(arr,item, item.uuid)
                            }
                        });
                        return parentItem.children
                    }
                    
                    this.fileData = fileOne

                    // 获取保存的目录列表
                    let saveApiList = JSON.parse(JSON.stringify(fileOne))
                        // 布局
                        function addLine(num){
                            let line = '|——'
                            let lineSrc = ''
                            for(let i=0; i<num; i++){
                                lineSrc = lineSrc + line
                            }

                            return lineSrc

                        }
                        function searchFail(list,num = 1){
                            let sortFolder = []

                            for (let i = 0; i < list.length; i++) {	 
                                    if(list[i].type == 'folder'){
                                        sortFolder.push({
                                            name: addLine(num) + list[i].foldername,
                                            uuid:   list[i].uuid
                                        })

                                        if(list[i].children && list[i].children.length > 0){
                                                sortFolder.push(...searchFail(list[i].children, num + 1))
                                            }
                                    }
                                    
                            }
                            
                            return sortFolder
                        } 
                        let saveFileOne = searchFail(saveApiList) || [] 
                        this.$store.commit('ApiList/setFileData',saveFileOne)
                    // 获取数组的结构树
                    
                }
            })
        },
        
        // 获取拥有层级的文件夹
        getFileLayer(apiList){
            
        },
        // 文件夹操作
        fileHandleData(command){
            let data = command.split('-|-')

            if(data.length >= 2){
                switch(data[0]){
                    case 'api':
                        // 添加接口
                        this.addApiItem(data[1])
                    break;
                    case 'add':
                        // 添加子目录
                        this.addChildrenFile(data[1])
                    break;
                    case 'rename':
                        // 目录重命名
                        if(data.length == 3){
                            this.renameFile(data[1],data[2])
                        }else{
                            this.renameFile(data[1])
                        }
                        
                    break;
                    case 'remove':
                        // 删除目录
                        if(data.length == 3){
                            this.removeFile(data[1],data[2])
                        }else{
                            this.removeFile(data[1])
                        }
                    break;
                }
            }
        },
        // 添加接口
        addApiItem(parenr){
            addApiItem({
                    parentuuid: parenr,
                    projectuuid: window.localStorage.getItem('projectValue') ||  null,
                    apiName: this.itemInfo.apiName , // 接口名称
                    apiMethod: this.itemInfo.apiMethod, // 接口请求方式
                    apiLink: this.itemInfo.apiLink, // 接口地址
                    apiQequestHeader: this.itemInfo.apiQequestHeader, // 请求-请求头
                    apiQequestParams: this.itemInfo.apiQequestParams, // 请求-GTE请求体
                    apiQequestBody: this.itemInfo.apiQequestBody , //  请求-Body
                    apiQesponseHeader: this.itemInfo.apiQesponseHeader ,// 响应-头
                    apiQesponseReq: this.itemInfo.apiQesponseReq, // 响应请求头
                    apiQesponseData: this.itemInfo.apiQesponseData , // 响应体
                    apiQesponseSuccess: this.itemInfo.apiQesponseSuccess , // 成功体
                    apiQesponseFill: this.itemInfo.apiQesponseFill,  // 失败体
                    apiQesponseStatus: this.itemInfo.apiQesponseStatus , // 状态码
                    apiQesponseUpdata: this.itemInfo.apiQesponseUpdata ,// 更新时间
                    apiQesponseTime: this.itemInfo.apiQesponseTime , // 耗时
                    isSave: 0,
                    uuid: this.itemInfo.uuid
            })
            .then(res => {
                    if(res.status == 200){
                        this.getSearchFileItem()
                    
                        let interfaceApi = {
                            apiName: this.itemInfo.apiName , // 接口名称
                            apiMethod: this.itemInfo.apiMethod, // 接口请求方式
                            apiLink: this.itemInfo.apiLink, // 接口地址
                            apiQequestHeader: this.itemInfo.apiQequestHeader, // 请求-请求头
                            apiQequestParams: this.itemInfo.apiQequestParams, // 请求-GTE请求体
                            apiQequestBody: this.itemInfo.apiQequestBody , //  请求-Body
                            apiQesponseHeader: this.itemInfo.apiQesponseHeader ,// 响应-头
                            apiQesponseReq: this.itemInfo.apiQesponseReq, // 响应请求头
                            apiQesponseData: this.itemInfo.apiQesponseData , // 响应体
                            apiQesponseSuccess: this.itemInfo.apiQesponseSuccess , // 成功体
                            apiQesponseFill: this.itemInfo.apiQesponseFill,  // 失败体
                            apiQesponseStatus: this.itemInfo.apiQesponseStatus , // 状态码
                            apiQesponseUpdata: this.itemInfo.apiQesponseUpdata ,// 更新时间
                            apiQesponseTime: this.itemInfo.apiQesponseTime , // 耗时
                            isSave: 0,
                            uuid: res.data.uuid
                        }
                        this.$store.commit('ApiList/asideAddOptionItem',{...interfaceApi})
                        
                        this.getOpenItem(parenr)
                    }else{

                    }
                })
                .catch(()=>{
                    
                })
            
        },
        // 添加子文件夹
        addChildrenFile(parent){
            
            ElMessageBox.prompt('', '新建子目录', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|[A-Za-z0-9]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                    inputErrorMessage: '名字必须是中文,英文或者数字',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    center: true,
                })
                .then(({ value }) => {
                    // 去空格
                    let val = value.replace(/(^\s*)|(\s*$)/g, "")
                    if(val){
                        val = val.length > 12 ? val.substring(0, 12) : val
                        this.getAddFileItem(val,parent)
                    }
                    
                })
                .catch(() => {
                    
                })
        },
        // 重命名文件夹
        renameFile(parent,name){
            
            ElMessageBox.prompt('', '目录重命名', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|[A-Za-z0-9]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/,
                    inputErrorMessage: '名字必须是中文,英文或者数字',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    center: true,
                    inputValue: name
                })
                .then(({ value }) => {
                    // 去空格
                    let val = value.replace(/(^\s*)|(\s*$)/g, "")
                    if(val){
                        val = val.length > 12 ? val.substring(0, 12) : val
                        this.updataRenameFileItem(val,parent)
                    }
                    
                })
                .catch(() => {
                    
                })
        },
        // 重命名文件夹
        updataRenameFileItem(name,parent){
            renameFileItem({
                fileuuid: parent,
                foldername: name
            })
            .then(res => {
                if(res.status == 200){
                    this.$toast.success(res.message)
                    this.getSearchFileItem()
                }
            })
        },
        // 删除文件夹
        removeFile(parent,name){
           ElMessageBox.confirm(
                    `确认要删除<span style="color: red;">(${name})</span>文件夹嘛？`,
                    '删除文件夹后将删除改文件夹下的所有文件',
                {
                    confirmButtonText: '确认删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    center:true,
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                }
            )
                .then(() => {
                    // 这里应当同时删除接口（待补充BUG）
                    this.deleteChildrenApi(parent)
                    this.getRemoveFileItem(parent)
                    
                })
                .catch(() => {
                    
                })     
        },
        // 删除文件夹
        getRemoveFileItem(uuid){
            removeFileItem({
                fileuuid: uuid
            })
            .then(res => {
                if(res.status == 200){
                    this.$toast.success(res.message)
                    this.getSearchFileItem()
                    // 清空 展开文件夹
                    if(this.openData.includes(uuid)){
                        this.openData.splice(this.openData.indexOf(uuid), 1)
                    }
                    // 清空 当前活动文件夹 
                    if(this.activeFile && this.activeFile.uuid == uuid){
                        this.$store.commit('ApiList/setActiveFile',{})
                    }
                }
            })
        },
        // 文件夹的点击操作
        tagItem(item){



            if(this.openData.includes(item.uuid)){
                this.openData.splice(this.openData.indexOf(item.uuid), 1)
            }else{
                this.openData.push(item.uuid)
            }
            this.$store.commit('ApiList/setActiveFile',item)
        },
        // 在保存的时候 打开当前保存到文件的侧边栏
        getOpenItem(num){
            if(num){
                let parentData =  this.getParent(this.fileData,num)
                for(let i=0; i<parentData.length; i++){
                    if(!this.openData.includes(parentData[i])){
                        this.openData.push(parentData[i])
                        }
                }
            }
            
        },
        // 获取父级
        getParent(acceptUnitNodes, ids){// acceptUnitNodes树状结构数据，ids当前节点的id
            var parentNodes = []// 所有父节点
            var forfun = function(id, nodes) {
                for (var i = 0; i < nodes.length; i++) {
                    if(nodes[i].type == 'folder'){
                        var currentNode = nodes[i]
                        if (currentNode.uuid === id) {
                            return currentNode.uuid
                        } else if (currentNode.children) {
                            var validNodeId = forfun(id, currentNode.children)
                            if (validNodeId && parentNodes.indexOf(validNodeId) < 0) {
                                parentNodes.push(validNodeId)
                            }
                            if (validNodeId) {
                                return currentNode.uuid
                            }
                        }
                    }
                    
                }
            }
            var validNodeId = forfun(ids, acceptUnitNodes)
            if (validNodeId && parentNodes.indexOf(validNodeId) < 0) {
                parentNodes.push(validNodeId)
            }
            return parentNodes
        },
        // 更新侧边栏
        updataAside(){
            this.getSearchFileItem()
        },
        // 删除文件夹下的所有接口
        deleteChildrenApi(uuid){
            let fileData = this.fileData
            var chideData = []
                function getChild(data){
                    for(let i=0; i<data.length; i++){
                        if(data[i].uuid == uuid){
                            chideData = data[i].children || []
                        }else{
                            if(data[i].children && data[i].children.length > 0){
                                getChild(data[i].children)
                            }
                        }
                    }
                }
            getChild(fileData)

            if(chideData.length == 0) return

            let childrenApi = []
            function getuuid(data){
                for(let i=0; i<data.length; i++ ){
                    if(data[i].type == 'Interface'){
                        childrenApi.push(data[i].uuid)
                    }else{
                        if(data[i].children && data[i].children.length > 0){
                                getuuid(data[i].children)
                            }
                    }
                }
            }
            getuuid(chideData)
            if(childrenApi.length > 0){
                delectApiList({
                        deleteArray: childrenApi
                    })
                    .then(res => {
                        if(res.status == 200){
                            this.updataAside()
                            for(let i=0; i<childrenApi.length; i++){
                                this.$store.dispatch('ApiList/removeApiItem',childrenApi[i])
                            }
                            
                        }
                    })
            }
            
        },
        // 设置环境变量
        setGlobal(){
            this.globalShow = true
            this.getSearchGlobalItem()
        },
        // 添加环境
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.isGloabLoading = true
                if(this.globalForm.uuid){
                    updataGlobalItem({
                        globalname: this.globalForm.globalname,
                        globallink: this.globalForm.globallink,
                        uuid: this.globalForm.uuid
                    })
                    .then(res => {
                        if(res.status == 200){
                            
                            this.globalForm.globalname =''
                            this.globalForm.globallink = ''
                            this.globalForm.uuid = ''
                            this.globalTitle = false
                            this.$nextTick(()=>{
                                this.$toast.success(res.message)
                            })
                            this.getSearchGlobalItem()
                        }
                        this.isGloabLoading = false
                        this.globalTitle = false
                    })
                    .finally(()=>{
                        this.isGloabLoading = false
                        this.globalTitle = false
                    })
                }else{
                    addGlobalItem({
                        globalname: this.globalForm.globalname,
                        globallink: this.globalForm.globallink,
                        projectuuid: window.localStorage.getItem('projectValue') ||  null,
                    })
                    .then(res => {
                        if(res.status == 200){
                            
                            this.globalForm.globalname =''
                            this.globalForm.globallink = ''
                            this.globalForm.uuid = ''
                            this.globalTitle = false
                            this.$nextTick(()=>{
                                this.$toast.success(res.message)
                            })
                            this.getSearchGlobalItem()
                        }
                        this.isGloabLoading = false
                    })
                    .finally(()=>{
                        this.isGloabLoading = false
                    })
                }
                
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        // 删除环境变量
        removeGlobal(uuid){
            removeGlobalItem({
                uuid:uuid
            })
            .then(res => {
                if(res.status == 200){
                    this.getSearchGlobalItem()
                    this.$nextTick(()=>{
                        this.$store.commit('ApiList/setGlobalValue', -1)
                    })
                    this.globalTitle = false
                }
            })
        },
        // 添加变量按钮
        addGlobalTitle(){
            this.globalTitle = true
            this.globalForm.globalname =''
            this.globalForm.globallink = ''
            this.globalForm.uuid = ''
        },
        // 查询环境变量
        getSearchGlobalItem(){
            searchGlobalItem({
                projectuuid: window.localStorage.getItem('projectValue') ||  null,
            })
            .then(res => {
                if(res.status == 200){
                    // this.globalData = res.data
                    this.$store.commit('ApiList/setGlobalData', res.data)
                }
            })
        },
        // 环境变量修改按钮
        updataGlobal(item){
            this.globalTitle = true
            this.globalForm.globalname = item.globalname
            this.globalForm.globallink = item.globallink
            this.globalForm.uuid = item.uuid
        },
        // 保存全局请求头
        getUpdataGlobalItemOption(uuid,index){
            updataGlobalItemOption({
                uuid: uuid,
                headerdata: this.$store.state.ApiList.globalData[index].headerdata
            })
            .then(res => {
                if(res.status == 200){
                    this.$toast.success(res.message)
                    this.getSearchGlobalItem()
                }
            })
        },
        // 设置环境变量
        tagGlobalValue(val){
            this.$store.commit('ApiList/setGlobalValue', val)
        }
    },
    provide(){
        return {
            fileHandleData: this.fileHandleData,
            tagItem: this.tagItem,
            getOpenItem: this.getOpenItem,
            updataAside: this.updataAside
        }
    },
    computed: {
        activeFile(){
            return this.$store.state.ApiList.activeFile
        },
        itemInfo(){
            return this.$store.state.ApiList.itemInfo
        },
        apiActiveIndex(){
            return this.$store.state.ApiList.apiActiveIndex
        },
        apiItem(){
            if(this.$store.getters['ApiList/apiName'] < this.$store.state.ApiList.apiList.length){
                return this.$store.state.ApiList.apiList[this.$store.getters['ApiList/apiName']]
            }else {
                return {}
            }
        },
        apiListData(){
                return this.$store.state.ApiList.apiList || []
        },
        globalData(){
            return this.$store.state.ApiList.globalData
        },
        globalValue(){
            return this.$store.state.ApiList.globalValue
        }
    },
    watch: {
        apiActiveIndex: {
            handler(news){
                if(news){
                    if(this.apiItem.parentuuid && this.apiItem.parentuuid.length > 0){
                        this.getOpenItem(this.apiItem.parentuuid)
                    }
                }
            },
            deep: true,
            immediate: true
        }
    },
    components: {
        IndexList,
        TagList,
        GlobalHeader,
        ItemList
    },
}
</script>

<style scoped>
.apiIndex{
    width: 100%;
    height: 100%;
    /* background: yellowgreen; */
    display: flex;
}
.apiIndexAside{
    width: 310px;
    height: 100%;
    /* background: yellow; */
    padding: 5px 0;
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
}

.apiIndexAsideName{
    width: 100%;
    height: 45px;
    /* background: blueviolet; */
    font-size: 12px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #DCDFE6;
    box-sizing: border-box;
    padding: 0 5px;
    
}
.apiIndexAsideNameText{
    width: calc(100% - 50px);
    height: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #EF2B20;
    font-weight: bold;
    /* background: #EF2B20; */
}
.apiIndexAsideNameIcon{
    width: 25px;
    height: 45px;
    /* background: yellow; */
    text-align: center;
    line-height: 45px;
    cursor: pointer;
}
.apiIndexAsideNameIcon span{
    font-size: 14px;
    color: #88A0CD;
}
.apiIndexAsideSearch{
    width: 100%;
    height: 45px;
    background: yellowgreen;
}
.apiIndexAsideMenuBox{
    width: 100%;
    height: calc(100% - 45px);
    /* background: #88A0CD; */
    padding: 5px 5px 0 5px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
}
.apiIndexAsideMenuBox::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}

/* 右侧 */
.apiIndexContent{
    width: calc(100% - 310px);
    height: 100%;
    /* background: bisque; */
    padding: 5px 0;
    box-sizing: border-box;
}
.apiIndexContentTitle{
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #DCDFE6;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding-left: 10px;
    box-sizing: border-box;
}

.apiIndexAsideNameRight{
    width: 320px;
    height: 100%;
    /* background: #DCDFE6; */
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
    box-sizing: border-box;
}
.apiIndexAsideNameRightEnv{
    width: 220px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.apiIndexAsideNameRightEnv >>> .el-input__inner{
    font-size: 12px;
}
.apiIndexAsideNameRightEnv >>> .el-select-dropdown__item{
    font-size: 12px !important;
}
.apiIndexAsideNameRightIcon{
    width: 40px;
    height: 44px;
    /* background: #EF2B20; */
    text-align: center;
    line-height: 44px;
    cursor: pointer;
}
.apiIndexAsideNameRightIcon span{
    font-size: 16px;
    background: #E9ECEF;
    padding: 7px;
    border-radius: 5px;
    color: #7680A2;
    /* font-weight: bold; */
}

.apiIndexAsideNameLeft{
    width: calc(100% - 360px);
    height: 100%;
    /* background: #DCDFE6; */
    padding: 5px 10px 0 5px;
    box-sizing: border-box;
    /* display: flex;
    justify-content: flex-start; */
    overflow-x: auto;
    overflow-y:  hidden;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none; 
}
.apiIndexAsideNameLeft::-webkit-scrollbar {
    display: none; 
    width: 0 !important ;
}
.apiIndexAsideNameLeftBox{
    width: auto;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    /* float: right; */
}
.apiIndexAsideNameLeftItem{
    flex-shrink: 0;
    width: auto;
    max-width: 220px;
    height: 100%;
    cursor: pointer;
    line-height: 40px;
    font-size: 12px;
    padding: 0 30px 0 10px;
    box-sizing: border-box;
    border-top: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    position: relative;
    color: #545B62;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-right: 10px;
    border-radius: 5px 5px 0 0 ;
}
.apiIndexAsideNameLeftItemActive{
   /* background: #F7F7F7; */
   border-top: 3px solid  #EF2B20;
   /* border-bottom: 2px solid #ffffff; */
   position: relative;
}
.apiIndexAsideNameLeftItemActive::before{
    content: '';
    width: 100%;
    height: 20px;
    /* background: yellow; */
    position: absolute;
    left: 0;
    bottom: -10px;
}
.apiIndexAsideNameLeftItemIcon{
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 35px;
    /* background: #E9ECEF; */
    text-align: center;
    line-height: 40px;
}
.apiIndexAsideNameLeftItemIcon span{
    font-size: 12px;
}


.apiIndexAsideNameAdd{
    width: 40px;
    height: 100%;
    /* background: #DCDFE6; */
    padding-top: 10px;
    box-sizing: border-box;
}
.apiIndexAsideNameAddIcon{
    width: 25px;
    height: 25px;
    border: 1px solid #DCDFE6;
    border-radius: 3px;
    text-align: center;
    line-height: 25px;
    cursor: pointer;
}
.apiIndexAsideNameAddIcon span{
    color: #88A0CD;
}
/* 接口主界面 */
.apiIndexContentMain{
    width: 100%;
    height: calc(100% - 45px);
    /* background: #EF2B20; */
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
}
.apiIndexContentMain::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}


.demo-tabs >>> .el-tabs__new-tab{
    width: 20px !important;
    height: 20px !important;
    color: #303133;
    text-align: center !important;
}

.apiIndex >>> .el-drawer__header{
    padding: 10px 20px;
    box-sizing: border-box;
    margin-bottom: 0;
    border-bottom: 1px solid #DCDFE6;
}

.apiIndexDrawerAdd{
    width: 100%;
    height: 40px;
    /* background: #88A0CD; */
}
.apiIndexDrawerBox{
    width: 100%;
    height: calc(100% - 40px);
}
.apiIndexDrawerItem{
    width: calc(100% - 10px);
    height: auto;
    border: 1px solid #E9ECEF;
    margin-bottom: 20px;
}
.apiIndexDrawerItemName{
    width: 100%;
    height: 35px;
    line-height: 35px;
    display: flex;
    border-bottom: 1px solid #E9ECEF;
}
.apiIndexDrawerItemNameLeft{
    width: 200px;
    height: 100%;
    /* background: #88A0CD; */
    font-size: 12px;
    border-right: 1px solid #E9ECEF;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.apiIndexDrawerItemNameLink{
    width: calc(100% - 240px);
    height: 100%;
    font-size: 12px;
    border-right: 1px solid #E9ECEF;
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.apiIndexDrawerItemNameRight{
    width: 40px;
    height: 100%;
    font-size: 12px;
    /* border-right: 1px solid #88A0CD; */
    text-align: center;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
.apiIndexDrawerItemParent{
    width: 100%;
    height: 35px;
    font-size: 12px;
    color: #666;
    line-height: 35px;
    padding-left: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #E9ECEF;
    font-weight: bold;
}
.apiIndexDrawerItemFoot{
    width: 100%;
    height: 70px;
    padding-top: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    padding-right: 20px;
    padding-bottom: 10px;
    box-sizing: border-box;
}
</style>
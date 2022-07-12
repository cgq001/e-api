<template>
<!-- 项目 -->
    <div class="projectIndex">
        <!-- 左侧 -->
        <div class="projectIndexAside">
            <div class="projectIndexAsideNews">
                <div class="projectIndexAsideNameIcon">
                    <span class="iconfont icon-jiahao"></span>
                </div>
                <div class="projectIndexAsideNameText" @click="addProject">
                    新建项目
                </div>
            </div>
            <div class="projectIndexAsideList">
                <el-scrollbar style="height:100%;">
                    <div class="projectIndexAsideListItem" 
                        v-for="item in projectList" :key="item.uuid"
                        :class="item.uuid == asideIndex && 'projectIndexAsideListItemActive'"
                        @click="tagProject(item)">
                        <span class="iconfont icon-list" style="color: #88A0CD;margin-right: 5px;"></span>
                        <span>{{item.projectName}}</span>
                    </div>
                    <el-empty v-if="projectList.length == 0" description="暂无数据" />
                </el-scrollbar>
            </div>
        </div>
        <!-- 右侧 -->
        <div class="projectIndexMain" v-if="asideIndex">
            <div class="projectIndexMainName">
                <div class="projectIndexMainNameLeft">
                    项目名称：
                </div>
                <div class="projectIndexMainNameInput">
                    <el-input v-model="asideProjectName" maxlength="16" placeholder="请输入项目名称(限16个字符以内)" />
                </div>
                <div class="projectIndexMainNameRight" style="margin-left: 20px;">
                    <el-button type="primary" style="width: 120px;" @click="updataProjectName">保存修改</el-button>
                </div>
                <div class="projectIndexMainNameRight" style="margin-left: 20px;">
                    <el-button type="success" style="width: 120px;" @click="addNewsUser">添加成员</el-button>
                </div>
                <div class="projectIndexMainNameRight" style="margin-left: 20px;" @click="deleteTeam">
                    <el-button type="danger" style="width: 120px;">解散项目</el-button>
                </div>
                <div class="projectIndexMainNameRight" style="margin-left: 20px;">
                    <el-button type="text" style="width: 120px;text-decoration: underline;color: red;"
                        :disabled="!this.asideIndex"
                        @click="goApi">进入项目</el-button>
                </div>
            </div>
            <div class="projectIndexMainTable">
                <el-table 
                    :data="tableData" 
                    border style="width: 100%"
                    >
                    <el-table-column 
                        label="序号" 
                        type="index" 
                        width="80"
                        align='center' />
                    <el-table-column 
                        prop="name" 
                        label="头像" 
                        width="80"
                        align='center' />
                    <el-table-column 
                        prop="wxNickName" 
                        label="昵称" 
                        width="280"
                        align='center' />
                    <el-table-column 
                        prop="sex" 
                        label="性别" 
                        width="80"
                        align='center' />
                    <el-table-column 
                        prop="email" 
                        label="邮箱"
                        align='center'>
                        <template #default="scope">
                            <span>{{getNoEmail(scope.row.email)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        prop="email" 
                        label="当前权限"
                        align='center'>
                        <template #default="scope">
                            <span>{{scope.row.auth == 2 ? '编辑者' : scope.row.auth == 1 ? '观察者': '暂无权限'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        label="切换权限" 
                        width="280"
                        align='center'>
                        <template #default="scope">
                      
                        
                                <el-button size="small" v-if="scope.row.auth != 1" @click="updataAuth(scope.row, 1)" type="info">观察者</el-button>
                                <el-button size="small" v-if="scope.row.auth != 2" @click="updataAuth(scope.row, 2)" type="primary">编辑者</el-button>
                                <el-button size="small" type="danger"  v-if="userInfoItem.email != scope.row.email" @click="deleteItem(scope.row)">取消权限</el-button>
                     
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 添加项目 -->
        <el-dialog
            v-model="projectShow"
            title="新建项目"
            width="30%"
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'
        >
            <el-input 
                v-model.trim="projectName" 
                placeholder="请输入项目名称(限16个字符以内)"
                style="margin-bottom: 20px;"
                maxlength="16" />
            <div class="teamSubmit">
                <el-button 
                    size="small" 
                    type="primary" 
                    style="width: 100%;"
                    :loading="projectLoad"
                    @click="submitProject"
                    >确认添加</el-button>
            </div>
        </el-dialog>
        <!-- 添加项目 -->
        <el-dialog
            v-model="addUserShow"
            title="添加成员"
            width="30%"
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'
        >
            <el-form :model="addUser" :rules="userRules" ref="ruleForm"  class="demo-ruleForm">
    
                <el-form-item prop="name">
                    <el-select v-model="addUser.name" multiple placeholder="请选择用户" style="width:100%;">
                        <el-option 
                        v-for="item in teamUserProjetc"
                        :key="item.uuid"
                        :label="item.nickName" 
                        :value="item.uuid"
                        :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="auth">
                    <el-select v-model="addUser.auth" placeholder="请选择权限"  style="width:100%;">
                        <el-option label="观察者" value="1"></el-option>
                        <el-option label="编辑者" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="teamSubmit">
                <el-button 
                    size="small" 
                    type="primary" 
                    style="width: 100%;"
                    :loading="addUserLoad"
                    @click="addProjectUser"
                    >确认添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { 
        addProject, 
        searchProject , 
        searchProjectUser , 
        updataProjectInfo,
        searchTeamUser,
        addProjectUserItem,
        removeProjectItem,
        removeProjectUserItem } from '../../../api/item'
import { ElMessageBox } from 'element-plus'
export default {
    data(){
        return {
            asideIndex: '',
            asideProjectName: '',
            name: '',
            tableData: [],
            projectShow: false,
            projectName: '',
            projectLoad: false,
            projectList: [],
            addUserShow: false,
            addUserLoad: false,
            teamUser: [],
            addUser: {
                name: [],
                auth: "1"
            },
            userRules: {
                name: [{ required: true, message: '请选择用户', trigger: 'blur' }],
                auth: [{ required: true, message: '请选择权限', trigger: 'blur' }]
            },
            teamUserProjetc: []
        }
    },
    created(){
        let teamValue = window.localStorage.getItem('teamValue') || ''     
        // 这里应该校验当前是否还处于该团队
        if(!teamValue){
            ElMessageBox.confirm(
                '你目前还没有选择团队,请先选择团队?',
                '警告',
                {
                confirmButtonText: '知道了',
                cancelButtonText: '去管理团队',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
                }
            )
                .then(() => {
                    this.$router.replace('/')
                })
                .catch(() => {
                    this.$router.replace('/team')
                })
        }else{
            // 获取项目
            this.getProjectItem()
            // 查询团队用户
            this.getTeamUser()
        }
        
    },
    methods: {
        addProject(){
            this.projectShow = true
            this.projectName = ''
        },
        // 添加项目
        submitProject(){
            if(this.projectName.length == 0){
                return 
            }
            this.projectLoad = true
            addProject({
                projectName: this.projectName,
                projectTeamUuid: window.localStorage.getItem('teamValue')
            })
            .then(res => {
                if(res.status == 200){
                    this.$toast.success(res.message)
                    this.projectShow = false
                    this.projectName = ''
                    this.getProjectItem()
                }else{
                    this.$toast.fail('创建失败')
                }
               
            })
            .finally(()=>{
                 this.projectLoad = true
            })
        },
        // 获取项目
        getProjectItem(){
            searchProject({
                projectTeamUuid: window.localStorage.getItem('teamValue')
            })
            .then(res => {
                if(res.status == 200){
                    this.projectList = res.data || []
                    if(this.projectList.length > 0 ){
                        let asideIndex = window.localStorage.getItem('asideIndex')
                        if(asideIndex){
                            this.asideIndex = asideIndex
                            let pv = window.localStorage.getItem('projectValue')
                            let pvF = false
                            for(let i=0; i < this.projectList.length; i++){
                                if(this.projectList[i].uuid == asideIndex){
                                    this.asideProjectName = this.projectList[i].projectName
                                }

                                if(pv && this.projectList[i].uuid == pv) {
                                    pvF = true
                                }
                            }
                            if(pv && !pvF){
                                this.$store.commit('ApiList/clearStore')
                                window.localStorage.removeItem('projectValue')
                            }
                        }else{
                            this.asideIndex = this.projectList[0].uuid 
                            this.asideProjectName = this.projectList[0].projectName
                            window.localStorage.setItem('asideIndex', this.asideIndex)
                        }
                        
                    }else{
                        this.$store.commit('ApiList/clearStore')
                        window.localStorage.removeItem('projectValue')
                        // window.localStorage.removeItem('teamValue')
                        // this.$router.push('/')
                    }
                }
            })
        },
        // 获取用户列表
        getAuthUser(uuid){
            searchProjectUser({
                projectUuid: uuid
            })
            .then(res => {
                if(res.status == 200){
                    
                    let { authUser = [], dataUser = []} = res.data
                    for(let i=0; i<dataUser.length; i++){
                        dataUser[i].auth = 0
                        for(let k=0; k<authUser.length; k++){
                            
                            if(dataUser[i].uuid == authUser[k].uuid){
                                dataUser[i].auth =  authUser[k].auth
                            }
                        }
                    }
                    this.tableData = dataUser
                }
            })
        },
        // 获取匿名邮箱
        getNoEmail(email){
            let arr = email.split("@");
            let star = "";
            if (arr[0].length <= 3) {
                star = "*";
                arr[0] = arr[0].substr(0, arr[0].length) + star;
            } else {
                star = "***";
                arr[0] = arr[0].substr(0, 1) + star + arr[0].charAt(arr[0].length - 1);

            }
            return email = arr[0] + "@" + arr[1];
        },
        // 修改权限
        updataAuth(item,index){
            item.auth = index
            updataProjectInfo({
                projectUuid: this.asideIndex,
                auth: item
            })
            .then(res =>{
                if(res.status == 200){
                    this.$toast.success('更新成功')
                    this.getAuthUser(this.asideIndex)
                }
            })
        },
        // 修改项目名称
        updataProjectName(){
            if(this.asideProjectName.length == 0){
                return 
            }
            updataProjectInfo({
                projectUuid: this.asideIndex,
                projectName: this.asideProjectName
            })
            .then(res =>{
                if(res.status == 200){
                    this.$toast.success('更新成功')
                    this.getProjectItem()
                }
            })
        },
        // 查询团队用户
        getTeamUser(){
            searchTeamUser({
                projectTeamUuid: window.localStorage.getItem('teamValue')
            })
            .then(res => {
                if(res.status == 200){
                    this.teamUser = res.data
                }
            })
        },
        // 点击 添加用户
        addNewsUser(){
            let teamUserProjetc = JSON.parse(JSON.stringify(this.teamUser))
            let tableData = this.tableData 
            for(let i=0; i<teamUserProjetc.length; i++){
                for(let k=0; k<tableData.length; k++){
                    if(teamUserProjetc[i].uuid == tableData[k].uuid){
                        teamUserProjetc[i].disabled = true
                    }
                }
            }

            this.teamUserProjetc = teamUserProjetc
            this.addUserShow = true
        },
        // 进入项目
        goApi(){
            if(this.asideIndex){
                let oldAsideIndex = window.localStorage.getItem('projectValue')
                if(oldAsideIndex == this.asideIndex){
                    this.$router.push('/api')
                }else{
                    window.localStorage.setItem('projectValue', this.asideIndex)
                    this.$store.commit('ApiList/clearStore')
                    this.$router.push('/api')
                } 
            }
        },
        // 添加用户
        addProjectUser(){
           
            if(this.addUser.name.length == 0) return
            this.addUserLoad = true
            let projectData = []
            for(let i=0; i< this.addUser.name.length; i++){
                projectData.push({
                    uuid: this.addUser.name[i],
                    auth: this.addUser.auth
                })
            }
           
            addProjectUserItem({
                uuid: this.asideIndex,
                teamUser: projectData
            })
            .then(res => {
                this.addUserLoad = false
                if(res.status == 200){
                    this.addUserShow = false
                    this.getProjectItem()
                    this.getAuthUser(this.asideIndex)
                }
            })
            .finally(()=>{
                this.addUserLoad = false
                this.addUserShow = false
            })
        },
        // 解散团队
        deleteTeam(){
            ElMessageBox.confirm(
                '确定要解散该项目吗?',
                '警告',
                {
                confirmButtonText: '解散',
                cancelButtonText: '算了',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
                }
            )
                .then(() => {
                    removeProjectItem({
                        uuid: this.asideIndex
                    })
                    .then(res => {
                        if(res.status == 200){
                            if(this.asideIndex){
                                let oldAsideIndex = window.localStorage.getItem('projectValue')
                                console.log(oldAsideIndex, this.asideIndex)
                                if(oldAsideIndex == this.asideIndex){
                                    this.$store.commit('ApiList/clearStore')
                                    window.localStorage.removeItem('projectValue')
                                }
                                let asideIndex = window.localStorage.getItem('asideIndex')
                                if(this.asideIndex == asideIndex){
                                     window.localStorage.removeItem('asideIndex')
                                }

                                this.getProjectItem()
                            }
                        }
                    })
                })
                .catch(() => {
                    
                })
           
        },
        // 切换项目
        tagProject(item){
            this.asideIndex = item.uuid
            this.asideProjectName = item.projectName
            window.localStorage.setItem('asideIndex', item.uuid)
        },
        // 取消权限
        deleteItem(item){
            ElMessageBox.confirm(
                    '确定要移除该成员吗?',
                    '警告',
                    {
                    confirmButtonText: '确定',
                    cancelButtonText: '算了',
                    type: 'warning',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false
                    }
                )
                .then(() => {
                    removeProjectUserItem({
                        teamUser:  item.uuid,
                        uuid: this.asideIndex
                    })
                    .then(res => {
                        if(res.status == 200){
                            this.getAuthUser(this.asideIndex)
                        }
                    })
                })
                .catch(() => {
                    
                })
        }
    },
    computed:{
        userInfoItem(){
            return this.$store.state.userApi.userInfo
        }
	},
    watch: {
        asideIndex:{
            handler(news){
                if(news && news.length > 0){
                    this.getAuthUser(news)
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.projectIndex{
    width: 100%;
    height: 100%;
    display: flex;
}
.projectIndexAside{
    width: 310px;
    height: 100%;
    /* background: yellow; */
    padding: 5px 0;
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
}
.projectIndexAsideNews{
    height: 45px;
    /* background: blueviolet; */
    font-size: 12px;
    line-height: 45px;
    border-bottom: 1px solid #DCDFE6;
    box-sizing: border-box;
    padding: 0 5px;
    display: flex;
    cursor: pointer;
}
.projectIndexAsideNameIcon{
    width: 25px;
    height: 45px;
    /* background: yellow; */
    text-align: center;
    line-height: 45px;
    cursor: pointer;
    color: #EF2B20;
}
.projectIndexAsideNameText{
    width: calc(100% - 50px);
    height: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #EF2B20;
    font-weight: bold;
    /* background: #EF2B20; */
}
.projectIndexAsideList{
    width: 100%;
    height: calc(100% - 45px);
    /* background: cornflowerblue; */
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
    padding-left: 5px;
}
.projectIndexAsideList::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.projectIndexMain{
    width: calc(100% - 310px);
    height: 100%;
    /* background: chocolate; */
    padding-top: 20px;
    box-sizing: border-box;
}
.projectIndexAsideListItem{
    width: 100%;
    height: 40px;
    line-height: 40px;
    /* background: crimson; */
    cursor: pointer;
    padding-left: 10px;
    box-sizing: border-box;
    border-left: 3px solid transparent;
    color: #767779;
    font-size: 14px;
    margin: 5px 0;
}
.projectIndexAsideListItemActive{
   background: #EAF2FF;
   border-left-color: #2C7BFB; 
}

.projectIndexMainName{
    width: 100%;
    height: 50px;
    /* background: violet; */
    line-height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.projectIndexMainNameLeft{
    width: 100px;
    height: 100%;
    /* background: turquoise; */
}
.projectIndexMainNameRight{
    width: 120px;
    height: 100%;
    /* background: turquoise; */
    
}
.projectIndexMainNameInput{
    flex: 1;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.projectIndexMainTable{
    width: 100%;
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
    padding: 20px;
    box-sizing: border-box;
}
.projectIndexMainTable::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
</style>
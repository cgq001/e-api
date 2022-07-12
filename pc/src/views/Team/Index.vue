<template>
<!-- 项目 -->
    <div class="teamIndex">
        <!-- 左侧 -->
        <div class="teamIndexAside">
            <div class="teamIndexAsideNews">
                <div class="teamIndexAsideNameIcon"
                    @click="addTeam">
                    <span class="iconfont icon-jiahao"></span>
                </div>
                <div class="teamIndexAsideNameText"
                    @click="addTeam">
                    新建团队
                </div>
                <div class="teamIndexAsideNameHome">
                    <span class="iconfont icon-zhuye" title="主页" @click="goIndex"></span>
                </div>
            </div>
            <div class="teamIndexAsideList">
                <el-scrollbar style="height:100%;">
                    <div class="teamIndexAsideListItem" 
                        v-for="item in teamDataList" :key="item"
                        :class="item.uuid == asideIndex && 'teamIndexAsideListItemActive'"
                        @click="tegTeam(item)">
                        <span class="iconfont icon-list" style="color: #88A0CD;margin-right: 5px;"></span>
                        <span>{{item.teamName}}</span>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <!-- 右侧 -->
        <div class="teamIndexMain" v-if="asideIndex">
            <div class="teamIndexMainName">
                <div class="teamIndexMainNameLeft">
                    团队名称：
                </div>
                <div class="teamIndexMainNameInput">
                    <el-input v-model="teamNameUpdata" maxlength="16" placeholder="请输入团队名称(限16个字符以内)" />
                </div>
                <div class="teamIndexMainNameRight">
                    <el-button type="primary" style="width: 120px;" @click="submitUpdata">确认修改</el-button>
                </div>
                <div class="teamIndexMainNameRight">
                    <el-button type="success" style="width: 120px;" @click="addUser">添加成员</el-button>
                </div>
                <div class="teamIndexMainNameRight">
                    <el-button type="danger" style="width: 120px;" @click="deleteTeam">解散团队</el-button>
                </div>
                <div class="teamIndexMainNameRight" style="margin-left: 20px;">
                    <el-button type="text" style="width: 120px;text-decoration: underline;color: red;" @click="tagTeam">切换团队</el-button>
                </div>
            </div>
            <div class="teamIndexMainTable">
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
                        prop="nickName" 
                        label="昵称" 
                        width="280"
                        align='center' />
                    <el-table-column 
                        prop="email" 
                        label="邮箱"
                        align='center' />
                    <el-table-column 
                        label="操作" 
                        width="280"
                        align='center'>
                        <template #default="scope">
                            <el-button size="small" 
                                type="danger"
                                :loading="teamLoad"
                                @click="removeTeam(scope.row)">移除团队</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 添加成员 -->
        <el-dialog
            v-model="userShow"
            title="添加成员"
            width="30%"
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'
        >
            <!-- <el-select 
                v-model="userValue" 
                placeholder="请输入账号搜索" 
                size="large"
                style="width: 100%;margin-bottom: 50px;">
                <el-option
                v-for="item in userOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
                </el-option>
            </el-select> -->
            <el-select
                v-model="addForm.teamUserUuid"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入账号搜索" 
                size="large"
                style="width: 100%;margin-bottom: 50px;"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <div class="teamSubmit">
                <el-button size="small" type="primary" style="width: 150px;"
                  :loading="isAddLoad"
                 @click="addTeamUser">确认添加</el-button>
            </div>
        </el-dialog>
        <!-- 新建团队 -->
        <el-dialog
            v-model="teamShow"
            title="新建团队"
            width="30%"
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'
        >
            <el-input 
                v-model.trim="teamName" 
                placeholder="请输入团队名称(限16个字符以内)"
                style="margin-bottom: 20px;"
                maxlength="16" />
            <div class="teamSubmit">
                <el-button 
                    size="small" 
                    type="primary" 
                    style="width: 100%;"
                    :loading="teamLoad"
                    @click="submitTeam"
                    >确认添加</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { 
    addTeam , 
    searchTeam, 
    searchUserAllInfo,
    updataTeam,
    searchTeamUserTeam,
    addTeamUserItem,
    removeTeamUserItem,
    removeTeamItem } from '../../api/item'
import { ElMessageBox } from 'element-plus'
export default {
    data(){
        return {
            asideIndex: null,
            teamNameUpdata: '',
            tableData: [],
            outUser: [],
            userShow: false,
            userValue: '',
            userOptions: [
                {
                    value: '',
                    label: '张三'
                }
            ],
            teamShow: false,
            teamName: '',
            teamLoad: false,
            teamDataList: [],
            loading: false,
            options: [],
            addForm:{
                teamUserUuid: ''
            },
            isAddLoad: false
        }
    },
    created(){
        this.getSearchTeam()
    },
    methods: {
        // 
        addTeam(){
            this.teamShow = true
            this.teamName = ''
        },
        // 新建团队
        async submitTeam(){
            if(this.teamName.length == 0){
                return false
            }
            this.teamLoad = true
            let result = await addTeam({
                teamName: this.teamName
            })
            this.teamLoad = false
            if(result.status == 200){
                this.$toast.success(result.message)
                this.teamShow = false
                this.getSearchTeam()
            }else{
                this.$toast.fail(result.message)
            }
        },
        // 查询团队
        async getSearchTeam(){
            let result = await searchTeam()
            if(result.status == 200){
                this.teamDataList = result.data || []
                if(this.teamDataList.length >0){

                    let teamActiveIndex = window.localStorage.getItem('teamActiveIndex')
        

                    if(teamActiveIndex){
                        this.asideIndex = teamActiveIndex
                        this.teamNameUpdata = ''
                        let teamActiveData = []
                        for(let i=0; i<this.teamDataList.length; i++){
                            if(this.teamDataList[i].uuid == teamActiveIndex){
                                teamActiveData = this.teamDataList[i].teamUserUuid
                                this.teamNameUpdata = this.teamDataList[i].teamName
                            }
                        }
                        this.getSearchUserAllInfo(teamActiveData)
                    }else{
                        this.asideIndex = this.teamDataList[0].uuid
                        this.teamNameUpdata = this.teamDataList[0].teamName
                        this.getSearchUserAllInfo(this.teamDataList[0].teamUserUuid)
                        // 记录当前团队
                        window.localStorage.setItem('teamActiveIndex', this.teamDataList[0].uuid)
                    }
                    
                }
            }else{
                this.$toast.fail(result.message)
            }
        },
        // 切换团队
        async tegTeam(item){
            console.log(item)
            this.asideIndex = item.uuid
            this.teamNameUpdata = item.teamName
            this.getSearchUserAllInfo(item.teamUserUuid)
            window.localStorage.setItem('teamActiveIndex', item.uuid)       

        },
        // 查询团队成员信息
        async getSearchUserAllInfo(teamUserUuid){
            let result = await searchUserAllInfo({
                teamUserUuid:teamUserUuid
            })
            if(result.status == 200){
                this.tableData  = result.data
            }
        },

        // 修改团队名称
        async submitUpdata(){
            let result = await updataTeam({
                uuid: this.asideIndex,
                teamName: this.teamNameUpdata
            })

            if(result.status == 200){
                this.$toast.success(result.message)
                this.getSearchTeam()
            }else{
                this.$toast.fail(result.message)
            }
        },
        // 回主页
        goIndex(){
            this.$router.push('/')
        },
        // 切换团队
        tagTeam(){
            // this.asideIndex
            // window.localStorage.setItem('teamValue', this.asideIndex)
            

            let oldTeamValue = window.localStorage.getItem('teamValue')
                if(oldTeamValue && oldTeamValue == this.asideIndex){
                    this.teamShow = false
                    this.$toast.success('切换成功')
                    this.$router.push('/')
                }else{
                     window.localStorage.setItem('teamValue', this.asideIndex)
                     window.localStorage.removeItem('projectValue')
                     this.$store.commit('ApiList/clearStore')
                     this.$router.push('/')
                     this.$store.dispatch('ApiList/getTeamInfo',this.asideIndex)
                     window.localStorage.removeItem('asideIndex')
                }
 
        },
        // 搜索用户
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                searchTeamUserTeam({
                    teamUser: this.outUser,
                    email: query
                })
                .then(res => {
                    this.loading = false
                    if(res.status == 200){
                        let data = res.data || []
                            data.map(item => {
                                item.value = item.uuid
                                item.label = item.email
                            })
                            this.options = data;
                        return data
                    }
                })
                .catch(()=>{
                    this.loading = false
                })
            } else {
            this.options = [];
            }
        },
        // 添加用户
        addTeamUser(){
            if(this.addForm.teamUserUuid.length == 0){
                this.$toast.fail('请先选择用户')
                return
            }
            this.isAddLoad = true
            addTeamUserItem({
                uuid: this.asideIndex,
                teamUser: this.addForm.teamUserUuid
            })
            .then(res => {
                this.isAddLoad = false
                if(res.status == 200){
                    this.userShow = false
                    this.getSearchTeam()
                    this.$nextTick(()=>{
                        this.$toast.success('添加成功')
                    })
                }
            })
            .finally(()=>{
                this.isAddLoad = false
            })

        },
        // 添加成员
        addUser(){
            this.addForm.teamUserUuid = []
            this.options = []
            this.userShow = true
        },
        // 移除用户
        removeTeam(item){
            this.teamLoad = true
            removeTeamUserItem({
                uuid: this.asideIndex,
                teamUser: item.uuid
            })
            .then((res)=>{
                if(res.status == 200){
                    this.teamLoad = false
                    this.getSearchTeam()
                }
            })
            .finally(()=>{
                this.teamLoad = false
            })
        },
        // 解散团队
        deleteTeam(){
            ElMessageBox.confirm(
                '确定要解散该团队吗?',
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
                    removeTeamItem({
                        uuid: this.asideIndex
                    })
                    .then(res => {
                        if(res.status == 200){
                            
                            let teamActiveIndex = window.localStorage.getItem('teamActiveIndex')
                                if(teamActiveIndex == this.asideIndex){
                                    window.localStorage.removeItem('teamActiveIndex')
                                }
                            
                            // 清空已经保存的当前团队、项目、tab
                            let teamValue = window.localStorage.getItem('teamValue')
                            if(teamValue == this.asideIndex){
                                window.localStorage.removeItem('teamValue')
                                window.localStorage.removeItem('projectValue')
                                this.$store.commit('ApiList/clearStore')
                            }

                            this.getSearchTeam()
                        }
                    })
                })
                .catch(() => {
                    
                })
           
        }
    },
    watch: {
        tableData:{
            handler(news){
                if(news.length > 0){
                    this.outUser = news.map(item => {
                        return item.uuid
                    })
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped>
.teamIndex{
    width: 100%;
    height: 100%;
    display: flex;
}
.teamIndexAside{
    width: 310px;
    height: 100%;
    /* background: yellow; */
    padding: 5px 0;
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
}
.teamIndexAsideNews{
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
.teamIndexAsideNameIcon{
    width: 25px;
    height: 45px;
    /* background: yellow; */
    text-align: center;
    line-height: 45px;
    cursor: pointer;
    color: #EF2B20;
}
.teamIndexAsideNameText{
    width: 120px;
    height: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #EF2B20;
    font-weight: bold;
    /* background: turquoise; */
}
.teamIndexAsideNameHome{
    width: calc(100% - 170px);
    height: 100%;
    /* background: coral; */
    text-align: right;
}
.teamIndexAsideNameHome span{
    color: #A8ACAE;
}
.teamIndexAsideList{
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
.teamIndexAsideList::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.teamIndexMain{
    width: calc(100% - 310px);
    height: 100%;
    /* background: chocolate; */
    padding-top: 20px;
    box-sizing: border-box;
}
.teamIndexAsideListItem{
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
.teamIndexAsideListItemActive{
   background: #EAF2FF;
   border-left-color: #2C7BFB; 
}

.teamIndexMainName{
    width: 100%;
    height: 50px;
    /* background: violet; */
    line-height: 50px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.teamIndexMainNameLeft{
    width: 100px;
    height: 100%;
    /* background: turquoise; */
}
.teamIndexMainNameRight{
    width: 120px;
    height: 100%;
    /* background: turquoise; */
    margin-left: 10px;
    
}
.teamIndexMainNameInput{
    flex: 1;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.teamIndexMainTable{
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
.teamIndexMainTable::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.teamSubmit{
    width: 100%;
    height: 45px;
    /* background: chocolate; */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
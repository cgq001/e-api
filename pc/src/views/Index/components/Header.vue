<template>
<!-- 全系统 头部
    软件名称
    搜索
    用户信息
 -->
    <div class="indexHeader">
        <div class="indexHeaderLeft">
            <div class="indexHeaderRightInfo">
                 <el-dropdown  @command='commandClick'>
                    <span class="el-dropdown-link">
                        <img :src="$store.state.userApi.urlAPi + userInfoItem.headerImage" />
                    </span>
                    <template #dropdown >
                        <el-dropdown-menu>
                            <el-dropdown-item disabled>
                                <div class="indexHeaderRightInfoItemUser">
                                    <div class="indexHeaderRightInfoItemUserImage">
                                        <img :src="$store.state.userApi.urlAPi + userInfoItem.headerImage" />
                                    </div>
                                    <div class="indexHeaderRightInfoItemUserInfo">
                                        <p>{{userInfoItem.nickName}}</p>
                                        <p>{{userInfoItem.email}}</p>
                                    </div>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item divided command="editInfo">
                                <span class="iconfont icon-mingpian indexHeaderRightInfoItem">修改资料</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="editPassWord">
                                <span class="iconfont icon-suoding indexHeaderRightInfoItem">修改密码</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided command="tagTeam">
                                <span class="iconfont icon-tuandui indexHeaderRightInfoItem">切换团队</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided command="outUser">
                                <span class="iconfont icon-daochu indexHeaderRightInfoItem">退出登陆</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <div class="indexHeaderRightInfoUser">
                    <div class="indexHeaderRightInfoItemName">
                        {{userInfoItem.nickName}}
                    </div>
                    <div class="indexHeaderRightInfoItemName" v-if="teamInfo.teamName" style="font-size: 12px;">
                        <span class="indexHeaderRightInfoItemTeam">{{teamInfo.teamName}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="indexHeaderCenter">
            
        </div>
        <!-- 用户信息 -->
        <div class="indexHeaderRight">
            <div class="indexHeaderRightTitle" v-if="isElectron == 1">
                <span class="iconfont icon-zuixiaohua indexHeaderRightTitleIcon"
                     alt='最小化' @click="minWindow"></span>
                <span class="iconfont  indexHeaderRightTitleIcon"
                    :class="isMax ? 'icon-zuidahua' : 'icon-zuidahuaxi'"
                     alt='最大化' @click="tagWindow"></span>
                <span class="iconfont icon-guanbi1 indexHeaderRightTitleIconClose"
                     alt='关闭' @click="closeWindow"></span>
            </div>
            
        </div>
        <!-- 切换团队 -->
        <el-dialog 
            v-model="teamShow" 
            title="切换团队" 
            width="500px" 
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'>
                <el-select v-model="teamValue" 
                    placeholder="请选择团队" 
                    size="large"
                    style="width: 100%; margin-bottom: 20px;">
                    <el-option
                    v-for="item in teamOptions"
                    :key="item.uuid"
                    :label="item.teamName"
                    :value="item.uuid"
                    
                    >
                    </el-option>
                </el-select>
                <div class="teamSubmit">
                    <el-button 
                        size="small" 
                        type="primary"
                        @click="tagItem">确认切换</el-button>
                    <el-button 
                        size="small" 
                        type="info"
                        @click="goItem">管理团队</el-button>
                </div>
        </el-dialog>
        <!-- 修改密码 -->
        <el-dialog 
            v-model="passwordShow" 
            title="修改密码" 
            width="500px" 
            center
            :close-on-click-modal='false'
            :close-on-press-escape='false'>
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwordForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="旧密码" prop="oldPawwword">
                    <el-input v-model="passwordForm.oldPawwword"></el-input>
                </el-form-item>
                <el-form-item label="" style="display:flex; justify-content: space-between;">
                    
                    <el-button @click="resetPassword" size="small" style="width: 120px;">取消</el-button>
                    <el-button type="primary" @click="submitForm('passwordForm')" :loading="isLoading" size="small" style="width: 120px;">确认修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 修改资料弹出层 -->
        <el-dialog
            title="修改资料"
            v-model="isDataShow"
            class="dataShow"
            width="500px"
            :close-on-press-escape='false'
            :close-on-click-modal='false'>
            <el-form ref="form" :model="userForm" label-width="80px">
                <el-form-item label="昵称">
                    <el-input v-model="userForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <div class="dataShowIamge">
                        <div 
                            class="dataShowIamgeItem"
                            v-for="(item,index) in userListImage"
                            :key="index"
                            :class="userForm.headerImage == item && 'dataShowIamgeItemActive'"
                            @click="changeImage(item)"
                            >
                            <img :src="$store.state.userApi.urlAPi + item" />
                        </div>
                    </div>
                </el-form-item>
                <el-form-item class="dataShowSubmit">
                    <el-button type="primary" size="small" style="width: 120px;" @click="onSubmit">确认修改</el-button>
                    <el-button @click="isDataShow = false" size="small"  style="width: 120px;">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { getToken } from '@/utils/auth';
import { userInfo, searchTeam , updataUserInfoPassword, updataUserInfo } from '../../../api/item'
import { ElMessageBox } from 'element-plus'
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            // 
            let rgP = /^[a-zA-Z0-9_-]{6,18}$/
            
            if (value === '') {
                callback(new Error('请输入密码'));
            }else if(!rgP.test(value)){
                callback(new Error('密码为6~18位的字母、数字、下划线组成'));
            } else {
                callback();
            }
        }
        return {
            teamShow: false,
            teamValue: window.localStorage.getItem('teamValue') ,
            teamOptions: [],
            passwordShow: false,
            passwordForm:{
                newPassword: '',
                oldPawwword: ''
            },
            passwordRules: {
                newPassword: [
                    {   required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                oldPawwword: [
                    {   required: true, message: '请输入旧密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ]
            },
            isLoading: false,
            isDataShow: false,
            userForm: {
                nickName: '',
                headerImage: ''
            },
            userListImage: [
                '/public/image/head/1.png',
                '/public/image/head/2.png',
                '/public/image/head/3.png',
                '/public/image/head/4.png',
                '/public/image/head/5.png',
                '/public/image/head/6.png',
                '/public/image/head/7.png',
                '/public/image/head/8.png',
                '/public/image/head/9.png',
                '/public/image/head/10.png',
                '/public/image/head/11.png',
                '/public/image/head/12.png',
                '/public/image/head/13.png',
                '/public/image/head/14.png',
                '/public/image/head/15.png'
            ],
            isMax: false,
            mP: ''
        }
    },
    mounted(){

        let teamValue = window.localStorage.getItem('teamValue')

        if(teamValue){
            this.$store.dispatch('ApiList/getTeamInfo',teamValue)
        }
        if(this.isElectron == 1){
            let This = this 
            this.$electron.ipcRenderer.on('maxState',function(event,data){
                    This.isMax = data
                })
        }
        
    },
    methods: {
        commandClick(command){
            switch(command){
                 // 修改资料
                case 'editInfo':
                    this.isDataShow = true
                break;
                 // 修改密码
                case 'editPassWord':
                   this.shwoPassword()
                break;
                // 切换团队
                case 'tagTeam':
                    this.tagTeam()
                break;
                // 推出登录
                case 'outUser':
                    this.outLoad()
                break;
            }
        },
        // 切换团队按钮
        tagTeam(){
            // this.teamShow = true
            this.getSearchTeam()
        },
        // 获取团队信息
        getSearchTeam(){
            searchTeam()
                .then(res => {
               
                    if(res.status == 200){
                        this.teamOptions = res.data
                        this.teamShow = true
                    }else{
                       this.$toast.fail(res.message) 
                    }
                })
        },
        // 确认切换团队
        tagItem(){
            if(this.teamValue && this.teamValue.length > 0){
                let oldTeamValue = window.localStorage.getItem('teamValue')
                console.log(oldTeamValue)

                if(oldTeamValue && oldTeamValue == this.teamValue){
                    this.teamShow = false
                    
                }else{
                     window.localStorage.setItem('teamValue', this.teamValue)
                     window.localStorage.removeItem('projectValue')
                     window.localStorage.removeItem('asideIndex')
                     this.$store.commit('ApiList/clearStore')
                     this.$toast.success('切换成功')
                     this.$router.replace('/')
                     this.teamShow = false
                     this.$store.dispatch('ApiList/getTeamInfo',this.teamValue)
                }
                
                 
            }
        },
        // 去管理团队
        goItem(){
            this.$router.push('/team')
        },
        // 退出登录
        outLoad(){
            ElMessageBox.confirm(
                '确定要退出登录嘛？',
                '警告',
                {
                confirmButtonText: '退出登录',
                cancelButtonText: '算了',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
                }
            )
                .then(() => {
                    this.$store.commit('userApi/outUserInfo')
                    this.$router.replace('/login')
                    
                })
                .catch(() => {
                    
                })
        },
        // 打开修改密码
        shwoPassword(){
            this.passwordForm = {
                newPassword: '',
                oldPawwword: ''
            }
            this.passwordShow = true
        },
        // 取消修改密码
        resetPassword(){
            this.passwordShow = false
        },
        // 确认修改密码
        submitForm(formName){
             this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.isLoading = true

                        updataUserInfoPassword({
                           newPassword:  this.passwordForm.newPassword,
                           oldPassword:  this.passwordForm.oldPawwword,
                        })
                        .then(res => {
                            this.isLoading = false
                            if(res.status == 200){
                                this.$toast.success(res.message)
                                this.$store.commit('userApi/outUserInfo')
                                this.$router.replace('/login')
                            }else{
                                this.$toast.fail(res.message)
                            }
                        })
                        .finally(()=>{
                             this.isLoading = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
        },
        // 修改头像和昵称
        onSubmit(){
            if(!this.userForm.headerImage || !this.userForm.nickName){
                this.$message.error('昵称或头像不能为空')
                return 
            }
            updataUserInfo({
                    headerImage: this.userForm.headerImage,
                    nickName: this.userForm.nickName
                })
                .then(res => {
                    if(res.status == 200){
                        this.isDataShow = false
                        this.getUserInfo()
                    }else{
                        this.$toast.fail('更新失败')
                    }
                })
        },
        // 切换头像
        changeImage(item){
            this.userForm.headerImage = item
        },
        // 获取资料
        async getUserInfo(){
            let result = await userInfo()
            if(result.status == 200){
                this.$store.commit('userApi/setUserInfo', result.data)
            }else{
                this.$router.replace('/login')
            }
        },
        // 最小化
        minWindow(){
            this.$electron.ipcRenderer.send('window-min') 
        },
        // 关闭
        closeWindow(){
            this.$electron.ipcRenderer.send('window-close') 
        },
        // 切换
        tagWindow(){
            this.$electron.ipcRenderer.send('window-tag') 
        },
    },
    computed:{
		token(){
			return this.$store.state.userApi.token || getToken()
		},
        teamInfo(){
			return this.$store.state.ApiList.teamInfo || {}
		},
        userInfoItem(){
            return this.$store.state.userApi.userInfo
        },
        isElectron(){
            return process.env.VUE_APP_Electron
        }
	},
	watch: {
		token: {
            async handler(news,olds){
                if(news){
                    this.getUserInfo()
                }
            },
			immediate: true
		},
        userInfoItem:{
            handler(news){
                if(news){
                    this.userForm.headerImage = news.headerImage
                    this.userForm.nickName = news.nickName
                }
                
            },
            deep: true,
            immediate: true
        }
	}
}
</script>

<style scoped>
.indexHeader{
    width: 100%;
    height: 100%;
    background: #F7F7F7;
    border-bottom: 1px solid #DCDFE6;
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
    box-sizing: border-box;
}
.indexHeaderLeft{
    width: 400px;
    height: 100%;
    text-align: left;
    line-height: 80px;
    /* background: yellowgreen; */
    font-family: '宋体';
    font-size: 30px;
    padding-left: 20px;
    box-sizing: border-box;
}
.indexHeaderCenter{
    width: calc(100% - 800px);
    min-width: 400px;
    -webkit-app-region: drag;
}
/* 用户信息 */
.indexHeaderRight{
    width: 400px;
    height: 100%;
    /* background: blueviolet; */
    padding-top: 5px;
    box-sizing: border-box;
}
.indexHeaderRightTitle{
    width: 100%;
    height: 40px;
    /* background: yellow; */
    display: flex;
    justify-content: flex-end;
}
.indexHeaderRightTitleIcon{
    display: inline-block;
    width: 40px;
    height: 30px;
    color: #545B62;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
}
.indexHeaderRightTitleIcon:hover{
    background: #DCDDDD;
}
.indexHeaderRightTitleIconClose{
    display: inline-block;
    width: 40px;
    height: 30px;
    color: #545B62;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
}
.indexHeaderRightTitleIconClose:hover{
    background: red;
    color: #fff;
}
.indexHeaderRightInfo{
    width: 100%;
    height: 100%;
    /* background: #545B62; */
    display: flex;
}
.indexHeaderRightInfoItem{
    width: 180px;
    text-align: left;
    font-size: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
.indexHeaderRightInfoItem::before{
    margin-right: 10px;
    font-size: 16px;
}
.el-dropdown-link{
    width: 50px;
    height: 50px;
    /* background: yellowgreen; */
    display: inline-block;
    cursor: pointer;
    border-radius: 3px;
    overflow: hidden;
}
.el-dropdown-link img{
    width: 35px;
    height: 35px;
    border-radius: 3px;
    overflow: hidden;
    margin: 7px;
}
.indexHeaderRightInfoUser{
    width: calc(100% - 50px);
    height: 50px;
    /* background: #545B62; */
    
}
.indexHeaderRightInfoItemName{
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    padding-right: 10px;
    box-sizing: border-box;
    text-align: left;
    color: #545B62;
}
.indexHeaderRightInfoItemTeam{
    background-image: linear-gradient(to right,#FE9301,#F55115,#EE2023);
    display: inline-block;
    height: 20px;
    padding: 0 15px;
    box-sizing: border-box;
    color: #fff;
    border-radius: 5px;
}

.indexHeaderRightInfoItemUser{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.indexHeaderRightInfoItemUserImage{
    width: 30px;
    height: 30px;
    border-radius: 5px;
    margin-right: 10px;
}
.indexHeaderRightInfoItemUserImage img{
    width: 100%;
    height: 100%;
}
.indexHeaderRightInfoItemUserInfo{
    width: calc(100% - 30px);
    height: 100%;
    /* background:#F55115; */
}
.indexHeaderRightInfoItemUserInfo p{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 20px;
    font-size: 12px;
}
.teamSubmit{
    width: 100%;
    height: 45px;
    /* background: chocolate; */
    display: flex;
    justify-content: center;
    align-items: center;
}


.dataShowIamge{
    width: 100%;
    height: auto;
    display: flex;
    flex-wrap: wrap;
}
.dataShowIamgeItem{
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    margin: 0 0 10px 10px;
    cursor: pointer;
    border: 5px solid transparent;
    border-radius: 50%;
}
.dataShowIamgeItem img{
    width: 100%;
    height: 100%;
}
.dataShowIamgeItemActive{
    border-color: red;
}
.dataShowSubmit{
    width: 100%;
}
.dataShow{
    padding: 20px;
    box-sizing: border-box;
}
</style>
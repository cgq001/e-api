<template>
<!-- 登陆 -->
    <div class="loginBox">
        <div class="loginMain">
            <div class="loginTitle">
                <span>E-API</span>
                <span class="el-icon-s-tools loginTitleSet" ></span>
                <span class="iconfont icon-guanbi1 loginTitleIcon" v-if="isElectron == 1" @click="goClose"></span>
                
            </div>
            <div class="loginTag">
                <div class="loginTagItem">账号登录</div>
            </div>
            <div class="loginMainContent">
                <UserName></UserName>
            </div>
            <!-- 忘记密码 -->
            <div class="wxBoxFoot">
                <el-link type="primary" href='#/register'>注册新用户</el-link>
                <el-link type="danger" @click="resultPassword">忘记密码</el-link>
                <!-- <el-button type="text"  >忘记密码</el-button> -->
            </div>
        </div>
    </div>
</template>

<script>
import UserName from './components/UserName.vue'
import { ElMessageBox } from 'element-plus'
import { resultUserInfoPassword } from '../../api/item'
export default {
    components:{
        UserName
    },
    data(){
        return {
            isElectron: process.env.VUE_APP_Electron
        }
    },
    created(){

    },
    methods: {
        goClose(){
            // 切换
            this.$electron.ipcRenderer.send('window-quit') 
        },
        resultPassword(){
            ElMessageBox.prompt('请输入需要重置密码的邮箱', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:
                /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
                inputErrorMessage: '请输入正确的邮箱',
            })
                .then(({ value }) => {
                    resultUserInfoPassword({
                        email: value
                    })
                    .then(res => {
                        if(res.status == 200){
                            this.$toast.success(res.message)
                        }else{
                            this.$toast.fail(res.message)
                        }
                    })
                })
                .catch(() => {
                    
                })
        }
    }
}
</script>

<style  scoped>
.loginBox{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/image/loginBg.png') no-repeat;
    background-size: 100% 100%;
    box-sizing: border-box;
}

.loginMain{
    width: 450px;
    height: 430px;
    background: #fff;
    position: relative;
}
.loginTitle{
    width: 100%;
    height: 30px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-size: 12px;
    color: #636B82;
    position: relative;
}
.loginTitle span:nth-child(1){
    width: calc(100% - 60px);
    height: 30px;
    display: inline-block;
    line-height: 30px;
    -webkit-app-region: drag;
}
.loginTitleIcon{
    width: 26px;
    height: 30px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    z-index: 1;
    font-size: 12px;
}

.loginTitleSet{
    width: 30px;
    height: 30px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
}

.loginTag{
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #E9ECEF;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.loginTagItem{
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
}
.loginMainContent{
    width: 100%;
    height: calc(100% - 70px);
}
.wxBoxFoot{
    width: 100%;
    height: 35px;
    position: absolute;
    left: 0;
    bottom: 10px;
    padding: 0px 20px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
}
</style>
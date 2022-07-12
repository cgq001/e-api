<template>
<!-- 登陆 -->
    <div class="loginBox">
        <div class="loginMain">
            <div class="loginTitle">
                <span>E-API</span>
                <span class="el-icon-close loginTitleIcon"></span>
                <span class="iconfont icon-guanbi1 loginTitleIcon"  v-if="isElectron == 1"  @click="goClose"></span>
                
            </div>
            <div class="loginTag">
                注册新用户
            </div>
            <div class="loginMainContent">
                <RegisterUser></RegisterUser>
            </div>
            <!-- 忘记密码 -->
            <div class="wxBoxFoot">
                <el-link type="primary"  href='#/login'>已有账号,去登陆</el-link>
                
            </div>
        </div>
        
    </div>
</template>

<script>
import RegisterUser from './components/RegisterUser.vue'

export default {
    components:{
        RegisterUser
    },
    data(){
        return {
            isElectron: process.env.VUE_APP_Electron
        }
    },
    methods:{
        goClose(){
            // 切换
            this.$electron.ipcRenderer.send('window-quit') 
        },
    }
}
</script>

<style lang="less" scoped>
.loginBox{
    width: 100%;
    height: 100%;
    background: url('../../assets/image/loginBg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
    // background: #E1E2E3;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-size: 12px;
    color: #636B82;
}
.loginTitle span:nth-child(1){
    width: calc(100% - 30px);
    height: 30px;
    display: inline-block;
    line-height: 30px;
    -webkit-app-region: drag;
    // background: chartreuse;
}
.loginTitleIcon{
    width: 30px;
    height: 30px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
}

.loginTag{
    width: 100%;
    height: 40px;
    // background: bisque;
    border-bottom: 1px solid #E9ECEF;
    box-sizing: border-box;
    // display: flex;
    // justify-content: space-between;
    text-align: center;
    line-height: 40px;
}
.loginTagItem{
    width: 50%;
    height: 100%;
    // border-right: 1px solid #E9ECEF;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
}
.loginMainContent{
    width: 100%;
    height: calc(100% - 70px);
    // height: 150px;
    // background: cornflowerblue;
}
.wxBoxFoot{
    width: 100%;
    height: 35px;
    // background: bisque;
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
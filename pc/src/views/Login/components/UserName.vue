<template>
    <div class="wxBox">
        <!-- 表单 -->
        <div class="wxFrom">
            <el-form :model="loginFrom" :rules="rulesFrom" ref="ruleForm" class="demo-ruleForm">
                <el-form-item  prop="email">
                    <el-input spellcheck="false" v-model="loginFrom.email" placeholder="请输入邮箱地址"></el-input>
                </el-form-item>
                <el-form-item  prop="password" style="margin-bottom: 50px;">
                    <el-input spellcheck="false" style="width: 100%" type="password" v-model="loginFrom.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" :loading="isLoading" @click="submitUser('ruleForm')">立即登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
import { userLand } from '../../../api/item'
import { setToken } from '@/utils/auth';

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
        };
        return {
            loginFrom:{
                email: null,
                password: null
            },
            rulesFrom: {
                email: [
                    {  type: 'email' , required: true, message: '请输入邮箱地址', trigger: 'blur' }
                ],
                password: [
                    {   required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ]
            },
            isLoading: false
        }
    },
    methods:{
        submitUser(ruleForm){
            this.$refs[ruleForm].validate(async (valid) => {
                if (valid) {
                    this.isLoading = true
                    let result = await userLand({
                        ...this.loginFrom
                    })
                    this.isLoading = false

                    if(result.status == 200){
                        this.$store.commit('ApiList/clearStore')
                        window.localStorage.removeItem('projectValue')
                        window.localStorage.removeItem('teamValue')
                        window.localStorage.removeItem('teamActiveIndex')
                        window.localStorage.removeItem('asideIndex')

                        this.$toast.success(result.message)
                        this.$store.commit('userApi/setTokenState',result.data.token)
                        this.$store.commit('ApiList/setTeamInfo',{})
                        setToken(result.data.token)
                        this.$router.replace('/')
                    }else{
                        this.$toast.fail(result.message)
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.wxBox{
    width: 100%;
    height: 100%;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    position: relative;
}
.wxFrom{
    width: 100%;
    height: auto;
}


</style>

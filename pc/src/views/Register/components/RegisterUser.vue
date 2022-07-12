<template>
    <div class="wxBox">
        <!-- 表单 -->
        <div class="wxFrom">
            <el-form :model="loginFrom" :rules="rulesFrom" ref="ruleForm" class="demo-ruleForm">
                <el-form-item  prop="email">
                    <el-input spellcheck="false" v-model.trim="loginFrom.email" :disabled='codeLand' placeholder="请输入邮箱(推荐QQ邮箱，其他可能不成功)地址"></el-input>
                </el-form-item>
                 <el-form-item  prop="code" style="display: flex; justify-content: flex-start;">
                    <el-col :span="11">
                        <el-input spellcheck="false" style="width: 100%;" v-model.trim.number="loginFrom.code" placeholder="请输入验证码"></el-input>
                    </el-col>
                     <el-col :span="2"></el-col>
                    <el-col :span="11">
                        <el-button type="primary" style="width: 100%;" @click="sendCode" :loading='codeLand'>{{codeText}}</el-button>
                    </el-col>
                </el-form-item>
                <el-form-item  prop="password" style="margin-bottom: 50px;">
                    <el-input spellcheck="false" style="width: 100%" v-model.trim="loginFrom.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%" :disabled="this.codeId.length == 0" :loading='isRegister' @click="submitForm('ruleForm')">立即注册</el-button>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
import { registerUserSendEmail, registerUser } from '@/api/item.js'

export default {
    data(){
        var passwordRult = (rule, value, callback) => {
                if (!value) {
                return callback(new Error('密码不能为空'));
                }
                // 
                let pR = /^[a-zA-Z0-9_-]{6,18}$/
                if (!pR.test(value)) {
                    callback(new Error('密码须为6~18位的字数、数字或者下划线'));
                } else {
                    callback();
                }
             
            }
        return {
            
            loginFrom:{
                email: null,
                password: null,
                code: null
            },
            rulesFrom: {
                email: [
                    {  type: 'email' , required: true, message: '请输入邮箱地址', trigger: 'blur' }
                ],
                code: [
                    {   required: true, message: '请输入验证码', trigger: 'blur' }
                ],
                password: [
                    {   required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: passwordRult, trigger: 'blur' }
                ]
            },
            codeText: '发送验证码',
            codeTime: null,
            codeLand: false,
            isRegister: false,
            codeId: ""
        }
    },
    methods:{
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.isRegister = true
                    registerUser({
                        ...this.loginFrom,
                        uuid: this.codeId
                    })
                    .then(res => {
                        if(res.status == 200){
                            // this.$notify({
                            //     title: '注册成功',
                            //     message: res.message,
                            //     type: 'success'
                            // });
                            this.$toast.success(res.message);
                            this.loginFrom = {
                                email: null,
                                password: null,
                                code: null
                            }
                            clearInterval(this.codeTime)
                            this.codeText = '获取验证码'
                            this.$router.push('/login')
                        }else{
                            this.$toast.fail(res.message);
                            clearInterval(this.codeTime)
                            this.codeText = '获取验证码'
                            this.codeLand = false
                            this.isRegister = false
                        }

                        this.isRegister = false
                    },err => {
                        clearInterval(this.codeTime)
                        this.codeText = '获取验证码'
                        this.isRegister = false
                    })
                    

                } else {
                    console.log('error submit!!');
                    return false;
                }
                })
        },
        // 发送验证码
        sendCode(){
            let emailRL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
            if(!this.loginFrom.email || !emailRL.test(this.loginFrom.email)){
                // this.$notify.error({
                //     title: '邮箱地址错误',
                //     message: '请输入正确的邮箱地址'
                //     });
                this.$toast.fail('邮箱地址错误');
                return false
            }

            this.codeLand = true
            registerUserSendEmail({
                email: this.loginFrom.email
            })
            .then(res => {
                if(res.status == 200){
                    this.$toast.success('发送成功');

                    let This = this
                    let num = 120
                    clearInterval(this.codeTime)
                    this.codeTime = setInterval(()=>{
                        if(num > 0){
                            num = num - 1
                            This.codeText = num + 'S后失效'
                        }else{
                            This.codeText = '重新获取验证码'
                            clearInterval(This.codeTime)
                            This.codeLand = false
                        }
                    },1000)
                    this.codeId = res.data.uuid

                }else{
                    this.$toast.fail(res.message);
                    this.codeLand = false
                    clearInterval(this.codeTime)
                    this.codeText = '获取验证码'
                    this.isRegister = false
                }
            },err => {
                this.codeLand = false
                clearInterval(this.codeTime)
                this.codeText = '获取验证码'
                this.isRegister = fal
            })
            
        }
    },
    destroyed(){
        clearInterval(this.codeTime)
        this.codeText = '获取验证码'
    }
}
</script>

<style  scoped>
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

.wxBox >>> .el-form-item__content {
    display: flex;
    justify-content: space-between;
}
</style>
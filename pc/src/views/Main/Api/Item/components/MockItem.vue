<template>
<!-- Mock数据 -->
    <div class="mockItem">
        <el-scrollbar max-height="100%">
        <div class="mockItemUrl">
            <div class="mockItemUrlLeft" ref="copyMockText"  @click="goCopy(linkUrl)">
                 {{linkUrl}}<span style="color: #2084FF">(一键复制)</span>
            </div>
            <div class="mockItemUrlRight">
                <!-- <el-button type="info"  size="small" 
                    ref="copyMock"
                    :data-clipboard-text="linkUrl"
                    @click="goCopy('copyMockText')"></el-button> -->
                <el-button type="success"  size="small" 
                    style="width: 100px"
                    :disabled="!resmock"
                    @click="saveMock">保存</el-button>
                <el-button type="primary" v-if="isUpdataMock"  size="small" style="width: 100px" @click="goMock">发送</el-button>
            </div>
        </div>
        <div class="mockItemTitle">
            Mock数据格式：
        </div>
        <Codemirror
            class="mockItemCode"
            v-model:value="resmock"
            :options="cmOptions"
            placeholder="请使用标准JSON语法"
            :height="250"
            @change="change"
            v-if="mockItemCodeShow"
        />
        <div class="mockItemTitle mockItemTitleData">
            返回结果：
        </div>
        <Codemirror
            class="mockItemCode"
            v-model:value="dataMock"
            :options="cmOptions"
            placeholder="请使用标准JSON语法"
            height="auto"
            v-if="mockItemCodeShow"
        />
        </el-scrollbar>
    </div>
</template>

<script>
// import * as monaco from 'monaco-editor'
// import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'
import { updataApiListMock, searchApiListMock , getMock } from '../../../../../api/item'
import { ElMessage , ElNotification  } from 'element-plus'

export default {
    data(){
        return {
            resmock: '',
            cmOptions: {
                mode: "text/javascript", // Language mode
                theme: "dracula", // Theme
                lineNumbers: false, // Show line number
                smartIndent: true, // Smart indent
                indentUnit: 2, // The smart indent unit is 2 spaces in length
                foldGutter: true, // Code folding
                styleActiveLine: true, // Display the style of the selected row
                cursorHeight: 1.2,
                readOnly: false
            },
            mockItemCodeShow: false,
            dataMock: '',
            linkUrl: '',
            clipboard: null,
            isUpdataMock: false
        }
    },
    mounted(){
        this.linkUrl = this.$store.state.userApi.urlAPi + '/mock/' + this.apiItem.uuid
        console.log('开启')
        this.mockItemCodeShow = true
        this.getMock()
        // this.clipboard = new Clipboard(this.$refs['copyMockText']);  
    },
    methods: {
        // 复制
        goCopy(item){
            let This = this 
            if(this.isElectron == 1){
                this.$electron.clipboard.writeText(this.linkUrl)
                This.$message.success('复制成功')  
            }else{
                const input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', this.linkUrl);
                input.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    This.$message.success('复制成功')
                }
                document.body.removeChild(input);

            }
                
    
        },
        goCopy2(item){
            let This = this 
            console.log('复制')
            let clipboard2 = new Clipboard(this.$refs[item]);  
                clipboard2.on('success', e => {
                     This.$message.success('复制成功')   
                    e.clearSelection();
                    clipboard2.destroy()
                })
                clipboard2.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制')
                   
                })
    
        },
        change(e){
            this.resmock = e
        },
        // 保存MOCK
        saveMock(){
            console.log(this.resmock)
            let body = this.resmock
            let bodyJson = null
                if(body){
                    try {
                        // bodyJson = eval('(' + body + ')')
                        bodyJson = JSON.parse(body)
                    }catch(error){
                        // this.$message.fail('JSON参数非合法的JSON格式')
                        // ElMessage.error('JSON参数非合法的JSON格式' + error)
                         ElNotification({
                                title: 'Body的JSON语法错误',
                                message: error + '',
                                type: 'error',
                            })
                        return 
                    }
                }
            let bodyString = JSON.stringify(bodyJson,null,4)
            updataApiListMock({
                uuid: this.apiItem.uuid,
                apiMock: bodyString
            })
            .then(res => {
                if(res.status == 200){
                    ElMessage({
                        message: res.message,
                        type: 'success',
                    })
                    this.getMock()
                }
            })
        },
        // 查询MOCK
        getMock(){
            searchApiListMock({
                uuid:  this.apiItem.uuid
            })
            .then(res => {
                if(res.status == 200){
                    this.resmock = res.data.apiMock ? res.data.apiMock : ''
                    if(res.data.apiMock){
                        this.isUpdataMock = true
                        this.goMock()
                    }
                }
            })
        },
        // 获取mock数据
        goMock(){
            getMock(this.apiItem.uuid)
            .then(res => {
                if(res.status == 200){
                    this.dataMock = typeof res.data == 'string' ? res.data : JSON.stringify(res.data, null, 4)
                }
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
        isElectron(){
            return process.env.VUE_APP_Electron
        }
    },
    onBeforeUnmount(){
       
    },
}
</script>

<style scoped>
.mockItem{
    width: 1000px;
    height: 100%;
    background: #fff;
}
.mockItemCode{
    width: 100%;
    height: auto;
    font-size : 16px;
}
.mockItemUrl{
    width: 100%;
    height: 55px;
    /* background: turquoise; */
    line-height: 54px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    /* border-bottom: 1px solid #E9ECEF; */
    /* margin-bottom: 30px; */
    color: #7C7C7D;
    /* background: chocolate; */
    border-bottom: 1px solid  #E9ECEF;
}
.mockItemUrlIcon{
    color: #20BDFB;
    cursor: pointer;
}
.mockItemTitle{
    width: 100%;
    height: 35px;
    /* background: turquoise; */
    line-height: 34px;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid  #E9ECEF;
    color: #7C7C7D;
    font-weight: bold;
    
}
.mockItemTitleData{
    border-top:  1px solid  #E9ECEF;
}

.mockItemUrlRight{
    width: 360px;
    height: 100%;
    /* background: yellowgreen; */
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
}
.mockItemUrlLeft{
    width: calc(100% - 360px);
    height: 100%;
    /* text-decoration: underline #999999; */
    color: #999999;
    cursor: pointer;
    /* user-select:none; */
}
</style>
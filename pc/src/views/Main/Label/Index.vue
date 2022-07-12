<template>
<!-- 便签 -->
    <div class="labelIndex">
        <el-scrollbar style="height:100%">
            <div class="labelIndexList" 
                >
                <div class="labelIndexItem"
                    :class="item.styleName"
                    v-for="(item) in tableList"
                    :key="item.uuid"
                    @click="editItem(item)">
                    <div class="labelIndexItemName">
                        {{item.title}}
                    </div>
                    <div class="labelIndexItemText">
                        {{item.content}}
                    </div>
                </div>
                <div class="labelIndexListEmpty" v-if="tableList.length == 0">
                    <el-empty  description="暂无数据" />
                </div>
            </div>
        </el-scrollbar>
        <!-- 便签弹出层 -->
        <el-dialog 
            v-model="labelShow" 
            class="labelBox"
            :title="formLabel.uuid ? '编辑便签' : '添加便签'"
            :width='900'>
            <el-form :model="formLabel" :rules="labelRules" ref="formLabel"  class="demo-ruleForm">
                <el-form-item  prop="title" class="labelName">
                    <el-input v-model="formLabel.title" placeholder="请输入便签名称" />
                </el-form-item>
                <el-form-item  prop="content" class="labelText">
                    <el-input
                        class="labelTextArea"
                        v-model="formLabel.content"
                        maxlength="1000"
                        placeholder="请输入便签内容"
                        show-word-limit
                        :autosize='false'
                        resize='none'
                        spellcheck="false"
                        type="textarea"
                    />
                </el-form-item>
            </el-form>
            <div class="labelTheme">
                <div class="labelIndexItemB1 labelThemeItem" 
                    :class="formLabel.styleName == 'labelIndexItemB1' && 'labelThemeItemAtive' " 
                    @click="selectStyle('labelIndexItemB1')">
                    <span></span>
                </div>
                <div class="labelIndexItemB2 labelThemeItem"
                     :class="formLabel.styleName == 'labelIndexItemB2' && 'labelThemeItemAtive' " 
                     @click="selectStyle('labelIndexItemB2')">
                    <span></span>
                </div>
                <div class="labelIndexItemB3 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB3' && 'labelThemeItemAtive' " 
                     @click="selectStyle('labelIndexItemB3')">
                    <span></span>
                </div>
                <div class="labelIndexItemB4 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB4' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB4')">
                    <span></span>
                </div>
                <div class="labelIndexItemB5 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB5' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB5')">
                    <span></span>
                </div>
                <div class="labelIndexItemB6 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB6' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB6')">
                    <span></span>
                </div>
                <div class="labelIndexItemB7 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB7' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB7')">
                    <span></span>
                </div>
                <div class="labelIndexItemB8 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB8' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB8')">
                    <span></span>
                </div>
                <div class="labelIndexItemB9 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB9' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB9')">
                    <span></span>
                </div>
                <div class="labelIndexItemB10 labelThemeItem" 
                     :class="formLabel.styleName == 'labelIndexItemB10' && 'labelThemeItemAtive' "
                     @click="selectStyle('labelIndexItemB10')">
                    <span></span>
                </div>
            </div>
            <div class="labelFoot">
                <el-button type="danger"  size='mini' 
                    style="width: 100px; margin-right:15px;" 
                    @click="removeItem">删除</el-button>
                <el-button type="primary" size='mini' 
                    style="width: 100px;" @click="submitForm('formLabel')"
                    :loading="loadingForm"
                    >保存</el-button>
                
            </div>
        </el-dialog>
        <div class="labelAdd" alt='添加便签' title="添加便签" @click="addLabelButton">
            <span class="iconfont icon-jiahao labelAddIcon"></span>
        </div>
    </div>
</template>

<script>
import { addTableItem,
        searchTable,
        updataTableItem,
        removeTableItem } from '../../../api/item'
import { ElMessageBox } from 'element-plus'
export default {
    data(){
        return {
            labelShow: false,
            tableName: '',
            labelText: '',
            formLabel: {
                title: '',
                content: '',
                styleName: 'labelIndexItemB1'
            },
            labelRules: {
                title: [{ required: true, message: '请输入便签名称', trigger: 'blur' }],
                content: [{ required: true, message: '请输入便签内容', trigger: 'blur' }],
            },
            loadingForm: false,
            tableList: []
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
            this.getTable()
        }
    },
    methods: {
        // 编辑便签
        editItem(item){
            this.formLabel = {
                title: item.title,
                content: item.content,
                styleName: item.styleName,
                uuid: item.uuid
            }
            this.labelShow = true
        },
        // 添加标签
        addLabelButton(){
            this.formLabel = {
                title: '',
                content: '',
                styleName: 'labelIndexItemB1'
            }
            this.labelShow = true
        },
        // 选择样式
        selectStyle(item){
            this.formLabel.styleName = item
        },
        // 提交标签
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loadingForm = true
                    if(this.formLabel.uuid){
                        updataTableItem({
                            uuid: this.formLabel.uuid,
                            title: this.formLabel.title,
                            content: this.formLabel.content,
                            styleName: this.formLabel.styleName,
                        })
                        .then(res => {
                            this.loadingForm = false
                            if(res.status == 200){
                                this.$toast.success('修改成功')
                                this.labelShow = false
                                this.getTable()
                            }
                            
                        })
                        .finally(()=>{
                            this.loadingForm = false
                        })
                    }else{
                        addTableItem({
                            ...this.formLabel,
                            teamuuid: window.localStorage.getItem('teamValue') || ''
                        })
                        .then(res => {
                            this.loadingForm = false
                            if(res.status == 200){
                                this.$toast.success('添加成功')
                                this.labelShow = false
                                this.getTable()
                            }
                            
                        })
                        .finally(()=>{
                            this.loadingForm = false
                        })
                    }
                    
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 查询所有便签
        getTable(){
            searchTable({
                teamuuid: window.localStorage.getItem('teamValue') || ''
            })
            .then((res => {
                if(res.status == 200){
                    this.tableList = res.data
                }
            }))
        },
        // 删除便签
        removeItem(){
            ElMessageBox.confirm(
                '确定要删除该便签嘛?',
                '警告',
                {
                confirmButtonText: '当然了',
                cancelButtonText: '算了',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
                }
            )
                .then(() => {
                    removeTableItem({
                        uuid: this.formLabel.uuid
                    })
                    .then(res => {
                    
                        if(res.status == 200){
                            this.$toast.success('删除成功')
                            this.labelShow = false
                            this.getTable()
                        }
                        
                    })
            .finally(()=>{
            
            })
                })
                .catch(() => {
                   
                })
            
        }
    }
}
</script>

<style scoped>
.labelIndex{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
    
}
.labelIndexList{
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    box-sizing: border-box;
}
.labelIndex::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.labelIndexItem{
    width: 350px;
    height: 180px;
    border-radius: 5px;
    padding: 15px 0;
    box-sizing: border-box;
    line-height: 30px;
    margin: 20px;
    flex-shrink: 0;
}
.labelIndexItemName{
    width: 100%;
    height: 30px;
    font-weight: bold;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #fff;
    padding: 0 15px ;
    box-sizing: border-box;
}
.labelIndexItemText{
    width: 100%;
    height: calc(100% - 30px);
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    padding: 0 15px ;
    box-sizing: border-box;
}
.labelIndexItemB1{
    background: rgba(19,68,86, 0.9);
    box-shadow: 0 0 3px 1px #98AAB1;
    color: #fff;
}

.labelIndexItemB2{
    background: rgba(253,71,57, 0.9);
    box-shadow: 0 0 3px 1px #F8AFAA;
    color: #fff;
}
.labelIndexItemB3{
    background: rgba(219,30,251, 0.9);
    box-shadow: 0 0 3px 1px #F4C0FD;
    color: #fff;
}
.labelIndexItemB4{
    background: rgba(224,57,151, 0.9);
    box-shadow: 0 0 3px 1px #FDD0EA;
    color: #fff;
}
.labelIndexItemB5{
    background: rgba(0,129,255, 0.9);
    box-shadow: 0 0 3px 1px #C6E1FC;
    color: #fff;
}
.labelIndexItemB6{
    background-image: linear-gradient(45deg, #F33B40, #ED0389);
    box-shadow: 0 0 3px 1px #FCC1E3;
    color: #fff;
}
.labelIndexItemB7{
    background-image: linear-gradient(45deg, #FE8E03, #ED2022);
    box-shadow: 0 0 3px 1px #FECDCB;
    color: #fff;
}
.labelIndexItemB8{
    background-image: linear-gradient(45deg, #3EB649, #0285FA);
    box-shadow: 0 0 3px 1px #D1E8FD;
    color: #fff;
}
.labelIndexItemB9{
    background-image: linear-gradient(45deg, #8D00FF, #6000FF);
    box-shadow: 0 0 3px 1px #E2D1FF;
    color: #fff;
}
.labelIndexItemB10{
    background-image: linear-gradient(45deg, #E8028D, #ED2022);
    box-shadow: 0 0 3px 1px #E6D5FD;
    color: #fff;
}
.labelName{
    width: 100%;
    height: 45px;
    margin-bottom: 25px;
}
.labelText{
    width: 100%;
    height: 300px;
    margin-bottom: 25px;
}
.labelTextArea{
    width: 100%;
    height: 100%;
    
}
.labelTextArea >>> .el-textarea__inner{
    width: 100%;
    height: 100%;
}
.labelIndex >>> .el-dialog__body{
    padding: 0 10px 10px 10px !important;
}
.labelIndex >>> .el-dialog__header{
    padding-top: 10px !important;
}

.labelIndex >>> .el-input__inner{
    border-color: transparent;
    border-radius: 0;
    border-color: #DCDFE6;
}
.labelIndex >>> .el-input__inner:hover{
    border-color: transparent;
    border-radius: 0;
    border-color: #DCDFE6;
}
.labelIndex >>> .el-textarea__inner{
    border-color: transparent;
    border-radius: 0;
    border-color: #DCDFE6;
}
.labelIndex >>> .el-textarea__inner:hover{
    border-color: transparent;
    border-radius: 0;
    border-color: #DCDFE6;
}
.labelIndex >>> .el-dialog__headerbtn{
    top: 10px;
}
.labelTheme{
    width: 100%;
    height: 35px;
    /* background: chocolate; */
    display: flex;
    margin-bottom: 15px;
}
.labelThemeItem{
    width: 25px;
    height: 25px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 0 0 #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
}
.labelThemeItemAtive span{
    width: 10px;
    height: 10px;
    background: #fff;
    display: inline-block;
    border-radius: 50%;
}
.labelFoot{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.labelAdd{
    width: 55px;
    height: 55px;
    background: #3570FB;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    line-height: 55px;
    position: fixed;
    right: 10px;
    bottom: 10px;
    cursor: pointer;
}
.labelAddIcon{
    font-size: 30px;
}
.labelIndexListEmpty{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<template>
<!-- 说明文档 -->
    <div class="word">
        <div class="wordHeader">
            <div class="wordHeaderLeft">
                <span>接口说明文档</span>
            </div>
            <div class="wordHeaderRight">
                <!-- <span 
                    class="iconfont icon-combinedshapecopy2 wordHeaderLeftIcon"  
                    alt='编辑'></span>
                <span 
                    class="iconfont icon-baocun-tianchong wordHeaderLeftIcon"  
                    alt='保存'></span> -->
                <!-- <span class="wordHeaderRightEdit">编辑</span>
                <span class="wordHeaderRightSave"
                    @click="saveWork">保1存</span> -->
                <el-button type="danger" size='mini' v-if="!isShow" @click="goEdit">编辑</el-button>
                <el-button type="primary" size='mini' v-else @click="saveWork">保存</el-button>
                <span 
                    class="iconfont icon-guanbi1 wordHeaderLeftIcon" 
                    alt='关闭'
                    @click="closeDrawer"></span>
            </div>
        </div>
        <div class="wordEdit" v-if="isShow" spellcheck="false" ref="wordEdit"></div>
        <div class="wordText" v-else>
            <el-scrollbar max-height="100%">
                <div v-html="htmlText"></div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import E from 'wangeditor'
import hljs from 'highlight.js'
// import '@wangeditor/editor/dist/css/style.css'
import { updataApiListWord , searchApiListWord} from '../../../../../api/item'

export default {
    data(){
        return {
            editor: null,
            htmlText: '',
            isShow: false
        }
    },
    mounted(){
        // this.$nextTick(()=>{
            
        // })
         this.getWork()
        // console.log()
    },
    methods:{
        goEdit(){
            this.isShow = true
            this.$nextTick(()=>{
                this.getEditor()
            })
        },
        getEditor(){
            this.editor = new E(this.$refs.wordEdit)
            this.editor.config.placeholder = '请输入文档内容'
            this.editor.config.menus = [
                'head',
                'bold',
                'fontSize',
                // 'fontName',
                'italic',
                'underline',
                'strikeThrough',
                'indent',
                'lineHeight',
                'foreColor',
                'backColor',
                'link',
                'list',
                'todo',
                'justify',
                'quote',
                'emoticon',
                'image',
                // 'video',
                'table',
                'code',
                'splitLine',
                'undo',
                'redo',
            ]

            this.editor.config.showFullScreen = false
            this.editor.highlight = hljs
            this.editor.config.height = this.$refs.wordEdit.offsetHeight - 40 // this.$refs.wordEdit.offsetHeight

            this.editor.create()

           

            if(this.htmlText){
                this.editor.txt.html(this.htmlText)
            }
            
        },
        closeDrawer(){
            this.$emit('closeDrawer')
        },
        saveWork(){
            let text = this.editor.txt.html()
            if(!text) return 
            updataApiListWord({
                uuid: this.apiItem.uuid,
                apiWord: text
            })
            .then(res => {
                if(res.status == 200){
                    this.getWork()
                    this.isShow = false
                }
            })
        },
        getWork(){
            searchApiListWord({
                uuid: this.apiItem.uuid,
            })
            .then(res => {
                if(res.status == 200){
                    this.htmlText = res.data.apiWord
                }else{

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
            
        }
    },
}
</script>

<style scoped>
.word{
    width: 1200px;
    height: 100vh;
}
.wordText{
    width: 100%;
    height: calc(100% - 55px);
    padding: 0px 25px;
    box-sizing: border-box;
}
.wordText table,td{
    border: 1px solid #DCDFE6;
}
.wordEdit{
    width: 100%;
    height: calc(100% - 55px);
}
.wordEdit >>> .w-e-text-container{
    border: none !important;
    /* background: oldlace; */
}
.wordEdit >>> .w-e-toolbar{
    border: none !important;
    border-bottom: 1px solid #DCDFE6!important;
}
.wordHeader{
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #DCDFE6!important;
    /* background: orangered; */
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.wordHeaderLeft{
    width: 200px;
    height: 100%;
    line-height: 44px;
    color: #666;
}
.wordHeaderLeftIcon{
    margin-left: 5px;
    color: #666 !important;
    margin-left: 20px;
    cursor: pointer;
}
.wordHeaderLeftIcon::before{
    color: #666 !important;
}
.wordHeaderRight{
    width: calc(100% - 200px);
    height: 100%;
    line-height: 44px;
    color: #333333;
    text-align: right;
    
}
.wordHeaderRightEdit{
    color: red;
    text-decoration: underline;
    margin-right: 10px;
    cursor: pointer;
}
.wordHeaderRightSave{
    color: #1384F9;
    text-decoration: underline;
    margin-right: 10px;
    cursor: pointer;
}
</style>
<template>
    <div class="editIndex">
        <!-- 文档标题 -->
        <div class="editIndexTitle">
            <div class="editIndexTitleName">
                <input type="text" placeholder="请输入文档标题" class="editIndexTitleNameInput" />
            </div>
            <div class="editIndexTitleCan">
                <el-button type="primary" size='mini'>保存文档</el-button>
            </div>
        </div>
        <!-- 文档正文 -->
        <div class="editIndexContent" ref="wordEditText">

        </div>
        <!-- 文档附件 -->
        <div class="editIndexFill">

        </div>
    </div>
</template>

<script>
import E from 'wangeditor'
import hljs from 'highlight.js'

export default {
    data(){
        return {
            editor: null
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.getEditor()
        })

        console.log()
    },
    methods: {
        getEditor(){
            this.editor = new E(this.$refs.wordEditText)
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
                'video',
                'table',
                'code',
                'splitLine',
                'undo',
                'redo',
            ]

            this.editor.config.showFullScreen = false
            this.editor.highlight = hljs
            this.editor.config.height = this.$refs.wordEditText.offsetHeight - 40 // this.$refs.wordEditText.offsetHeight

            this.editor.create()
        },
    }
}
</script>

<style scoped>
.editIndex{
    width: 100%;
    height: 100%;
    /* background: cornflowerblue; */
}
.editIndexTitle{
    width: 100%;
    height: 45px;
    /* background: red; */
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #DCDFE6;
}
.editIndexTitleName{
    width: calc(100% - 210px);
    height: 100%;
}
.editIndexTitleNameInput{
    width: 100%;
    height: 95%;
    outline: none;
    border: none;
}
.editIndexTitleCan{
    width: 200px;
    height: 100%;
    /* background: yellowgreen; */
    text-align: right;
    line-height: 45px;
}
.editIndexContent{
    width: 100%;
    height: calc(100% - 90px);
    /* background: chocolate; */
}
.editIndexFill{
    width: 100%;
    height: 45px;
    padding: 0 20px;
    box-sizing: border-box;
    border-top: 1px solid #DCDFE6;
}

.editIndexContent >>> .w-e-text-container{
    border: none !important;
    /* background: oldlace; */
}
.editIndexContent >>> .w-e-toolbar{
    border: none !important;
    border-bottom: 1px solid #DCDFE6!important;
}
</style>
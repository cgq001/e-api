<template>
<!--  接口相应数据 -->
    <div class="ResponseDataItem">
        <div class="ResponseDataItemHeader" v-if="apiItem.apiQesponseData">
            <div class="ResponseDataItemHeaderLeft">
                <span class="ResponseDataItemHeaderLeftName">状态码：</span>
                <span class="ResponseDataItemHeaderLeftText">{{apiItem.apiQesponseStatus}}</span>
                <span class="ResponseDataItemHeaderLeftName">请求时间：</span>
                <span class="ResponseDataItemHeaderLeftText">{{apiItem.apiQesponseUpdata}}</span>
                <span class="ResponseDataItemHeaderLeftName">耗时：</span>
                <span class="ResponseDataItemHeaderLeftText">{{apiItem.apiQesponseTime}}ms</span>
            </div>
            <div class="ResponseDataItemHeaderRight" v-if="isAuthInfo && isAuthInfo.auth && isAuthInfo.auth.auth == 2">
                <div class="ResponseDataItemHeaderRightSuccess"
                    @click="saveSuccess">
                    保存为成功示例
                </div>
                <div class="ResponseDataItemHeaderRightFill"
                    @click="saveFill">
                    保存为失败示例
                </div>
            </div>
        </div>
        <Codemirror
            class="ResponseDataItemCode"
            :value="resBody"
            :options="cmOptions"
            placeholder="test placeholder"
            height="auto"
            @change="change"
        />
    </div>
</template>

<script>

export default {
    data(){
        return {
            resBody: '',
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
            }
        }
    },
    mounted(){
   
    },
    methods: {
        change(e){
            this.$store.commit('ApiList/setAPiName',{name: "apiQesponseData", value: e })
        },
        saveSuccess(){
            this.$store.commit('ApiList/setAPiName',{name: "apiQesponseSuccess", value: this.resBody })
        },
        saveFill(){
            this.$store.commit('ApiList/setAPiName',{name: "apiQesponseFill", value: this.resBody })
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
        isAuthInfo(){
            return this.$store.state.ApiList.isAuthInfo
        }
    },
    watch: {
        'apiItem.apiQesponseData': {
            handler(news){
                if(news != this.resBody){
                    this.resBody = news
                }    
            },
            immediate: true,
            deep: true
        }
    },
    onBeforeUnmount(){
       
    },
}
</script>

<style scoped>
.ResponseDataItem{
    width: 100%;
    height: 100%;
    background: #fff;
}
.ResponseDataItemCode{
    width: 100%;
    height: calc(100% - 50px);
    font-size : 12px;
}
.ResponseDataItemHeader{
    width: 100%;
    height: 50px;
    /* background: #F7F7F7; */
    border-bottom: 1px solid #E9ECEF;
    box-sizing: border-box;
    padding-left: 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.ResponseDataItemHeaderLeft{
    width: 50%;
    height: 100%;
    line-height: 50px;
    user-select: none;
}
.ResponseDataItemHeaderLeftName{
    color: #979696;
    margin-right: 5px;
}
.ResponseDataItemHeaderLeftText{
    color: #1D8AFE;
    margin-right: 10px;
    font-weight: bold;
    font-size: 14px;
}
.ResponseDataItemCode >>> .CodeMirror-gutters{
    background: transparent;
}
.ResponseDataItemHeaderRight{
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    box-sizing: border-box;
}
.ResponseDataItemHeaderRightSuccess{
    width: 150px;
    height: 30px;
    background: #409EFF;
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
}
.ResponseDataItemHeaderRightFill{
    width: 150px;
    height: 30px;
    background: #F56C6C;
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 3px;
    margin-left: 10px;
    cursor: pointer;
    user-select: none;
}
</style>
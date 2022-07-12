<template>
<!-- 成功示例 -->
    <div class="ResponseFill">
        <Codemirror
            class="ResponseFillCode"
            :value="resBody"
            :options="cmOptions"
            placeholder="test placeholder"
            :height="450"
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
                readOnly: true
            }
        }
    },
    mounted(){
   
    },
    methods: {
        change(e){
            this.$store.commit('ApiList/setAPiName',{name: "apiQesponseFill", value: e })
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
    watch: {
        'apiItem.apiQesponseFill': {
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
.ResponseFill{
    width: 100%;
    height: 100%;
    background: #fff;
}
.ResponseFillCode{
    width: 100%;
    height: 100%;
    font-size : 12px;
}
.ResponseFillCode >>> .CodeMirror-gutters{
    background: transparent;
}
</style>
<template>
<!-- Body 提交参数 v-model:value="resBody" apiItem.apiQequestBody-->
    <div class="bodyItem">
        <Codemirror
            class="bodyItemCode"
            :value="resBody"
            :options="cmOptions"
            placeholder="请使用标准的JSON语法"
            :height="450"
            @change="change"
        />
    </div>
</template>

<script>

export default {
    data(){
        return {
            jsonEditor: '' ,
            resBody: '' ,
            cmOptions: {
                mode: "text/javascript", // Language mode
                theme: "default", // Theme
                lineNumbers: true, // Show line number
                smartIndent: true, // Smart indent
                indentUnit: 0, // The smart indent unit is 2 spaces in length
                foldGutter: true, // Code folding
                styleActiveLine: true, // Display the style of the selected row
                tabSize: 4,
                autofocus: true,
                showCursorWhenSelecting: true
            }
        }
    },
    mounted(){
       
        
    },
    methods: {
        change(e){
            // console.log(e)
            this.$store.commit('ApiList/setAPiName',{name: "apiQequestBody", value: e })
        },
    },
    onBeforeUnmount(){
       
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
    components:{
 
    },
    watch: {
        'apiItem.apiQequestBody': {
            handler(news){
                if(news != this.resBody){
                    this.resBody = news
                }    
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style scoped>
.bodyItem{
    width: 100%;
    height: 100%;
    background: #fff;
}
.bodyItemCode{
    width: 100%;
    height: 100%;
    font-size : 16px;
}
</style>
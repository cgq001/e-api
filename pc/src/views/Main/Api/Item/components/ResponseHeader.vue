<template>
<!-- 请求头 -->
    <div class="ResponseHeader">
        <div class="ResponseHeaderList" v-for="(item,key) in resBody" :key="item">
            <!-- key -->
            <div class="ResponseHeaderListKey"  @click="goCopy(key)">
                {{key}}
            </div>
            <!-- value -->
            <div class="ResponseHeaderListValue"  @click="goCopy(item)">   
               <span>
                   {{item}}
               </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            resBody: {},
            isElectron: process.env.VUE_APP_Electron
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
    methods: {
        goCopy(item){
            let This = this 
            if(this.isElectron == 1){
                 this.$electron.clipboard.writeText(item)
                 This.$toast.success('复制成功')
            }else{
                const input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', item);
                input.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    This.$toast.success('复制成功')
                }
                document.body.removeChild(input);
            }
           
        }
    },
    watch: {
        'apiItem.apiQesponseReq': {
            handler(news){
                if(news != this.resBody){
                    this.resBody = news
                }    
            },
            immediate: true,
            deep: true
        }
    },
}
</script>

<style scoped>
.ResponseHeader{
    width: 100%;
    height: auto;
}
.ResponseHeaderList{
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #E9ECEF;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
}
.ResponseHeaderListKey{
    width: 500px;
    height: 100%;
    border-right: 1px solid #E9ECEF;
    box-sizing: border-box;
    line-height: 45px;
    padding: 0 20px;
    box-sizing: border-box;
    /* color: #5F6380; */
    font-weight: bold;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    cursor: pointer;
}
.ResponseHeaderList >>> .el-input__inner{
    background: #ffffff;
    border-color: transparent;
}
.ResponseHeaderList >>> .el-input__inner:hover{
    border-color: transparent;
    background: #ffffff;
}
.ResponseHeaderListValue{
    width: calc(100% - 500px);
    height: 100%;
    border-right: 1px solid #E9ECEF;
    box-sizing: border-box;
    line-height: 45px;
    padding: 0 20px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    cursor: pointer;
}
.ResponseHeaderListRequired{
    width: 120px;
    height: 100%;
    border-right: 1px solid #E9ECEF;
    box-sizing: border-box;
    line-height: 45px;
}

.ResponseHeaderList >>> .el-select .el-input.is-focus .el-input__inner{
    border-color: transparent;
}
.ResponseHeaderListType{
    width: 130px;
    height: 100%;
    border-right: 1px solid #E9ECEF;
    box-sizing: border-box;
    line-height: 45px;
}
.ResponseHeaderListRemarks{
    width: 300px;
    height: 100%;
    border-right: 1px solid #E9ECEF;
    box-sizing: border-box;
    line-height: 45px;
}
.ResponseHeaderListDelect{
    width: 80px;
    height: 100%;
    border-right: 1px solid #E9ECEF;
    box-sizing: border-box;
    line-height: 45px;
    display: flex;
    justify-content: center;
}
.ResponseHeaderListDelectIcon{
    font-size: 20px;
    color: #8E9095;
    cursor: pointer;
}
</style>
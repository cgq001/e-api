<template>
<!-- 接口列表 -->
    <div class="indexItem" 
        :class="apiItem.uuid && apiItem.uuid == itemData.uuid && 'indexItemActive'"
        :style="{paddingLeft: ((zIndex - 1) * 10) + 'px'}">
        <div class="indexItemIcon" @click="goItem(itemData)">
            <span class="iconfont "
                :class="goIcon(itemData.apiMethod)"></span>
        </div>
        <div class="indexItemName" @click="goItem(itemData)">
            {{itemData.apiName}}
        </div>
        <div class="indexItemIcon" style="text-align: right;" @click="confirmApi(itemData)">
                    <span class="iconfont icon-shanchu"></span>
        </div>
    </div>
</template>

<script>
import { ElMessageBox } from 'element-plus'
import { searchApiListOne, delectApiList } from '../../../../api/item'

export default {
    props: {
        itemData: {
            type: Object,
            default: {}
        },
        zIndex: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            isLoading: false
        }
    },
    methods: {
        goItem(item){

            let zIndex = null
            for(let i=0; i<this.apiList.length; i++){
                if(this.apiList[i].uuid == item.uuid){
                    zIndex = i
                }
            }

            if(zIndex){
                this.$store.commit('ApiList/setApiActiveIndex',zIndex)
                return 
            }
            if(this.isLoading) return
            this.isLoading = true
            searchApiListOne({
                uuid: item.uuid
            })
            .then(res => {
                this.isLoading = false
                if(res.status == 200){
                    let interfaceApi = res.data
                        interfaceApi.isSave = 0

                    this.$store.commit('ApiList/asideAddOptionItem',{...interfaceApi})
                }
            })
            .catch(()=>{
                this.isLoading = false
            })
        },
        confirmApi(item){
            ElMessageBox.confirm(
                    `确认要删除<span style="color: red;">(${item.apiName})</span>接口嘛？`,
                    '删除后可在管理后台查看',
                {
                    confirmButtonText: '确认删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true,
                    center:true,
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                }
            )
                .then(() => {
                    delectApiList({
                        deleteArray: [item.uuid]
                    })
                    .then(res => {
                        if(res.status == 200){
                            this.updataAside()
                            this.$store.dispatch('ApiList/removeApiItem',item.uuid)
                        }
                    })
                })
                .catch(() => {
                    
                }) 
        },
        goIcon(icon){
            switch(icon){
                case 'get':
                    return 'icon-16gl-G icon-get';
                break;
                case 'post':
                    
                    return 'icon-16gl-P icon-post';
                break;
                case 'put':
                    return 'icon-16gl-U icon-put';
                break;
                case 'delete':
                    return 'icon-16gl-D icon-delete';
                break;
            }
        }
    },
    inject: ['updataAside'],
    computed: {
        apiList(){
            return this.$store.state.ApiList.apiList
        },
        apiItem(){
            if(this.$store.getters['ApiList/apiName'] < this.$store.state.ApiList.apiList.length){
                return this.$store.state.ApiList.apiList[this.$store.getters['ApiList/apiName']]
            }else {
                return {}
            }
            
        },
    },
}
</script>

<style scoped>
.indexItem{
    width: 100%;
    height: 40px;
    /* background: #F3F3F3; */
    display: flex;
    /* padding: 0 5px 0 5px; */
    padding-right: 5px;
    box-sizing: border-box;
    cursor: pointer;
    border-left: 3px solid transparent;
    box-sizing: border-box;
}
.indexItem:hover{
    background: #F3F3F3;
}
.indexItem .indexItemIcon:nth-child(3){
    display: none;
}
.indexItem:hover .indexItemIcon:nth-child(3){
    display: block;
}
.indexItemActive{
    /* background: #F3F3F3; */
    color: #2084FF;
}
.indexItemActive .indexItemName{
    color: #2084FF;
    font-weight: bold;
    transform: translate(5px);
}
/* .indexItemActive .indexItemIcon:nth-child(1) span{
    color: #2084FF;
} */
.indexItemIcon{
    width: 25px;
    height: 40px;
    color: #88A0CD;
    line-height: 40px;
    font-size: 12px;
    
}
.indexItemName{
    width: calc(100% - 50px);
    height: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    line-height: 40px;
    font-size: 12px;
    color: #545B62;
    
    transition: all 0.5s;
}

.icon-get{
    color: #67C23A;
}

.icon-post{
    color: #FF00C6;
}

.icon-put{
    color: #409EFF;
}

.icon-delete{
    color: #FF002D;
}
</style>
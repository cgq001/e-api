<template>
    <div class="itemBox">
        <div class="itemBoxText" @click="tagStatr">
            <div class="itemBoxLeft">
                <!-- <van-checkbox :modelValue="itemData.stateActive == 1" :disabled="checked1"></van-checkbox> -->
                <span class="iconfont" 
                    :class="itemData.stateActive == 1 ? 'icon-xuanzhongyixuanzhong' : 'icon-weixuanzhong'"
                    :style="{color: itemData.stateActive == 1 ? '#C8C9CD' : '#2084FF'}"></span>
            </div>
            <div class="itemBoxRight" :class="itemData.stateActive == 1 && 'itemBoxRightActive' ">
                {{itemData.content}}
            </div>
        </div>
        <div class="itemBoxTime">
            <span v-if="itemData.stateActive == 1">完成时间：{{moment(itemData.saveTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-else>要求完成时间: {{moment(itemData.endTime).format('YYYY-MM-DD')}}</span>
            <span class="iconfont icon-shanchu" @click="removeItem"></span>
        </div>
    </div>
</template>

<script>
import { updateToadyNeed , removeNeedItem } from '../../../../api/item'

import moment from "moment"
export default {
    props:{
        itemData:{
            type: Object,
            default: {}
        }
    },
    data(){
        return {
            checked1: true,
            value: 5
        }
    },
    methods: {
        moment,
        tagStatr(){
            if(this.itemData.stateActive == 0){
                updateToadyNeed({
                    uuid: this.itemData.uuid
                })
                .then(res => {
                    if(res.status == 200){
                        this.$toast.success('更新成功')
                        this.$emit('resultNeed')
                    }
                })
            }
        },
        removeItem(){
            removeNeedItem({
                uuid: this.itemData.uuid
            })
            .then(res => {
                    if(res.status == 200){
                        this.$toast.success('删除成功')
                        this.$emit('resultNeed')
                    }
                })
        }
    },
    watch:{
        itemData:{
            handler(news){
                if(news){
                    this.checked1 = news.stateActive == 1 ? true : false
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped>
.itemBox{
    width: 100%;
    height: auto;
    padding: 10px 20px;
    box-sizing: border-box;
    border: 1px solid #DCDFE6;
    border-radius: 5px;
    margin-bottom: 15px;
    cursor: pointer;
}
.itemBoxText{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
}
.itemBoxLeft{
    width: 50px;
    height: 50px;
    /* background: cornflowerblue; */
    display: flex;
    justify-content: center;
    align-items: center;
}
.itemBoxLeft span{
    color: #C8C9CD;
}
.itemBoxLeft >>> .el-checkbox__inner{
    width: 30px;
    height: 30px;
}
.itemBoxLeft >>> .el-checkbox__inner::after{
    font-size: 15px;
    width: 15px;
    height: 15px;
    /* transform: rotateY(-90deg); */
}
.itemBoxRight{
    width: calc(100% - 50px);
    /* background: chocolate; */
    line-height: 20px;
    padding: 10px 0;
    box-sizing: border-box;
}
.itemBoxRightActive{
    text-decoration: line-through;
    color: #C8C9CD;
}
.itemBoxTime{
    width: 100%;
    height: 20px;
    text-align: right;
    color: #C8C9CD;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.itemBoxTime span:nth-child(2){
    display: none;
    margin-left: 10px;
}
.itemBox:hover .itemBoxTime span{
    display: block;
}
</style>
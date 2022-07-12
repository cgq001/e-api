<template>
    <div class="editIndex">
        <!-- 文档标题 -->
        <div class="editIndexTitle">
            <div class="editIndexTitleName">
                请输入文档标题
            </div>
            <div class="editIndexTitleCan">
                <span class="editIndexTitleCanSpan">张三</span>
                <span class="editIndexTitleCanSpan">2022-01-20 12:00:00</span>
                <span class="editIndexTitleCanSpan" style="color: #158FFE;">编辑</span>
                <span class="editIndexTitleCanSpan" style="color: red;">删除</span>
            </div>
        </div>
        <!-- 文档正文 -->
        <div class="editIndexContent">

        </div>
        <!-- 文档附件 -->
        <div class="editIndexFill">

        </div>
    </div>
</template>

<script>


export default {
    data(){
        return {
            
        }
    },
    mounted(){
       
    },
    methods: {
       
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
    width: calc(100% - 410px);
    height: 100%;
    line-height: 45px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    color: #666;
    font-size: 18px;
}
.editIndexTitleNameInput{
    width: 100%;
    height: 95%;
    outline: none;
    border: none;
}
.editIndexTitleCan{
    width: 400px;
    height: 100%;
    /* background: yellowgreen; */
    text-align: right;
    line-height: 45px;
    font-size: 12px;
}
.editIndexTitleCanSpan{
    margin-left: 10px;
    cursor: pointer;
    color: #909090;
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
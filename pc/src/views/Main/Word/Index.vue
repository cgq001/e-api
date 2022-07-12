<template>
<!-- 文档 -->
    <div class="wordIndex">
        <!-- 文件夹 -->
        <div class="wordIndexAside">
            <div class="wordIndexAsideTitle">
                <div class="wordIndexAsideTitleItem wordIndexAsideTitleItemActive">
                    公开的
                </div>
                <div class="wordIndexAsideTitleItem">
                    私有的
                </div>
            </div>
            <div class="wordIndexAsideMainNew">
                <span class="iconfont icon-jiahao wordIndexAsideMainNewIcon" title="新建文件夹"></span>
                <span>&nbsp;&nbsp;新建文件夹</span>
            </div>
            <div class="wordIndexAsideMain">
                <el-scrollbar style="height:100%">
                    <div class="wordIndexAsideMainItem" v-for="item in 100" :key="item">
                        <span class="iconfont icon-wenjian wordIndexAsideMainItemIcon"></span>
                        <span>工台面板{{item}}</span>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <!-- 文件 -->
        <div class="wordIndexAside">
            <div class="wordIndexAsideMainNew">
                <span class="iconfont icon-jiahao wordIndexAsideMainNewIcon" title="新建文档"></span>
                <span>&nbsp;&nbsp;新建文档</span>
            </div>
            <div class="wordIndexAsideMainWord">
                <el-scrollbar style="height:100%">
                    <div class="wordIndexAsideMainItemWord" v-for="item in 100" :key="item">
                        <span class="iconfont icon-wendang wordIndexAsideMainItemIcon" style="color: #F78A09;"></span>
                        <span>工台面板{{item}}</span>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <!-- 编辑或展示区域 -->
        <div class="wordIndexContent">
            <WordEdit></WordEdit>
            <!-- <WordText></WordText> -->
        </div>
    </div>
</template>

<script>
import WordEdit from './Edit.vue'
import WordText from './Text.vue'

export default {
    components: {
        WordEdit,
        WordText
    }
}
</script>

<style scoped>

.wordIndex{
    width: 100%;
    height: 100%;
    /* background: brown; */
    display: flex;
    justify-content: flex-start;
}
.wordIndexAside{
    width: 310px;
    height: 100%;
    /* padding: 5px 0 5px 5px; */
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
    /* background: #F5F5F5; */
}
.wordIndexAsideTitle{
    width: 100%;
    height: 45px;
    /* background: chartreuse; */
    text-align: center;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
}
.wordIndexAsideTitleItem{
    width: 50%;
    height: 100%;
    border-bottom: 1px solid #DCDFE6;
    position: relative;
    cursor: pointer;
}
.wordIndexAsideTitleItemActive{
    background: #398DEE;
    border-bottom-color: #398DEE;
    color: #ffffff;
    /* transform: skew(-45deg); */
}
.wordIndexAsideMain{
    width: 100%;
    height: calc(100% - 80px);
    /* background: chocolate; */
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;
}
.wordIndexAsideMain::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.wordIndexAsideMainItem{
    width: 100%;
    height: 35px;
    /* background: cyan; */
    color: #686868;
    line-height: 35px;
    padding: 0 15px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-bottom: 10px;
    cursor: pointer;
}
.wordIndexAsideMainNew{
    width: 100%;
    height: 35px;
    /* background: chocolate; */
    text-align: right;
    line-height: 35px;
    padding: 0 10px;
    box-sizing: border-box;
    color: #767779;
    cursor: pointer;
}
.wordIndexAsideMainNewIcon{
    color: #398DEE;
    cursor: pointer;
}
.wordIndexAsideMainItemIcon{
    color: #F6CE62;
    margin-right: 10px;
}
.wordIndexAsideMainWord >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}


.wordIndexAsideMainWord{
    width: 100%;
    height: calc(100% - 35px);
    /* background: chocolate; */
    overflow-x: hidden;
    /* overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none; */
}
.wordIndexAsideMainWord::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
.wordIndexAsideMainItemWord{
    width: 100%;
    height: 45px;
    /* background: cyan; */
    color: #686868;
    line-height: 45px;
    padding: 0 15px;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-bottom: 10px;
    cursor: pointer;
}
.wordIndexContent{
    width: calc(100% - 620px);
    height: 100%;
    /* background: chocolate; */
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;
}
.wordIndexContent::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
</style>
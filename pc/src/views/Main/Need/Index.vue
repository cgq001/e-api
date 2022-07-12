<template>
    <div class="needIndex">
        <div class="needIndexAside">
            <div class="needIndexAsideItem"
                :class="asideIndex == 0 && 'needIndexAsideItemActive'"
                @click="asideIndex = 0">
                <span class="iconfont icon-jinriyixuerenwu needIndexAsideItemIcon"></span>
                <span>今日待办</span>
            </div>
            <div class="needIndexAsideItem"
                :class="asideIndex == 1 && 'needIndexAsideItemActive'"
                @click="asideIndex = 1">
                <span class="iconfont icon-wendang3 needIndexAsideItemIcon"></span>
                <span>全部待办</span>
            </div>
             <div class="needIndexAsideItem"
                :class="asideIndex == 5 && 'needIndexAsideItemActive'"
                @click="asideIndex = 5">
                <span class="iconfont icon-weixuanzhong needIndexAsideItemIcon"></span>
                <span>未处理的</span>
            </div>
            <div class="needIndexAsideItem"
                :class="asideIndex == 2 && 'needIndexAsideItemActive'"
                @click="asideIndex = 2">
                <span class="iconfont icon-querenyuanzhengqueduigoutijiaochenggongwancheng needIndexAsideItemIcon"></span>
                <span>已处理的</span>
            </div>
            <div class="needIndexAsideItem"
                :class="asideIndex == 4 && 'needIndexAsideItemActive'"
                @click="asideIndex = 4">
                <span class="iconfont icon-guoqi needIndexAsideItemIcon"></span>
                <span>已过期的</span>
            </div>
            <!-- <div class="needIndexAsideItem"
                :class="asideIndex == 3 && 'needIndexAsideItemActive'"
                @click="asideIndex = 3">
                <span class="iconfont icon-shanchu needIndexAsideItemIcon"></span>
                <span>回收站</span>
            </div> -->
        </div>
        <div class="needIndexMain">
            <TodayItem :asideIndex="asideIndex"></TodayItem>
        </div>
    </div>
</template>

<script>
import TodayItem from './components/Today.vue'
import { ElMessageBox } from 'element-plus'
export default {
    data(){
        return {
            asideIndex: 0
        }
    },
    created(){
        let teamValue = window.localStorage.getItem('teamValue') || ''
        // 这里应该校验当前是否还处于该团队
        if(!teamValue){
            ElMessageBox.confirm(
                '你目前还没有选择团队,请先选择团队?',
                '警告',
                {
                confirmButtonText: '知道了',
                cancelButtonText: '去管理团队',
                type: 'warning',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false
                }
            )
                .then(() => {
                    this.$router.replace('/')
                })
                .catch(() => {
                    this.$router.replace('/team')
                })
        }else{
            
        }
    },
    components: {
        TodayItem
    }
}
</script>

<style scoped>
.needIndex{
    width: 100%;
    height: 100%;
    /* background: cornsilk; */
    display: flex;
    justify-content: space-between;
}
.needIndexAside{
    width: 310px;
    height: 100%;
    padding: 5px 0 5px 5px;
    box-sizing: border-box;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
}
.needIndexAsideItem{
    width: 100%;
    height: 40px;
    line-height: 40px;
    /* background: crimson; */
    cursor: pointer;
    padding-left: 10px;
    box-sizing: border-box;
    border-left: 3px solid transparent;
    color: #767779;
    font-size: 14px;
    margin: 5px 0;
}
.needIndexAsideItemActive{
    background: #EAF2FF;
    border-left-color: #2C7BFB; 
}
.needIndexAsideItemIcon{
    margin-right: 5px;
}

.needIndexMain{
    width: calc(100% - 310px);
    height: 100%;
    /* background: chocolate; */
}
</style>
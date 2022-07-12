<template>
<!-- 今日代办 -->
    <div class="todayIndex">
        <div class="TodayIndexHeader">
            <el-input
                    class="TodayIndexHeaderArea"
                    v-model="labelText"
                    maxlength="200"
                    placeholder="请输入标签内容"
                    show-word-limit
                    :autosize='false'
                    resize='none'
                    spellcheck="false"
                    type="textarea"
                    @keydown="keyEven"
                />
            <div class="TodayIndexFoot">
                <el-date-picker v-model="tiemText" 
                    size="small" 
                    type="daterange"
                    :clearable="false"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="请选择截至日期">
                </el-date-picker>
                <el-button type="primary" 
                    class="TodayIndexFootButton"  
                    size="small"
                    :loading="isLoading"
                    @click="addNeed">新建待办</el-button>
            </div>
        </div>
        <div class="TodayIndexMain">
            <el-scrollbar style="height:100%; padding-right: 20px;box-size: border-box;">
                <NeedItem  v-for="item in needList" 
                    :key="item.uuid"
                    :itemData="item"
                    @resultNeed="resultNeed"></NeedItem>
                <el-empty v-if="needList.length == 0" description="暂无数据" />
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
import NeedItem from './Item.vue'
import { addNeedItem,
        searchToadyNeed } from '../../../../api/item'
import moment from 'moment'
export default {
    props:{
        asideIndex: {
            type: Number,
            default: 0
        }
    },
    data(){
        return {
            labelText: '',
            tiemText: [],
            needList: [],
            totas: null
        }
    },
    created(){
        let endTime = new Date().getTime() + 86400000
        let start = moment().format('YYYY-MM-DD')
        let ent = moment(endTime).format('YYYY-MM-DD')
        this.tiemText = [start, ent]
    },
    methods:{
        addNeed(){
            this.isLoading = true
            addNeedItem({
                startTime: this.tiemText[0],
                endTime: this.tiemText[1],
                content: this.labelText,
                teamuuid: window.localStorage.getItem('teamValue') || ''
            })
            .then(res => {
                this.isLoading = false
                if(res.status == 200){
                    this.$toast.success('新建成功')
                    this.resultForm()
                    this.getTable(this.asideIndex)
                }
            })
            .finally(()=>{
                this.isLoading = false
            })
        },
        resultForm(){
            this.labelText = ''
            let endTime = new Date().getTime() + 86400000
            let start = moment().format('YYYY-MM-DD')
            let ent = moment(endTime).format('YYYY-MM-DD')
            this.tiemText = [start, ent]
        },
        // 获取数据
        getTable(index){
            this.getToday(index)
        },
        // 今日代办
        getToday(index){
            this.totas = this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                });
            searchToadyNeed({
                teamuuid: window.localStorage.getItem('teamValue') || '',
                searchTime: moment().format('YYYY-MM-DD'),
                index: index
            })
            .then(res => {
                if(res.status == 200){
                    this.needList = res.data
                }else{
                    this.needList = []
                }
                this.totas.clear();
            })
            .catch(()=>{
                this.needList = []
                this.totas.clear();
            })
        },
        // 
        resultNeed(){
            this.getTable(this.asideIndex)
        },
        // enter
        keyEven(e){
            console.log(e)
            if(e.keyCode == 13 && this.labelText.length > 0 && !this.isLoading){
                this.addNeed()
            }
        }
    },
    components: {
        NeedItem
    },
    watch:{
        asideIndex:{
            handler(news){
                this.getTable(news)
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style scoped>
.todayIndex{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}
.TodayIndexHeader{
    width: 100%;
    height: auto;
    /* background: cadetblue; */
    margin-bottom: 10px;
}
.TodayIndexHeaderArea{
    width: 100%;
    height: 60px;
}
.TodayIndexHeaderArea >>> .el-textarea__inner{
    width: 100%;
    height: 100%;
}
.TodayIndexFoot{
    width: 100%;
    height: 50px;
    /* background: chocolate; */
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.TodayIndexFootButton{
    width: 120px;
}
.TodayIndexMain{
    width: 100%;
    height: calc(100% - 120px);
    overflow-x: hidden;
    overflow-y: auto;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;  /*  火狐   */
}
.TodayIndexMain::-webkit-scrollbar {
    display: none;  /*  Chrome  */
    width: 0 !important ; /*  Chrome  */
}
</style>
<template>
    <div class="chromePage">
        <div class="chromePageTag">
            <div class="chromePageMove">

            </div>
            <!-- 标签页 -->
            <div class="chromePageTagBox">
                <Tag></Tag>
            </div>
            <!-- 功能菜单 -->
            <div class="chromePageTagRight">
                <div class="chromePageTagRightLeft">
                    <span class="iconfont icon-jiahao chromePageTagRightLeftIcon"
                        @click="addTag"></span>
                </div>
                <div class="chromePageTagRightCentent"></div>
                <div class="indexHeaderRightTitle">
                    <!-- <span class="iconfont icon-quanping indexHeaderRightTitleIcon"></span>
                    <span class="iconfont icon-xiangxiajixu indexHeaderRightTitleIcon" 
                        alt='全屏' @click="allWindow"></span> -->
                    <span class="iconfont icon-zuixiaohua indexHeaderRightTitleIcon" 
                        alt='最小化' @click="minWindow"></span>
                    <span class="iconfont indexHeaderRightTitleIcon"
                        :class="isMax ? 'icon-zuidahua' : 'icon-zuidahuaxi'"
                        alt='最大化' @click="tagWindow"></span>
                    <span class="iconfont icon-guanbi1 indexHeaderRightTitleIconClose"
                        alt='关闭' @click="closeWindow"></span>
                </div>
            </div>
        </div>
        <!-- 试图区域 -->
        <div class="chromeView">
            <chromeView 
                v-show="apiActiveIndex == index "
                v-for="(item,index) in apiList" 
                :key="item.id"
                :like='item.like'
                :zIndex='index'
                :item="item"></chromeView>
        </div>
    </div>
</template>

<script>
import Tag from './components/Tag.vue'
import chromeView from './components/webView.vue'
export default {
    data(){
        return {
            isMax: false
        }
    },
    mounted(){
        let This = this 
        this.$electron.ipcRenderer.on('maxState-chrome',function(event,data){
                This.isMax = data
            })
        document.title = 'E-浏览器'
    },
    methods:{
        addTag(){
            this.$store.commit('Chrome/addOptionItem')
        },
        // 最小化
        minWindow(){
           this.$electron.ipcRenderer.send('window-children-min') 
        },
        // 关闭
        closeWindow(){
            this.$electron.ipcRenderer.send('window-children-quit') 
        },
        // 切换
        tagWindow(){
            this.$electron.ipcRenderer.send('window-children-tag') 
        },
        // 全屏
        allWindow(){
            this.$electron.ipcRenderer.send('window-children-all') 
        }
    },
    computed: {
        apiList(){
            return this.$store.state.Chrome.apiList
        },
        apiActiveIndex(){
            return this.$store.state.Chrome.apiActiveIndex
        }
    },
    watch:{
        apiActiveIndex(news){
        }
    },
    components:{
        Tag,
        chromeView
    }
}
</script>

<style scoped>
.chromePage{
    width: 100%;
    height: 100%;
}
.chromePageTag{
    width: 100%;
    height: 35px;
    background: #E7EAED;
    display: flex;
    /* padding-left: 15px; */
    box-sizing: border-box;
}
.chromePageMove{
    width: 15px;
    height: 100%;
    -webkit-app-region: drag;
}
.chromePageTagBox{
    width: calc(100% - 200px);
    height: 100%;
    /* background: #545B62; */
}
.chromePageTagRight{
    width: 250px;
    height: 100%;
    padding-top: 0px;
    box-sizing: border-box;
    /* background: red; */
    display: flex;
    justify-content: space-between;
}
.chromePageTagRightLeft{
    width: 40px;
    height: 100%;
    /* background: yellowgreen; */
    padding-top: 2px;
    box-sizing: border-box;
}
.chromePageTagRightLeftIcon{
    display: inline-block;
    width: 30px;
    height: 30px;
    color: #545B62;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
}
.chromePageTagRightLeft span{
    background: #fff;
}
.chromePageTagRightCentent{
    width: 60px;
    height: 100%;
    -webkit-app-region: drag;
}
.indexHeaderRightTitle{
    width: 150px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    /* background: bisque; */
}
.indexHeaderRightTitleIcon{
    display: inline-block;
    width: 40px;
    height: 30px;
    color: #545B62;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
}
.indexHeaderRightTitleIcon:hover{
    background: #DCDDDD;
}
.indexHeaderRightTitleIconClose{
    display: inline-block;
    width: 45px;
    height: 30px;
    color: #545B62;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
}
.indexHeaderRightTitleIconClose:hover{
    background: red;
    color: #fff;
}
/* 试图区域 */
.chromeView{
    width: 100%;
    height: calc(100% - 35px);
}
</style>
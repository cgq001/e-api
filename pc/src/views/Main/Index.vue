<template>
<!--携带侧边栏的主页 -->
    <div class="mainIndex">
        <!-- 主页的侧边栏 -->
        <div class="mainIndexAside">
            <!-- 上半部分 -->
            <div class="mainIndexAsideTop">
                <!-- 侧边功能栏 -->
                <div class="mainIndexAsideItem"
                    @click="goHome"
                    :class="path == '/' && 'mainIndexAsideItemActive'">
                    <div class="iconfont icon-zhuye mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">首页</div>
                </div>
                <div class="mainIndexAsideItem"  
                    @click="goAPi"
                    :class="path.includes('api') && 'mainIndexAsideItemActive'">
                    <div class="iconfont icon-jiekouzhongxin mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">接口</div>
                </div>
                <div class="mainIndexAsideItem"  
                    @click="goProject"
                    :class="path.includes('project') && 'mainIndexAsideItemActive'">
                    <div class="iconfont icon-dilanxianxingiconyihuifu_huabanfuben mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">项目</div>
                </div>
                <!-- <div class="mainIndexAsideItem" style="margin:0">
                    <div class="iconfont icon-shiyanshaobei2 mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">BUG</div>
                </div> -->
                <span class="mainIndexAsideItemLine"></span>
                <div class="mainIndexAsideItem"
                    @click="goLabel"
                    :class="path.includes('label') && 'mainIndexAsideItemActive'">
                    <div class="iconfont icon-bianqian mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">便签</div>
                </div>
                <div class="mainIndexAsideItem"
                    @click="goNeed"
                    :class="path.includes('need') && 'mainIndexAsideItemActive'">
                    <div class="iconfont icon-richeng1 mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">待办</div>
                </div>
                <!-- <div class="mainIndexAsideItem"
                    @click="goWord"
                    :class="path.includes('word') && 'mainIndexAsideItemActive'">
                    <div class="iconfont icon-wendang2 mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">文档</div>
                </div> -->
            </div>
            <!-- 中间部分 -->
            <div class="mainIndexAsideContent">

            </div>
            <!-- 下半部分 -->
            <div class="mainIndexAsideBootom">
                <div class="mainIndexAsideItem" v-if="isElectron == 1" @click="goChrome">
                    <div class="iconfont icon-chrome mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">浏览器</div>
                </div>
                <!-- <div class="mainIndexAsideItem"  @click="goTable"  v-if="isElectron">
                    <div class="iconfont icon-yingyong mainIndexAsideItemIcon"></div>
                    <div class="mainIndexAsideItemName">应用</div>
                </div> -->
            </div>
        </div>
        <!-- 主程序二级视图 -->
        <div class="mainIndexContent">
            <div class="mainIndexContentTop">
                <router-view></router-view>
            </div>
            <div class="mainIndexContentBottom">
                <div class="mainIndexContentBottomLeft">
                    <!-- <div class="mainIndexContentBottomLeftLine">
                        <span class="iconfont icon-xinhao1 mainIndexContentBottomLeftLineIcon" 
                            :class="isLine ? 'mainIndexContentBottomLeftLineIconActive' : 'mainIndexContentBottomLeftLineIconDisable' "></span>
                        <span v-if="!isLine" class="mainIndexContentBottomLeftLineNone"></span>
                    </div> -->
                </div>
                <div class="mainIndexContentBottomRight">
                    <span class="mainIndexContentBottomRightWeb" @click="goWeb">E-API官网</span>
                    <span>版本：{{version}}</span>
                    <span>更新时间：{{updataTime}}</span>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>


export default {
    data(){
        return {
            version: process.env.VUE_APP_Version,
            updataTime: process.env.VUE_APP_UpdataTime,
            eAPiWeb:  process.env.VUE_APP_Web,
            isElectron: process.env.VUE_APP_Electron,
            isLine: false
        }
    },
    created(){
        // console.log(this.$route)
        this.getLine()
    },
    methods:{
        goHome(){
            this.$router.push('/')
        },
        goAPi(){
            this.$router.push('/api')
        },
        goProject(){
            this.$router.push('/project')
        },
        goLabel(){
            this.$router.push('/label')
        },
        goNeed(){
            this.$router.push('/need')
        },
        goWord(){
            this.$router.push('/word')
        },
        goTable(){
           
        },
        goChrome(){
            this.$electron.ipcRenderer.send('window-children-chrome') 
            // window.open('/#/chrome')
            // this.$router.push('/chrome')
        },
        goWeb(){
                if(this.isElectron == 1){
                    this.$electron.shell.openExternal(this.eAPiWeb)
                }else{
                    window.open(this.eAPiWeb)
                } 
        },
        getLine() {
            let This = this

			
			window.addEventListener('offline', function(e) {
                console.log(e)
				This.isLine = false
			})

			window.addEventListener("online", function(e) {
                console.log(e)
				This.isLine = true
			})
		},
        getRemoveLine(){
            let This = this
            window.removeEventListener('offline',function(e) {
				This.isLine = false
			})
            window.removeEventListener('online', function(e) {
				This.isLine = true
			})
        }
    },
    computed: {
        path(){
            return this.$route.fullPath
        },
        isElectron(){
            return process.env.VUE_APP_Electron
        }
    },
    beforeUnmount(){
        this.getRemoveLine()
    }
}
</script>

<style scoped>
.mainIndex{
    width: 100%;
    height: 100%;
    display: flex;
}
/* 侧边栏 */
.mainIndexAside{
    width: 70px;
    height: 100%;
    background: #F7F7F7;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-content: center;
    flex-direction: column;
    padding: 7px;
    box-sizing: border-box;
}
.mainIndexAsideTop{
    width: 100%;
    height: auto;
    /* background: yellowgreen; */
}
.mainIndexAsideContent{
    flex: 1;
    height: auto;
    /* background: bisque; */
}
.mainIndexAsideBootom{
    width: 100%;
    height: auto;
    /* background: blueviolet; */
    padding-bottom: 10px;
    box-sizing: border-box;
}

.mainIndexAsideItem{
    width: 100%;
    height: 56px;
    /* background: #DCDFE6; */
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
}
.mainIndexAsideItem:hover{
    background: #E9ECEF;
}
.mainIndexAsideItemActive{
    background: #E9ECEF;
}
.mainIndexAsideItemIcon{
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #88A0CD;
    font-size: 18px;
}
.mainIndexAsideItemName{
    width: 100%;
    height: 20px;
    font-size: 12px;
    text-align: center;
}
.mainIndexAsideItemBottom{
    width: 30px;
    height: 30px;
    /* background: #DCDFE6; */
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
    margin: 0 auto;
}
.mainIndexAsideItemBottom:hover{
    background: #E9ECEF;
}
.mainIndexContent{
    width: calc(100% - 70px);
    height: 100%;
    /* background: tan; */
}
.mainIndexContentTop{
    width: 100%;
    height: calc(100% - 26px);
}
.mainIndexContentBottom{
    width: 100%;
    height: 25px;
    background: transparent;
    border-top: 1px solid #DCDFE6;
    padding: 0 10px;
    box-sizing: border-box;
    user-select: none;
    display: flex;
}
.mainIndexContentBottomLeft{
    width: 500px;
    height: 100%;
    /* background: #88A0CD; */
}
.mainIndexContentBottomRight{
    width: calc(100% - 500px);
    height: 100%;
    text-align: right;
    font-size: 12px;
    color: #999;
    line-height: 25px;
}
.mainIndexContentBottomRight span{
    margin-left: 15px;
}
.mainIndexContentBottomRightWeb{
    text-decoration: underline;
    cursor: pointer;
    
}
.mainIndexAsideItemLine{
    display: inline-block;
    width: 100%;
    height: 1px;
    background: #E9ECEF;
    margin-bottom: 5px;
}
.mainIndexContentBottomLeftLine{
    width: 40px;
    height: 100%;
    background: #F7F7F7;
    line-height: 24px;
    position: relative;
}
.mainIndexContentBottomLeftLineIcon{
    font-size: 16px;
}
.mainIndexContentBottomLeftLineIconActive{
    color: #1084FB;
}
.mainIndexContentBottomLeftLineIconDisable{
    color: red;
}
.mainIndexContentBottomLeftLineNone{
    width: 24px;
    height: 2px;
    background: red;
    display: inline-block;
    position: absolute;
    left: 3px;
    top: 5px;
    transform-origin: left top;
    transform: rotate(35deg);
}
</style>
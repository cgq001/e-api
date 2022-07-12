<template>
    <div class='WebInndex'>
        <!-- 输入框 -->
        <div class="WebInndexInput">
            <span class="iconfont icon-xiangyou WebInndexInputIcon" :class="isGoBack ? 'WebInndexInputIconActive' : ''" @mouseover="mouseoverBack" @click="goBack"></span>
            <span class="iconfont icon-xiangyou WebInndexInputIcon" :class="isGoForward ? 'WebInndexInputIconActive' : ''" @click="forward"></span>
            <span v-if="isStop" class="iconfont icon-guanbi1 WebInndexInputIcon WebInndexInputIconActive" @click="stop"></span>
            <span v-else class="iconfont icon-shuaxin WebInndexInputIcon WebInndexInputIconActive" @click="reload"></span>
            <div class="WebInndexInputBox">
                <input 
                    v-model.trim="urlLink" 
                    spellcheck="false"  
                    class="WebInndexInputBoxLink" 
                    autosave
                    @keyup="urlLinkKey" 
                    placeholder="在百度中搜索，或者输入一个网址" />
            </div>
        </div>
        <!-- 书签 -->
        <!-- <div class="WebInndexNook">

        </div> -->
        <!-- 
            nodeintegration 拥有可是使用Node底层的能力 
            plugins 可以使用浏览器插件
            httpreferrer='http://www.baidu.com' // 默认URL
            disablewebsecurity  禁止安全控制
            allowpopups 允许新开窗口
            -->
        <div class="WebWebview">
             <webview 
                nodeintegration 
                plugins
                class="WebWebviewWeb"
                disablewebsecurity
                httpreferrer='http://www.baidu.top'
                ref="webViews" 
                style="display: inline-flex;" 
                :src='webViewLink'
                ></webview>
            <!-- 右键菜单 -->
            <div class="contextmenu" :style="{top: isContextTop + 'px', left: isContextLeft + 'px'}" v-if="isContextShow">
                <div class="contextmenuItem"  v-if="selectText.length > 0" @click="goCopy">
                    复制
                </div>
                <div v-if="selectText.length > 0" class="contextmenuItem" style="border-bottom: 1px solid #EBEBEB" @click="searchText">
                    在百度搜索：“{{selectText.length > 9 ? selectText.substr(0,9) + '...' : selectText}}”
                </div>
                <div class="contextmenuItem" style="border-bottom: 1px solid #EBEBEB" @click="goNewView">
                    打开新窗口
                </div>
                <div class="contextmenuItem"  v-if="selectLink.length > 0" @click="newViews(1)">
                    在新窗口打开连接
                </div>
                <div class="contextmenuItem"  v-if="selectLink.length > 0" @click="newViews(3)">
                    在隐藏窗口打开连接
                </div>
                <div class="contextmenuItem"  v-if="selectLink.length > 0" @click="newViews(2)">
                    在本窗口打开连接
                </div>
                <div class="contextmenuItem" style="border-bottom: 1px solid #EBEBEB"  v-if="selectLink.length > 0"  @click="goCopyLink">
                    复制连接
                </div>
                <div class="contextmenuItem"  :class="isGoBack ? 'WebInndexInputIconActive' : ''"  @click="goBack">
                    返回
                </div>
                <div class="contextmenuItem"  :class="isGoBack ? 'WebInndexInputIconActive' : ''"  @click="forward">
                    前进
                </div>
                <div class="contextmenuItem" style="border-bottom: 1px solid #EBEBEB" @click="reload">
                    刷新
                </div>
                <div class="contextmenuItem" @click="goConsole">
                    控制台
                </div>
                <div class="contextmenuItem" @click="goClose">
                    关闭右键菜单
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        like:{
            default: '',
            type: String
        },
        item: {
            type: Object,
            require: true
        },
        zIndex: {
            type: Number,
            require: true
        }
    },
    // created(){
    //     if(this.like){
    //         this.webViewLink = this.like
    //     }
    // },
    data(){
        return {
            webViews: null,
            urlLink: null,
            webViewLink: '',
            isGoBack: false,
            isGoForward: false,
            isStop: false,
            isNormal: true ,// 页面是否正常加载
            selectText: '' ,// 右键复制的文字
            selectLink: '' ,// 右键复制发连接,
            isContextTop: '',
            isContextLeft: '',
            isContextShow: false,
            isOpen: true,
            
        }
    },
    mounted(){
        this.goLink()
    },
    methods:{
        async goLink(){
            let This = this 
            this.webViews = this.$refs.webViews
            this.webViews.addEventListener('new-window', async (e) => {
                const { protocol } = require('url').parse(e.url)
                
                if (protocol === 'http:' || protocol === 'https:') {
                    // this.webViews.src = e.url
                    // let id =  new Date().getTime()
                    // This.$store.commit('setTitleList',{
                    //     ico: null,
                    //     title: null,
                    //     like: e.url,
                    //     id: id
                    // })
                    // This.$store.commit('setActiveIndex',id)
                    this.$store.commit('Chrome/addOptionItem',e.url)
                }
            });
            this.webViews.addEventListener('dom-ready', () => {
            //    console.log('4.主页面 dom 加载完成')
                // https://www.electronjs.org/zh/docs/latest/api/webview-tag#webviewgeturl
               let isLoading = this.webViews.isLoading() // 是否加载完成
               let getURL = this.webViews.getURL() // 访客页面URL This.webViews.getAttribute('src')
               let getTitle = this.webViews.getTitle() // 访客页面标题
                    // console.log(getTitle)
                    // this.webViews.openDevTools()
                // this.webViews.stop() // 停止
                // this.webViews.reload() // 刷新   this.webViews.reloadIgnoringCache //刷新并忽略缓存
                // this.webViews.canGoBack() // 能否后退
                // this.webViews.canGoForward() // 能否前进  canGoToOffset(6) // 能否前进到
                //  this.webViews.clearHistory() // 清楚历史记录 
                
                This.isGoBack = this.webViews.canGoBack()
                This.isGoForward = this.webViews.canGoForward()
                
                    This.$store.commit('Chrome/setTitleTitle',{
                        title:  This.webViews.getTitle(),
                        // id: This.item.id 
                        zIndex: this.zIndex
                    })

                // console.log(This.urlLink)
            })

            this.webViews.addEventListener('did-start-loading',() => {
                This.isStop = true
                This.isNormal = false
                // console.log('1.页面开始加载')
            })
            this.webViews.addEventListener('load-commit',() => {
                This.isNormal = true
                // console.log('2.主页面文档加载')
            })
            this.webViews.addEventListener('page-title-updated',() => {
                // console.log('3.page-title-updated')
            })
            this.webViews.addEventListener('load-commit',() => {
                // console.log('5.frame文档加载')
                let This = this
                This.urlLink = decodeURI(this.webViews.getURL())
            })
            this.webViews.addEventListener('did-frame-finish-load',() => {
                // console.log('6.frame 加载完成')
                // console.log('7.最后一个是主框架frame 加载完成')
            })
            this.webViews.addEventListener('did-finish-load',() => {
                // console.log('8.最后一个是主框架frame 加载完成')
            })
            this.webViews.addEventListener('page-favicon-updated',(e) => {
                // console.log('10.网页 icon',e.favicons)
                if(e.favicons && e.favicons.length > 0){
                    // console.log(e.favicons[0])
                    This.$store.commit('Chrome/setTitleIcon',{
                        ico: e.favicons[0],
                        // id: This.item.id 
                        zIndex: this.zIndex
                    })
                }
            })
            this.webViews.addEventListener('did-stop-loading',() => {
                This.isStop = false
                // console.log('9.页面停止加载')

                if(!This.isNormal){
                    // 当页面加载失败的时候，重定向到百度
                    This.webViews.src = 'http://www.baidu.com'
                }
            })
            this.webViews.addEventListener('did-fail-loadg',() => {
                This.isStop = false
                // console.log('页面加载失败')
            })
            this.webViews.addEventListener('context-menu',(e) => {
                if(!This.isContextShow){
                    This.isContextShow = true
                }
                This.isContextTop = e.params.y - 40 - 35
                This.isContextLeft = e.params.x 
                This.selectLink = e.params.linkURL
                let selectText = e.params.selectionText
                This.selectText = selectText
            })
        },
        urlLinkKey(ev){
            if(ev.key == 'Enter'){
                let urlRG =  /^(?:(http|https|ftp):\/\/)?((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)/
                let webRG =  /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
      
                if(urlRG.test(this.urlLink)){
                    // console.log('这是一个网址')
                    if(this.urlLink.startsWith('http://') || this.urlLink.startsWith('https://') || this.urlLink.startsWith('ftp://')){

                    }else{
                        this.urlLink = 'http://' + this.urlLink
                    }

                    this.webViewLink = this.urlLink
                }else if(webRG.test(this.urlLink)){
                    if(this.urlLink.startsWith('http://') || this.urlLink.startsWith('https://') || this.urlLink.startsWith('ftp://')){

                    }else{
                        this.urlLink = 'http://' + this.urlLink
                    }

                    this.webViewLink = this.urlLink
                }else if(this.urlLink.includes('localhost')){
                    if(this.urlLink.startsWith('http://') || this.urlLink.startsWith('https://') || this.urlLink.startsWith('ftp://')){

                    }else{
                        this.urlLink = 'http://' + this.urlLink
                    }

                    this.webViewLink = this.urlLink
                }else{
                    // console.log('这不是网址')
                    this.$store.commit('Chrome/addOptionItem',`https://www.baidu.com/s?ie=UTF-8&wd=${this.urlLink}`)
                }
                // console.log(this.urlLink)
            }
        },
        // 鼠标移入返回按钮
        mouseoverBack(){
            if(this.webViews && this.webViews.canGoBack){
                this.isGoBack = this.webViews.canGoBack()
              
            }
            
        },
        // 停止
        stop(){
            this.webViews.stop()
        },
        // 刷新
        reload(){
            this.isContextShow = false
            // this.webViews.reload() 
            this.webViews.reloadIgnoringCache() 
        },
        // 前进
        forward(){
            this.isContextShow = false
            if(!this.isGoForward){
                return false
            }
            this.webViews.goForward()
        },
        // 后退
        goBack(){
 
            this.isContextShow = false
            if(!this.isGoBack){
                // this.$message.error('已不能后退');
                return false
            }
            
            this.webViews.goBack()
        },
        // 右键
        goContextMenu(e){
            
        },
        // 打开控制台
        goConsole(){
            if(this.webViews.isDevToolsOpened()){
                this.$message.error('控制台已经打开');
            }else{
                // {mode:'right'}
                this.webViews.openDevTools()
            }
            this.isContextShow = false
            //  this.webViews.inspectServiceWorker(40,400)
            
        },
        // 复制
        goCopy(){
            this.$electron.clipboard.writeText(this.selectText)
            this.isContextShow = false
        },
        // 复制连接
        goCopyLink(){
            this.$electron.clipboard.writeText(this.selectLink)
            this.isContextShow = false
        },
        goClick(){
            // console.log('点击')
        },
        goClose(){
            // console.log('关闭菜单')
            this.isContextShow = false
        },
        // 打开新窗口
        goNewView(){
            let id =  new Date().getTime()
            this.$store.commit('Chrome/addOptionItem')
            this.isContextShow = false
        },
        // 打开连接
        newViews(index){
            this.isContextShow = false

            if(index == 1){
                let id = new Date().getTime()
                    this.$store.commit('Chrome/addOptionItem',this.selectLink)
                    this.isContextShow = false
            }else if (index == 3){
                 let id = new Date().getTime()
                 this.$store.commit('setTitleList',{
                        ico: null,
                        title: null,
                        like: this.selectLink,
                        id:  id
                    })
            }else{
                 this.webViewLink = this.selectLink
                  this.isContextShow = false
            }
        },
        // 在百度搜索
        searchText(){
      
                this.$store.commit('Chrome/addOptionItem',`https://www.baidu.com/s?ie=UTF-8&wd=${this.selectText}`)
                    this.isContextShow = false
        },
        // 启动java
        goJava(){
            // console.log('启动java')
            // this.$electron.ipcRenderer.send('window-java') 
        }
    },
    watch:{
        like: {
            handler(news){
                if(news){
                    this.webViewLink = news
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.WebInndex{
    width: 100%;
    height: 100%;
    /* background: yellowgreen; */
     overflow: hidden;
}
.WebWebview{
    width: 100%;
    height: calc(100% -  40px);
    margin: 0;
    padding: 0;
    /* overflow: hidden; */
    position: relative;
}
.WebWebviewWeb{
    width: 100%;
    height: 100%;
}

.WebInndexInput{
    width: 100%;
    height: 40px;
    /* background: yellowgreen; */
    padding: 2.5px 2.5px;
    box-sizing: border-box;
    display: flex;
    color: #000;
    border-bottom: 1px solid #DBDCDD;
}
.WebInndexInput span:nth-child(1){
    transform: rotate(180deg);
}
.WebInndexInputIcon{
    font-size: 16px;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    /* cursor: pointer; */
    border-radius: 50%;
    color: #BABCBE;
}
.WebInndexInputIconActive{
    color: #5F6368;
}
.WebInndexInputIconActive:hover{
    background: #EDEDED;
}
.WebInndexInputBox{
    height: 30px;
    width: calc(100% - 135px);
    background: #F1F3F4;
    border-radius: 13px;
    overflow: hidden;
}
.WebInndexInputBoxLink{
    height: 30px;
    border-radius: 15px;
    width: 100%;
    outline: none;
    text-decoration: none;
    border: none;
    padding: 0 25px;
    box-sizing: border-box;
    background: #F1F3F4;
    font-size: 14px;
    font-weight: 100;
    font-family: '微软雅黑';
    color: #000;
    border: 1px solid transparent;
}
.WebInndexInputBoxLink:focus{
    border-color: #3CA1FD;
    box-shadow: inset 0 0 1px 2px #F9FAFA;
}

.contextmenu{
    position: absolute;
    left: 10px;
    top: 10px;
    width: 250px;
    height: auto;
    border-radius: 5px;
    border: 1px solid #EBEBEB;
    box-shadow: 1px 1px 2px 2px #EBEBEB;
    background: #ffffff;
    -webkit-user-select: none;
}
.contextmenuItem{
    width: 100%;
    height: 35px;
    font-size: 12px;
    padding: 0 20px;
    box-sizing: border-box;
    line-height: 35px;
    /* background: burlywood; */
    /* cursor: pointer; */
}
.contextmenuItem:hover{
    background: #EBEBEB;
}

/* 书签 */
.WebInndexNook{
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #DADCE0;
    box-sizing: border-box;
    /* background: brown; */
}
</style>
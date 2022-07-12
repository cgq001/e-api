<template>
    <div class="homeIndex">
        <!-- 时间 -->
        <div class="homeIndexTime">
            <div class="homeIndexTimeHose">
                {{hoseTime}}
            </div>
            <div class="homeIndexTimeDaty">
                <span>{{datTime}}</span><span>{{weekTime}}</span>
                <span v-if="lunarTimeData.length == 3">
                    {{lunarTimeData[0] }} 年 {{lunarTimeData[1]}}月初{{lunarTimeData[2]}}
                </span>
            </div>
        </div>
        <!-- 搜索 -->
        <div class="homeIndexSearch">
            <div class="homeIndexSearchBox">
                <div class="homeIndexSearchBoxLogo" @click="searckIconShwo = !searckIconShwo">
                    <img :src="searchList[searckIndex].icon" class="homeIndexSearchBoxLogoImage" />
                    <span class="iconfont icon-xiangxia1 homeIndexSearchBoxLogoIcon"></span>
                </div>
                <div class="homeIndexSearchBoxText">
                    <input 
                        type="text" 
                        :placeholder="searchList[searckIndex].placeholder" 
                        class="homeIndexSearchBoxTextInput"
                        v-model="searckText"
                        @keydown="inputDown" />
                </div>
                <div class="homeIndexSearchBoxButton" @click="searckName">
                    <span class="iconfont icon-sousuo homeIndexSearchBoxLogoIcon"></span>
                </div>
            </div>
        </div>
        <!-- 搜索ICON -->
        <div class="homeIndexIcon" v-show="searckIconShwo">
            <div class="homeIndexIconItem" 
                v-for="(item,index) in searchList" 
                :key="index"
                @click="tagSearch(index)">
                <img :src="item.icon" />
            </div>
        </div>
    </div>
</template>

<script>
import BaiduSvg from './../../../assets/image/search/baidu.svg'
import BingSvg from '../../../assets/image/search/bing.svg'
import CsdnSvg from '../../../assets/image/search/csdn.svg'
import JuejinSvg from '../../../assets/image/search/juejin.svg'
import GitHubSvg from '../../../assets/image/search/github.svg'
import BilibilSvg from '../../../assets/image/search/bilibili.svg'

import moment from 'moment'
moment.locale('zh-cn')
export default {
    data(){
        return {
            searchList: [
                {
                    icon: BaiduSvg,
                    placeholder: '百度一下',
                    link: 'https://www.baidu.com/s?ie=UTF-8&wd='
                },
                {
                    icon: BingSvg,
                    placeholder: '必应搜索',
                    link: 'https://cn.bing.com/search?q='
                },
                {
                    icon: CsdnSvg,
                    placeholder: 'CSDN搜索',
                    link: 'https://so.csdn.net/so/search?q=A'
                },
                {
                    icon: JuejinSvg,
                    placeholder: '探索稀土掘金',
                    link: 'https://juejin.cn/search?query='
                },
                {
                    icon: GitHubSvg,
                    placeholder: 'Search or jump to…',
                    link: 'https://github.com/search?q='
                },
                {
                    icon: BilibilSvg,
                    placeholder: '哔哩哔哩搜索',
                    link: 'https://search.bilibili.com/all?keyword='
                }
            ],
            searckIndex: window.localStorage.getItem('searckIndex') || 0,
            searckText: '',
            searckIconShwo: false,
            hoseTime: moment().format('HH:mm:ss'),
            datTime: moment().format('MM月DD日'),
            time: null,
            weekTime: moment().format('dddd'),
            lunarTime: new Date().toLocaleString('ja-JP-u-ca-chinese') , //  zh-Hans-u-ca-chinese
            lunarTimeData: [],
            timeTwo: null
        }
    },
    mounted(){
        this.getTimes()
    },
    methods: {
        tagSearch(index){
            this.searckIndex = index
            window.localStorage.setItem('searckIndex',index)
            this.searckIconShwo = false
        },
        inputDown(e){
            if(e.keyCode == 13){
                this.searckName()
            }
        },
        searckName(){
            if(this.searckText.length > 0){
                if(this.isElectron == 1){
                    this.$electron.shell.openExternal(this.searchList[this.searckIndex].link + this.searckText)
                }else{
                    window.open(this.searchList[this.searckIndex].link + this.searckText)
                }
                
                this.searckText = ''
            }
        },
        // 定时器
        getTimes(){
            
            let This = this 
            clearInterval(this.time)
            this.time = setInterval(()=>{
                
                This.hoseTime = moment().format('HH:mm:ss')
            },1000)


            clearInterval(this.timeTwo)
            this.timeTwo = setInterval(()=>{
                
                This.hoseTime = moment().format('HH:mm:ss')
            },1000 * 60 * 60)
        }
    },
    watch: {
        lunarTime: {
            handler(news){
                let data = (news.split(' ')[0]).split('-')
                this.lunarTimeData = data
            },
            immediate: true
        }
    },
    computed:{
        isElectron(){
            return process.env.VUE_APP_Electron
        }
    },
    onBeforeUnmount(){
        clearInterval(this.time)
        clearInterval(this.timeTwo)
    }
}
</script>
<style scoped>
@font-face {
    font-family: 'font-time';
    src: url('../../../assets/font/clockicons.woff2');
    font-weight: normal;
    font-style: normal
}
.homeIndex{
    width: 100%;
    height: 100%;
    padding-top: 70px;
    box-sizing: border-box;
}
.homeIndexTime{
    width: 100%;
    height: 150px;
    /* background: gold; */
}
.homeIndexTimeHose{
    width: 100%;
    height: 100px;
    /* background: coral; */
    font-size: 85px;
    text-align: center;
    line-height: 100px;
    font-family: 'font-time';
}
.homeIndexTimeDaty{
    width: 100%;
    height: 30px;
    line-height: 30px;
    /* background: cornflowerblue; */
    text-align: center;
}
.homeIndexTimeDaty span{
    margin: 0 5px;
}
.homeIndexSearch{
    width: 100%;
    height: 60px;
    /* background: chocolate; */
    display: flex;
    justify-content: center;
}
.homeIndexSearchBox{
    width: 800px;
    height: 50px;
    border: 1px solid #C4C7CE;
    border-radius: 25px;
    display: flex;
    justify-content: space-between;
}
.homeIndexSearchBoxLogo{
    width: 70px;
    height: 50px;
    /* background: coral; */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px 0 0 25px;
}
.homeIndexSearchBoxLogo:hover{
    background: #f5f5f5;
}
.homeIndexSearchBoxLogoImage{
    width: 20px;
    height: 20px;
}
.homeIndexSearchBoxLogoIcon{
    font-size: 14px;
    color: #9FA2A3;
    margin-left: 10px;
}
.homeIndexSearchBoxButton{
    width: 60px;
    height: 50px;
    border-radius: 0 25px 25px 0;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    cursor: pointer;
}
.homeIndexSearchBoxButton:hover{
    background: #f5f5f5;
}
.homeIndexSearchBoxText{
    width: calc(100% - 130px);
    height: 100%;
    line-height: 50px;
}
.homeIndexSearchBoxTextInput{
    width: 100%;
    height: 95%;
    border: none;
    outline: none;
    padding: 0 10px;
    box-sizing: border-box;
}
.homeIndexIcon{
    width: 100%;
    height: 30px;
    /* background: brown; */
    display: flex;
    justify-content: center;
}
.homeIndexIconItem{
    width: 80px;
    height: 30px;
    background: rgba(231,237,239, 0.7);
    border-radius: 15px;
    text-align: center;
    padding-top: 5px;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0 5px;
}
.homeIndexIconItem img{
    width: 20px;
    height: 20px;
}
</style>
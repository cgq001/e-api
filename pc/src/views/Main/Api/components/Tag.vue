<template>
    <div class="tagComponent">
        <!-- 左箭头 -->
        <div class="tagComponentItemLeft" 
            v-if="isScroll"
            :class="isLeft && 'tagComponentItemDisabled'"
            @click="goRight">
            <span class="iconfont icon-xiangyou" style=" display: block;transform: rotate(180deg);"></span>
        </div>
        <!-- 盒子最大宽度 -->
        <div class="tagComponentTable" ref="tagComponentTable">
            <!-- 盒子总宽度 -->
            <div class="tagComponentTableMain" ref="tagComponentTableMain">
                <!-- 每一个标签 -->
                <div class="tagComponentItem" 
                    :ref="'tagComponentItem' + index"
                    :class="index == apiActiveIndex && 'tagComponentItemActive'"
                    v-for="(item,index) in apiList" :key="index">
                    <div class="tagComponentItemSave" @click="tagItem(index)">
                        <span v-if="item.isSave > 0 && isAuthInfo && isAuthInfo.auth && isAuthInfo.auth.auth == 2" class="tagComponentItemSaveIcon"></span>
                    </div>
                    <div class="tagComponentItemText" @click="tagItem(index)">
                        {{item.apiName}}
                    </div>
                    <div class="tagComponentItemClose">
                        <div class="tagComponentItemCloseBox"
                            :class="index == apiActiveIndex && 'tagComponentItemCloseBoxActive'"
                            @click="closeTag(item,index)">
                            <span class="iconfont icon-guanbi"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右箭头 -->
        <div class="tagComponentItemRight"
            v-if="isScroll" 
            :class="isRight && 'tagComponentItemDisabled'"
            @click="goLeft">
            <span class="iconfont icon-xiangyou" style=" display: block;"></span>
        </div>
    </div>
</template>

<script>
import { close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

export default {
    data(){
        return {
            isScroll: false,
            itemWidth: 180,
            parentWidth: 0,
            isLeft: false,
            isRight: false
        }
    },
    mounted(){
        let This = this
        this.getTageWidth()
        window.onresize = function(){
            
            This.$nextTick(()=>{
                This.getTageWidth()
            })
        }
        
    },
    methods:{
        getTageWidth(){
            // 盒子最大宽度
            this.parentWidth = this.$refs.tagComponentTable.offsetWidth
            // 盒子总宽度
            let allWidth = this.$refs.tagComponentTableMain.offsetWidth
            // 每个盒子的宽度
            this.itemWidth =   allWidth.children && allWidth.children.length > 0 ? allWidth.children[0].offsetWidth : 180
            if(allWidth >= this.parentWidth){
                this.isScroll = true
            }else{
                this.isScroll = false
            }

            this.goRight()
            // this.$refs.tagComponentTableMain.style.left = (this.tagIndex * this.itemWidth) + 'px'
        },
        goLeft(){
            let left = this.$refs.tagComponentTableMain.offsetLeft
            let parent = this.$refs.tagComponentTable.offsetWidth
            let box = this.$refs.tagComponentTableMain.offsetWidth
            if( Math.abs(left) + parent >= box - this.itemWidth ){
                this.$refs.tagComponentTableMain.style.left = -(box - parent) + 'px'
                this.isLeft = true
            }else{
                this.$refs.tagComponentTableMain.style.left = left - this.itemWidth  + 'px'
            }
            this.isDisabled()
        },
        goRight(){
            let left = this.$refs.tagComponentTableMain.offsetLeft
            if(Math.abs(this.$refs.tagComponentTableMain.offsetLeft) <= this.itemWidth){

                this.$refs.tagComponentTableMain.style.left = 0 + 'px'
                this.isRight = true
            }else{
                this.$refs.tagComponentTableMain.style.left = left + this.itemWidth  + 'px'
            }
            this.isDisabled()
        },
        isDisabled(){
                let left = this.$refs.tagComponentTableMain.offsetLeft
                let parent = this.$refs.tagComponentTable.offsetWidth
                let box = this.$refs.tagComponentTableMain.offsetWidth

                    if(left< 0){
                        this.isLeft = false
                    }else{
                        this.isLeft = true
                    }

                    if(box <= parent){
                        this.isRight = true
                    }else if(Math.abs(left) + parent >= box){
                        this.isRight = true
                    }else{
                        this.isRight = false
                    }
        },
        tagItem(index){
            if(this.apiActiveIndex != index){
                this.$store.commit('ApiList/setApiActiveIndex',index)
            }
        },
        closeTag(item,index){
            if(item.isSave && item.isSave > 0  && this.isAuthInfo && this.isAuthInfo.auth && this.isAuthInfo.auth.auth == 2){
                    ElMessageBox.confirm(
                    "(" + `<span style='color:red;'>${item.apiName}</span>` + ')接口未保存，是否保存?',
                    '警告',
                    {
                    confirmButtonText: '去保存',
                    cancelButtonText: '不保存',
                    type: 'warning',
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    dangerouslyUseHTMLString: true,
                    }
                )
                    .then(() => {
                        // this.$router.replace('/project')
                    })
                    .catch(() => {
                        this.$store.commit('ApiList/closeOptionItem',index)
                    })
            }else{
                this.$store.commit('ApiList/closeOptionItem',index)
            }
        }
    },
    computed: {
        apiList(){
             return this.$store.state.ApiList.apiList
        },
        apiActiveIndex(){
            return this.$store.state.ApiList.apiActiveIndex
        },
        isAuthInfo(){
            return this.$store.state.ApiList.isAuthInfo
        }
    },
    watch: {
        apiList:{
            handler(news){
                if(news.length == 0){
                    this.$store.commit('ApiList/addOptionItem')
                }
                this.$nextTick(()=>{
                    this.getTageWidth()
                })
            },
            deep: true,
            immediate: true
        },
        apiActiveIndex: {
            handler(news){
                this.$nextTick(()=>{
                    let item = this.$refs['tagComponentItem' + news]
                    if(item){
                        if(item.offsetLeft > this.parentWidth - this.itemWidth){
                    
                            this.$refs.tagComponentTableMain.style.left = -(item.offsetLeft - this.parentWidth + this.itemWidth)  + 'px'
                            this.isDisabled()
                            
                        }
                    }
                })
                
                
            },
            deep: true,
            immediate: true,
        },
    },
    components:{
        close
    },
    beforeUnmount(){
      window.onresize = null;
    }
}
</script>

<style scoped>
.tagComponent{
    width: 100%;
    height: 100%;
    /* background: yellow; */
    /* border-top: 1px solid #DCDFE6; */
    /* border-right: 1px solid #DCDFE6; */
    border-left: 1px solid #DCDFE6;
    border-radius: 3px;
    /* overflow: hidden; */
    display: flex;
}
.tagComponentItem{
    width: 180px;
    height: 100%;
    background: #f5f5f5;
    border-top: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    padding-right: 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
}
.tagComponentItemText{
    width: calc(100% - 40px);
    height: 100%;
    /* background: #CAC6C6; */
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    line-height: 38px;
    font-size: 12px;
    color: #666;
    cursor: pointer;
}
.tagComponentItemSave{
    width: 20px;
    height: 100%;
    /* background: #DCDFE6; */
    display: flex;
    justify-content: center;
    align-items: center;
}
.tagComponentItemSaveIcon{
    width: 10px;
    height: 10px;
    display: inline-block;
    background: #2084FF;
    border-radius: 50%;
}
.tagComponentItemClose{
    width: 20px;
    height: 100%;
    /* background: #CAC6C6; */
    display: flex;
    justify-content: center;
    align-items: center;
}
.tagComponentItemCloseBox{
    width: 20px;
    height: 20px;
    
    border-radius: 2px;
    text-align: center;
    line-height: 20px;
    text-align: center;
}
.tagComponentItemCloseBox span{
    font-size: 10px;
    display: inline-block;
    transform: scale(0.75);
    display: none;
    color: #898989;
}
.tagComponentItemCloseBox:hover{
    background: rgba(202,198,198, 0.7);
}
.tagComponentItemCloseBox:hover span{
    
    display: block;
}

.tagComponentItemCloseBoxActive span{
    display: block;
}

.tagComponentItemLeft{
    width: 40px;
    height: 100%;
    /* background: #DCDFE6; */
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    border-right: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    box-sizing: border-box;
}
.tagComponentItemLeft:hover{
    background: rgba(217,217,218, 0.3);
}
.tagComponentItemLeft span{
    transform: rotate(180deg);
}
.tagComponentItemRight{
    width: 40px;
    height: 100%;
    /* background: #DCDFE6; */
    text-align: center;
    line-height: 38px;
    cursor: pointer;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    box-sizing: border-box;
    border-radius: 0 3px 0 0 ;
}
.tagComponentItemRight:hover{
    background: rgba(217,217,218, 0.3);
}
.tagComponentTable{
    width: calc(100% - 80px);
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -ms-overflow-style: none; 
    overflow: '-moz-scrollbars-none';
    scrollbar-width: none;
    position: relative;
}
.tagComponentTableMain{
    width: auto;
    height: 100%;
    display: flex;
    transition: all 0.5s;  
    position: absolute;
    top: 0;
    left: 0px;
    transition: all 0.5s;
    user-select: none;
}
.tagComponentTable::-webkit-scrollbar {
    display: none; 
    height: 0 !important ; 
}

.tagComponentItemDisabled{
    cursor: not-allowed;
    /* background: #DCDFE6; */
    opacity: 0.7;
}
.tagComponentItemDisabled:hover{
    opacity: 0.7;
    background: #fff;
}

.tagComponentItemActive{
    color: #2084FF;
    border-top: 1px solid #DCDFE6;
    background: #fff;
}
.tagComponentItemActive .tagComponentItemText{
    color: #2084FF;
}
</style>
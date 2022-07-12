<template>
<!-- 接口文件夹 -->
    <div class="indexList" v-for="(item) in listData" :key="item.uuid">
        <template v-if="item.type == 'folder' ">
            <div class="IndexListItself"
                :style="{paddingLeft: (zIndex * 10 + 5) + 'px'}"
                :class="activeFile.uuid == item.uuid && 'IndexListItselfActive'"
                >
                <div class="IndexListItselfIcon" @click="tagItem(item)">
                    <span class="iconfont icon-wenjian"></span>
                </div>
                <div class="IndexListItselfName" @click="tagItem(item)">
                    {{item.foldername}}
                </div>
                <div class="IndexListItselfIcon" style="text-align: right;">
                    <!-- <span class="iconfont icon-yuandiancaidan"></span> -->
                    <el-dropdown @command="fileHandleData">
                        <span class="iconfont icon-yuandiancaidan el-dropdown-link">
                        </span>
                        <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item :command="'api-|-' + item.uuid">新建接口</el-dropdown-item>
                            <el-dropdown-item divided :command="'add-|-' + item.uuid ">新建子目录</el-dropdown-item>
                            <el-dropdown-item divided :command="'rename-|-' + item.uuid + '-|-' + item.foldername">目录重命名</el-dropdown-item>
                            <el-dropdown-item :command="'remove-|-' + item.uuid + '-|-' + item.foldername">删除目录</el-dropdown-item>
                        </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
                <div class="IndexListItselfIcon"  style="text-align: right;" @click="tagItem(item)">
                    <span class="iconfont icon-xiangyou"
                        :style="{transform: openData.includes(item.uuid) ? 'rotate(90deg)' : 'rotate(0deg)'}"></span>
                </div>
            </div>
            <div class="indexListChildren" v-if="item.children">
                <el-collapse-transition>
                    <div v-show="openData.includes(item.uuid)">
                        <IndexList :listData='item.children' 
                        :zIndex='zIndex + 1'
                        :openData='openData'
                        :activeFile="activeFile"
                        ></IndexList>
                    <div class="indexListChildrenErty" v-if="item.children.length == 0">
                        暂无数据
                    </div>
                    </div>
                </el-collapse-transition>
                
                
                <!-- <IndexItem></IndexItem> -->
            </div>
        </template>
        
        <template v-else>
            <IndexItem :itemData="item" :zIndex='zIndex + 1'></IndexItem>
        </template>
    </div>
</template>

<script>
import IndexItem from './IndexItem.vue'

export default {
    name: 'IndexList',
    props: {
        listData: {
            type: Array,
            default: []
        },
        openData: {
            type: Array,
            default: []
        },
        activeFile: {
            type: Object,
            default: {}
        },
        zIndex: {
            type: Number,
            default: 0
        }
    },
    inject: ['fileHandleData','tagItem'],
    methods: {
        
    },
    components: {
        IndexItem
    }
}
</script>

<style scoped>
.indexList{
    width: 100%;
    height: auto;
    /* overflow-x: hidden; */
}
.IndexListItself{
    width: 100%;
    height: 35px;
    /* background: yellow; */
    display: flex;
    cursor: pointer;
    padding-right: 5px;
    box-sizing: border-box;
    border-radius: 3px;
    
}
.IndexListItself:hover{
    background: rgba(214,217,220, 0.5);
}
.IndexListItselfActive{
    background: #1387FB;
    color: #fff;
}
.IndexListItselfActive .IndexListItselfIcon span{
    color: #fff;
}
.IndexListItselfActive .IndexListItselfName{
    color: #fff;
}
.IndexListItselfActive:hover{
    background: #1387FB;
}
.IndexListItselfIcon{
    width: 25px;
    height: 35px;
    /* background: blanchedalmond; */
    line-height: 35px;
}
.IndexListItselfIcon span{
    font-size: 16px;
    color: #88A0CD;
    display: inline-block;
    transition: all 0.5s;
}
.IndexListItselfName{
    width: calc(100% - 75px);
    height: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    line-height: 35px;
    font-size: 12px;
    color: #929293;
}
.indexListChildren{
    width: 100%;
    height: auto;
    box-sizing: border-box;
}

.indexListChildrenBox{
    height: 0;
}
.indexListChildrenBoxActive{
    width: 100%;
    height: auto;
}

.indexListChildrenErty{
    width: 100%;
    height: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 12px;
    color: #666666;
}
</style>
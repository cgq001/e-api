<template>
<!-- 携带头部的主页 -->
    <div class="indexIndex">
        <!-- 头部 -->
        <div class="indexIndexHeader">
            <IndexHeaders></IndexHeaders>
        </div>
        <!-- 主内容 -->
        <div class="indexIndexMain">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import IndexHeaders from './components/Header.vue'
export default {
    data(){
        return {

        }
    },
    components:{
        IndexHeaders
    }
}
</script>

<style scoped>
.indexIndex{
    width: 100%;
    height: 100%;
    /* background: yellowgreen; */
}
.indexIndexHeader{
    width: 100%;
    height: 50px;
    /* background: yellowgreen; */
}
.indexIndexMain{
    width: 100%;
    height: calc(100% - 50px);
    /* background: yellow; */
}
</style>
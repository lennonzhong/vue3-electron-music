<template>
    <div class="layout-wrap">
        <layout-header></layout-header>
        <div class="content">
            <layout-aside class="left-aside"></layout-aside>
            <layout-content class="right-content"></layout-content>
        </div>
        <music-controls></music-controls>
    </div>
</template>

<script setup>
import LayoutHeader from "./../components/Header/index.vue";
import LayoutAside from "./../components/Aside/index.vue"
import LayoutContent from "./../components/Content/index.vue"
import MusicControls from "../components/MusicControls/index.vue"
</script>

<style lang="less" scoped>
.layout-wrap {
    width: 100%;
    height: 100%;
    .content{
        height: calc(100% - 130px);
        display: flex;
        .left-aside{
            flex: 0 0 196px;
            border-right: 1px solid var(--border-color);
        }
        .right-content{
            flex: 1 1;
        }
    }
}
</style>
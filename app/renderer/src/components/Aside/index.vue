<template>
    <div class="aside-wrap">
        <ul class="menu-list">
            <li :class="{ 'active': route.path === '/search' }" @click="hangleMenu('/search')" class="menu-item"><i
                    class="iconfont icon-search-list"></i>发现音乐</li>
            <li :class="{ 'active': route.path === '/song-list' }" @click="hangleMenu('/song-list')" class="menu-item">
                <i class="iconfont icon-song-list"></i>歌单
            </li>
            <li :class="{ 'active': route.path === '/collect' }" @click="hangleMenu('/collect')" class="menu-item"><i
                    class="iconfont icon-collect"></i>我的收藏</li>
            <li :class="{ 'active': route.path === '/rank' }" @click="hangleMenu('/rank')" class="menu-item"><i
                    class="iconfont icon-rank"></i>排行榜</li>
            <li :class="{ 'active': route.path === '/download' }" @click="hangleMenu('/download')" class="menu-item"><i
                    class="iconfont icon-download"></i>本地下载</li>
        </ul>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"

const route = useRoute();
const router = useRouter();

console.log(route.path);

const hangleMenu = (path) => {
    router.push({
        path
    })
}
</script>

<style lang="less" scoped>
.aside-wrap {
    width: 100%;
    padding-top: 30px;

    .menu-list {
        width: 100%;
        padding: 0 20px;

        .menu-item {
            font-size: 14px;
            list-style: none;
            cursor: pointer;
            margin-bottom: 10px;
            color: rgba(0, 0, 0, 0.8);

            &:hover,
            &.active {
                background-color: rgba(255, 255, 255, 0.2);
                color: var(--primary-color);
            }

            i {
                display: inline-block;
                width: 24px;
                height: 24px;
                font-size: 18px;
            }
        }
    }
}
</style>
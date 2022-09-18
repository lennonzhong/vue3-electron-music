<template>
    <div class="header">
        <div class="header-left">
            <div class="logo">
                <img :src="Logo" alt="">
            </div>
            <div class="title">爱听音乐</div>
        </div>

        <div class="header-right">
            <div class="search-text">
                <el-input v-model="searchText" placeholder="search" @input="handleInput" :prefix-icon="Search" />
            </div>

            <div class="app-actions">
                <span class="iconfont icon-minimize" @click="handleOpt('minimize')"></span>
                <span class="iconfont " :class="isFullScreen ? 'icon-maximize-normal' : 'icon-maximize'"
                    @click="handleOpt('maximize')"></span>
                <span class="iconfont icon-close" @click="handleOpt('close')"></span>
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from "../../assets/images/logo.svg"
import { Search } from '@element-plus/icons-vue'
import { ref } from "vue"
import { debounce } from "lodash";
import { useSongList } from "../../stores/songList"

const { ipcRenderer } = require("electron")

const searchText = ref('')
const isFullScreen = ref(false)
const songListInfo = useSongList()

const handleInput = (text) => {
    searchText.value = text;
    handleSearch(text);
}

const handleSearch = debounce((text) => {
    if (!text) return
    // 分路由讨论
    // 歌曲页面 搜歌曲
    songListInfo.getSongList(text, 1);

    // 歌单页面


    // 排行榜

    // 收藏
}, 1000)


const handleOpt = (type) => {
    ipcRenderer.send(type)
    if (type == 'maximize') {
        isFullScreen.value = !isFullScreen.value
    }
}
</script>

<style lang="less" scoped>
.logo {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: white;

    img {
        width: 25px;
    }
}

.header-left {
    display: flex;
    line-height: 30px;
    width: 180px;

    .title {
        margin-left: 10px;
        letter-spacing: 2px;
        color: white;
        font-weight: bold;
        font-size: 16px;
    }
}

.header-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;


    .search-text {
        -webkit-app-region: no-drag;

        :deep(.el-input) {
            color: white;
            border-radius: 16px;
            border: none;
            background-color: rgba(0, 0, 0, 0.1);
            overflow: hidden;

            .el-input__wrapper {
                background-color: rgba(0, 0, 0, 0.1);
                border-radius: 16px;
                border: none;
                box-shadow: none;

                &.is-focus {
                    box-shadow: none;
                }
            }

            .el-input__inner {
                color: #efdcdc;
            }
        }
    }

    .app-actions {
        width: 120px;
        height: 30px;
        display: flex;
        -webkit-app-region: no-drag;

        .iconfont {
            color: white;
            cursor: pointer;
            flex: 1;
            display: inline-block;
            font-size: 16px;
            text-align: center;
            line-height: 30px;
        }
    }


}

.header {
    -webkit-app-region: drag;
    height: 60px;
    background-color: var(--primary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}
</style>
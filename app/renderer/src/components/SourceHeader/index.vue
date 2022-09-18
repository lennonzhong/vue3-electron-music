<template>
    <div class="source-wrap">
        <ul>
            <template v-for="item,key in MusicSource">
                <li class="source-item" :class="{active: key === activeKey}" @click="handleActive(key)">
                    {{item}}
                </li>
                <li class="gap" v-if="key != 'taihe'"></li>
            </template>
        </ul>
    </div>
</template>
<script setup>
import { ref } from "vue"
import { MusicSource } from "./../../music";
import { useAppConfig } from "../../stores/appConfig"
import { useSongList } from "../../stores/songList"

const app_config = useAppConfig();
const songListInfo = useSongList()

window.app_config = app_config
let activeKey = ref(app_config.platform);

const handleActive = (key) => {
    activeKey.value = key;
    app_config.setPlatform(key);
    songListInfo.changePage(1);
    if (songListInfo.searchText) {
        songListInfo.getSongList(songListInfo.searchText, 1);
    }
}

</script>

<style lang="less">
.source-wrap {
    ul {
        list-style: none;
        display: flex;
        align-items: center;

        .source-item {
            display: inline-block;
            color: #a9a9a9;
            cursor: pointer;
            font-size: 14px;
            border-bottom: solid 1px transparent;

            &.active {
                color: #323232;
                border-bottom: solid 1px #323232;
            }
        }

        .gap {
            display: inline-block;
            background: #a9a9a9;
            height: 12px;
            width: 1px;
            margin: 0 10px;
        }
    }
}
</style>
<template>
    <div class="song-list-wrap" v-loading.lock="songListInfo.loading" target="song-list-wrap">
        <el-empty v-if="songListInfo.songList.length<1" description="暂无数据哦" style="margin-top: 50px;" />
        <template v-else>
            <el-table :data="songListInfo.songList" stripe>
                <el-table-column prop="title" label="歌曲名" show-overflow-tooltip width="240" />
                <el-table-column prop="artist" label="歌手" show-overflow-tooltip width="180" />
                <el-table-column prop="album" label="专辑" show-overflow-tooltip width="200" />
                <el-table-column prop="options" label="操作" :min-width="120">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="handleSongClick(scope.row)">
                            <span class="iconfont icon-listen" style="font-size: 18px;"></span>
                        </el-button>
                        <el-button link type="primary" size="small">
                            <span class="iconfont icon-favorite" @click="handleRemoveCollect(scope.row)"
                                v-if="scope.row.collect"></span>
                            <span class="iconfont icon-favorite-blank" @click="handleAddCollect(scope.row)"
                                v-else></span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="songListInfo.total" :page-size="20" :small="true"
                :background="true" :current-page="songListInfo.curpage" class="table-pagination"
                @current-change="handleCurrentChange" />
        </template>
    </div>
</template>

<script setup>
import { useAppConfig } from "../../stores/appConfig";
import { useSongList } from "../../stores/songList";

const songListInfo = useSongList();
const { ipcRenderer } = require("electron");
const appConfig = useAppConfig();

const emits = defineEmits(['currentPageChange'])

const handleCurrentChange = (page) => {
    emits('currentPageChange', page)
}

const handleSongClick = (song) => {
    appConfig.setPlayStatus(false)
    songListInfo.setPlaySong(song)
}

const handleAddCollect = async (songItem) => {
    songListInfo.addCollectSingle(songItem);
    await ipcRenderer.invoke("add-collect", {
        ...songItem,
        collect: true
    });
}
const handleRemoveCollect = () => {

}

</script>


<style lang="less" scoped>
.song-list-wrap {
    overflow: hidden;
    overflow-y: auto;
    max-height: 100%;
}

.table-pagination {
    margin-top: 15px;
}
</style>
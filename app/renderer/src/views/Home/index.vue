<template>
    <div class="home">
        <SourceHeader />
        <SongList @currentPageChange="handleCurrentPageChange" />
    </div>
</template>
<script setup>
import SourceHeader from "./../../components/SourceHeader/index.vue"
import SongList from "./../../components/SongList/index.vue"
import { onBeforeMount, onMounted } from "vue"
import { useSongList } from "../../stores/songList"
const songListInfo = useSongList()

const handleCurrentPageChange = (page) => {
    songListInfo.changePage(page)
}

onBeforeMount(() => {
    songListInfo.resetSongListPagination();
})

onMounted(() => {
    console.log(songListInfo.searchText);
    if (songListInfo.searchText) {
        songListInfo.getSongList(songListInfo.searchText, 1);
    }
})
</script>

<style lang="less">
.home {
    width: 100%;
    overflow-x: hidden;
}
</style>
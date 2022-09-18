<template>
    <div class="collect-wrap">
        <SongList @currentPageChange="handleCurrentPageChange" />
    </div>
</template>
<script setup>
import SongList from "./../../components/SongList/index.vue"
import { onMounted, onBeforeMount, ref } from "vue"
import { useSongList } from "../../stores/songList"
const songListInfo = useSongList()

let curpage = ref(1);

const handleCurrentPageChange = (page) => {
    curpage.value = page;
    sliceList();
}

const sliceList = () => {
    let startIndex = (curpage.value - 1) * 20
    let data = (songListInfo.collectList || []).slice(startIndex, startIndex + 20);
    songListInfo.setPaginationInfo({
        total: songListInfo.collectList.length,
        songList: data
    })
}

onBeforeMount(() => {
    songListInfo.resetSongListPagination();
})

onMounted(() => {
    sliceList();
})
</script>

<style lang="less">
.home {
    width: 100%;
    overflow-x: hidden;
}
</style>
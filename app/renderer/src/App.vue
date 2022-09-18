<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useSongList } from "./stores/songList"
const { ipcRenderer } = require("electron")
const songInfo = useSongList();

onMounted(async () => {
  let data = await ipcRenderer.invoke("get-collect");
  songInfo.setCollectList([...data]);
  songInfo.setCurrentPlayList([...data]);
  if (data.length) {
    songInfo.setCurrentPlaySong(data[0])
  }
})
</script>

<template>
  <RouterView />
</template>

<style lang="less">
div#app {
  height: 100vh;
  padding: 0;
}
</style>

<style lang="less">
body {
  position: relative;

  // &::before {
  //   top: 0;
  //   z-index: -1;
  //   left: 0;
  //   position: absolute;
  //   content: '';
  //   display: block;
  //   width: 100%;
  //   height: 100%;
  //   background: url("./assets/bh.jpg") no-repeat center center;
  //   background-size: cover;
  //   filter: brightness(0.3);
  // }

  // #app {
  //   background-color: rgba(0, 0, 0, 0.2);
  // }
}
</style>
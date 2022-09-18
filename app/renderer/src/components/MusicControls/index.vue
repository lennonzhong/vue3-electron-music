<template>
    <div class="controls-wrap">
        <div class="song-info">
            <div class="song-pic">
                <img :src="songInfo.currentPlaySong.img_url" v-if="songInfo.currentPlaySong.img_url" alt=""
                    onerror="this.style.display='none'" onload="this.style.display='block'">
            </div>
            <div class="song-detail">
                <div class="song-name">{{songInfo.currentPlaySong.title}}</div>
                <div class="song-singer">{{songInfo.currentPlaySong.artist || '未知'}}</div>
            </div>
        </div>
        <div class="song-controls">
            <div class="controls">
                <div class="play-btns">
                    <span class="iconfont icon-previous" @click="playPrev"></span>
                    <span class="iconfont icon-pause" @click="togglePlayStatus" v-if="appConfig.playStatus"></span>
                    <span class="iconfont icon-play" @click="togglePlayStatus" v-else></span>
                    <span class="iconfont icon-next" @click="playNext"></span>
                </div>
                <div class="player-time-line">
                    <div class="progress-bar">
                        <div class="time-current">{{formatPlayTime(currentDuration)}}</div>
                        <div class="progress-content">
                            <span class="progress-drag iconfont icon-circle-fill"
                                :style="{left: `${progressBarLeft * 100 }%`}" @mousedown="hanleMouseDown"></span>
                            <div class="time-slider" ref="progressRef" @mousemove="handleMouseMove">
                                <div class="slider" :style="{ width: `${progressBarLeft * 100 }%` }">
                                </div>
                            </div>
                        </div>
                        <div class="time-total">{{formatPlayTime(totalDuration)}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="player-options">

            <span class="iconfont icon-song-list"></span>

            <span class="iconfont icon-favorite" @click="handleRemoveCollect"
                v-if="songInfo.currentPlaySong.collect"></span>
            <span class="iconfont icon-favorite-blank" @click="handleAddCollect" v-else></span>

            <el-popover placement="top" trigger="hover" popper-class="volumn-pop" :width="40">
                <template #reference>
                    <span class="iconfont icon-voice"></span>
                </template>
                <el-slider size="small" v-model="progress" vertical height="100px" @input="handleVolumnChange" />
            </el-popover>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, reactive } from 'vue';
import { useAppConfig } from "../../stores/appConfig"
import { createAudio, setResource } from "../../utils/player"
import { useSongList } from "../../stores/songList"
import { setPause, setPlay, setVolume, onEnded, onTimeupdate, getDuration, onLoadeddata, formatPlayTime, onPlaying, setCurrentTime, isEmpty } from "../../utils/player"
const { ipcRenderer } = require("electron")

const appConfig = useAppConfig();
// 音量
let progress = ref(100)

// 当前播放信息
const songInfo = useSongList()
const totalDuration = ref(0);
const currentDuration = ref(0);
const progressWidth = ref(0);
const progressRef = ref(null);

const progressBarLeft = computed(() => {
    return currentDuration.value / totalDuration.value
})

const playPrev = () => {
    let index = songInfo.currentPlayList.findIndex(item => { return item.id === songInfo.currentPlaySong.id })

    console.log(songInfo.currentPlayList);
    if (index < 0) {
        playIndexMusic(0)
    } else if (index == 0) {
        // 播放到最后一首
        playIndexMusic(songInfo.currentPlayList.length - 1)
    } else {
        // 在中间
        playIndexMusic(index - 1);
    }
}

const playNext = () => {
    onPlayEnd();
}

/**
 * 拖拽区
 */

const isMouseDown = ref(false);
const hanleMouseDown = () => {
    isMouseDown.value = true;
}

const handleMouseMove = (event) => {
    if (isMouseDown.value) {
        let boundPos = progressRef.value.getBoundingClientRect()
        if (event.pageX >= boundPos.left && event.pageX <= boundPos.right) {
            let diffX = event.pageX - boundPos.left;
            let currentTime = diffX / progressWidth.value * totalDuration.value;
            currentDuration.value = currentTime
        }
    }
}

const handleMouseUp = () => {
    if (isMouseDown.value) {
        setCurrentTime(currentDuration.value)
    }
    isMouseDown.value = false
}

const togglePlayStatus = () => {
    if (!songInfo.currentPlaySong.id) {
        return
    }
    if (appConfig.playStatus) {
        setPause()
    } else {
        if (songInfo.currentPlaySong.url) {
            if (isEmpty()) {
                setResource(songInfo.currentPlaySong.url)
            }
            setPlay()
        } else {
            songInfo.setPlaySong(songInfo.currentPlaySong)
        }
    }
    appConfig.setPlayStatus(!appConfig.playStatus);
}

const handleVolumnChange = (val) => {
    setVolume(val / 100)
}

function onPlayEnd() {
    appConfig.setPlayStatus(false);
    let index = songInfo.currentPlayList.findIndex(item => { return item.id === songInfo.currentPlaySong.id })
    // 不在当前播放列表
    if (index < 0) {
        playIndexMusic(0)
    } else if (index == songInfo.currentPlayList.length - 1) {
        // 播放到最后一首歌
        playIndexMusic(0)
    } else {
        // 在中间
        playIndexMusic(index + 1);
    }
}

const playIndexMusic = (index) => {
    console.log(index);
    setPause();
    let songItem = songInfo.currentPlayList[index];
    console.log(songItem, '====> item');
    if (songItem.url) {
        setResource(songItem.url)
        setPlay()
        songInfo.setCurrentPlaySong(songItem)
        appConfig.setPlayStatus(true);
    } else {
        songInfo.setPlaySong(songItem)
    }
}


function handleOnTimeUpdate(event) {
    if (isMouseDown.value) {
        return;
    }
    currentDuration.value = event.path[0].currentTime
}

function handleLoadedEnd() {
    let duration = getDuration();
    totalDuration.value = duration;
}

function handleOnPlaying() {
    let duration = getDuration();
    totalDuration.value = duration
}

const handleAddCollect = async () => {
    songInfo.addCollectSingle(songInfo.currentPlaySong);
    let result = await ipcRenderer.invoke("add-collect", {
        ...songInfo.currentPlaySong,
        collect: true
    });
    console.log(result);
}
const handleRemoveCollect = () => {

}

onMounted(() => {
    createAudio();
    onEnded(onPlayEnd)
    onLoadeddata(handleLoadedEnd)
    onTimeupdate(handleOnTimeUpdate)
    onPlaying(handleOnPlaying);

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mousemove", handleMouseMove);

    let width = progressRef.value.clientWidth;
    progressWidth.value = width;
})

</script>


<style lang="less" scoped>
.controls-wrap {
    height: 70px;
    border-top: 1px solid var(--border-color);
    padding: 0 20px;
    display: flex;
    align-items: center;

    .song-info {
        height: 100%;
        max-width: 300px;
        display: flex;
        align-items: center;
        flex-basis: 300px;

        .song-pic {
            overflow: hidden;
            border-radius: 4px;
            background: url(../../assets/images/album_default.png);
            background-size: contain;
            width: 40px;
            height: 40px;
            min-width: 40px;

            img {
                border-radius: 4px;
                width: 40px;
                height: 40px;
            }
        }

        .song-detail {
            margin-left: 10px;
            flex: 1 1;
            max-width: calc(100% - 40px);

            .song-name {
                font-size: 14px;
                color: var(--text-default-color);
                min-width: 0px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .song-singer {
                color: var(--text-subtitle-color);
                font-size: 12px;
                min-width: 0px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

    }

    .song-controls {
        flex: 1;

        .controls {
            padding: 4px 0;

            .play-btns {
                display: flex;
                justify-content: center;

                span {
                    font-size: 24px;
                    margin: 0 10px;
                    font-weight: 300;
                    cursor: pointer;
                }
            }
        }

        .player-time-line {
            padding: 0 30px;

            .progress-bar {
                display: flex;
                align-items: center;
            }

            .time-current,
            .time-total {
                flex: 0 0 60px;
                text-align: center;
                user-select: none;
            }

            .progress-content {
                flex: 1 1;
                height: 10px;
                position: relative;
                align-items: center;
                color: var(--primary-color);

                &:hover {
                    .progress-drag {
                        display: block;
                    }
                }

                .progress-drag {
                    display: none;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    font-size: 10px;
                    cursor: pointer;
                    transform: translateX(-50%);
                }

                .time-slider {
                    height: 4px;
                    margin-top: 3px;
                    background-color: #e0e0e0;
                    position: relative;
                    border-radius: 2px;
                    overflow: hidden;

                    .slider {
                        border-radius: 2px;
                        position: absolute;
                        height: 100%;
                        background-color: var(--primary-color);
                    }
                }
            }
        }

    }

    .player-options {
        flex: 0 0 200px;
        justify-content: flex-end;
        align-items: center;
        display: flex;

        span {
            cursor: pointer;
            font-size: 18px;
            margin: 0 8px;
            color: var(--text-default-color);
        }
    }
}
</style>

<style lang="less">
.volumn-pop.el-popover.el-popper {
    min-width: 20px;
    padding: 4px 0px;
    padding-top: 10px;
}
</style>
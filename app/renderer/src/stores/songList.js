import { defineStore } from 'pinia'
import apis from "./../music/index"
import { useAppConfig } from "./appConfig"
import { setResource, setPlay } from "../utils/player"
export const useSongList = defineStore({
    id: "songList",
    state: () => ({
        songList: [],
        loading: false,
        total: 0,
        curpage: 1,
        searchText: '',
        currentPlaySong: {},
        currentPlayList: [],
        collectList: []
    }),
    actions: {
        async getSongList(searchText, curpage) {
            this.searchText = searchText || this.searchText;
            if (!this.searchText) {
                return;
            }
            this.loading = true;
            this.songList = [];
            try {
                let platform = useAppConfig().platform;
                let result = await apis[platform].search(`/search?keywords=${searchText}&curpage=${curpage}`)
                this.songList = result.lists;
                this.total = result.total
                this.loading = false;
            } catch (error) {
                console.log(error)
                this.loading = false;
            }
        },
        changePage(curpage) {
            if (curpage === this.curpage) {
                return
            }
            this.curpage = curpage;
            this.getSongList(this.searchText, curpage)
        },
        setCurrentPlaySong(song) {
            this.currentPlaySong = song;
        },
        async setPlaySong(song) {
            try {
                let result = await apis[song.source || useAppConfig().platform].bootstrap_track(song)
                if (result.url) {
                    let songInfo = {
                        ...song,
                        ...result
                    }
                    this.setCurrentPlaySong(songInfo)

                    let index = this.currentPlayList.findIndex(item => item.id == song.id)
                    if (index > -1) {
                        this.currentPlayList[index] = songInfo
                    } else {
                        this.currentPlayList.push(songInfo);
                    }
                    setResource(result.url);
                    setPlay();
                    useAppConfig().setPlayStatus(true)
                }
            } catch (error) {
                console.log(error);
            }
        },
        setCurrentPlayList(list) {
            this.currentPlayList = list;
        },
        setCollectList(list) {
            this.collectList = list;
        },
        async addCollectSingle(song = {}) {
            if (!song.id || song.collect) {
                return;
            }
            song.collect = true
            this.collectList.push(song);
        },
        resetSongListPagination() {
            this.total = 0;
            this.curpage = 1;
            this.songList = [];
        },
        setPaginationInfo(info) {
            let { songList, total } = info;
            if (songList) {
                this.songList = songList;
            }
            if (total !== undefined) {
                this.total = total
            }
        }
    }
})
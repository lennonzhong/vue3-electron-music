import { defineStore } from 'pinia'

export const useAppConfig = defineStore({
  id: "useAppConfig",
  state: () => ({
    platform: 'kugou',
    playStatus: false,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    setPlatform(source) {
      this.platform = source
    },
    setPlayStatus(status) {
      this.playStatus = status
    }
  }
})

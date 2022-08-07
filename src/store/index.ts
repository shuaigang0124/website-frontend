import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: '',
    role: '',
    dailySharing: [],
  },
  // 同步方法
  mutations: {
    setUserId: (state, payLoad) => {
      state.userId = payLoad;
    },
    setRole: (state, payLoad) => {
      state.role = payLoad;
    },
    setDailySharing: (state, payLoad) => {
      state.dailySharing = payLoad;
    },
  },
  // 异步方法
  actions: {
  },
  getters: {
    userId: (state) => state.userId,
    role: (state) => state.role,
    dailySharing: (state) => state.dailySharing,
  },
  // 
  modules: {
  }
})

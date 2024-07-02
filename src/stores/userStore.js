import { defineStore } from 'pinia';

export const useUserStore = defineStore({
    id: 'userStore',
    state: () => ({
      user: null,
      token: null,
    }),
    getters: {
      getUser(state) {
        return state.user;
      },
      getToken(state) {
        return state.token;
      }
    },
    actions: {
      setUser(user) {
        this.user = user;
      },
      setToken(token) {
        this.token = token;
      }
    },
});
import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
  state: () => ({
    username: "" || useCookie('username').value,
    loginMsg: "",
    timeFormatter: new Intl.DateTimeFormat('ru-RU', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }),
  }),
  actions: {
    setUsername(name) {
      this.username = name
    },
    setLoginMsg(msg) {
      this.loginMsg = msg
    },
  },
  getters: {
    isLoggedIn: state => !!state.username,
  },
})

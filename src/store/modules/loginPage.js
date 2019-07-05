import axios from 'axios'
import { vm, API_URL } from '@/main'

export default {
  namespaced: true,
  state: {
    form: {},
    loader: false,
    textMessage: '',
    errorTextMessage: '',
    backendTextMessage: ''
  },
  getters: {
    form (state) {
      return state.form
    }
  },
  mutations: {
    LOADER_TOGGLE (state, payload) {
      state.loader = payload
    },
    UPLOAD_TEXT_MESSAGE (state, payload) {
      state.textMessage = payload
      setTimeout(() => {
        state.textMessage = ''
        state.form = {}
      }, 5000)
    },
    UPLOAD_ERROR_TEXT_MESSAGE (state, payload) {
      state.errorTextMessage = payload
      setTimeout(() => {
        state.errorTextMessage = ''
        state.form = {}
      }, 5000)
    },
    UPLOAD_BACKEND_MESSAGE (state, payload) {
      state.backendTextMessage = payload
      setTimeout(() => {
        state.backendTextMessage = ''
        state.form = {}
      }, 10000)
    },
    TO_THE_PAGE (state, payload) {
      vm.$router.push({ name: payload })
    }
  },
  actions: {
    onLogin ({ commit }, form) {
      commit('LOADER_TOGGLE', true)
      axios.post(API_URL + '/auth/login?username=' + form.username + '&password=' + form.password, {withCredentials: true})
        .then((response) => {
          commit('UPLOAD_TEXT_MESSAGE', 'Успешный вход.')
          commit('LOADER_TOGGLE', false)
          setTimeout(() => {
            commit('TO_THE_PAGE', 'Search')
          }, 1000)
        }).catch(error => {
          if (error.response.data.status === 400) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          }
          if (error.response.data.status !== 400) {
            commit('UPLOAD_ERROR_TEXT_MESSAGE', 'Ошибка входа.')
            commit('LOADER_TOGGLE', false)
          }
        })
    }
  }
}

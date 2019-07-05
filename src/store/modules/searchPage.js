import axios from 'axios'
import { vm, API_URL } from '@/main'

export default {
  namespaced: true,
  state: {
    loader: false,
    user: [],
    search: [],
    loadFirstTime: true,
    tableParams: {},
    searchForm: {
      certTypes: ['birth', 'death', 'perinatalDeath'],
      certSeries: {select: 'начинается'},
      certNumber: {select: 'начинается'},
      barcode: {},
      status: 'любое',
      signingDate: {select: '='},
      resolution: 'нет',
      lastName: {select: 'начинается'},
      firstName: {select: 'начинается'},
      middleName: {select: 'начинается'},
      birthDate: {select: '='},
      page: 0
    },
    resolutionOptions: [
      {id: 0, name: 'нет'},
      {id: 1, name: 'Отозвано'},
      {id: 2, name: 'Проверено'}
    ],
    statusOptions: [
      {id: 1, name: 'любое'},
      {id: 2, name: 'оформлено'},
      {id: 3, name: 'проверено'},
      {id: 4, name: 'черновик'},
      {id: 5, name: 'на утверждение'}
    ],
    searchOptions: [
      {id: 1, name: 'начинается'},
      {id: 2, name: 'содержит'},
      {id: 3, name: '='}
    ],
    searchOptions2: [
      {id: 1, name: '='},
      {id: 2, name: 'от/до'},
      {id: 3, name: '<'},
      {id: 4, name: '>'}
    ],
    /* Роли */
    userRoles: [],
    adminRole: null,
    birthCreatorRole: null,
    deathCreatorRole: null,
    perinatalDeathCreatorRole: null,
    miacRole: null,
    printerRole: null,
    unknownBodyRole: null,
    signerRole: null,
    moSelectorRole: null
    /* END Роли */
  },
  getters: {},
  mutations: {
    HIDE_LOAD_FIRST_TIME (state) {
      state.loadFirstTime = false
    },
    DELETE_USER_DATA (state) {
      state.user = []
      state.search = []
      state.loadFirstTime = true
      state.adminRole = null
      state.birthCreatorRole = null
      state.deathCreatorRole = null
      state.perinatalDeathCreatorRole = null
      state.miacRole = null
      state.printerRole = null
      state.unknownBodyRole = null
      state.signerRole = null
      state.moSelectorRole = null
    },
    UPLOAD_USER_DATA (state, payload) {
      state.user = payload
      state.userRoles = payload.authorities
      state.userRoles.forEach(function (item) {
        if (item.authority === 'ROLE_ADMIN') {
          state.adminRole = true
        }
        if (item.authority === 'ROLE_BIRTH_CREATOR') {
          state.birthCreatorRole = true
        }
        if (item.authority === 'ROLE_DEATH_CREATOR') {
          state.deathCreatorRole = true
        }
        if (item.authority === 'ROLE_PERINATAL_CREATOR') {
          state.perinatalDeathCreatorRole = true
        }
        if (item.authority === 'ROLE_MIAC') {
          state.miacRole = true
        }
        if (item.authority === 'ROLE_ISSUER') {
          state.printerRole = true
        }
        if (item.authority === 'ROLE_UNKNOWN_BODY_ISSUER') {
          state.unknownBodyRole = true
        }
        if (item.authority === 'ROLE_SIGNER') {
          state.signerRole = true
        }
        if (item.authority === 'ROLE_MO_SELECTER') {
          state.moSelectorRole = true
        }
        /* NEW (NOT CONNECT) */
        /* ROLE_DEATH_REASON_CODER */
      })
    },
    CLEAR_CERT_TYPES (state) {
      state.search = []
      state.searchForm = {
        certTypes: ['birth', 'death', 'perinatalDeath'],
        certSeries: {select: 'начинается'},
        certNumber: {select: 'начинается'},
        barcode: {},
        status: 'любое',
        signingDate: {select: '='},
        resolution: 'нет',
        lastName: {select: 'начинается'},
        firstName: {select: 'начинается'},
        middleName: {select: 'начинается'},
        birthDate: {select: '='},
        page: 0
      }
    },
    LOADER_TOGGLE (state, payload) {
      state.loader = payload
    },
    SEARCH_TOGGLE (state, payload) {
      state.search = payload.content
      state.tableParams = payload
    },
    UPLOAD_PREV_CERTS (state, payload) {
      state.search.forEach((item, index) => {
        if (item.medCertId === payload.item.medCertId) {
          item.isShow = true
          for (let i in payload.data) {
            payload.data[i].isPrevCert = true
            payload.data[i].mainCert = payload.item.medCertId
            state.search.splice(index + 1, 0, payload.data[i])
          }
        }
      })
    },
    HIDE_AND_CLEAR_PREV_CERTS (state, payload) {
      state.search.forEach((item, index) => {
        if (item.medCertId === payload.item.medCertId) {
          item.isShow = !item.isShow
        }
        if (item.mainCert && item.mainCert === payload.item.medCertId) {
          state.search.splice(index)
        }
      })
    },
    TO_MAIN_PAGE (state, payload) {
      vm.$router.push({ name: payload })
    }
  },
  actions: {
    onUserCheck ({ commit }) {
      axios.get(API_URL + '/user/profile')
        .then((response) => {
          commit('UPLOAD_USER_DATA', response.data)
        }).catch(error => {
          if (error.response.data.status === 401) {
            commit('DELETE_USER_DATA')
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onFirstLoading ({ commit }, payload) {
      const postData = payload
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/searchMedCerts', postData, {headers: axiosConfig})
        .then((response) => {
          commit('SEARCH_TOGGLE', response.data)
          commit('HIDE_LOAD_FIRST_TIME')
        }).catch(error => {
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onSearch ({ commit }, payload) {
      commit('LOADER_TOGGLE', true)
      console.log('Searching...')
      const postData = payload
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/searchMedCerts', postData, {headers: axiosConfig})
        .then((response) => {
          commit('SEARCH_TOGGLE', response.data)
          commit('LOADER_TOGGLE', false)
        }).catch(error => {
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onPrevCert ({ commit }, payload) {
      axios.get(API_URL + '/rest/medCertsChain/' + payload.id)
        .then((response) => {
          commit('UPLOAD_PREV_CERTS', {'item': payload.item, 'data': response.data})
        }).catch(error => {
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onLogout ({ commit }) {
      commit('LOADER_TOGGLE', true)
      axios.get(API_URL + '/auth/logout', {withCredentials: true})
        .then((response) => {
          commit('LOADER_TOGGLE', false)
          commit('DELETE_USER_DATA')
          commit('TO_MAIN_PAGE', 'Login')
        }).catch(error => {
          commit('LOADER_TOGGLE', false)
          console.log(error.response.data.errors)
        })
    }
  }
}

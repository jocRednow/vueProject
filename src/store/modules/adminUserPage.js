import axios from 'axios'
import { vm, API_URL } from '@/main'

export default {
  namespaced: true,
  state: {
    loading: true,
    loader: false,
    message: '',
    /* Роли */
    currentUser: [],
    currentUserRoles: [],
    adminRole: null,
    birthCreatorRole: null,
    deathCreatorRole: null,
    perinatalDeathCreatorRole: null,
    miacRole: null,
    printerRole: null,
    unknownBodyRole: null,
    signerRole: null,
    /* END Роли */
    users: [],
    userForm: {},
    persons: [],
    personForm: {},
    departments: [],
    departmentForm: {},
    /* ADDRESSES */
    serverAddressRequest: [],
    serverCountriesRequest: [],
    serverSubRequest: [],
    serverRegionRequest: [],
    serverCityRequest: [],
    serverTownRequest: [],
    serverInnerTerritoryRequest: [],
    server65Request: [],
    server91Request: [],
    serverStreetRequest: [],
    serverHouseRequest: []
    /* END ADDRESSES */
  },
  getters: {
    userForm (state) {
      return state.userForm
    },
    personForm (state) {
      return state.personForm
    },
    departmentForm (state) {
      return state.departmentForm
    }
  },
  mutations: {
    UPLOAD_USER_DATA (state, payload) {
      state.currentUser = payload
      state.currentUserRoles = payload.authorities
      state.currentUserRoles.forEach(function (item) {
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
        /* NEW (NOT CONNECT) */
        /* ROLE_DEATH_REASON_CODER, ROLE_MO_SELECTER */
      })
    },
    CHANGE_LOADING_STATE (state, payload) {
      state.loading = payload
    },
    UPLOAD_MESSAGE (state, payload) {
      state.message = payload
      setTimeout(() => {
        state.message = ''
        vm.$router.push({ name: 'AdminForm' })
      }, 5000)
    },
    UPLOAD_USERS (state, payload) {
      state.users = payload
    },
    UPLOAD_USER (state, payload) {
      state.userForm = payload
    },
    UPLOAD_PERSONS (state, payload) {
      state.persons = payload
    },
    UPLOAD_PERSON (state, payload) {
      state.personForm = payload
    },
    UPLOAD_DEPARTMENTS (state, payload) {
      state.departments = payload
    },
    UPLOAD_DEPARTMENT (state, payload) {
      state.departmentForm = payload
    },

    TO_MAIN_PAGE (state, payload) {
      vm.$router.push({ name: payload })
    }
  },
  actions: {
    onCurrentUserGet ({ commit }) {
      axios.get(API_URL + '/user/profile')
        .then((response) => {
          if (response.status === 200) {
            commit('CHANGE_LOADING_STATE', false)
            commit('UPLOAD_USER_DATA', response.data)
          }
          if (response.status === 500) {
            commit('CHANGE_LOADING_STATE', true)
            commit('TO_MAIN_PAGE', 'Search')
          }
        }).catch(error => {
          commit('CHANGE_LOADING_STATE', true)
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    // USERS
    getAllUsers ({ commit }) {
      axios.get(API_URL + '/user/all')
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_USERS', response.data)
          }
        })
    },
    getEmptyUser ({ commit }) {
      axios.get(API_URL + '/user/empty')
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_USER', response.data)
          }
        })
    },
    getUser ({ commit }, data) {
      axios.get(API_URL + '/user/' + data)
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_USER', response.data)
          }
        })
    },
    postUser ({ commit }, form) {
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/user/save', postData, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_MESSAGE', 'Успешно.')
          } else {
            commit('UPLOAD_MESSAGE', 'Что-то пошло не так. Попробуйте ещё раз.')
          }
        }).catch(error => {
          console.log(error)
        })
    },
    // PERSONS
    getAllPersons ({ commit }) {
      axios.get(API_URL + '/security/person')
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_PERSONS', response.data)
          }
        })
    },
    getEmptyPerson ({ commit }) {
      axios.get(API_URL + '/security/emptyPerson')
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_PERSON', response.data)
          }
        })
    },
    getPerson ({ commit }, data) {
      axios.get(API_URL + '/security/person/' + data)
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_PERSON', response.data)
          }
        })
    },
    postPerson ({ commit }, form) {
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/security/person', postData, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_MESSAGE', 'Успешно.')
          } else {
            commit('UPLOAD_MESSAGE', 'Что-то пошло не так. Попробуйте ещё раз.')
          }
        }).catch(error => {
          console.log(error)
        })
    },
    // DEPARTMENTS
    getDepartments ({ commit }) {
      axios.get(API_URL + '/security/department')
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_DEPARTMENTS', response.data)
          }
        })
    },
    getEmptyDepartment ({ commit }) {
      axios.get(API_URL + '/security/emptyDepartment')
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_DEPARTMENT', response.data)
          }
        })
    },
    getDepartment ({ commit }, data) {
      axios.get(API_URL + '/security/department/' + data)
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_DEPARTMENT', response.data)
          }
        })
    },
    postDepartment ({ commit }, form) {
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/security/department', postData, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_MESSAGE', 'Успешно.')
          } else {
            commit('UPLOAD_MESSAGE', 'Что-то пошло не так. Попробуйте ещё раз.')
          }
        }).catch(error => {
          console.log(error)
        })
    },

  }
}

import Vue from 'vue'
import Vuex from 'vuex'
import 'es6-promise/auto'

import loginPage from './modules/loginPage'
import searchPage from './modules/searchPage'
import bornPage from './modules/bornPage'
import deathPage from './modules/deathPage'
import perinatalDeathPage from './modules/perinatalDeathPage'
import adminUserPage from './modules/adminUserPage'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    loginPage,
    searchPage,
    bornPage,
    deathPage,
    perinatalDeathPage,
    adminUserPage
  },
  strict: false
})

import axios from 'axios'
import { vm, API_URL } from '@/main'

export default {
  namespaced: true,
  state: {
    newFormMedCertId: null,
    form: {},
    stuff: {},
    loading: true,
    loader: false,
    resolutionType: [],
    warningTextMessage: '',
    draftTextMessage: '',
    textMessage: '',
    backendTextMessage: '',
    yearType: [],
    certKindType: [],
    usersOfCurrentUserOrganisations: [],
    currentUserDepartmentHead: [],
    serverRequest: [],
    serverOperationRequest: [],
    docType: [],
    deathLocationType: [],
    recordedDeathBasedType: [],
    eduType: [],
    familyStatus: [],
    emplState: [],
    gender: [],
    localityType: [],
    deathAccidentType: [],
    recordedDeathEmplType: [],
    fetusType: [],
    deathRoadAccidentStateType: [],
    deathPregnantStateType: [],
    countriesList: [],
    /* ADDRESSES */
    serverAddressRequest: [],
    serverCountriesRequest: [],
    serverAdminRegionRequest: [],
    serverSubRequest: [],
    serverRegionRequest: [],
    serverCityRequest: [],
    serverTownRequest: [],
    serverInnerTerritoryRequest: [],
    server65Request: [],
    server91Request: [],
    serverStreetRequest: [],
    serverHouseRequest: [],
    /* END ADDRESSES */
    allComments: [],
    placesList: []
  },
  getters: {
    form (state) {
      return state.form
    },
    stuff (state) {
      return state.stuff
    }
  },
  mutations: {
    UPLOAD_FORM (state, payload) {
      state.form = payload
    },
    CHANGE_LOADING_STATE (state, payload) {
      state.loading = payload
    },
    LOADER_TOGGLE (state, payload) {
      state.loader = payload
    },
    UPLOAD_RESOLUTION_TYPE (state, payload) {
      state.resolutionType = payload
    },
    UPLOAD_WARNING_TEXT_MESSAGE (state, payload) {
      state.warningTextMessage = payload
      setTimeout(() => {
        state.warningTextMessage = ''
      }, 5000)
    },
    UPLOAD_DRAFT_TEXT_MESSAGE (state, payload) {
      state.draftTextMessage = payload
      setTimeout(() => {
        state.draftTextMessage = ''
      }, 5000)
    },
    UPLOAD_TEXT_MESSAGE (state, payload) {
      state.textMessage = payload.textAnswer
      state.newFormMedCertId = payload.id
    },
    DELETE_TEXT_MESSAGE (state) {
      state.textMessage = ''
    },
    UPLOAD_BACKEND_MESSAGE (state, payload) {
      state.backendTextMessage = payload
      setTimeout(() => {
        state.backendTextMessage = ''
      }, 10000)
    },
    UPLOAD_YEAR_TYPE (state, payload) {
      state.yearType = payload
    },
    UPLOAD_CERT_KIND_TYPE (state, payload) {
      state.certKindType = payload
    },
    UPLOAD_ORG_USERS (state, payload) {
      state.usersOfCurrentUserOrganisations = payload
    },
    UPLOAD_DEP_HEAD (state, payload) {
      state.currentUserDepartmentHead = payload
    },
    UPLOAD_DOC_TYPE (state, payload) {
      state.docType = payload
    },
    UPLOAD_DEATH_LOCATION_TYPE (state, payload) {
      state.deathLocationType = payload
    },
    UPLOAD_RECORDED_DEATH_BASED_TYPE (state, payload) {
      state.recordedDeathBasedType = payload
    },
    UPLOAD_EDU_TYPE (state, payload) {
      state.eduType = payload
    },
    UPLOAD_FAMILY_STATUS (state, payload) {
      state.familyStatus = payload
    },
    UPLOAD_EMPL_STATE (state, payload) {
      state.emplState = payload
    },
    UPLOAD_GENDER_TYPE (state, payload) {
      state.gender = payload
    },
    UPLOAD_LOCALITY_TYPE (state, payload) {
      state.localityType = payload
    },
    UPLOAD_DEATH_ACCIDENT_TYPE (state, payload) {
      state.deathAccidentType = payload
    },
    UPLOAD_RECORDED_DEATH_EMPL_TYPE (state, payload) {
      state.recordedDeathEmplType = payload
    },
    UPLOAD_FETUS_TYPE (state, payload) {
      state.fetusType = payload
    },
    UPLOAD_DEATH_ROAD_ACCIDENT_TYPE (state, payload) {
      state.deathRoadAccidentStateType = payload
    },
    UPLOAD_DEATH_PREGNANT_STATE_TYPE (state, payload) {
      state.deathPregnantStateType = payload
    },
    UPLOAD_DEPT_STUFF (state, payload) {
      state.stuff = {
        deptPlace: payload.name,
        medOrg: null,
        address: payload.orgAddress,
        code: payload.code,
        codeBSME: payload.codeBSME
      }
    },
    UPLOAD_MED_ORG_STUFF (state, payload) {
      state.stuff = {
        deptPlace: null,
        medOrg: payload.name,
        address: payload.orgAddress,
        code: payload.code,
        codeBSME: payload.codeBSME
      }
    },
    SET_SAME_AS_MED_ORG (state, payload) {
      payload.addressType = 4
      vm.$set(state.form.medCertDeath.addresses, 1, payload)
    },
    SET_SAME_ADDRESSES (state) {
      let copyItem = Object.assign({}, state.form.medCertDeath.addresses[0])
      copyItem.addressType = 4
      vm.$set(state.form.medCertDeath.addresses, 1, copyItem)
    },
    UPLOAD_COUNTRIES (state, payload) {
      state.countriesList = payload
    },
    UPLOAD_ADMIN_REGION (state, payload) {
      state.serverAdminRegionRequest = payload
    },
    UPLOAD_DEATH_REASONS (state, payload) {
      state.serverRequest = payload
    },
    UPLOAD_OPERATION_REASONS (state, payload) {
      state.serverOperationRequest = payload
    },
    UPLOAD_ADDRESS_SEARCH_DATA (state, payload) {
      state.serverAddressRequest = payload
    },
    UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_0 (state, payload) {
      vm.$set(state.form.medCertDeath.addresses, 0, payload)
    },
    UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_1 (state, payload) {
      vm.$set(state.form.medCertDeath.addresses, 1, payload)
    },
    UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_2 (state, payload) {
      vm.$set(state.form.medCertDeath.addresses, 2, payload)
    },
    UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS (state, payload) {
      state.serverCountriesRequest = []
      state.serverSubRequest = []
      state.serverRegionRequest = []
      state.serverCityRequest = []
      state.serverTownRequest = []
      state.serverInnerTerritoryRequest = []
      state.server65Request = []
      state.server91Request = []
      state.serverStreetRequest = []
      state.serverHouseRequest = []
      state.serverCountriesRequest.push(payload.countryRegion)
      state.serverSubRequest.push(payload.aolevel1)
      state.serverRegionRequest.push(payload.aolevel3)
      state.serverCityRequest.push(payload.aolevel4)
      state.serverTownRequest.push(payload.aolevel6)
      state.serverInnerTerritoryRequest.push(payload.aolevel5)
      state.server65Request.push(payload.aolevel65)
      state.server91Request.push(payload.aolevel91)
      state.serverStreetRequest.push(payload.aolevel7)
      state.serverHouseRequest.push(payload.house)
    },
    UPLOAD_NEW_INNER_ADDRESS_SEARCH_DATA_PARAMS (state, payload) {
      if (payload.level === 0) state.serverCountriesRequest = payload.data
      if (payload.level === 1) state.serverSubRequest = payload.data
      if (payload.level === 3) state.serverRegionRequest = payload.data
      if (payload.level === 4) state.serverCityRequest = payload.data
      if (payload.level === 6) state.serverTownRequest = payload.data
      if (payload.level === 5) state.serverInnerTerritoryRequest = payload.data
      if (payload.level === 65) state.server65Request = payload.data
      if (payload.level === 91) state.server91Request = payload.data
      if (payload.level === 7) state.serverStreetRequest = payload.data
      if (payload.level === 100) state.serverHouseRequest = payload.data
    },
    TO_MAIN_PAGE (state, payload) {
      vm.$router.push({ name: payload })
    },
    UPLOAD_ALL_COMMENTS (state, payload) {
      state.allComments = payload
    },
    CHANGE_STATE_DUPLICATE (state, payload) {
      state.form.isDuplicate = payload
    },
    CHANGE_STATE_INSTEAD (state, payload) {
      state.form.insteadOf = payload
    },
    UPLOAD_ALL_PLACES (state, payload) {
      state.placesList = payload
    }
  },
  actions: {
    onEditForm ({ commit, dispatch }, id) {
      axios.get(API_URL + '/rest/' + id + '/getMedCertDeathById')
        .then((response) => {
          if (response.status === 200) {
            if (response.data.deptId !== null) {
              dispatch('onLoadDepartmentStuff', {id: response.data.deptId, name: 'deptId'})
            } else {
              dispatch('onLoadDepartmentStuff', {id: response.data.medOrgId, name: 'medOrgId'})
            }
            commit('UPLOAD_FORM', response.data)
            commit('CHANGE_LOADING_STATE', false)
          }
          if (response.status === 500) {
            commit('CHANGE_LOADING_STATE', true)
          }
        }).catch(error => {
          commit('CHANGE_LOADING_STATE', true)
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onReadForm ({ commit, dispatch }, id) {
      axios.get(API_URL + '/rest/' + id + '/medCertDeathDTO')
        .then((response) => {
          if (response.status === 200) {
            if (response.data.deptId !== null) {
              dispatch('onLoadDepartmentStuff', {id: response.data.deptId, name: 'deptId'})
            } else {
              dispatch('onLoadDepartmentStuff', {id: response.data.medOrgId, name: 'medOrgId'})
            }
            commit('UPLOAD_FORM', response.data)
            commit('CHANGE_LOADING_STATE', false)
          }
          if (response.status === 500) {
            commit('CHANGE_LOADING_STATE', true)
          }
        }).catch(error => {
          commit('CHANGE_LOADING_STATE', true)
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onLoadFrom ({ commit, dispatch }) {
      axios.get(API_URL + '/rest/getEmptyMedCertDeath')
        .then((response) => {
          if (response.status === 200) {
            if (response.data.deptId !== null) {
              dispatch('onLoadDepartmentStuff', {id: response.data.deptId, name: 'deptId'})
            } else {
              dispatch('onLoadDepartmentStuff', {id: response.data.medOrgId, name: 'medOrgId'})
            }
            commit('UPLOAD_FORM', response.data)
            commit('CHANGE_LOADING_STATE', false)
          }
        }).catch(error => {
          commit('CHANGE_LOADING_STATE', true)
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    },
    onLoadDepartmentStuff ({ commit }, payload) {
      axios.get(API_URL + '/security/department/' + payload.id)
        .then((response) => {
          if (payload.name === 'deptId') {
            commit('UPLOAD_DEPT_STUFF', response.data)
          } else {
            commit('UPLOAD_MED_ORG_STUFF', response.data)
          }
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadAddressSameAsMedOrg ({ commit }, id) {
      axios.get(API_URL + '/rest/' + id + '/getMoAddress')
        .then((response) => {
          commit('SET_SAME_AS_MED_ORG', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadUsersOfCurrentUserOrganisations ({ commit }) {
      axios.get(API_URL + '/security/personsOfCurrentUserOrganisations')
        .then((response) => {
          commit('UPLOAD_ORG_USERS', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadCurrentUserDepartmentHead ({ commit }) {
      axios.get(API_URL + '/security/currentUserOrganisationHeadPersons')
        .then((response) => {
          commit('UPLOAD_DEP_HEAD', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadResolutionTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/Resolution')
        .then((response) => {
          commit('UPLOAD_RESOLUTION_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadYearTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/year')
        .then((response) => {
          commit('UPLOAD_YEAR_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadCertKindTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/certKind')
        .then((response) => {
          commit('UPLOAD_CERT_KIND_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadDocTypeDirectory ({ commit }) {
      axios.get(API_URL + '/dictionary/identityDoc')
        .then((response) => {
          commit('UPLOAD_DOC_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadDeathLocationTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/deathLocation/death')
        .then((response) => {
          commit('UPLOAD_DEATH_LOCATION_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadRecordedDeathBasedTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/recordedDeathBased/death')
        .then((response) => {
          commit('UPLOAD_RECORDED_DEATH_BASED_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadEduTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/eduLevel')
        .then((response) => {
          commit('UPLOAD_EDU_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadFamilyStatusDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/familyStatus')
        .then((response) => {
          commit('UPLOAD_FAMILY_STATUS', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadEmplStateDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/emplState')
        .then((response) => {
          commit('UPLOAD_EMPL_STATE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadGenderDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/gender')
        .then((response) => {
          commit('UPLOAD_GENDER_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadLocalityTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/locality')
        .then((response) => {
          commit('UPLOAD_LOCALITY_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadDeathAccidentTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/deathAccident/death')
        .then((response) => {
          commit('UPLOAD_DEATH_ACCIDENT_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadRecordedDeathEmplTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/recordedDeathEmplType/death')
        .then((response) => {
          commit('UPLOAD_RECORDED_DEATH_EMPL_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadFetusTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/fetusType')
        .then((response) => {
          commit('UPLOAD_FETUS_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadDeathRoadAccidentStateTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/deathRoadAccidentState')
        .then((response) => {
          commit('UPLOAD_DEATH_ROAD_ACCIDENT_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadDeathPregnantStateTypeDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/deathPregnantState')
        .then((response) => {
          commit('UPLOAD_DEATH_PREGNANT_STATE_TYPE', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadCountriesDirectory ({ commit }) {
      axios.get(API_URL + '/rest/countries')
        .then((response) => {
          commit('UPLOAD_COUNTRIES', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onLoadAdminRegionDirectory ({ commit }) {
      axios.get(API_URL + '/baseEnum/AddressAdmObject')
        .then((response) => {
          commit('UPLOAD_ADMIN_REGION', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSearchData ({ commit }, searchData) {
      const postData = JSON.stringify(searchData)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/dictionary/findMKB10ByDescription', postData, {headers: axiosConfig})
        .then((response) => {
          commit('UPLOAD_DEATH_REASONS', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSearchOperationData ({ commit }, searchData) {
      const postData = JSON.stringify(searchData)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/baseEnum/getSurgeryByName', postData, {headers: axiosConfig})
        .then((response) => {
          commit('UPLOAD_OPERATION_REASONS', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSearchAddressData ({ commit }, searchData) {
      const postData = JSON.stringify(searchData)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/searchAddressAlt', postData, {headers: axiosConfig})
        .then((response) => {
          commit('UPLOAD_ADDRESS_SEARCH_DATA', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSearchAddressDataParams ({ commit }, data) {
      const postData = JSON.stringify(data.options)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/fillAddressAlt', postData, {headers: axiosConfig})
        .then((response) => {
          if (data.type === 1) {
            response.data.addressType = 1
            commit('UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_0', response.data)
            commit('UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS', response.data)
          }
          if (data.type === 4) {
            response.data.addressType = 4
            commit('UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_1', response.data)
            commit('UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS', response.data)
          }
          if (data.type === 5) {
            response.data.addressType = 5
            commit('UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_2', response.data)
            commit('UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS', response.data)
          }
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSearchHouseOrFlatDataParams ({ commit }, data) {
      const postData = JSON.stringify(data.dto)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/getDataForAddressHouseOrFlat', postData, {headers: axiosConfig})
        .then((response) => {
          if (data.type === 1) {
            response.data.addressType = 1
            commit('UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_0', response.data)
            commit('UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS', response.data)
          }
          if (data.type === 4) {
            response.data.addressType = 4
            commit('UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_1', response.data)
            commit('UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS', response.data)
          }
          if (data.type === 5) {
            response.data.addressType = 5
            commit('UPLOAD_ADDRESS_SEARCH_DATA_PARAMS_2', response.data)
            commit('UPLOAD_INNER_ADDRESS_SEARCH_DATA_PARAMS', response.data)
          }
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSearchSubData ({ commit }, searchData) {
      const postData = JSON.stringify(searchData)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/getDataForAddresses', postData, {headers: axiosConfig})
        .then((response) => {
          commit('UPLOAD_NEW_INNER_ADDRESS_SEARCH_DATA_PARAMS', {'data': response.data, 'level': searchData.level})
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onWarning ({ commit }) {
      commit('UPLOAD_WARNING_TEXT_MESSAGE', 'Серия и номер свидетельства являются обязательными для сохранения.')
    },
    onDraft ({ commit }, form) {
      commit('LOADER_TOGGLE', true)
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/addMedCertDeathDraft', postData, {headers: axiosConfig})
        .then((response) => {
          commit('UPLOAD_DRAFT_TEXT_MESSAGE', 'Успешно сохранено как черновик.')
          commit('UPLOAD_FORM', response.data)
          commit('LOADER_TOGGLE', false)
        }).catch(error => {
          if (error.response.data.status === 400) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          }
        })
    },
    onDraftEdit ({ commit, dispatch }, form) {
      commit('LOADER_TOGGLE', true)
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/death/isOnlySerAndNumDifferent', postData, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            return axios.post(API_URL + '/rest/death/checkDifference', postData, {headers: axiosConfig})
          }
        }).then((response2) => {
          if (response2.status === 200) {
            return axios.post(API_URL + '/rest/addMedCertDeathDraft', postData, {headers: axiosConfig})
          }
        }).then((res) => {
          commit('UPLOAD_DRAFT_TEXT_MESSAGE', 'Успешно сохранено как черновик.')
          commit('UPLOAD_FORM', res.data)
          commit('LOADER_TOGGLE', false)
        })
        .catch(error => {
          if (error.response.data.status === 400 && error.response.data.errors) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          } else if (error.response.status === 400 && error.response.data.message === 'Maybe it is a duplicate?') {
            commit('LOADER_TOGGLE', false)
            vm.$modal.show('to-instead-or-duplicate')
          } else if (error.response.status === 400 && error.response.data.message === 'You need to set new Series and Number') {
            if (error.response.data.counter > 1) {
              commit('LOADER_TOGGLE', false)
              vm.$modal.show('to-series-number')
            } else {
              dispatch('onDraft', this.form)
            }
          }
        })
    },
    onSave ({ commit }, form) {
      commit('LOADER_TOGGLE', true)
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/addMedCertDeath', postData, {headers: axiosConfig})
        .then((response) => {
          commit('UPLOAD_TEXT_MESSAGE', response.data)
          commit('LOADER_TOGGLE', false)
          vm.$modal.show('to-success')
        }).catch(error => {
          if (error.response.data.status === 400) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          }
        })
    },
    onSaveEdit ({ commit, dispatch }, form) {
      commit('LOADER_TOGGLE', true)
      const postData = JSON.stringify(form)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/death/isOnlySerAndNumDifferent', postData, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            return axios.post(API_URL + '/rest/death/checkDifference', postData, {headers: axiosConfig})
          }
        }).then((response2) => {
          if (response2.status === 200) {
            return axios.post(API_URL + '/rest/addMedCertDeath', postData, {headers: axiosConfig})
          }
        }).then((res) => {
          commit('UPLOAD_TEXT_MESSAGE', res.data)
          commit('LOADER_TOGGLE', false)
          vm.$modal.show('to-success')
        })
        .catch(error => {
          if (error.response.data.status === 400 && error.response.data.errors) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          } else if (error.response.status === 400 && error.response.data.message === 'Maybe it is a duplicate?') {
            commit('LOADER_TOGGLE', false)
            vm.$modal.show('to-instead-or-duplicate')
          } else if (error.response.status === 400 && error.response.data.message === 'You need to set new Series and Number') {
            if (error.response.data.counter > 1) {
              commit('LOADER_TOGGLE', false)
              vm.$modal.show('to-series-number')
            } else {
              dispatch('onSave', this.form)
            }
          }
        })
    },
    onDuplicateOrInstead ({ commit }, newForm) {
      commit('LOADER_TOGGLE', true)
      const postData = JSON.stringify(newForm)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/death/makeInsteadOrDuplicate', postData, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_FORM', response.data)
            commit('LOADER_TOGGLE', false)
            vm.$modal.show('to-success-copy', {typeCert: 'Death', certId: response.data.medCertId})
          }
        })
        .catch(error => {
          if (error.response.data.status === 400 && error.response.data.errors) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          }
        })
    },
    onLoadAllCertComments ({ commit }, id) {
      axios.get(API_URL + '/rest/' + id + '/comments')
        .then((response) => {
          commit('UPLOAD_ALL_COMMENTS', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSaveCertComment ({ commit }, payload) {
      commit('LOADER_TOGGLE', true)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/' + payload.id + '/comments', payload.data, {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            commit('UPLOAD_ALL_COMMENTS', response.data)
            commit('LOADER_TOGGLE', false)
          }
        }).catch(error => {
          if (error.response.data.status === 400) {
            commit('UPLOAD_BACKEND_MESSAGE', error.response.data.errors)
            commit('LOADER_TOGGLE', false)
          }
        })
    },
    onLoadPlaces ({ commit }) {
      axios.get(API_URL + '/baseEnum/morgue')
        .then((response) => {
          commit('UPLOAD_ALL_PLACES', response.data)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    onSing ({ commit, dispatch }, id) {
      commit('LOADER_TOGGLE', true)
      let axiosConfig = {
        'Content-Type': 'application/json'
      }
      axios.post(API_URL + '/rest/' + id + '/death/sign', {headers: axiosConfig})
        .then((response) => {
          if (response.status === 200) {
            if (response.data.deptId !== null) {
              dispatch('onLoadDepartmentStuff', {id: response.data.deptId, name: 'deptId'})
            } else {
              dispatch('onLoadDepartmentStuff', {id: response.data.medOrgId, name: 'medOrgId'})
            }
            commit('UPLOAD_FORM', response.data)
            commit('CHANGE_LOADING_STATE', false)
          }
          if (response.status === 500) {
            commit('CHANGE_LOADING_STATE', true)
          }
        }).catch(error => {
          commit('CHANGE_LOADING_STATE', true)
          if (error.response.data.status === 401) {
            commit('TO_MAIN_PAGE', 'Login')
          }
        })
    }
  }
}

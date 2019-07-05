<template>
  <div class="row">
    <Loader :loader="this.loader" />
    <div class="col-sm-12">
      <form @submit.prevent="onSearch">
        <div class="row doc-select">
          <div class="col-sm-6 align-self-center">
            <h4>Поиск свидетельств</h4>
          </div>
          <div class="col-sm-6 align-self-center">
            <div class="input-group">
              <div class="custom-control custom-checkbox mr-5">
                <input type="checkbox" class="custom-control-input pointer" id="birth"
                       value="birth" v-model="searchForm.certTypes">
                <label class="custom-control-label pointer" for="birth">О рождении</label>
              </div>
              <div class="custom-control custom-checkbox mr-5">
                <input type="checkbox" class="custom-control-input pointer" id="death"
                       value="death" v-model="searchForm.certTypes">
                <label class="custom-control-label pointer" for="death">О смерти</label>
              </div>
              <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input pointer" id="perinatalDeath"
                       value="perinatalDeath" v-model="searchForm.certTypes">
                <label class="custom-control-label pointer" for="perinatalDeath">О перинатальной смерти</label>
              </div>
            </div>
          </div>
        </div>
        <div class="row deep-search">
          <div class="col-sm-6">
            <h5 class="mt-4 mb-4"><strong>Регистрационные данные</strong></h5>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Серия свидетельства</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.certSeries.select">
                      <option v-for="item in searchOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.certSeries.input" v-mask="'####'">
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>№ свидетельства</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.certNumber.select">
                      <option v-for="item in searchOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.certNumber.input" v-mask="'########'">
                  </div>
                </div>
              </div>
              <!--<div class="col-sm-12">
                <div class="form-group mb-3">
                  <label><strong>Штрих-код</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.barcode.select">
                      <option v-for="item in searchOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.barcode.input">
                  </div>
                </div>
              </div>-->
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Статус обработки</strong></label>
                  <div class="input-group">
                    <select class="form-control" v-model="searchForm.status">
                      <option v-for="item in statusOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Дата подписания</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.signingDate.select">
                      <option v-for="item in searchOptions2" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.signingDate.fromDate" v-mask="'##.##.####'">
                  </div>
                  <span v-if="searchForm.signingDate.select === 'от/до'" class="float-right self-custom-second-input">
                    <input type="text" class="form-control" v-model="searchForm.signingDate.toDate" v-mask="'##.##.####'">
                  </span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Резолюция МИАЦ</strong></label>
                  <div class="input-group">
                    <select class="form-control" v-model="searchForm.resolution">
                      <option v-for="item in resolutionOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <h5 class="mt-4 mb-4"><strong>Личные данные</strong></h5>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Фамилия</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.lastName.select">
                      <option v-for="item in searchOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.lastName.input">
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Имя</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.firstName.select">
                      <option v-for="item in searchOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.firstName.input">
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Отчество</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.middleName.select">
                      <option v-for="item in searchOptions" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.middleName.input">
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6">
                <div class="form-group mb-3">
                  <label><strong>Дата рождения</strong></label>
                  <div class="input-group">
                    <select class="form-control self-custom-select" v-model="searchForm.birthDate.select">
                      <option v-for="item in searchOptions2" :key="item.id">{{ item.name }}</option>
                    </select>
                    <input type="text" class="form-control" v-model="searchForm.birthDate.fromDate" v-mask="'##.##.####'">
                  </div>
                  <span v-if="searchForm.birthDate.select === 'от/до'" class="float-right self-custom-second-input">
                    <input type="text" class="form-control" v-model="searchForm.birthDate.toDate" v-mask="'##.##.####'">
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row search-button-group">
          <div class="col-sm-3">
            <button type="reset" class="btn btn-lg btn-half-danger" @click.prevent="onClear">Очистить</button>
          </div>
          <div class="col-sm-9">
            <button type="submit" class="btn btn-lg btn-info">Найти</button>
          </div>
        </div>
      </form>
      <div v-if="search.length > 0" class="mt-2 mb-2">
        <SearchTable />
        <infinite-loading @infinite="infiniteHandler" spinner="waveDots">
          <div slot="no-more">Свидетельств больше нет.</div>
          <div slot="no-results">Ничего не найдено.</div>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Loader from '../elements/Loader'
import SearchTable from './SearchTable'

import axios from 'axios'
import { API_URL } from '@/main'

export default {
  name: 'Main',
  components: {
    Loader,
    SearchTable
  },
  beforeMount () {
    /* CHECK USER */
    this.$store.dispatch('searchPage/onUserCheck')
    /* END CHECK USER */
  },
  mounted () {
    /* LOAD AFTER LOGIN */
    if (this.loadFirstTime === true) {
      this.searchForm.page = 0
      this.$store.dispatch('searchPage/onFirstLoading', {searchForm: this.searchForm})
    }
    /* END LOAD AFTER LOGIN */
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('searchPage', ['loader', 'search', 'loadFirstTime', 'tableParams', 'searchForm', 'resolutionOptions',
      'statusOptions', 'searchOptions', 'searchOptions2'])
  },
  methods: {
    onClear () {
      this.$store.commit('searchPage/CLEAR_CERT_TYPES')
    },
    onSearch () {
      this.searchForm.page = 0
      this.$store.dispatch('searchPage/onSearch', {searchForm: this.searchForm})
    },
    infiniteHandler ($state) {
      this.searchForm.page += 1
      console.log('Searching ' + this.searchForm.page + '...')
      setTimeout(() => {
        const postData = { searchForm: this.searchForm }
        let axiosConfig = {
          'Content-Type': 'application/json'
        }
        axios.post(API_URL + '/rest/searchMedCerts', postData, {headers: axiosConfig})
          .then(({ data }) => {
            if (data.content.length) {
              this.tableParams.numberOfElements += data.numberOfElements
              this.search.push(...data.content)
              $state.loaded()
            } else {
              $state.complete()
            }
          })
      }, 500)
    }
  }
}
</script>

<style scoped>
  .doc-select {
    padding: 20px 20px;
    background-color: #007bff;
    color: white;
  }
  .deep-search {
    padding: 20px 20px;
  }
  .search-button-group {
    padding: 20px 0;
  }
  .search-button-group button {
    width: 100%;
  }
  .self-custom-select {
    max-width: 180px;
  }
  .self-custom-second-input {
    width: 50%;
  }
</style>

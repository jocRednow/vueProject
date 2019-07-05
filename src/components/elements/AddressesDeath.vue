<template>
  <div class="ml-4">
    <div class="form-row mb-3">
      <div class="col-md-6">
        <label>Страна</label>
      </div>
      <div class="col-md-6">
        <!--<label>Местность</label>-->
      </div>
      <div class="input-group col-md-5">
        <v-select :options="serverCountriesRequest"
                  label="name"
                  :clearable="false"
                  v-model="address.countryRegion"
                  @input.native="searchSubOnServer($event, address.countryRegion)"
                  placeholder="">
          <span slot="no-options">Начните вводить адрес.</span>
          <template slot="option" slot-scope="option">
            <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
          </template>
        </v-select>
      </div>
      <div class="input-group col-md-5 offset-1 custom-cool-select">
        <!--<cool-select
          v-model="address.locality"
          :items="localityType"
          itemValue="id"
          itemText="name"
          id="locality"
          name="locality"
          placeholder="" />
        <span class="input-group-append">
            <button @click="address.locality = null"
                    title="Очистить поле"
                    class="btn btn-sm btn-outline-dark btn-color-light border-left-0 border" type="button">
                <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </span>-->
      </div>
    </div>
    <div class="form-row mt-4 mb-3">
      <div class="input-group col-md-11">
        <v-select :options.sync="serverAddressRequest"
                  label="name"
                  class="v-select-lg"
                  :clearable="false"
                  v-model="address.addressSearchObj"
                  @search="searchAddressOnServer"
                  placeholder="Поиск адреса">
          <span slot="no-options">Начните вводить адрес.</span>
          <template slot="option" slot-scope="option">
            <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
          </template>
        </v-select>
        <span class="input-group-append">
            <button @click="clearAddress"
                    title="Очистить адрес"
                    class="btn btn-lg btn-outline-dark btn-color-light border-left-0 border" type="button">
                <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </span>
      </div>
    </div>
    <div v-if="address.countryRegion && address.countryRegion.refId === 'РФ'">
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Субъект</label>
        </div>
        <div class="col-md-6"></div>
        <div class="input-group col-md-5">
          <v-select :options="serverSubRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel1"
                    @input.native="searchSubOnServer($event, address.aolevel1)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
        <div class="input-group col-md-5 offset-1"></div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Город</label>
        </div>
        <div class="col-md-6">
          <label>Населенный пункт</label>
        </div>
        <div class="input-group col-md-5">
          <v-select :options="serverCityRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel4"
                    @input.native="searchSubOnServer($event, address.aolevel4)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
        <div class="input-group col-md-5 offset-1">
          <v-select :options="serverTownRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel6"
                    @input.native="searchSubOnServer($event, address.aolevel6)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Внутригородская территория</label>
        </div>
        <div class="col-md-6">
          <label>Район</label>
        </div>
        <div class="input-group col-md-5">
          <v-select :options="serverInnerTerritoryRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel5"
                    @input.native="searchSubOnServer($event, address.aolevel5)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
        <div class="input-group col-md-5 offset-1">
          <v-select :options="serverRegionRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel3"
                    @input.native="searchSubOnServer($event, address.aolevel3)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Элем. планир. структуры</label>
        </div>
        <div class="col-md-6">
          <label>Подчиненные доп. территория объекты</label>
        </div>
        <div class="input-group col-md-5">
          <v-select :options="server65Request"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel65"
                    @input.native="searchSubOnServer($event, address.aolevel65)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
        <div class="input-group col-md-5 offset-1">
          <v-select :options="server91Request"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel91"
                    @input.native="searchSubOnServer($event, address.aolevel91)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Улица</label>
        </div>
        <div class="col-md-3">
          <label>Дом</label>
        </div>
        <div class="input-group col-md-5">
          <v-select :options="serverStreetRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.aolevel7"
                    @input.native="searchSubOnServer($event, address.aolevel7)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectAddress(option, address.addressType)" class="select-option">{{ option.name }} <small class="text-secondary ml-2">{{ option.fullName }}</small></p>
            </template>
          </v-select>
        </div>
        <div class="input-group col-md-5 offset-1">
          <v-select :options="serverHouseRequest"
                    label="name"
                    :clearable="false"
                    v-model="address.house"
                    @input.native="searchSubOnServer($event, address.house)"
                    placeholder="">
            <span slot="no-options">Начните вводить адрес.</span>
            <template slot="option" slot-scope="option">
              <p @click="selectHouseOrFlat(option, address.addressType)" class="select-option">{{ option.name }}</p>
            </template>
          </v-select>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6"><label>Квартира</label></div>
        <div class="col-md-6">
          <label v-if="address.aolevel1.name === 'Санкт-Петербург г'">Район г.Санкт-Петербурга</label>
        </div>
        <div class="input-group col-md-5">
          <input type="text" v-model="address.flat"
                 @blur="selectHouseOrFlat(address.flat, address.addressType)"
                 class="form-control field-height-32">
          <span class="input-group-append">
              <button @click="address.flat = null"
                      title="Очистить поле"
                      class="btn btn-sm btn-outline-dark btn-color-light border-left-0 border" type="button">
                  <font-awesome-icon :icon="['fas', 'times']" />
              </button>
            </span>
        </div>
        <div class="input-group col-md-5 offset-1 custom-cool-select" v-if="address.aolevel1.name === 'Санкт-Петербург г'">
          <cool-select
            v-model="address.addressAdmObject"
            :items="serverAdminRegionRequest"
            itemValue="id"
            itemText="name"
            id="addressAdmObject"
            placeholder="" />
          <span class="input-group-append">
            <button @click="address.addressAdmObject = null"
                    title="Очистить поле"
                    class="btn btn-sm btn-outline-dark btn-color-light border-left-0 border" type="button">
                <font-awesome-icon :icon="['fas', 'times']" />
            </button>
          </span>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Адрес</label>
        </div>
        <div class="col-md-6">
          <label>Уточнение адреса</label>
        </div>
        <div class="input-group col-md-5">
              <textarea name="addressTxt"
                        :disabled="true"
                        class="form-control"
                        cols="30" rows="3"
                        v-model="address.addressTxt"></textarea>
        </div>
        <div class="input-group col-md-5 offset-1">
              <textarea name="addressTxtRandom"
                        class="form-control"
                        cols="30" rows="3"
                        v-model="address.addressTxtRandom"></textarea>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Уточнение адреса</label>
        </div>
        <div class="col-md-6"></div>
        <div class="input-group col-md-5">
              <textarea name="addressTxtRandom"
                        class="form-control"
                        cols="30" rows="3"
                        v-model="address.addressTxtRandom"></textarea>
        </div>
        <div class="input-group col-md-5 offset-1"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { mapState } from 'vuex'
import { CoolSelect } from 'vue-cool-select'

Vue.component('v-select', vSelect)

export default {
  name: 'addresses-death',
  components: {
    CoolSelect
  },
  props: {
    address: {
      type: Object
    }
  },
  mounted () {
    this.$store.dispatch('deathPage/onLoadAdminRegionDirectory')
    // this.$store.dispatch('deathPage/onLoadLocalityTypeDirectory')
    this.$store.dispatch('deathPage/onLoadCountriesDirectory')
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('deathPage', ['countriesList', 'serverAddressRequest', 'serverSubRequest', 'serverCountriesRequest', 'serverAdminRegionRequest',
      'serverRegionRequest', 'serverCityRequest', 'serverTownRequest', 'serverInnerTerritoryRequest', 'server65Request', 'server91Request', 'serverStreetRequest', 'serverHouseRequest'])
  },
  methods: {
    clearAddress () {
      this.address.addressAdmObject = null
      // this.address.addressId = null
      this.address.addressSearchObj = null
      this.address.addressSearchText = null
      this.address.addressTxt = null
      this.address.addressTxtRandom = null
      this.address.aolevel1 = {level: 1, refId: null, name: null}
      this.address.aolevel2 = {level: 2, refId: null, name: null}
      this.address.aolevel3 = {level: 3, refId: null, name: null}
      this.address.aolevel4 = {level: 4, refId: null, name: null}
      this.address.aolevel5 = {level: 5, refId: null, name: null}
      this.address.aolevel6 = {level: 6, refId: null, name: null}
      this.address.aolevel7 = {level: 7, refId: null, name: null}
      this.address.aolevel65 = {level: 65, refId: null, name: null}
      this.address.aolevel90 = {level: 90, refId: null, name: null}
      this.address.aolevel91 = {level: 91, refId: null, name: null}
      this.address.countryRegion = {level: 0, refId: null, name: null}
      this.address.flat = null
      this.address.house = {level: 100, refId: null, name: null}
      // this.address.locality = null
    },
    searchAddressOnServer (search) {
      const lettersLimit = 3
      if (search.length >= lettersLimit) {
        this.$store.dispatch('deathPage/onSearchAddressData', {'level': null, 'refId': null, 'name': search})
      }
    },
    selectAddress (options, type) {
      this.$store.dispatch('deathPage/onSearchAddressDataParams', {'options': options, 'type': type})
    },
    selectHouseOrFlat (options, type) {
      this.$store.dispatch('deathPage/onSearchHouseOrFlatDataParams', {'dto': this.address, 'type': type})
    },
    searchSubOnServer ($event, obj) {
      let lettersLimit = 1
      if ($event.target.value.length >= lettersLimit) {
        this.$store.dispatch('deathPage/onSearchSubData', {'level': obj.level, 'dto': this.address, 'searchString': $event.target.value})
      }
    }
  }
}
</script>

<style scoped>
  .field-height-32 {
    height: 32px!important;
  }
  .btn-color-light {
    color: #9D9D9D!important;
  }
  .btn-color-light:hover {
    color: white!important;
  }
</style>

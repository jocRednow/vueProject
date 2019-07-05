<template>
  <div>
    <Loader :loader="this.loader" />
    <div v-if="loading">
      <h1>Проверка доступа...</h1>
    </div>
    <div v-if="adminRole">
      <div class="row">
        <div class="col-md-12">
          <h2 v-if="this.$route.params.id" class="mt-2 mb-5">Редактирование департамент:</h2>
          <h2 v-else class="mt-2 mb-5">Создание департамент:</h2>
          <form>
            <div class="form-row mb-3">
              <div class="col-md-6">
                <label for="name">Мед. организация</label>
                <input type="text" id="name" v-model="departmentForm.name"
                       name="name" class="form-control" />
              </div>
              <div class="col-md-6">
                <label for="code">Код по ОКПО</label>
                <input type="text" id="code" v-model="departmentForm.code"
                       name="code" class="form-control" />
              </div>
            </div>
            <!--<div class="form-row">
              <div class="form-row mb-3">
                <div class="col-md-6">
                  <label>Страна</label>
                </div>
                <div class="col-md-6">
                  <label>Местность</label>
                </div>
                <div class="input-group col-md-5">
                  <v-select :options="serverCountriesRequest"
                            label="name"
                            :clearable="false"
                            v-model="departmentForm.address.countryRegion"
                            @input.native="searchSubOnServer($event, departmentForm.address.countryRegion)"
                            placeholder="">
                    <span slot="no-options">Начните вводить адрес.</span>
                    <template slot="option" slot-scope="option">
                      <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
                    </template>
                  </v-select>
                </div>
                <div class="input-group col-md-5 offset-1 custom-cool-select">
                  <cool-select
                    v-model="departmentForm.address.locality"
                    :items="localityType"
                    itemValue="id"
                    itemText="name"
                    id="locality"
                    name="locality"
                    placeholder="" />
                  <span class="input-group-append">
                    <button @click="departmentForm.address.locality = null"
                            title="Очистить поле"
                            class="btn btn-sm btn-outline-dark btn-color-light border-left-0 border" type="button">
                        <font-awesome-icon :icon="['fas', 'times']" />
                    </button>
                  </span>
                </div>
              </div>
              <div class="form-row mt-4 mb-3">
                <div class="input-group col-md-11">
                  <v-select :options.sync="serverAddressRequest"
                            label="name"
                            class="v-select-lg"
                            :clearable="false"
                            v-model="departmentForm.address.addressSearchObj"
                            @search="searchAddressOnServer"
                            placeholder="Поиск адреса">
                    <span slot="no-options">Начните вводить адрес.</span>
                    <template slot="option" slot-scope="option">
                      <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
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
              <div v-if="departmentForm.address.countryRegion && departmentForm.address.countryRegion.refId === 'РФ'">
                <div class="form-row mb-3">
                  <div class="col-md-6">
                    <label>Субъект</label>
                  </div>
                  <div class="col-md-6">
                    <label v-if="departmentForm.address.aolevel1.name === 'Санкт-Петербург г'">Район г.Санкт-Петербурга</label>
                  </div>
                  <div class="input-group col-md-5">
                    <v-select :options="serverSubRequest"
                              label="name"
                              :clearable="false"
                              v-model="departmentForm.address.aolevel1"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel1)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
                      </template>
                    </v-select>
                  </div>
                  <div class="input-group col-md-5 offset-1 custom-cool-select" v-if="departmentForm.address.aolevel1.name === 'Санкт-Петербург г'">
                    <cool-select
                      v-model="departmentForm.address.addressAdmObject"
                      :items="serverAdminRegionRequest"
                      itemValue="id"
                      itemText="name"
                      id="addressAdmObject"
                      placeholder="" />
                    <span class="input-group-append">
                      <button @click="departmentForm.address.addressAdmObject = null"
                              title="Очистить поле"
                              class="btn btn-sm btn-outline-dark btn-color-light border-left-0 border" type="button">
                          <font-awesome-icon :icon="['fas', 'times']" />
                      </button>
                    </span>
                  </div>
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
                              v-model="departmentForm.address.aolevel4"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel4)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
                      </template>
                    </v-select>
                  </div>
                  <div class="input-group col-md-5 offset-1">
                    <v-select :options="serverTownRequest"
                              label="name"
                              :clearable="false"
                              v-model="departmentForm.address.aolevel6"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel6)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
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
                              v-model="departmentForm.address.aolevel5"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel5)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
                      </template>
                    </v-select>
                  </div>
                  <div class="input-group col-md-5 offset-1">
                    <v-select :options="serverRegionRequest"
                              label="name"
                              :clearable="false"
                              v-model="departmentForm.address.aolevel3"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel3)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
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
                              v-model="departmentForm.address.aolevel65"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel65)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
                      </template>
                    </v-select>
                  </div>
                  <div class="input-group col-md-5 offset-1">
                    <v-select :options="server91Request"
                              label="name"
                              :clearable="false"
                              v-model="departmentForm.address.aolevel91"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel91)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
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
                              v-model="departmentForm.address.aolevel7"
                              @input.native="searchSubOnServer($event, departmentForm.address.aolevel7)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectAddress(option, departmentForm.address.addressType)" class="select-option">{{ option.name }} <small class="text-secondary ml-2">{{ option.fullName }}</small></p>
                      </template>
                    </v-select>
                  </div>
                  <div class="input-group col-md-5 offset-1">
                    <v-select :options="serverHouseRequest"
                              label="name"
                              :clearable="false"
                              v-model="departmentForm.address.house"
                              @input.native="searchSubOnServer($event, departmentForm.address.house)"
                              placeholder="">
                      <span slot="no-options">Начните вводить адрес.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectHouseOrFlat(option, departmentForm.address.addressType)" class="select-option">{{ option.name }}</p>
                      </template>
                    </v-select>
                  </div>
                </div>
                <div class="form-row mb-3">
                  <div class="col-md-6"><label>Квартира</label></div>
                  <div class="col-md-6"></div>
                  <div class="input-group col-md-5">
                    <input type="text" v-model="departmentForm.address.flat"
                           @blur="selectHouseOrFlat(departmentForm.address.flat, departmentForm.address.addressType)"
                           class="form-control field-height-32">
                    <span class="input-group-append">
              <button @click="departmentForm.address.flat = null"
                      title="Очистить поле"
                      class="btn btn-sm btn-outline-dark btn-color-light border-left-0 border" type="button">
                  <font-awesome-icon :icon="['fas', 'times']" />
              </button>
            </span>
                  </div>
                  <div class="input-group col-md-5 offset-1"></div>
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
                        v-model="departmentForm.address.addressTxt"></textarea>
                  </div>
                  <div class="input-group col-md-5 offset-1">
              <textarea name="addressTxtRandom"
                        class="form-control"
                        cols="30" rows="3"
                        v-model="departmentForm.address.addressTxtRandom"></textarea>
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
                        v-model="departmentForm.address.addressTxtRandom"></textarea>
                  </div>
                  <div class="input-group col-md-5 offset-1"></div>
                </div>
              </div>
            </div>-->
            <button class="btn btn-lg btn-outline-primary mt-4" @click.prevent="onSave">Сохранить</button>
            <h4 v-if="message.length > 0" class="text-secondary mt-4"><strong>{{ message }}</strong></h4>
          </form>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-dark text-center mt-5 mb-5">У ВАС НЕТ ДОСТУПА.</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { mapState, mapGetters } from 'vuex'
import Loader from './../elements/Loader'
import { CoolSelect } from 'vue-cool-select'

Vue.component('v-select', vSelect)

export default {
  name: 'department-form',
  components: {
    Loader,
    CoolSelect
  },
  beforeMount () {
    this.$store.dispatch('adminUserPage/onCurrentUserGet')
    /* CREATE|EDIT */
    if (this.$route.params.id) {
      let id = this.$route.params.id
      this.$store.dispatch('adminUserPage/getDepartment', id)
    } else {
      this.$store.dispatch('adminUserPage/getEmptyDepartment')
    }
    /* END CREATE|EDIT */
  },
  mounted () {
    this.$store.dispatch('deathPage/onLoadAdminRegionDirectory')
    this.$store.dispatch('deathPage/onLoadLocalityTypeDirectory')
    this.$store.dispatch('deathPage/onLoadCountriesDirectory')
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('adminUserPage', ['loading', 'loader', 'adminRole', 'miacRole', 'printerRole', 'signerRole', 'message',
      'serverAddressRequest', 'serverSubRequest', 'serverCountriesRequest', 'serverRegionRequest', 'serverCityRequest',
      'serverTownRequest', 'serverInnerTerritoryRequest', 'server65Request', 'server91Request', 'serverStreetRequest', 'serverHouseRequest']),
    ...mapGetters('adminUserPage', ['departmentForm'])
  },
  methods: {
    onSave () {
      this.$store.dispatch('adminUserPage/postDepartment', this.departmentForm)
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div class="row">
    <div class="col-sm-5 align-self-center">
      <h4>Отображено свидетельств: <strong>{{ tableParams.numberOfElements }}/{{ tableParams.totalElements }}</strong></h4>
    </div>
    <div class="col-sm-2 align-self-center">
      <span class="dot bg-info"></span><span class="dot-title">Рождение</span>
    </div>
    <div class="col-sm-2 align-self-center">
      <span class="dot bg-danger"></span><span class="dot-title">Смерть</span>
    </div>
    <div class="col-sm-3 align-self-center">
      <span class="dot bg-warning"></span><span class="dot-title">Перинатальная смерть</span>
    </div>
    <div class="col-sm-12 mt-4">
      <table class="table table-borderless custom-table">
        <thead>
        <tr class="table-info border-bottom border-dark align-middle custom-border-header">
          <th class="align-middle text-center">Связь</th>
          <th class="align-middle text-center">Категория</th>
          <th class="align-middle text-center">ФИО</th>
          <th class="align-middle text-center">Серия Номер</th>
          <th class="align-middle text-center">Подписано</th>
          <th class="align-middle text-center">Статус</th>
          <th class="align-middle text-center">Резолюция МИАЦ</th>
          <!--<th class="align-middle text-center">Тип</th>-->
          <th width="15%" class="align-middle text-center">Мед. организация</th>
          <th class="align-middle text-center"></th>
        </tr>
        </thead>
        <tbody>
        <tr class="border-bottom custom-border pointer" v-for="item in search" :key="item.medCertId"
            :class="[item.certType === 'о смерти' ? 'border-danger' : '',
                   item.certType === 'о рождении' ? 'border-info' : '',
                   item.certType === 'о перинатальной смерти' ? 'border-warning' : '']">
          <td class="align-middle text-center"
              :class="[item.certType === 'о смерти' ? 'text-danger' : '',
                  item.certType === 'о рождении' ? 'text-info' : '',
                  item.certType === 'о перинатальной смерти' ? 'text-warning' : '']">
              <font-awesome-icon v-if="item.prevCertId && !item.isPrevCert && !item.isShow" @click="onShow(item)" class="pointer"
                                 :icon="['fas', 'plus-circle']" size="2x" title="Связанные свидетельства" />
              <font-awesome-icon v-if="item.isShow" @click="onHide(item)" class="pointer"
                                 :icon="['fas', 'minus-circle']" size="2x" title="Связанные свидетельства" />
              <span v-if="item.isPrevCert"><i class="arrow up"></i><i class="red-line"></i></span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)">Свидетельство {{ item.certType }}</span>
            <span v-else>Свидетельство {{ item.certType }}</span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)">{{ item.lastName }} {{ item.firstName }} {{ item.patronymicName }}</span>
            <span v-else>{{ item.lastName }} {{ item.firstName }} {{ item.patronymicName }}</span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)">{{ item.certSeries }}<br /> №{{ item.certNumber }}</span>
            <span v-else>{{ item.certSeries }}<br /> №{{ item.certNumber }}</span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)">{{ item.checkDate }}</span>
            <span v-else>{{ item.checkDate }}</span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)"><kbd v-if="item.certStatus">{{ item.certStatus }}</kbd></span>
            <span v-else><kbd v-if="item.certStatus">{{ item.certStatus }}</kbd></span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)"><kbd v-if="item.resolution">{{ item.resolution }}</kbd></span>
            <span v-else><kbd v-if="item.resolution">{{ item.resolution }}</kbd></span>
          </td>
          <!--<td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)"></span>
            <span v-else></span>
          </td>-->
          <td class="align-middle text-center">
            <span v-if="!item.mainCert" @click="onRead(item)">{{ item.organization }}</span>
            <span v-else>{{ item.organization }}</span>
          </td>
          <td class="align-middle text-center">
            <span v-if="!item.mainCert && (birthCreatorRole || adminRole)">
              <router-link v-if="item.certType === 'о рождении'" :to="'/bornForm/edit/' + item.medCertId" tag="span" class="pointer" title="Редактировать">
                <font-awesome-icon :icon="['fas', 'edit']" class="align-middle" />
              </router-link>
            </span>
            <span v-if="!item.mainCert && (deathCreatorRole || adminRole)">
              <router-link v-if="item.certType === 'о смерти'" :to="'/deathForm/edit/' + item.medCertId" tag="span" class="pointer" title="Редактировать">
                <font-awesome-icon :icon="['fas', 'edit']" class="align-middle" />
              </router-link>
            </span>
            <span v-if="!item.mainCert && (perinatalDeathCreatorRole || adminRole)">
              <router-link v-if="item.certType === 'о перинатальной смерти'" :to="'/perinatalDeathForm/edit/' + item.medCertId" tag="span" class="pointer" title="Редактировать">
                <font-awesome-icon :icon="['fas', 'edit']" class="align-middle" />
              </router-link>
            </span>
            <span class="dot align-middle"
                  :class="[item.certType === 'о смерти' ? 'bg-danger' : '',
                   item.certType === 'о рождении' ? 'bg-info' : '',
                   item.certType === 'о перинатальной смерти' ? 'bg-warning' : '']"></span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'search-table',
  computed: {
    ...mapState('searchPage', ['search', 'tableParams',
      'adminRole', 'miacRole', 'birthCreatorRole', 'deathCreatorRole', 'perinatalDeathCreatorRole', 'printerRole', 'signerRole'])
  },
  methods: {
    onShow (item) {
      let prevId = item.prevCertId
      this.$store.dispatch('searchPage/onPrevCert', {'id': prevId, 'item': item})
    },
    onHide (item) {
      this.$store.commit('searchPage/HIDE_AND_CLEAR_PREV_CERTS', {'item': item})
    },
    onRead (item) {
      let id = item.medCertId
      if (item.certType === 'о рождении') {
        this.$router.push({ name: 'BornFormRead', params: { id } })
      }
      if (item.certType === 'о смерти') {
        this.$router.push({ name: 'DeathFormRead', params: { id } })
      }
      if (item.certType === 'о перинатальной смерти') {
        this.$router.push({ name: 'PerinatalDeathFormRead', params: { id } })
      }
    }
  }
}
</script>

<style scoped>
  .custom-border {
    opacity: 0.6;
  }
  .custom-border:hover {
    opacity: 1;
  }
  .dot {
    position: relative;
    top: 5px;
  }
  .red-line {
    position: absolute;
    margin-top: 9px;
    margin-left: -8px;
    padding: 10px 2px ;
    background: #DC3545;
  }
  .arrow {
    border: solid #DC3545;
    border-width: 0 4px 4px 0;
    display: inline-block;
    padding: 4px;
  }
  .up {
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
  }
</style>

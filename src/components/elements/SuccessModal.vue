<template>
  <div>
    <modal name="to-success" :width="600" :height="600" @before-close="beforeClose" :clickToClose="false">
      <div class="row">
        <div class="col-md-12 modal-title">
          <h3><strong>Успешно сохранено.</strong></h3>
          <div v-if="typeCert == 'Death'">
            <span>КОД: </span><br />
            <strong>{{ textMessage }}</strong>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mt-4 modal-body">
          <button class="btn btn-lg btn-outline-primary float-right" @click="onEdit">Редактировать</button>
          <router-link to="/" tag="button" class="btn btn-lg btn-outline-dark">Выйти</router-link>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'success-modal',
  props: [
    'typeCert'
  ],
  computed: {
    ...mapState('bornPage', {bornNewFormMedCertId: 'newFormMedCertId'}),
    ...mapState('deathPage', ['newFormMedCertId', 'textMessage']),
    ...mapState('perinatalDeathPage', {perinatalDeathNewMedCertId: 'newFormMedCertId'})
  },
  methods: {
    beforeClose () {
      this.$store.commit('deathPage/DELETE_TEXT_MESSAGE')
    },
    onEdit () {
      if (this.typeCert === 'Born') {
        let id = this.bornNewFormMedCertId
        this.$router.push({ name: 'BornFormEdit', params: { id } })
      }
      if (this.typeCert === 'Death') {
        let id = this.newFormMedCertId
        this.$router.push({ name: 'DeathFormEdit', params: { id } })
      }
      if (this.typeCert === 'PerinatalDeath') {
        let id = this.perinatalDeathNewMedCertId
        this.$router.push({ name: 'PerinatalDeathFormEdit', params: { id } })
      }
      this.$modal.hide('to-success')
    }
  }
}
</script>

<style scoped>
  .modal-title {
    padding: 20px 40px!important;
  }
  .modal-body {
    position: absolute!important;
    bottom: 5px!important;
    left: 0!important;
    padding: 25px 35px!important;
  }
</style>

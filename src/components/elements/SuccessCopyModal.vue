<template>
  <div>
    <modal name="to-success-copy" :width="600" :height="200" :clickToClose="false">
      <div class="row">
        <div class="col-md-12 modal-title">
          <h3><strong>Новое свидетельство успешно создано.</strong></h3>
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
export default {
  name: 'success-copy-modal',
  props: [
    'typeCert', 'certId'
  ],
  methods: {
    onEdit () {
      if (this.typeCert === 'Born') {
        let id = this.certId
        this.$router.push({ name: 'BornFormEdit', params: { id } })
      }
      if (this.typeCert === 'Death') {
        let id = this.certId
        this.$router.push({ name: 'DeathFormEdit', params: { id } })
      }
      if (this.typeCert === 'PerinatalDeath') {
        let id = this.certId
        this.$router.push({ name: 'PerinatalDeathFormEdit', params: { id } })
      }
      this.$modal.hide('to-success-copy')
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

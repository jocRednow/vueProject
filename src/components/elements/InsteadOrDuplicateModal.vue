<template>
  <div>
    <modal name="to-instead-or-duplicate" :width="600" :height="200" :clickToClose="false">
      <div class="row">
        <div class="col-md-12 modal-title">
          <h3><strong>Дубликат или Взамен?</strong></h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mt-4 modal-body">
          <button class="btn btn-lg btn-outline-primary float-right" @click="onInsteadOf">Взамен</button>
          <button class="btn btn-lg btn-outline-primary float-right mr-2" @click="isDuplicate">Дубликат</button>
          <button class="btn btn-lg btn-outline-dark" @click.prevent="hideModal()">Отмена</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'instead-or-duplicate-modal',
  props: ['typeCert', 'form'],
  methods: {
    hideModal () {
      this.$modal.hide('to-instead-or-duplicate')
    },
    isDuplicate () {
      if (this.typeCert === 'Death') {
        this.$store.commit('deathPage/CHANGE_STATE_DUPLICATE', true)
        this.$store.commit('deathPage/CHANGE_STATE_INSTEAD', false)
        this.$store.dispatch('deathPage/onDuplicateOrInstead', this.form)
      }
      if (this.typeCert === 'PerinatalDeath') {
        this.$store.commit('perinatalDeathPage/CHANGE_STATE_DUPLICATE', true)
        this.$store.commit('perinatalDeathPage/CHANGE_STATE_INSTEAD', false)
        this.$store.dispatch('perinatalDeathPage/onDuplicateOrInstead', this.form)
      }
      this.$modal.hide('to-instead-or-duplicate')
    },
    onInsteadOf () {
      this.$modal.show('to-instead')
      this.$modal.hide('to-instead-or-duplicate')
    }
  }
}
</script>

<style scoped>
  .modal-title {
    padding: 20px 40px 0!important;
  }
  .modal-body {
    position: absolute!important;
    bottom: 5px!important;
    left: 0!important;
    padding: 10px 30px 20px!important;
  }
</style>

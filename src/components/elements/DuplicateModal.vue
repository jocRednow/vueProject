<template>
  <div>
    <modal name="to-duplicate" :width="600" :height="200" :clickToClose="false">
      <div class="row">
        <div class="col-md-12 modal-title">
          <h3><strong>Это дубликат?</strong></h3>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mt-4 modal-body">
          <button class="btn btn-lg btn-outline-primary float-right" @click="isDuplicate">Дубликат</button>
          <button class="btn btn-lg btn-outline-primary float-right mr-2" @click="isNotDuplicate">Не дубликат</button>
          <button class="btn btn-lg btn-outline-dark" @click.prevent="hideModal()">Отмена</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'duplicate-modal',
  props: ['typeCert', 'form'],
  methods: {
    hideModal () {
      this.$modal.hide('to-duplicate')
    },
    isDuplicate () {
      if (this.typeCert === 'Born') {
        this.$store.commit('bornPage/CHANGE_STATE_DUPLICATE', true)
        this.$store.dispatch('bornPage/onDuplicateOrInstead', this.form)
      }
      this.$modal.hide('to-duplicate')
    },
    isNotDuplicate () {
      if (this.typeCert === 'Born') {
        this.$store.commit('bornPage/CHANGE_STATE_DUPLICATE', false)
        this.$store.dispatch('bornPage/onDuplicateOrInstead', this.form)
      }
      this.$modal.hide('to-duplicate')
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

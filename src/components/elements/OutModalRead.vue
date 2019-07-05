<template>
  <div>
    <modal name="go-out" :width="700" :height="200">
      <div class="row">
        <div class="col-md-12 modal-title">
          <strong>Вы действительно хотите выйти?
          </strong>
        </div>
      </div>
      <div class="row">
        <div class="col-md-11 mt-5 modal-body">
          <router-link to="/" tag="button" class="btn btn-lg btn-outline-danger float-right">Выйти</router-link>
          <button class="btn btn-lg btn-outline-primary mr-3 float-right" @click="hideModal()">Отмена</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'out-modal-read',
  props: {
    form: {
      type: Object
    }
  },
  methods: {
    hideModal () {
      this.$modal.hide('go-out')
    }
  }
}
</script>

<style scoped>
  .modal-title {
    padding: 20px 40px!important;
  }
  .modal-body {
    padding: 0 20px 0!important;
  }
</style>

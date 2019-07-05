<template>
  <div>
    <modal name="go-out" :width="700" :height="200">
      <div class="row">
        <div class="col-md-12 modal-title">
          <strong>Изменения не были сохранены.<br/>
            Вы действительно хотите выйти без сохранения?
          </strong>
        </div>
      </div>
      <div class="row">
        <div class="col-md-11 mt-5 modal-body">
          <router-link to="/" tag="button" class="btn btn-lg btn-outline-danger float-right">Выйти без сохранения</router-link>
          <button class="btn btn-lg btn-outline-primary mr-3 float-right" @click.prevent="onDraft($route.name); hideModal()">Сохранить и выйти</button>
          <button class="btn btn-lg btn-outline-primary mr-3 float-right" @click="hideModal()">Отмена</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'out-modal',
  props: {
    form: {
      type: Object
    }
  },
  methods: {
    hideModal () {
      this.$modal.hide('go-out')
    },
    onDraft (params) {
      if (params === 'BornForm' || params === 'BornFormEdit') {
        if (this.form.certSeries === null && this.form.certNumber === null) {
          this.$store.dispatch('bornPage/onWarning')
        } else if (this.form.certSeries.length === 4 && this.form.certNumber.length === 8) {
          console.log('Draft saving...')
          this.$store.dispatch('bornPage/onDraft', this.form)
          this.$router.push({ name: 'Search' })
        }
      }

      if (params === 'DeathFormEdit' || params === 'DeathForm') {
        if (this.form.certSeries === null && this.form.certNumber === null) {
          this.$store.dispatch('deathPage/onWarning')
        } else if (this.form.certSeries.length === 4 && this.form.certNumber.length === 8) {
          console.log('Draft saving...')
          this.$store.dispatch('deathPage/onDraft', this.form)
          this.$router.push({ name: 'Search' })
        }
      }

      if (params === 'PerinatalDeathForm' || params === 'PerinatalDeathFormEdit') {
        if (this.form.certSeries === null && this.form.certNumber === null) {
          this.$store.dispatch('perinatalDeathPage/onWarning')
        } else if (this.form.certSeries.length === 4 && this.form.certNumber.length === 8) {
          console.log('Draft saving...')
          this.$store.dispatch('perinatalDeathPage/onDraft', this.form)
          this.$router.push({ name: 'Search' })
        }
      }
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

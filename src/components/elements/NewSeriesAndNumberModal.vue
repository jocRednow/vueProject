<template>
  <div>
    <modal name="to-series-number" :width="400" :height="400" :clickToClose="false">
      <form>
        <div class="row">
          <div class="col-md-12 modal-title">
            <div class="form-row mb-3">
              <div class="col-md-12">
                <label for="certSeries">Серия свидетельства<strong class="text-danger">*</strong></label>
                <input type="text" id="certSeries" v-model="form.certSeries" v-mask="'####'"
                       placeholder="XXXX"
                       v-validate="{ required: true, min: 4 }" name="'Серия свидетельств'"
                       class="form-control" :class="{ 'is-invalid': errors.has('certSeries') }" />
              </div>
            </div>
            <div class="form-row mb-3">
              <div class="col-md-12">
                <label for="certNumber">Номер свидетельства<strong class="text-danger">*</strong></label>
                <input type="text" id="certNumber" v-model="form.certNumber" v-mask="'########'"
                       placeholder="XXXXXXXX"
                       v-validate="{ required: true, min: 8 }" name="'Номер свидетельств'"
                       class="form-control" :class="{ 'is-invalid': errors.has('certNumber') }" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 modal-error">
            <ul class="list-unstyled text-danger small" v-if="errors.all().length > 0">
              <li v-for="(error, i) in errors.all()" :key="i">{{ error }}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 mt-4 modal-body">
            <button class="btn btn-lg btn-outline-primary float-right" @click.prevent="onCreate">Создать</button>
            <button class="btn btn-lg btn-outline-dark" @click.prevent="hideModal()">Отмена</button>
          </div>
        </div>
      </form>
    </modal>
  </div>
</template>

<script>
export default {
  name: 'new-series-and-number-modal',
  props: ['typeCert', 'dto'],
  data () {
    return {
      form: {}
    }
  },
  methods: {
    hideModal () {
      this.$modal.hide('to-series-number')
    },
    onCreate () {
      this.$validator.validate().then(valid => {
        if (valid) {
          console.log('Edit saving...')
          this.dto.certSeries = this.form.certSeries
          this.dto.certNumber = this.form.certNumber
          if (this.typeCert === 'Born') {
            this.$store.dispatch('bornPage/onDuplicateOrInstead', this.dto)
          }
          if (this.typeCert === 'Death') {
            this.$store.dispatch('deathPage/onDuplicateOrInstead', this.dto)
          }
          if (this.typeCert === 'PerinatalDeath') {
            this.$store.dispatch('perinatalDeathPage/onDuplicateOrInstead', this.dto)
          }
          this.$modal.hide('to-series-number')
          this.form = {}
        }
      })
    }
  }
}
</script>

<style scoped>
  .modal-title {
    padding: 20px 40px 0!important;
  }
  .modal-error {
    padding: 3px 40px!important;
  }
  .modal-body {
    position: absolute!important;
    bottom: 5px!important;
    left: 0!important;
    padding: 10px 30px 20px!important;
  }
</style>

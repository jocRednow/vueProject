<template>
  <div>
    <modal name="to-instead" :width="600" :height="300" :clickToClose="false">
      <form>
        <div class="row">
          <div class="col-md-12 modal-title">
            <h3 class="mb-5"><strong>Укажите тип свидетельства</strong></h3>
            <div class="input-group">
              <label>Тип свидетельства<strong class="text-danger">*</strong></label>
              <cool-select
                v-model="select.certKind"
                :items="certKindType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('certKind') }"
                id="certKind"
                name="'Тип свидетельства'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="select.certKind = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
              <div v-if="errors.has('certKind')" class="invalid-feedback">{{ errors.first('certKind') }}</div>
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
import { mapState } from 'vuex'

import { CoolSelect } from 'vue-cool-select'

export default {
  name: 'instead-modal',
  components: {
    CoolSelect
  },
  props: ['typeCert', 'form'],
  mounted () {
    this.$store.dispatch('deathPage/onLoadCertKindTypeDirectory')
  },
  data () {
    return {
      select: {}
    }
  },
  computed: {
    ...mapState('deathPage', ['certKindType'])
  },
  methods: {
    hideModal () {
      this.$modal.hide('to-instead')
    },
    onCreate () {
      this.$validator.validate().then(valid => {
        if (valid) {
          this.form.certKind = this.select.certKind
          if (this.typeCert === 'Death') {
            this.$store.commit('deathPage/CHANGE_STATE_INSTEAD', true)
            // this.$store.commit('deathPage/CHANGE_STATE_DUPLICATE', false)
            this.$store.dispatch('deathPage/onDuplicateOrInstead', this.form)
          }
          if (this.typeCert === 'PerinatalDeath') {
            this.$store.commit('perinatalDeathPage/CHANGE_STATE_INSTEAD', true)
            // this.$store.commit('perinatalDeathPage/CHANGE_STATE_DUPLICATE', false)
            this.$store.dispatch('perinatalDeathPage/onDuplicateOrInstead', this.form)
          }
          this.$modal.hide('to-instead')
          this.select = {}
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

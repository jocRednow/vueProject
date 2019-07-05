<template>
  <div>
    <Loader :loader="this.loader" />
    <div v-if="loading">
      <h1>Проверка доступа...</h1>
    </div>
    <div v-if="adminRole">
      <div class="row">
        <div class="col-md-12">
          <h2 v-if="this.$route.params.id" class="mt-2 mb-5">Редактирование личность:</h2>
          <h2 v-else class="mt-2 mb-5">Создание личность:</h2>
          <form>
            <div class="form-row mb-3">
              <div class="col-md-4">
                <label for="lastName">Фамилия</label>
                <input type="text" id="lastName" v-model="personForm.lastName"
                       name="lastName" class="form-control" />
              </div>
              <div class="col-md-4">
                <label for="firstName">Имя</label>
                <input type="text" id="firstName" v-model="personForm.firstName"
                       name="firstName" class="form-control" />
              </div>
              <div class="col-md-4">
                <label for="patronymicName">Отчество</label>
                <input type="text" id="patronymicName" v-model="personForm.patronymicName"
                       name="patronymicName" class="form-control" />
              </div>
            </div>
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
import { mapState, mapGetters } from 'vuex'
import Loader from './../elements/Loader'

export default {
  name: 'person-form',
  components: {
    Loader
  },
  beforeMount () {
    this.$store.dispatch('adminUserPage/onCurrentUserGet')
    /* CREATE|EDIT */
    if (this.$route.params.id) {
      let id = this.$route.params.id
      this.$store.dispatch('adminUserPage/getPerson', id)
    } else {
      this.$store.dispatch('adminUserPage/getEmptyPerson')
    }
    /* END CREATE|EDIT */
  },
  mounted () {},
  data () {
    return {}
  },
  computed: {
    ...mapState('adminUserPage', ['loading', 'loader', 'adminRole', 'miacRole', 'printerRole', 'signerRole', 'message']),
    ...mapGetters('adminUserPage', ['personForm'])
  },
  methods: {
    onSave () {
      this.$store.dispatch('adminUserPage/postPerson', this.personForm)
    }
  }
}
</script>

<style scoped>

</style>

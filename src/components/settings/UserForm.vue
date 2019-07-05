<template>
  <div>
    <Loader :loader="this.loader" />
    <div v-if="loading">
      <h1>Проверка доступа...</h1>
    </div>
    <div v-if="adminRole">
      <div class="row">
        <div class="col-md-12">
          <h2 v-if="this.$route.params.id" class="mt-2 mb-5">Редактирование пользователя:</h2>
          <h2 v-else class="mt-2 mb-5">Создание пользователя:</h2>
          <form>
            <div class="form-row mb-3">
              <div class="col-md-4">
                <label for="lastName">Фамилия</label>
                <input type="text" id="lastName" v-model="userForm.personId.lastName"
                       name="lastName" class="form-control" />
              </div>
              <div class="col-md-4">
                <label for="firstName">Имя</label>
                <input type="text" id="firstName" v-model="userForm.personId.firstName"
                       name="firstName" class="form-control" />
              </div>
              <div class="col-md-4">
                <label for="patronymicName">Отчество</label>
                <input type="text" id="patronymicName" v-model="userForm.personId.patronymicName"
                       name="patronymicName" class="form-control" />
              </div>
            </div>
            <div class="form-row mb-3">
              <div class="col-md-6">
                <label for="login">Логин</label>
                <input type="text" id="login" v-model="userForm.login"
                       name="login" class="form-control" />
              </div>
              <div class="col-md-6">
                <label for="password">Пароль</label>
                <input type="text" id="password" v-model="userForm.password"
                       name="password" class="form-control" />
              </div>
            </div>
            <div class="form-row mt-5 mb-3">
              <div class="custom-control custom-checkbox mr-5 ml-2">
                <input type="checkbox" v-model="userForm.accountNonExpired" name="accountNonExpired"
                       class="custom-control-input pointer" id="accountNonExpired">
                <label class="custom-control-label pointer mr-3" for="accountNonExpired"><strong>accountNonExpired</strong></label>
              </div>
              <div class="custom-control custom-checkbox mr-5">
                <input type="checkbox" v-model="userForm.accountNonLocked" name="accountNonLocked"
                       class="custom-control-input pointer" id="accountNonLocked">
                <label class="custom-control-label pointer mr-3" for="accountNonLocked"><strong>accountNonLocked</strong></label>
              </div>
              <div class="custom-control custom-checkbox mr-5">
                <input type="checkbox" v-model="userForm.credentialsNonExpired" name="credentialsNonExpired"
                       class="custom-control-input pointer" id="credentialsNonExpired">
                <label class="custom-control-label pointer mr-3" for="credentialsNonExpired"><strong>credentialsNonExpired</strong></label>
              </div>
              <div class="custom-control custom-checkbox mr-5">
                <input type="checkbox" v-model="userForm.enabled" name="enabled"
                       class="custom-control-input pointer" id="enabled">
                <label class="custom-control-label pointer mr-3" for="enabled"><strong>enabled</strong></label>
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
  name: 'users-form',
  components: {
    Loader
  },
  beforeMount () {
    this.$store.dispatch('adminUserPage/onCurrentUserGet')
    /* CREATE|EDIT */
    if (this.$route.params.id) {
      let id = this.$route.params.id
      this.$store.dispatch('adminUserPage/getUser', id)
    } else {
      this.$store.dispatch('adminUserPage/getEmptyUser')
    }
    /* END CREATE|EDIT */
  },
  mounted () {},
  data () {
    return {}
  },
  computed: {
    ...mapState('adminUserPage', ['loading', 'loader', 'adminRole', 'miacRole', 'printerRole', 'signerRole', 'message']),
    ...mapGetters('adminUserPage', ['userForm'])
  },
  methods: {
    onSave () {
      this.$store.dispatch('adminUserPage/postUser', this.userForm)
    }
  }
}
</script>

<style scoped>

</style>

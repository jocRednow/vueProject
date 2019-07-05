<template>
  <div>
    <Loader :loader="this.loader" />
    <div class="row">
      <div class="offset-4 col-md-4">
        <div class="text-center mt-5 mb-5">
          <a href="/"><img src="../assets/logo-large.jpg"></a>
        </div>
        <h2 class="text-center mb-4">Система регистрации фактов рождения и смерти</h2>
        <form>
          <!--<small class="form-text text-muted text-center">Отсутствие активности более 60 минут. Пожалуйста, авторизуйтесь заново</small>-->
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon1"><font-awesome-icon :icon="['fas', 'user']" /></span>
            </div>
            <input type="text" class="form-control" placeholder="Логин" v-model="form.username"
                   aria-label="Username" aria-describedby="basic-addon1">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon2"><font-awesome-icon :icon="['fas', 'lock']" /></span>
            </div>
            <input type="password" class="form-control" placeholder="Пароль" v-model="form.password"
                   aria-label="Password" aria-describedby="basic-addon2">
          </div>
          <button type="submit" class="btn btn-lg btn-primary width-100"
                  :disabled="!form.password" @click.prevent="onLogin">Войти</button>
          <div v-if="textMessage && textMessage.length > 0" class="alert alert-success mt-2">
            <p class="text-center">{{ textMessage }}</p>
          </div>
          <div v-if="errorTextMessage && errorTextMessage.length > 0" class="alert alert-danger mt-2">
            <p class="text-center">{{ errorTextMessage }}</p>
          </div>
          <div v-if="backendTextMessage.length > 0" class="alert alert-danger mt-2">
            <ul class="list-unstyled">
              <li v-for="(message, i) in backendTextMessage" :key="i">{{ message.defaultMessage }}</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Loader from './elements/Loader'

export default {
  name: 'Login',
  components: {
    Loader
  },
  computed: {
    ...mapState('loginPage', ['loader', 'textMessage', 'errorTextMessage', 'backendTextMessage']),
    ...mapGetters('loginPage', ['form'])
  },
  methods: {
    onLogin () {
      console.log('Login...')
      this.$store.dispatch('loginPage/onLogin', this.form)
    }
  }
}
</script>

<style scoped>
  .width-100 {
    width: 100%;
  }
</style>

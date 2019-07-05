<template>
  <div class="row header" v-if="['Search'].indexOf($route.name) > -1">
    <!-- Modal -->
    <div class="modal fade" id="newForm" tabindex="-1" role="dialog" aria-labelledby="newFormLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title text-center" id="newFormLabel">Создать новое свидетельство</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <font-awesome-icon :icon="['fas', 'times']" title="Закрыть" />
            </button>
          </div>
          <div class="modal-body model-body-custom">
            <router-link v-if="birthCreatorRole || adminRole" to="/bornForm" tag="button"
                         class="btn btn-lg btn-outline-info mb-4"
                         data-dismiss="modal" aria-label="Close">О рождении</router-link>
            <router-link v-if="deathCreatorRole || adminRole" to="/deathForm" tag="button"
                         class="btn btn-lg btn-outline-danger mb-4"
                         data-dismiss="modal" aria-label="Close">О смерти</router-link>
            <router-link v-if="perinatalDeathCreatorRole || adminRole" to="/perinatalDeathForm" tag="button"
                         class="btn btn-lg btn-outline-warning text-hover-white mb-4"
                         data-dismiss="modal" aria-label="Close">О перинатальной смерти</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- END Modal -->
    <div class="col-sm-3 align-self-center">
      <a href="/"><img src="../../assets/logo.jpg"></a>
    </div>
    <div class="col-sm-4 align-self-center">
      <button v-if="birthCreatorRole || deathCreatorRole || perinatalDeathCreatorRole || adminRole" class="btn btn-lg btn-outline-primary"
              data-toggle="modal" data-target="#newForm">Создать новое свидетельство</button>
    </div>
    <div class="col-sm-4 align-self-end mt-3">
      <p class="float-right" v-if="user.principal && user.principal.personId">{{ user.principal.personId.lastName }} {{ user.principal.personId.firstName }} {{ user.principal.personId.patronymicName }}</p>
    </div>
    <div class="col-sm-1 align-self-center">
      <button class="btn btn-light" @click="logOut"><font-awesome-icon :icon="['fas', 'sign-out-alt']" title="Выйти" /></button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Header',
  computed: {
    ...mapState('searchPage', ['adminRole', 'miacRole', 'birthCreatorRole', 'deathCreatorRole', 'perinatalDeathCreatorRole', 'printerRole', 'signerRole']),
    ...mapState('searchPage', ['user'])
  },
  methods: {
    logOut () {
      console.log('Logout...')
      this.$store.dispatch('searchPage/onLogout')
    }
  }
}
</script>

<style scoped>
  .header {
    padding: 20px 20px;
  }
  .model-body-custom {
    text-align: center;
    padding: 20px 20px;
  }
  .model-body-custom button {
    width: 100%;
  }
</style>

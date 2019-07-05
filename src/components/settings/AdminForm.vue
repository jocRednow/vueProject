<template>
  <div>
    <Loader :loader="this.loader" />
    <div v-if="loading">
      <h1>Проверка доступа...</h1>
    </div>
    <div v-if="adminRole">
      <h2 class="text-center mt-2 mb-5">Техническая поддержка</h2>
      <ul class="nav nav-tabs nav-justified mb-3" id="adminTab" role="tablist">
        <li class="nav-item custom-item">
          <a class="nav-link active" id="info-tab" data-toggle="tab"
             href="#users" role="tab" aria-controls="users" aria-selected="true">Пользователи</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="mother-tab" data-toggle="tab"
             href="#persons" role="tab" aria-controls="persons" aria-selected="false">Личности</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="child-tab" data-toggle="tab"
             href="#departments" role="tab" aria-controls="departments" aria-selected="false">Департаменты</a>
        </li>
      </ul>
      <div class="tab-content" id="adminTabContent">
        <div class="tab-pane fade show active" id="users" role="tabpanel" aria-labelledby="users-tab">
          <div class="col-md-12">
            <button class="btn btn-outline-primary" @click="onCreate">Создать пользователя</button>
          </div>
          <div class="col-md-12 mt-4">
            <table class="table table-bordered custom-table">
              <thead>
              <tr class="table-secondary border-bottom border-dark align-middle custom-border-header">
                <th class="align-middle">ФИО</th>
                <th class="align-middle">Логин</th>
                <th class="align-middle"></th>
              </tr>
              </thead>
              <tbody>
              <tr class="border-bottom custom-border pointer" v-for="item in users" :key="item.id">
                <td class="align-middle">
                  <span v-if="item.personId">{{ item.personId.lastName }} {{ item.personId.firstName }} {{ item.personId.patronymicName }}</span>
                </td>
                <td class="align-middle">
                  <span>{{ item.login }}</span>
                </td>
                <td class="align-middle">
                  <button class="btn btn-sm btn-outline-secondary float-right" @click="onEdit(item)">Изменить</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane fade" id="persons" role="tabpanel" aria-labelledby="persons-tab">
          <div class="col-md-12">
            <button class="btn btn-outline-primary" @click="onCreatePerson">Создать личность</button>
          </div>
          <div class="col-md-12 mt-4">
            <table class="table table-bordered custom-table">
              <thead>
              <tr class="table-secondary border-bottom border-dark align-middle custom-border-header">
                <th class="align-middle">ФИО</th>
                <th class="align-middle"></th>
              </tr>
              </thead>
              <tbody>
              <tr class="border-bottom custom-border pointer" v-for="item in persons" :key="item.id">
                <td class="align-middle">
                  <span>{{ item.lastName }} {{ item.firstName }} {{ item.patronymicName }}</span>
                </td>
                <td class="align-middle">
                  <button class="btn btn-sm btn-outline-secondary float-right" @click="onEditPerson(item)">Изменить</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tab-pane fade" id="departments" role="tabpanel" aria-labelledby="departments-tab">
          <div class="col-md-12">
            <button class="btn btn-outline-primary" @click="onCreateDepartment">Создать департамент</button>
          </div>
          <div class="col-md-12 mt-4">
            <table class="table table-bordered custom-table">
              <thead>
              <tr class="table-secondary border-bottom border-dark align-middle custom-border-header">
                <th class="align-middle">Мед. организация</th>
                <th class="align-middle">Код по ОКПО</th>
                <th class="align-middle">Адрес</th>
                <th class="align-middle"></th>
              </tr>
              </thead>
              <tbody>
              <tr class="border-bottom custom-border pointer" v-for="item in departments" :key="item.departmentId">
                <td class="align-middle">{{ item.name }}</td>
                <td class="align-middle">{{ item.code }}</td>
                <td class="align-middle">
                  <div v-if="item.address">{{ item.address.addressTxt }}</div>
                </td>
                <td class="align-middle">
                  <button class="btn btn-sm btn-outline-secondary float-right" @click="onEditDepartment(item)">Изменить</button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-dark text-center mt-5 mb-5">У ВАС НЕТ ДОСТУПА.</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loader from './../elements/Loader'

export default {
  name: 'admin-form',
  components: {
    Loader
  },
  beforeMount () {
    this.$store.dispatch('adminUserPage/onCurrentUserGet')
  },
  mounted () {
    this.$store.dispatch('adminUserPage/getAllUsers')
    this.$store.dispatch('adminUserPage/getAllPersons')
    this.$store.dispatch('adminUserPage/getDepartments')
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('adminUserPage', ['loading', 'loader', 'adminRole', 'miacRole', 'printerRole', 'signerRole',
      'users', 'persons', 'departments'])
  },
  methods: {
    onCreate () {
      this.$router.push({ name: 'UserForm' })
    },
    onEdit (item) {
      let id = item.id
      this.$router.push({ name: 'UserFormEdit', params: { id } })
    },
    onCreatePerson () {
      this.$router.push({ name: 'PersonForm' })
    },
    onEditPerson (item) {
      let id = item.id
      this.$router.push({ name: 'PersonFormEdit', params: { id } })
    },
    onCreateDepartment () {
      this.$router.push({ name: 'DepartmentForm' })
    },
    onEditDepartment (item) {
      let id = item.departmentId
      this.$router.push({ name: 'DepartmentFormEdit', params: { id } })
    }
  }
}
</script>

<style scoped>
  .nav-link {
    font-size: 18px;
    font-weight: bold;
  }
</style>

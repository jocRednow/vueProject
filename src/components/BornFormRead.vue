<template>
  <div>
    <OutModalRead :form="this.form" />
    <div v-if="loading">
      <h1>Загрузка...</h1>
    </div>
    <form v-else class="needs-validation" novalidate>
      <div class="form-title-born">
        <div class="row">
          <div class="col-sm-9">
            <h1 class="mb-4">Свидетельство о рождении:</h1>
          </div>
          <div class="col-sm-3">
            <font-awesome-icon class="pointer float-right" :icon="['fas', 'times']" size="2x" @click="onExit" title="Закрыть" />
            <font-awesome-icon v-if="birthCreatorRole || adminRole" class="pointer float-right mr-3" :icon="['fas', 'edit']" size="2x" @click="onEdit" title="Редактировать" />
            <a v-if="certRouteID && form.certStatus !== null"
               :href="API_URL + '/report/' + certRouteID + '/previewBirth'" target="_blank" title="Предварительный просмотр">
              <font-awesome-icon class="pointer float-right mr-3 text-dark" :icon="['fas', 'eye']" size="2x" />
            </a>
            <a v-if="form.certStatus !== null && form.certStatus !== 'черновик' && certRouteID && (printerRole || adminRole) && !form.isPrint"
               :href="API_URL + '/report/' + certRouteID + '/birth'" target="_blank" title="Печать">
              <font-awesome-icon class="pointer float-right mr-3 text-dark" :icon="['fas', 'print']" size="2x" />
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3">
            <span v-if="form.certStatus">Статус: <kbd>{{ form.certStatus }}</kbd></span>
          </div>
          <div class="col-sm-5"></div>
          <div class="col-sm-4">
            <span v-if="form.isPrint" class="float-right"><kbd>Свидетельство распечатано</kbd></span>
          </div>
        </div>
      </div>
      <div class="row mt-2 mb-3 ml-3">
        <div class="col-md-6">
          <table class="table table-borderless border-right">
            <tr>
              <th width="30%">Мед. организация:</th>
              <td>{{ stuff.medOrg }}</td>
            </tr>
            <tr>
              <th>Адрес:</th>
              <td>{{ stuff.address }}</td>
            </tr>
            <!--<tr>
              <th>Код по ОКПО:</th>
              <td>{{ stuff.code }}</td>
            </tr>-->
          </table>
        </div>
        <div class="col-md-6">
          <div class="custom-control custom-checkbox mt-3">
            <input type="checkbox" :disabled="true" v-model="form.isDuplicate" name="isDuplicate"
                   class="custom-control-input pointer" id="isDuplicate">
            <label class="custom-control-label pointer" for="isDuplicate"><strong>Дубликат</strong></label>
          </div>
          <div v-if="miacRole" class="mt-5">
            <p><strong>Резолюция: {{ form.resolution }}</strong></p>
          </div>
          <div v-else class="mt-5">
            <p v-if="form.resolutionName">Резолюция: <kbd>{{ form.resolutionName }}</kbd></p>
          </div>
        </div>
      </div>
      <ul class="nav nav-tabs mb-3" id="bornTab" role="tablist">
        <li class="nav-item custom-item">
          <a class="nav-link active" id="info-tab" data-toggle="tab"
             href="#info" role="tab" aria-controls="info" aria-selected="true">Общая информация</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="mother-tab" data-toggle="tab"
             href="#mother" role="tab" aria-controls="mother" aria-selected="false">Мать</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="child-tab" data-toggle="tab"
             href="#child" role="tab" aria-controls="child" aria-selected="false">Ребёнок</a>
        </li>
      </ul>
      <div class="tab-content ml-4" id="bornTabContent">
        <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
          <div class="form-row mb-3">
            <div class="col-md-2">
              <label>Серия свидетельства</label>
              <p>{{ form.certSeries }}</p>
            </div>
            <div class="col-md-2">
              <label>Номер свидетельства</label>
              <p>{{ form.certNumber }}</p>
            </div>
            <div class="col-md-2">
              <label>Дата выдачи</label>
              <p>{{ form.certIssueDate }}</p>
            </div>
            <div class="col-md-3">
              <!--<label>Тип свидетельства</label>
              <p>{{ form.certKind }}</p>-->
            </div>
            <div class="col-md-3"></div>
            <div class="col-md-2 mt-3">
              <label>Дата получения</label>
              <p>{{ form.receivingDate }}</p>
            </div>
          </div>
          <div class="form-row mb-3" v-if="form.isDuplicate === true">
            <div class="col-md-2">
              <label>Серия предыдущего свидетельства</label>
              <p v-if="form.prevCertId">{{ form.prevCertId.certSeries }}</p>
            </div>
            <div class="col-md-2">
              <label>Номер предыдущего свидетельства</label>
              <p v-if="form.prevCertId">{{ form.prevCertId.certNumber }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="custom-control custom-checkbox col-md-4 mb-3">
            <input type="checkbox" v-model="form.isPrivatePractitioner" name="isPrivatePractitioner"
                   class="custom-control-input pointer" id="isPrivatePractitioner"
                   :disabled="true">
            <label class="custom-control-label pointer" for="isPrivatePractitioner">Для врача, занимающегося частной практикой</label>
          </div>
          <div class="form-row mb-3" v-if="form.isPrivatePractitioner === true">
            <div class="col-md-2">
              <label>№ Лицензии</label>
              <p>{{ form.privatePractitionerLicenceNumber }}</p>
            </div>
            <div class="col-md-2">
              <label>Адрес</label>
              <p>{{ form.privatePractitionerAddress }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>8. Врач (фельдшер, акушерка) выдавший медицинское свидетельство</strong></h5>
            </div>
            <p>{{ form.medCertBirth.certIssueByEmpl }}</p>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>9. Получатель</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.recipient.lastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.recipient.firstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.recipient.patronymicName }}</p>
            </div>
            <div class="col-md-3">
              <label>Отношение к ребёнку</label>
              <p>{{ form.recipient.relationshipType }}</p>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-3">
              <label>Тип документа</label>
              <p>{{ form.recipient.identDocType }}</p>
            </div>
            <div class="col-md-2">
              <label>Серия</label>
              <p>{{ form.recipient.identDocSeries }}</p>
            </div>
            <div class="col-md-2">
              <label>Номер</label>
              <p>{{ form.recipient.identDocNumber }}</p>
            </div>
            <div class="col-md-2">
              <label>Дата выдачи документа</label>
              <p>{{ form.recipient.identDocIssueDate }}</p>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-8">
              <label>Кем выдан</label>
              <p>{{ form.recipient.identDocIssueBy }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>19. Лицо, принимавшее роды</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.medCertBirth.accoucheurTypeB }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>20. Заполнил медицинское свидетельство</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.filledOutMedCertId }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>Руководитель медицинской организации</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.headOfMedOrgId }}</p>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="mother" role="tabpanel" aria-labelledby="mother-tab">
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>1. Ребёнок родился</strong></h5>
            </div>
            <label class="col-md-12">Дата и время рождения</label>
            <div class="col-md-5">
              <p>{{ form.medCertBirth.childBirthDate }}
                <span v-if="form.medCertBirth.childBirthTime"> | </span> {{ form.medCertBirth.childBirthTime }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-7">
              <h5><strong>2. ФИО матери</strong></h5>
            </div>
            <div class="col-md-5">
              <h5><strong>3. Дата рождения матери</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertBirth.motherLastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertBirth.motherFirstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertBirth.motherPatronymicName }}</p>
            </div>
            <div class="col-md-2 offset-1">
              <label>Дата рождения</label>
              <p v-if="form.medCertBirth.motherBirthDate_isYear === false">{{ form.medCertBirth.motherBirthDate }}</p>
              <p v-if="form.medCertBirth.motherBirthDate_isYear === true">{{ form.medCertBirth.motherBirthDate }}</p>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <label for="motherBirthDate_isYear"></label>
                <input type="checkbox" v-model="form.medCertBirth.motherBirthDate_isYear" name="motherBirthDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="motherBirthDate_isYear">
                <label class="custom-control-label pointer" for="motherBirthDate_isYear">Известен только год</label>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>4. Место постоянного жительства (регистрации)</strong></h5>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesRead :address="form.medCertBirth.addresses[0]" />
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>5. Местность</strong></h5>
              <p>{{ form.medCertBirth.addresses[0].locality }}</p>
            </div>
          </div>
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>6. Семейное положение</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertBirth.motherFamilyStatus }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>7. Образование</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>8. Занятость</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertBirth.motherEduLevel }}</p>
            </div>
            <div class="col-md-5 offset-1">
              <p>{{ form.medCertBirth.motherEmplState }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>9. Срок первой явки к врачу</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>10. Которым по счёту ребёнок был рождён у матери</strong></h5>
            </div>
            <div class="col-md-1">
              <p>{{ form.medCertBirth.firstAppearanceToDoctor }}</p>
            </div>
            <div class="col-md-1 pt-md-2">
              <p>недели</p>
            </div>
            <div class="col-md-1 offset-4">
              <p>{{ form.medCertBirth.childNumber }}</p>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="child" role="tabpanel" aria-labelledby="child-tab">
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>11. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertBirth.lastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertBirth.firstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertBirth.patronymicName }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>12. Место рождения</strong></h5>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesRead :address="form.medCertBirth.addresses[1]" />
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>13. Местность</strong></h5>
              <p>{{ form.medCertBirth.addresses[1].locality }}</p>
            </div>
          </div>
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>14. Роды произошли</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>15. Пол</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertBirth.birthLocation }}</p>
            </div>
            <div class="col-md-5 offset-1">
              <p>{{ form.medCertBirth.gender }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>16. Масса тела ребенка при рождении</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>17. Длина тела ребенка при рождении</strong></h5>
            </div>
            <div class="col-md-1">
              <p class="mt-2">{{ form.medCertBirth.weight }}</p>
            </div>
            <div class="col-md-1 pt-md-2">
              <p>Г.</p>
            </div>
            <div class="col-md-1 offset-4">
              <p class="mt-2">{{ form.medCertBirth.length }}</p>
            </div>
            <div class="col-md-1 pt-md-2">
              <p>СМ.</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>18. Ребёнок родился</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertBirth.fertility }}</p>
            </div>
          </div>
          <div class="form-row mb-3" v-if="showChildBornFields">
            <div class="col-md-2">
              <label>Которым по счёту</label>
              <p>{{ form.medCertBirth.childBornNumber }}</p>
            </div>
            <div class="col-md-2">
              <label>Число родившихся</label>
              <p>{{ form.medCertBirth.totalChildBornNumber }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <div class="row">
          <div class="col-md-10"></div>
          <div class="col-md-2">
            <back-to-top bottom="35px" right="50px" visibleoffset="500">
              <button type="button" class="btn btn-info btn-to-top">
                <font-awesome-icon :icon="['fas', 'chevron-up']" />
              </button>
            </back-to-top>
            <button class="btn btn-lg btn-outline-dark" @click.prevent="onExit">Выйти</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { API_URL } from '@/main'

import { mapState, mapGetters } from 'vuex'
import OutModalRead from './elements/OutModalRead'
import AddressesRead from './elements/AddressesRead'

export default {
  name: 'born-form-read',
  components: {
    OutModalRead,
    AddressesRead
  },
  beforeMount () {
    /* CHECK USER */
    this.$store.dispatch('searchPage/onUserCheck')
    /* END CHECK USER */
    /* READ */
    this.certRouteID = this.$route.params.id
    this.$store.dispatch('bornPage/onReadForm', this.certRouteID)
    /* END READ */
  },
  data () {
    return {
      API_URL: API_URL,
      certRouteID: ''
    }
  },
  computed: {
    ...mapState('searchPage', ['adminRole', 'miacRole', 'birthCreatorRole', 'printerRole', 'signerRole']),
    ...mapState('bornPage', ['loading']),
    ...mapGetters('bornPage', ['form', 'stuff']),
    showChildBornFields () {
      if (this.form.medCertBirth.fertility && this.form.medCertBirth.fertility === 2) return true
      else {
        this.form.medCertBirth.childBornNumber = null
        this.form.medCertBirth.totalChildBornNumber = null
        return false
      }
    }
  },
  methods: {
    onEdit () {
      let id = this.form.medCertId
      this.$router.push({ name: 'BornFormEdit', params: { id } })
    },
    onExit () {
      this.$modal.show('go-out')
    }
  }
}
</script>

<style scoped>
  .custom-item {
    padding-bottom: 0!important;
  }
  .form-errors {
    margin: 0 -15px 0 -30px;
    padding: 15px 20px 5px 30px;
  }
  .form-footer {
    margin: 100px -15px 0 -30px;
    position: relative;
    padding: 30px 45px;
    background-color: #D9EBFA;
  }
  .form-title-born:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background-color: #17A2B8;
  }
  .form-title-born {
    position: relative;
    margin: 0 -15px;
    padding: 30px 30px 20px 50px;
    background-color: #D9EBFA;
  }
  .form-line {
    margin: 20px 0;
    border-bottom: 1px solid #D9EBFA;
  }
  .nav-tabs {
    border-bottom: 1px solid #D9EBFA;
  }
  .nav-item {
    padding: 10px 30px;
  }
  .nav-link {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    opacity: 0.4;
    border-bottom: 3px solid #FFFFFF;
  }
  .nav-link.active {
    border: none;
    opacity: 1;
    border-bottom: 3px solid #17A2B8;
  }
</style>

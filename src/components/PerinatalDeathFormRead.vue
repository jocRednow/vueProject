<template>
  <div>
    <OutModalRead :form="this.form" />
    <div v-if="loading">
      <h1>Загрузка...</h1>
    </div>
    <form v-else class="needs-validation" novalidate>
      <div class="form-title-perinatal-death">
        <div class="row">
          <div class="col-sm-9">
            <h1 class="mb-4">Свидетельство о перинатальной смерти:</h1>
          </div>
          <div class="col-sm-3">
            <font-awesome-icon class="pointer float-right" :icon="['fas', 'times']" size="2x" @click="onExit" title="Закрыть" />
            <font-awesome-icon v-if="perinatalDeathCreatorRole || adminRole" class="pointer float-right mr-3" :icon="['fas', 'edit']" size="2x" @click="onEdit" title="Редактировать" />
            <a v-if="certRouteID && form.checkedBy !== null && form.checkDate !== null"
               :href="API_URL + '/report/' + certRouteID + '/previewPerinatalDeath'" target="_blank" title="Предварительный просмотр">
              <font-awesome-icon class="pointer float-right mr-3 text-dark" :icon="['fas', 'eye']" size="2x" />
            </a>
            <a v-if="certRouteID && form.checkedBy !== null && form.checkDate !== null && (printerRole || adminRole) && !form.isPrint"
               :href="API_URL + '/report/' + certRouteID + '/perinatalDeath'" target="_blank" title="Печать">
              <font-awesome-icon class="pointer float-right mr-3 text-dark" :icon="['fas', 'print']" size="2x" />
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-3">
            <span v-if="form.certStatus">Статус: <kbd>{{ form.certStatus }}</kbd></span>
          </div>
          <div class="col-sm-5">
            <button v-if="signerRole && form.certStatus !== null && form.certStatus !== 'черновик' && form.checkedBy === null"
                    @click.prevent="onSigning()" class="btn btn-lg btn-outline-success">Подписать</button>
            <span v-if="form.checkedBy !== null && form.checkDate !== null" class="text-success mt-2 ml-2"><strong>Подписано: {{ form.checkDate }}</strong></span>
          </div>
          <div class="col-sm-4">
            <span v-if="form.isPrint" class="float-right"><kbd>Свидетельство распечатано</kbd></span>
          </div>
        </div>
      </div>
      <div class="row mt-2 mb-3 ml-3">
        <div class="col-md-6">
          <table class="table table-borderless border-right">
            <tr v-if="moSelectorRole">
              <th width="30%">Площадка БСМЭ:</th>
              <td>{{ stuff.deptPlace }}</td>
            </tr>
            <tr v-if="!moSelectorRole">
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
      <ul class="nav nav-tabs mb-3" id="perinatalDeathTab" role="tablist">
        <li class="nav-item custom-item">
          <a class="nav-link active" id="info-tab" data-toggle="tab"
             href="#info" role="tab" aria-controls="info" aria-selected="true">Общая информация</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="mother-tab" data-toggle="tab"
             href="#mother" role="tab" aria-controls="mother" aria-selected="false">Мать</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="died-tab" data-toggle="tab"
             href="#died" role="tab" aria-controls="died" aria-selected="false">Ребёнок (плод)</a>
        </li>
      </ul>
      <div class="tab-content ml-4" id="perinatalDeathTabContent">
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
              <label>Тип свидетельства</label>
              <p>{{ form.certKind }}</p>
            </div>
            <div class="col-md-2">
              <label></label>
              <div class="custom-control custom-checkbox mt-2">
                <input type="checkbox" :disabled="true" v-model="form.insteadOf" name="insteadOf"
                       class="custom-control-input pointer" id="insteadOf">
                <label class="custom-control-label pointer" for="insteadOf"><strong>Взамен</strong></label>
              </div>
            </div>
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
              <h5><strong>3. Смерть наступила</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.medCertPerinatalDeath.birthRelatedDeathMoment }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 1 || form.medCertPerinatalDeath.birthRelatedDeathMoment == 2">
            <div class="col-md-12">
              <h5><strong>1. Роды мёртвым плодом</strong></h5>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertPerinatalDeath.deadFetusDate }}</p>
            </div>
            <div class="col-md-1">
              {{ form.medCertPerinatalDeath.deadFetusTime }}
            </div>
            <div class="col-md-1">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.deadFetusDate_isYear" name="deadFetusDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="deadFetusDate_isYear">
                <label class="custom-control-label pointer" for="deadFetusDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.deadFetusDate_isYearMonth" name="deadFetusDate_isYearMonth"
                       :disabled="true"
                       class="custom-control-input pointer" id="deadFetusDate_isYearMonth">
                <label class="custom-control-label pointer" for="deadFetusDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 1 || form.medCertPerinatalDeath.birthRelatedDeathMoment == 2"></div>
          <div class="form-row mb-3" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 3">
            <div class="col-md-6">
              <h5><strong>2. Ребёнок родился живым</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>И умер</strong></h5>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertPerinatalDeath.childBirthDate }}</p>
            </div>
            <div class="col-md-1">
              {{ form.medCertPerinatalDeath.childBirthTime }}
            </div>
            <div class="col-md-1">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childBirthDate_isYear" name="childBirthDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="childBirthDate_isYear">
                <label class="custom-control-label pointer" for="childBirthDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childBirthDate_isYearMonth" name="childBirthDate_isYearMonth"
                       :disabled="true"
                       class="custom-control-input pointer" id="childBirthDate_isYearMonth">
                <label class="custom-control-label pointer" for="childBirthDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertPerinatalDeath.childDeathDate }}</p>
            </div>
            <div class="col-md-1">
              <p>{{ form.medCertPerinatalDeath.childDeathTime }}</p>
            </div>
            <div class="col-md-1">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childDeathDate_isYear" name="childDeathDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="childDeathDate_isYear">
                <label class="custom-control-label pointer" for="childDeathDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childDeathDate_isYearMonth" name="childDeathDate_isYearMonth"
                       :disabled="true"
                       class="custom-control-input pointer" id="childDeathDate_isYearMonth">
                <label class="custom-control-label pointer" for="childDeathDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 3"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>13. Запись акта</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Номер</label>
              <p>{{ form.medCertPerinatalDeath.actRecordNumber }}</p>
            </div>
            <div class="col-md-2">
              <label>Дата</label>
              <p>{{ form.medCertPerinatalDeath.actRecordDate }}</p>
            </div>
            <div class="col-md-2">
              <label>Орган ЗАГС</label>
              <p>{{ form.medCertPerinatalDeath.registryDepartment }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>Работник органа ЗАГС</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertPerinatalDeath.actRecordEmployeeLastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertPerinatalDeath.actRecordEmployeeFirstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertPerinatalDeath.actRecordEmployeePatronymicName }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>14. Получатель</strong></h5>
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
              <p>{{ form.recipient.relationshipTyp }}</p>
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
              <h5><strong>25. Заполнил медицинское свидетельство</strong></h5>
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
              <h5><strong>4. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertPerinatalDeath.motherLastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertPerinatalDeath.motherFirstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertPerinatalDeath.motherPatronymicName }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>5. Дата рождения</strong></h5>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertPerinatalDeath.motherBirthDate }}</p>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.motherBirthDate_isYear" name="motherBirthDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="motherBirthDate_isYear">
                <label class="custom-control-label pointer" for="motherBirthDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.motherBirthDate_isYearMonth" name="motherBirthDate_isYearMonth"
                       :disabled="true"
                       class="custom-control-input pointer" id="motherBirthDate_isYearMonth">
                <label class="custom-control-label pointer" for="motherBirthDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.motherBirthDateUnknow" name="motherBirthDateUnknow"
                       :disabled="true"
                       class="custom-control-input pointer" id="motherBirthDateUnknow">
                <label class="custom-control-label pointer" for="motherBirthDateUnknow">неизвестно</label>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>6. Место постоянного жительства (регистрации)</strong></h5>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesRead :address="form.medCertPerinatalDeath.addresses[0]" />
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>7. Местность</strong></h5>
              <p>{{ form.medCertPerinatalDeath.addresses[0].locality }}</p>
            </div>
          </div>
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>8. Семейное положение</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.motherFamilyStatus }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>9. Образование</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>10. Занятость</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.motherEduLevel }}</p>
            </div>
            <div class="col-md-5 offset-1">
              <p>{{ form.medCertPerinatalDeath.motherEmplState }}</p>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>11. Которые по счёту роды</strong></h5>
            </div>
            <div class="col-md-1">
              <p>{{ form.medCertPerinatalDeath.motherBirthCount }}</p>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="died" role="tabpanel" aria-labelledby="died-tab">
          <div class="form-row mb-3">
            <div class="col-md-4">
              <label>Номер трупа</label>
              <p>{{ form.medCertPerinatalDeath.bodyNumberNum }}
                <span v-if="form.medCertPerinatalDeath.bodyNumberDept"> | </span> {{form.medCertPerinatalDeath.bodyNumberDept}}
                <span v-if="form.medCertPerinatalDeath.bodyNumberYear"> | </span> {{ form.medCertPerinatalDeath.bodyNumberYear }}</p>
            </div>
            <div v-if="moSelectorRole" class="col-md-3">
              <label>Код площадки БСМЭ</label>
              <p>{{ stuff.codeBSME }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>12. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertPerinatalDeath.lastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertPerinatalDeath.firstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertPerinatalDeath.patronymicName }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row">
            <div class="col-md-12">
              <h5><strong>13. Место смерти (мёртворождения)</strong></h5>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesRead :address="form.medCertPerinatalDeath.addresses[1]" />
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>14. Местность</strong></h5>
              <p>{{ form.medCertPerinatalDeath.addresses[1].locality }}</p>
            </div>
          </div>
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>15. Смерть (мёртворождение) произошла(о)</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.deathLocationP }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>16. Пол</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.gender }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>17. Масса тела ребенка (плода) при рождении</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>18. Длина тела ребенка (плода) при рождении</strong></h5>
            </div>
            <div class="col-md-1 mt-2">
              <p>{{ form.medCertPerinatalDeath.weight }}</p>
            </div>
            <div class="col-md-1 pt-md-2">
              <p>Г.</p>
            </div>
            <div class="col-md-1 offset-4 mt-2">
              <p>{{ form.medCertPerinatalDeath.length }}</p>
            </div>
            <div class="col-md-1 pt-md-2">
              <p>СМ.</p>
            </div>
            <div class="col-md-3 offset-4">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.weightAndLengthUnknow" name="weightAndLengthUnknow"
                       :disabled="true"
                       class="custom-control-input pointer" id="weightAndLengthUnknow">
                <label class="custom-control-label pointer" for="weightAndLengthUnknow"><strong>неизвестно</strong></label>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>19. Мёртворождение или живорождение</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.fertility }}</p>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertPerinatalDeath.fertility === 2"></div>
          <div class="form-row mb-3" v-if="form.medCertPerinatalDeath.fertility === 2">
            <div class="col-md-4">
              <label>Число детей родившихся (живыми и мертвыми)</label>
              <p>{{ form.medCertPerinatalDeath.childBornNumber }}</p>
            </div>
            <div class="col-md-2">
              <label>Которыми по счету</label>
              <p>{{ form.medCertPerinatalDeath.totalChildBornNumber }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>20. Которым по счету ребенок был рожден у матери (считая умерших и не считая мертворожденных)</strong></h5>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertPerinatalDeath.deathChildNumber }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>21. Смерть ребенка (плода) произошла</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.deathAccidentP }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>22. Лицо, принимавшее роды</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.medCertPerinatalDeath.accoucheurTypeP }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>23. Причины перинатальной смерти</strong></h5>
            </div>
          </div>
          <div v-for="(diagnItem, index) in form.medCertPerinatalDeath.deathReason.deathReasonDiagns"
               :key="index" class="border border-secondary rounded mt-2 p-2">
            <div class="row">
              <div class="col-md-2">
                <div v-if="index >= 4" class="alert alert-primary mb-3 custom-alert" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" :name="'print_' + index"
                           v-model="diagnItem.isPrint"
                           :disabled="true"
                           class="custom-control-input pointer" :id="'print_' + index">
                    <label class="custom-control-label pointer" :for="'print_' + index">На печать</label>
                  </div>
                </div>
              </div>
              <div class="col-md-7"></div>
              <div class="col-md-3">
                <!--<div v-if="index < 4" class="alert alert-secondary mb-3 custom-alert" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" :name="'prime_' + index"
                           v-model="diagnItem.isPrime"
                           :disabled="true"
                           class="custom-control-input pointer" :id="'prime_' + index">
                    <label class="custom-control-label pointer" :for="'prime_' + index">Основная причина смерти</label>
                  </div>
                </div>-->
              </div>
            </div>
            <div class="col-md-12">
              <label class="mb-3">
                <strong class="text-danger">{{ diagnItem.diagnType.name }}) </strong>
                <span v-if="diagnItem.diagnType.name === 'а'">Основное заболевание или патологическое <kbd>состояние плода или ребенка</kbd></span>
                <span v-if="diagnItem.diagnType.name === 'б'">Другие заболевания или патологические состояния плода или ребенка</span>
                <span v-if="diagnItem.diagnType.name === 'в'">Основное заболевание или патологическое <kbd>состояние матери</kbd>, оказавшее неблагоприятное влияние на плод или ребенка</span>
                <span v-if="diagnItem.diagnType.name === 'г'">Другие заболевания или патологические состояния матери, оказавшее неблагоприятное влияние на плод или ребенка</span>
                <span v-if="diagnItem.diagnType.name === 'д'">Другие обстоятельства, имевшие отношение к мёртворождению, смерти</span>
              </label>
              <div class="col-md-12 mb-3">
                <p><strong>{{ diagnItem.mkb.description }}</strong></p>
              </div>
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-2">
                <label>Код МКБ-10</label>
                <p><strong>{{ diagnItem.mkb.mkbCode }}</strong></p>
              </div>
              <div class="col-md-10">
                <label>Название МКБ-10</label>
                <p><strong>{{ diagnItem.mkb.name }}</strong></p>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>24. Причины смерти установлены</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.recordedDeathEmplTypeP }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>На основании</strong></h5>
            </div>
            <div class="col-md-6">
              <h5 v-if="form.medCertPerinatalDeath.recordedDeathBasedOld && form.medCertPerinatalDeath.recordedDeathBasedOld.length > 0">
                <strong>На основании (старые данные)</strong>
              </h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertPerinatalDeath.recordedDeathBased }}</p>
            </div>
            <div class="col-md-5 offset-1" v-if="form.medCertPerinatalDeath.recordedDeathBasedOld && form.medCertPerinatalDeath.recordedDeathBasedOld.length > 0">
              <div class="custom-control custom-checkbox mt-2"
                   v-for="(item, index) in form.medCertPerinatalDeath.recordedDeathBasedOld" :key="index">
                <input type="checkbox" v-model="item.value" name="recordedOld" :disabled="true"
                       class="custom-control-input pointer" :id="'recordedOld' + index">
                <label class="custom-control-label pointer mr-3" :for="'recordedOld' + index"><strong>{{ item.name }} |</strong></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <div class="row">
          <div class="col-md-10"></div>
          <div class="col-md-2">
            <back-to-top bottom="35px" right="50px" visibleoffset="500">
              <button type="button" class="btn btn-warning text-white btn-to-top">
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
  name: 'perinatal-death-form-read',
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
    this.$store.dispatch('perinatalDeathPage/onReadForm', this.certRouteID)
    /* END READ */
  },
  data () {
    return {
      API_URL: API_URL,
      certRouteID: ''
    }
  },
  computed: {
    ...mapState('searchPage', ['adminRole', 'miacRole', 'perinatalDeathCreatorRole', 'printerRole', 'signerRole', 'moSelectorRole']),
    ...mapState('perinatalDeathPage', ['loading']),
    ...mapGetters('perinatalDeathPage', ['form', 'stuff'])
  },
  methods: {
    onEdit () {
      let id = this.form.medCertId
      this.$router.push({ name: 'PerinatalDeathFormEdit', params: { id } })
    },
    onExit () {
      this.$modal.show('go-out')
    },
    onSigning () {
      this.$store.dispatch('perinatalDeathPage/onSing', this.form.medCertId)
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
    background-color: #FFF4D3;
  }
  .form-title-perinatal-death:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background-color: #FFC107;
  }
  .form-title-perinatal-death {
    position: relative;
    margin: 0 -15px;
    padding: 30px 30px 20px 50px;
    background-color: #FFF4D3;
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
    border-bottom: 3px solid #FFC107;
  }
</style>

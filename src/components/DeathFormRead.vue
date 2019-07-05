<template>
  <div>
    <OutModalRead :form="this.form" />
    <div v-if="loading">
      <h1>Загрузка...</h1>
    </div>
    <form v-else class="needs-validation" novalidate>
      <div class="form-title-death">
        <div class="row">
          <div class="col-sm-9">
            <h1 class="mb-4">Свидетельство о смерти:</h1>
          </div>
          <div class="col-sm-3">
            <font-awesome-icon class="pointer float-right" :icon="['fas', 'times']" size="2x" @click="onExit" title="Закрыть" />
            <font-awesome-icon v-if="deathCreatorRole || adminRole" class="pointer float-right mr-3" :icon="['fas', 'edit']" size="2x" @click="onEdit" title="Редактировать" />
            <a v-if="certRouteID && form.checkedBy !== null && form.checkDate !== null"
               :href="API_URL + '/report/' + certRouteID + '/previewDeath'" target="_blank" title="Предварительный просмотр">
              <font-awesome-icon class="pointer float-right mr-3 text-dark" :icon="['fas', 'eye']" size="2x" />
            </a>
            <a v-if="certRouteID && form.checkedBy !== null && form.checkDate !== null && (printerRole || adminRole) && !form.isPrint"
               :href="API_URL + '/report/' + certRouteID + '/death'" target="_blank" title="Печать">
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
      <ul class="nav nav-tabs mb-3" id="deathTab" role="tablist">
        <li class="nav-item custom-item">
          <a class="nav-link active" id="info-tab" data-toggle="tab"
             href="#info" role="tab" aria-controls="info" aria-selected="true">Общая информация</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="died-tab" data-toggle="tab"
             href="#died" role="tab" aria-controls="died" aria-selected="false">Умерший(ая)</a>
        </li>
        <li class="nav-item custom-item">
          <a class="nav-link" id="cause-of-death-tab" data-toggle="tab"
             href="#cause-of-death" role="tab" aria-controls="cause-of-death" aria-selected="false">Причина смерти</a>
        </li>
      </ul>
      <div class="tab-content ml-4" id="deathTabContent">
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
              <h5><strong>22. Заполнил медицинское свидетельство</strong></h5>
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
        <div class="tab-pane fade" id="died" role="tabpanel" aria-labelledby="died-tab">
          <div class="form-row mb-3">
            <div class="col-md-4">
              <label>Номер трупа</label>
              <p>{{ form.medCertDeath.bodyNumberNum }}
                <span v-if="form.medCertDeath.bodyNumberDept"> | </span> {{form.medCertDeath.bodyNumberDept}}
                <span v-if="form.medCertDeath.bodyNumberYear"> | </span> {{ form.medCertDeath.bodyNumberYear }}</p>
            </div>
            <div v-if="moSelectorRole" class="col-md-3">
              <label>Код площадки БСМЭ</label>
              <p>{{ stuff.codeBSME }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>1. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertDeath.lastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertDeath.lastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertDeath.patronymicName }}</p>
            </div>
            <div v-if="unknownBodyRole" class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.unknownBody" name="unknownBody"
                       :disabled="true"
                       class="custom-control-input pointer" id="unknownBody">
                <label class="custom-control-label pointer" for="unknownBody">неизвестно</label>
              </div>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-3">
              <label>Тип документа</label>
              <p>{{ form.medCertDeath.identDocType }}</p>
            </div>
            <div class="col-md-2">
              <label>Серия</label>
              <p>{{ form.medCertDeath.identDocSeries }}</p>
            </div>
            <div class="col-md-2">
              <label>Номер</label>
              <p>{{ form.medCertDeath.identDocNumber }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>2. Пол</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.medCertDeath.gender }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div v-if="form.medCertDeath.unknownBody && form.medCertDeath.birthDateUnknow" class="form-row">
            <div class="col-md-6"></div>
            <div class="col-md-5">
              <p>Предположительный возраст {{ form.medCertDeath.unknownBodyAge }} лет</p>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>3. Дата рождения</strong></h5>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertDeath.birthDate }}</p>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.birthDate_isYear" name="birthDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="birthDate_isYear">
                <label class="custom-control-label pointer" for="birthDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.birthDate_isYearMonth" name="birthDate_isYearMonth"
                       :disabled="true"
                       class="custom-control-input pointer" id="birthDate_isYearMonth">
                <label class="custom-control-label pointer" for="birthDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.birthDateUnknow" name="birthDateUnknow"
                       :disabled="true"
                       class="custom-control-input pointer" id="birthDateUnknow">
                <label class="custom-control-label pointer" for="birthDateUnknow">неизвестно</label>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>4. Дата смерти</strong></h5>
            </div>
            <div class="col-md-2">
              <p>{{ form.medCertDeath.deathDate }}</p>
            </div>
            <div class="col-md-1">
              <p>{{ form.medCertDeath.deathTime }}</p>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.deathDate_isYear" name="deathDate_isYear"
                       :disabled="true"
                       class="custom-control-input pointer" id="deathDate_isYear">
                <label class="custom-control-label pointer" for="deathDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.deathDate_isYearMonth" name="deathDate_isYearMonth"
                       :disabled="true"
                       class="custom-control-input pointer" id="deathDate_isYearMonth">
                <label class="custom-control-label pointer" for="deathDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" v-model="form.medCertDeath.deathDateUnknow" name="deathDateUnknow"
                       :disabled="true"
                       class="custom-control-input pointer" id="deathDateUnknow">
                <label class="custom-control-label pointer" for="deathDateUnknow">неизвестно</label>
              </div>
            </div>
            <div class="form-row col-md-12 mt-1">
              <div v-if="deathBiggerBorn" class="col-md-5 mt-2">
                <div class="alert alert-danger" role="alert">
                  <strong class="text-danger">Дата рождения не может быть больше даты смерти</strong>
                </div>
              </div>
              <div v-if="diffYears > 0" class="col-md-2 mt-2">
                <div class="alert alert-info" role="alert">
                  <label>Полных лет</label>
                  <strong class="text-info">
                    <strong class="mr-5" title="Лет">{{ clearYears }}</strong>
                  </strong>
                </div>
              </div>
              <div v-if="diffHours > 0 && diffYears === 0" class="col-md-8 mt-2">
                <h5><strong>Для детей, умерших в возрасте до 1 года</strong></h5>
                <div class="form-row">
                  <div class="col-md-3" v-if="diffMonths > 0">
                    <div class="alert alert-info" role="alert">
                      <label>Месяцев жизни</label>
                      <strong class="text-info">
                        <strong class="mr-5" title="Месяцев">{{ clearMonths }}</strong>
                      </strong>
                    </div>
                  </div>
                  <div class="col-md-3" v-if="diffDays > 0">
                    <div class="alert alert-info" role="alert">
                      <label>Дней жизни</label>
                      <strong class="text-info">
                        <strong class="mr-5" title="Недель">{{ clearDays }}</strong>
                      </strong>
                    </div>
                  </div>
                </div>
                <div class="form-row mb-3">
                  <div class="col-md-3" v-if="diffMonths > 0">
                    <label>Месяцев жизни</label>
                    <p>{{ form.medCertDeath.lifeMonthsNumber }}</p>
                  </div>
                  <div class="col-md-3" v-if="diffDays > 0">
                    <label>Дней жизни</label>
                    <p>{{ form.medCertDeath.lifeDaysNumber }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>5. Место постоянного жительства (регистрации) умершего(ей)</strong></h5>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesRead :address="form.medCertDeath.addresses[0]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>6. Местность</strong></h5>
              <p>{{ form.medCertDeath.addresses[0].locality }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12"><h5><strong>7. Место смерти</strong></h5></div>
          </div>
          <!-- Адрес -->
          <AddressesRead :address="form.medCertDeath.addresses[1]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>8. Местность</strong></h5>
              <p>{{ form.medCertDeath.addresses[1].locality }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>9. Смерть наступила</strong></h5>
            </div>
            <div class="col-md-3">
              <p>{{ form.medCertDeath.deathLocationD }}</p>
            </div>
          </div>
          <div v-if="lessMonth" class="form-line"></div>
          <div v-if="lessMonth" class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>10. Для детей, умерших в возрасте от 168 часов до 1 месяца</strong></h5>
            </div>
            <div class="col-md-3">
              <label>Доношенность</label>
              <p>{{ form.medCertDeath.fetusType }}</p>
            </div>
          </div>
          <div v-if="lessYear" class="form-line"></div>
          <div v-if="lessYear" class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>11. Для детей, умерших в возрасте от 168 часов до 1 года</strong></h5>
            </div>
            <div class="col-md-2 mb-3">
              <label>Масса тела при рождении (г.)</label>
              <p>{{ form.medCertDeath.weight }}</p>
            </div>
            <div class="col-md-4 offset-1 mb-3">
              <label>Каким по счету был ребенок у матери (считая умерших и не считая мертворожденных)</label>
              <p>{{ form.medCertDeath.deathChildNumber }}</p>
            </div>
            <div class="col-md-4 mb-3"></div>
            <div class="col-md-11">
              <h5><strong>Мать</strong></h5>
            </div>
            <div class="col-md-2">
              <label>Фамилия</label>
              <p>{{ form.medCertDeath.motherLastName }}</p>
            </div>
            <div class="col-md-2">
              <label>Имя</label>
              <p>{{ form.medCertDeath.motherFirstName }}</p>
            </div>
            <div class="col-md-2">
              <label>Отчество</label>
              <p>{{ form.medCertDeath.motherPatronymicName }}</p>
            </div>
            <div class="col-md-2">
              <label>Дата рождения</label>
              <p>{{ form.medCertDeath.motherBirthDate }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong> 12. Семейное положение</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertDeath.familyStatus }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>13. Образование</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>14. Занятость</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertDeath.eduLevel }}</p>
            </div>
            <div class="col-md-5 offset-1">
              <p>{{ form.medCertDeath.emplState }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>15. Смерть произошла</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertDeath.deathAccidentD }}</p>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertDeath.deathAccidentD && form.medCertDeath.deathAccidentD !== 1"></div>
          <div class="form-row mb-3" v-if="form.medCertDeath.deathAccidentD && form.medCertDeath.deathAccidentD !== 1">
            <div class="col-md-12">
              <h5><strong>16. В случае смерти от несчастного случая, убийства, самоубийства, от военных
                и террористических действий, при неустановленном роде смерти</strong></h5>
            </div>
            <label class="col-md-12">Дата и время травмы</label>
            <div class="col-md-2 mb-3">
              <p>{{ form.medCertDeath.accidentDate }}</p>
            </div>
            <div class="col-md-1 mb-3">
              <p>{{ form.medCertDeath.accidentTime }}</p>
            </div>
            <div class="col-md-12 mb-3">
              <label>Место и обстоятельства</label>
              <p>{{ form.medCertDeath.accidentPlaceAndConditions }}</p>
            </div>
            <div class="form-line"></div>
            <div class="col-md-12">
              <h5><strong>Место получения травмы</strong></h5>
            </div>
            <!-- Адрес -->
            <AddressesRead :address="form.medCertDeath.addresses[2]" />
            <!-- END Адрес -->
            <div class="form-line"></div>
            <div class="col-md-12">
              <h5><strong>Местность</strong></h5>
              <p>{{ form.medCertDeath.addresses[2].locality }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>17. Причины смерти установлены</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertDeath.recordedDeathEmplTypeD }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>18. Врач, установивший причины смерти</strong></h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertDeath.medicId }}</p>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>Основания установления причин смерти</strong></h5>
            </div>
            <div class="col-md-6">
              <h5 v-if="form.medCertDeath.recordedDeathBasedOld && form.medCertDeath.recordedDeathBasedOld.length > 0">
                <strong>Основания установления причин смерти (старые данные)</strong>
              </h5>
            </div>
            <div class="col-md-5">
              <p>{{ form.medCertDeath.recordedDeathBasedD }}</p>
            </div>
            <div class="col-md-5 offset-1" v-if="form.medCertDeath.recordedDeathBasedOld && form.medCertDeath.recordedDeathBasedOld.length > 0">
              <div class="custom-control custom-checkbox mt-2"
                   v-for="(item, index) in form.medCertDeath.recordedDeathBasedOld" :key="index">
                <input type="checkbox" v-model="item.value" name="recordedOld" :disabled="true"
                       class="custom-control-input pointer" :id="'recordedOld' + index">
                <label class="custom-control-label pointer mr-3" :for="'recordedOld' + index"><strong>{{ item.name }} |</strong></label>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="cause-of-death" role="tabpanel" aria-labelledby="cause-of-death-tab">
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>I. Причины смерти</strong></h5>
            </div>
          </div>
          <div v-for="(diagnItem, index) in form.medCertDeath.deathReason.deathReasonDiagns"
               :key="index" v-if="index <= 3" class="border border-secondary rounded mt-2 p-2">
            <div class="row">
              <div class="col-md-2">
                <!--<div class="alert alert-primary mb-3 custom-alert" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" :name="'print_' + index"
                           v-model="diagnItem.isPrint"
                           :disabled="true"
                           class="custom-control-input pointer" :id="'print_' + index">
                    <label class="custom-control-label pointer" :for="'print_' + index">На печать</label>
                  </div>
                </div>-->
              </div>
              <div class="col-md-6"></div>
              <div class="col-md-4">
                <div class="alert alert-secondary mb-3 custom-alert" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" :name="'prime_' + index"
                           v-model="diagnItem.isPrime"
                           :disabled="true"
                           class="custom-control-input pointer" :id="'prime_' + index">
                    <label class="custom-control-label pointer" :for="'prime_' + index">Первоначальная причина смерти</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-12">
              <label>
                <strong class="text-danger">{{ diagnItem.diagnType.name }}) </strong>
                {{ setDiangNames(diagnItem.diagnType.name) }}
              </label>
              <div class="col-md-12 mb-3">
                <p><strong>{{ diagnItem.mkb.description }}</strong></p>
              </div>
            </div>
            <div class="col-md-12 mt-4">
              <label>Приблизительный период времени между началом патологического процесса и смертью</label>
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-2">
                <label>лет</label>
                <p>{{ diagnItem.years }}</p>
              </div>
              <div class="col-md-2">
                <label>месяцев</label>
                <p>{{ diagnItem.months }}</p>
              </div>
              <div class="col-md-2">
                <label>дней</label>
                <p>{{ diagnItem.days }}</p>
              </div>
              <div class="col-md-2">
                <label>часов</label>
                <p>{{ diagnItem.hours }}</p>
              </div>
              <div class="col-md-2">
                <label>минут</label>
                <p>{{ diagnItem.minutes }}</p>
              </div>
              <div class="col-md-2">
                <div class="custom-control custom-checkbox mt-4">
                  <input type="checkbox" v-model="diagnItem.timeUnknown" :name="index"
                         :disabled="true"
                         class="custom-control-input pointer" :id="index">
                  <label class="custom-control-label pointer" :for="index">неизвестно</label>
                </div>
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
              <h5><strong>II. Прочие важные состояния, способствовавшие смерти, но не связанные с болезнью или патологическим состоянием,
                приведшим к ней, включая употребление алкоголя, наркотических средств, психотропных и других токсических веществ,
                содержание их в крови, а также операции (название, дата).</strong></h5>
            </div>
          </div>
          <div class="mb-3">
            <div v-for="(diagnItem, index) in form.medCertDeath.deathReason.deathReasonDiagns"
                 :key="index" v-if="index >= 4" class="border border-secondary rounded mt-2 p-2">
              <div class="alert alert-primary col-md-2 mb-3 custom-alert" role="alert">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" :name="'print_' + index"
                         v-model="diagnItem.isPrint"
                         :disabled="true"
                         class="custom-control-input pointer" :id="'print_' + index">
                  <label class="custom-control-label pointer" :for="'print_' + index">На печать</label>
                </div>
              </div>
              <div class="col-md-12">
                <label>{{ setDiangNames(diagnItem.diagnType.name) }}</label>
                <div>
                  <p><strong>{{ diagnItem.mkb.description }}</strong></p>
                </div>
              </div>
              <div class="col-md-12 mt-4">
                <label>Приблизительный период времени между началом патологического процесса и смертью</label>
              </div>
              <div class="col-md-12 form-row mb-3">
                <div class="col-md-2">
                  <label>лет</label>
                  <p>{{ diagnItem.years }}</p>
                </div>
                <div class="col-md-2">
                  <label>месяцев</label>
                  <p>{{ diagnItem.months }}</p>
                </div>
                <div class="col-md-2">
                  <label>дней</label>
                  <p>{{ diagnItem.days }}</p>
                </div>
                <div class="col-md-2">
                  <label>часов</label>
                  <p>{{ diagnItem.hours }}</p>
                </div>
                <div class="col-md-2">
                  <label>минут</label>
                  <p>{{ diagnItem.minutes }}</p>
                </div>
                <div class="col-md-2">
                  <div class="custom-control custom-checkbox mt-4">
                    <input type="checkbox" v-model="diagnItem.timeUnknown" :name="index"
                           :disabled="true"
                           class="custom-control-input pointer" :id="index">
                    <label class="custom-control-label pointer" :for="index">неизвестно</label>
                  </div>
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
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>Операции</strong></h5>
            </div>
          </div>
          <div v-for="(operation, index) in form.medCertDeath.deathReason.surgeries" :key="'oper_'+index"
               class="border border-secondary rounded mb-2 p-2">
            <div class="alert alert-primary col-md-2 custom-alert" role="alert">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" :name="'oper_print_' + index"
                       v-model="operation.isPrint"
                       :disabled="true"
                       class="custom-control-input pointer" :id="'oper_print_' + index">
                <label class="custom-control-label pointer" :for="'oper_print_' + index">На печать</label>
              </div>
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-10">
                <label>Название</label>
                <p><strong>{{ operation.description }}</strong></p>
              </div>
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-10">
                <label>Тип операциии</label>
                <p><strong>{{ operation.surgeryBE.name }}</strong></p>
              </div>
              <div class="col-md-2">
                <label>Дата</label>
                <p><strong>{{ operation.date }}</strong></p>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="border border-secondary rounded mb-2 p-2">
              <div class="alert alert-primary col-md-2 custom-alert" role="alert">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" name="'intoxication_print'"
                         :disabled="true"
                         v-model="form.medCertDeath.deathReason.intoxication.isPrint"
                         class="custom-control-input pointer" id="intoxication_print">
                  <label class="custom-control-label pointer" for="intoxication_print">На печать</label>
                </div>
              </div>
              <div class="col-md-12">
                <h5><strong>Другие состояния (употребление алкоголя, наркотических средств,
                  психотропных и других токсических веществ, содержание их в крови)</strong></h5>
              </div>
              <div class="col-md-12 mb-3">
                <p>{{ form.medCertDeath.deathReason.intoxication.description }}</p>
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>20. В случае смерти в результате ДТП</strong></h5>
            </div>
            <div class="col-md-4">
              <p>{{ form.medCertDeath.deathRoadAccidentState }}</p>
            </div>
          </div>
          <div v-if="form.medCertDeath.gender === 'Женский'" class="form-line"></div>
          <div v-if="form.medCertDeath.gender === 'Женский'" class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>21. В случае смерти беременной</strong></h5>
            </div>
            <div class="col-md-4">
              <p>{{ form.medCertDeath.deathPregnantState }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <div class="row">
          <div class="col-md-10"></div>
          <div class="col-md-2">
            <back-to-top bottom="35px" right="50px" visibleoffset="500">
              <button type="button" class="btn btn-danger btn-to-top">
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
import moment from 'moment'

import { mapState, mapGetters } from 'vuex'
import OutModalRead from './elements/OutModalRead'
import AddressesRead from './elements/AddressesRead'

export default {
  name: 'death-form-read',
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
    this.$store.dispatch('deathPage/onReadForm', this.certRouteID)
    /* END READ */
  },
  data () {
    return {
      API_URL: API_URL,
      certRouteID: '',
      clearYears: '',
      clearMonths: '',
      clearDays: '',
      diffYears: '',
      diffMonths: '',
      diffDays: '',
      diffHours: ''
    }
  },
  computed: {
    ...mapState('searchPage', ['adminRole', 'miacRole', 'deathCreatorRole', 'printerRole', 'unknownBodyRole', 'signerRole', 'moSelectorRole']),
    ...mapState('deathPage', ['loading']),
    ...mapGetters('deathPage', ['form', 'stuff']),
    deathBiggerBorn () {
      if (this.form.medCertDeath.birthDate && this.form.medCertDeath.deathDate) {
        if (this.form.medCertDeath.birthDate.length === 10 && this.form.medCertDeath.deathDate.length === 10) {
          let birth = moment(this.form.medCertDeath.birthDate, 'DD.MM.YYYY')
          let death = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')
          let diffHours = death.diff(birth, 'hours')
          if (diffHours < 0) {
            this.form.medCertDeath.deathDate = null
            return true
          } else return false
        } else if (this.form.medCertDeath.birthDate_isYear === true && this.form.medCertDeath.birthDate.length === 4 && this.form.medCertDeath.deathDate.length === 10) {
          let birthDate = '01.01.' + this.form.medCertDeath.birthDate
          let birth = moment(birthDate, 'DD.MM.YYYY')
          let death = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')
          let diffHours = death.diff(birth, 'hours')
          if (diffHours < 0) {
            this.form.medCertDeath.deathDate = null
            return true
          } else return false
        } else if (this.form.medCertDeath.birthDate_isYearMonth === true && this.form.medCertDeath.birthDate.length === 7 && this.form.medCertDeath.deathDate.length === 10) {
          let birthDate = '01.' + this.form.medCertDeath.birthDate
          let birth = moment(birthDate, 'DD.MM.YYYY')
          let death = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')
          let diffHours = death.diff(birth, 'hours')
          if (diffHours < 0) {
            this.form.medCertDeath.deathDate = null
            return true
          } else return false
        }
      }
    },
    lessMonth () {
      if (this.form.medCertDeath.birthDate && this.form.medCertDeath.deathDate) {
        if (this.form.medCertDeath.birthDate.length === 10 && this.form.medCertDeath.deathDate.length === 10) {
          let date = moment(this.form.medCertDeath.birthDate, 'DD.MM.YYYY')
          let date2 = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')

          let diffDuration = moment.duration(date2.diff(date))
          this.clearYears = diffDuration.years()
          this.clearMonths = diffDuration.months()
          this.clearDays = diffDuration.days()

          this.diffMonths = date2.diff(date, 'months')
          this.diffDays = date2.diff(date, 'days')
          this.diffHours = date2.diff(date, 'hours')
          if (this.diffHours >= 168 && this.diffMonths < 1) return true
          else return false
        } else if (this.form.medCertDeath.birthDate_isYear === true && this.form.medCertDeath.birthDate.length === 4 && this.form.medCertDeath.deathDate.length === 10) {
          let birthDate = '01.01.' + this.form.medCertDeath.birthDate
          let date = moment(birthDate, 'DD.MM.YYYY')
          let date2 = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')

          let diffDuration = moment.duration(date2.diff(date))
          this.clearYears = diffDuration.years()
          this.clearMonths = diffDuration.months()
          this.clearDays = diffDuration.days()

          this.diffMonths = date2.diff(date, 'months')
          this.diffDays = date2.diff(date, 'days')
          this.diffHours = date2.diff(date, 'hours')
          if (this.diffHours > 168 && this.diffMonths < 1) return true
          else return false
        } else if (this.form.medCertDeath.birthDate_isYearMonth === true && this.form.medCertDeath.birthDate.length === 7 && this.form.medCertDeath.deathDate.length === 10) {
          let birthDate = '01.' + this.form.medCertDeath.birthDate
          let date = moment(birthDate, 'DD.MM.YYYY')
          let date2 = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')

          let diffDuration = moment.duration(date2.diff(date))
          this.clearYears = diffDuration.years()
          this.clearMonths = diffDuration.months()
          this.clearDays = diffDuration.days()

          this.diffMonths = date2.diff(date, 'months')
          this.diffDays = date2.diff(date, 'days')
          this.diffHours = date2.diff(date, 'hours')
          if (this.diffHours >= 168 && this.diffMonths < 1) return true
          else return false
        }
      }
    },
    lessYear () {
      if (this.form.medCertDeath.birthDate && this.form.medCertDeath.deathDate) {
        if (this.form.medCertDeath.birthDate.length === 10 && this.form.medCertDeath.deathDate.length === 10) {
          let date = moment(this.form.medCertDeath.birthDate, 'DD.MM.YYYY')
          let date2 = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')

          let diffDuration = moment.duration(date2.diff(date))
          this.clearYears = diffDuration.years()
          this.clearMonths = diffDuration.months()
          this.clearDays = diffDuration.days()

          this.diffYears = date2.diff(date, 'years')
          this.diffDays = date2.diff(date, 'days')
          this.diffHours = date2.diff(date, 'hours')
          if (this.diffHours >= 168 && this.diffYears < 1) return true
          else return false
        } else if (this.form.medCertDeath.birthDate_isYear === true && this.form.medCertDeath.birthDate.length === 4 && this.form.medCertDeath.deathDate.length === 10) {
          let birthDate = '01.01.' + this.form.medCertDeath.birthDate
          let date = moment(birthDate, 'DD.MM.YYYY')
          let date2 = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')

          let diffDuration = moment.duration(date2.diff(date))
          this.clearYears = diffDuration.years()
          this.clearMonths = diffDuration.months()
          this.clearDays = diffDuration.days()

          this.diffYears = date2.diff(date, 'years')
          this.diffDays = date2.diff(date, 'days')
          this.diffHours = date2.diff(date, 'hours')
          if (this.diffHours > 168 && this.diffYears < 1) return true
          else return false
        } else if (this.form.medCertDeath.birthDate_isYearMonth === true && this.form.medCertDeath.birthDate.length === 7 && this.form.medCertDeath.deathDate.length === 10) {
          let birthDate = '01.' + this.form.medCertDeath.birthDate
          let date = moment(birthDate, 'DD.MM.YYYY')
          let date2 = moment(this.form.medCertDeath.deathDate, 'DD.MM.YYYY')

          let diffDuration = moment.duration(date2.diff(date))
          this.clearYears = diffDuration.years()
          this.clearMonths = diffDuration.months()
          this.clearDays = diffDuration.days()

          this.diffYears = date2.diff(date, 'years')
          this.diffDays = date2.diff(date, 'days')
          this.diffHours = date2.diff(date, 'hours')
          if (this.diffHours >= 168 && this.diffYears < 1) return true
          else return false
        }
      }
    }
  },
  methods: {
    setDiangNames (type) {
      switch (type) {
        case 'а':
          return 'Болезнь или состояние, непосредственно приведшее к смерти'
          break
        case 'б':
          return 'Патологическое состояние, которое привело к возникновению вышеуказанной причины'
          break
        case 'в':
          return 'Первоначальная причина смерти указывается последней'
          break
        case 'г':
          return 'Внешняя причина при травмах и отравлениях'
          break
        case 'д':
          return 'Название диагноза'
          break
      }
    },
    onEdit () {
      let id = this.form.medCertId
      this.$router.push({ name: 'DeathFormEdit', params: { id } })
    },
    onExit () {
      this.$modal.show('go-out')
    },
    onSigning () {
      this.$store.dispatch('deathPage/onSing', this.form.medCertId)
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
    background-color: #EDDCDF;
  }
  .form-title-death:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background-color: #ED3E54;
  }
  .form-title-death {
    position: relative;
    margin: 0 -15px;
    padding: 30px 30px 20px 50px;
    background-color: #EDDCDF;
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
    border-bottom: 3px solid #ED3E54;
  }
</style>

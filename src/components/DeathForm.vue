<template>
  <div>
    <Loader :loader="this.loader" />
    <SuccessModal :typeCert="'Death'" />
    <SuccessCopyModal :typeCert="'Death'" :certId="this.form.medCertId" />
    <NewSeriesAndNumberModal :typeCert="'Death'" :dto="this.form" />
    <InsteadOrDuplicateModal :typeCert="'Death'" :form="this.form" />
    <InsteadModal :typeCert="'Death'" :form="this.form" />
    <OutModal :form="this.form" />
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
              <td>
                <v-select :options="placesList"
                          label="name"
                          :clearable="false"
                          v-model="stuff.deptPlace">
                  <template slot="option" slot-scope="option">
                    <p @click="selectPlace(option)" class="select-option">{{ option.codeBSME }} <span class="text-secondary">{{ option.name }}</span></p>
                  </template>
                </v-select>
              </td>
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
          <div class="custom-control custom-checkbox mt-2">
            <input type="checkbox" :disabled="true" v-model="form.isDuplicate" name="isDuplicate"
                   class="custom-control-input pointer" id="isDuplicate">
            <label class="custom-control-label pointer" for="isDuplicate"><strong>Дубликат</strong></label>
          </div>
          <div v-if="miacRole" class="col-md-8 input-group mt-4">
            <label>Резолюция:</label>
            <cool-select
              v-model="form.resolution"
              :items="resolutionType"
              itemValue="id"
              itemText="name"
              id="resolution"
              name="'Резолюция'"
              placeholder="">
            </cool-select>
            <span class="input-group-append">
                <button @click="form.resolution = null"
                        :disabled="true"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
          </div>
          <div v-else class="mt-5">
            <p v-if="form.resolutionName">Резолюция: <kbd>{{ form.resolutionName }}</kbd></p>
          </div>
        </div>
      </div>
      <div class="row mt-2 mb-3 ml-3">
        <div class="col-md-8">
          <div v-if="commentsToggle">
            <div class="form-line"></div>
            <h5><strong>Комментарии к свидетельству:</strong></h5>
            <div class="mt-2 mb-3">
              <p v-if="allComments && allComments.length === 0">Комментариев нет.</p>
              <div v-for="(item, index) in allComments" :key="index" class="alert alert-dark">
                <span class="float-right">{{ item.date }}</span>
                <h6><strong>{{ item.user }}</strong></h6><hr />
                <p>{{ item.comment }}</p>
              </div>
            </div>
            <form @submit.prevent="onSendComment()">
              <label for="comment">Оставить комментарий</label>
              <textarea v-model="comment" class="form-control"
                        name="comment" id="comment" rows="3"></textarea>
              <button type="submit" class="btn btn-sm btn-outline-primary mt-3 mb-4"
                      :disabled="!comment || comment.length < 2">Отправить</button>
            </form>
            <div class="form-line"></div>
          </div>
        </div>
        <div class="col-md-4">
          <p v-if="form.medCertId" class="mb-5">
            <button class="btn btn-sm btn-outline-secondary float-right"
                    @click.prevent="commentsToggle = !commentsToggle; onLoadComments()">{{ commentsToggle === true ? 'Скрыть комментарии' : 'Комментарии' }}</button>
          </p>
          <p v-if="form.medCertId && allComments && allComments.length > 0" class="float-right text-secondary">Всего комментариев: {{ allComments.length }}</p>
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
              <label for="certSeries">Серия свидетельства<strong class="text-danger">*</strong></label>
              <input type="text" id="certSeries" v-model="form.certSeries" v-mask="'####'"
                     v-validate="{ required: true, min: 4 }" name="'Серия свидетельств'"
                     class="form-control" :class="{ 'is-invalid': errors.has('certSeries') }" />
              <div v-if="errors.has('Серия свидетельств')" class="invalid-feedback">{{ errors.first('Серия свидетельств') }}</div>
            </div>
            <div class="col-md-2">
              <label for="certNumber">Номер свидетельства<strong class="text-danger">*</strong></label>
              <input type="text" id="certNumber" v-model="form.certNumber" v-mask="'########'"
                     v-validate="{ required: true, min: 8 }" name="'Номер свидетельств'"
                     class="form-control" :class="{ 'is-invalid': errors.has('certNumber') }" />
              <div v-if="errors.has('certNumber')" class="invalid-feedback">{{ errors.first('certNumber') }}</div>
            </div>
            <div class="col-md-2">
              <label>Дата выдачи</label>
              <date-picker v-model="form.certIssueDate" v-mask="'##.##.####'"
                           name="'Дата выдачи'" id="certIssueDate" class="form-control"
                           :config="options"></date-picker>
            </div>
            <div class="input-group col-md-3">
              <label for="certKind">Тип свидетельства<strong class="text-danger">*</strong></label>
              <cool-select
                v-model="form.certKind"
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
                <button @click="form.certKind = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
              <div v-if="errors.has('certKind')" class="invalid-feedback">{{ errors.first('certKind') }}</div>
            </div>
            <div class="col-md-2">
              <label></label>
              <div class="custom-control custom-checkbox mt-2">
                <input type="checkbox" v-model="form.insteadOf" name="insteadOf"
                       :disabled="true"
                       class="custom-control-input pointer" id="insteadOf">
                <label class="custom-control-label pointer" for="insteadOf">Взамен</label>
              </div>
            </div>
            <div class="col-md-2 mt-3">
              <label>Дата получения</label>
              <date-picker v-model="form.receivingDate" v-mask="'##.##.####'"
                           name="'Дата получения'"
                           :config="options"></date-picker>
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
                   @click="clearAddictedFields(form.isPrivatePractitioner, 'isPrivatePractitioner')">
            <label class="custom-control-label pointer" for="isPrivatePractitioner">Для врача, занимающегося частной практикой</label>
          </div>
          <div class="form-row mb-3" v-if="form.isPrivatePractitioner === true">
            <div class="col-md-2">
              <label for="privatePractitionerLicenceNumber">№ Лицензии<strong class="text-danger">*</strong></label>
              <input type="text" id="privatePractitionerLicenceNumber" v-model="form.privatePractitionerLicenceNumber"
                     v-validate="{ required: true }" name="'№ Лицензии'"
                     class="form-control" :class="{ 'is-invalid': errors.has('privatePractitionerLicenceNumber') }" />
            </div>
            <div class="col-md-2">
              <label for="privatePractitionerAddress">Адрес<strong class="text-danger">*</strong></label>
              <input type="text" id="privatePractitionerAddress" v-model="form.privatePractitionerAddress"
                     v-validate="{ required: true }" name="'Адрес'"
                     class="form-control" :class="{ 'is-invalid': errors.has('privatePractitionerAddress') }" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>14. Получатель</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="recipientLastName">Фамилия</label>
              <input type="text" id="recipientLastName" v-model="form.recipient.lastName"
                     @keypress="isNumber($event)" name="recipientLastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="recipientFirstName">Имя</label>
              <input type="text" id="recipientFirstName" v-model="form.recipient.firstName"
                     @keypress="isNumber($event)" name="recipientFirstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="recipientPatronymicName">Отчество</label>
              <input type="text" id="recipientPatronymicName" v-model="form.recipient.patronymicName"
                     @keypress="isNumber($event)" name="recipientPatronymicName" class="form-control" />
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="input-group col-md-3">
              <label for="identDocType">Тип документа</label>
              <cool-select
                v-model="form.recipient.identDocType"
                :items="docType"
                itemValue="id"
                itemText="name"
                id="identDocType"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.recipient.identDocType = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="col-md-2">
              <label for="recipientDocumentSeries">Серия</label>
              <input type="text" id="recipientDocumentSeries" @keypress="isNumberLetter($event)"
                     v-model="form.recipient.identDocSeries"
                     name="recipientDocumentSeries" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="recipientDocumentNumber">Номер</label>
              <input type="text" id="recipientDocumentNumber" @keypress="isNumberLetter($event)"
                     v-model="form.recipient.identDocNumber"
                     name="recipientDocumentNumber" class="form-control" />
            </div>
            <div class="col-md-2">
              <label>Дата выдачи документа</label>
              <date-picker v-model="form.recipient.identDocIssueDate" v-mask="'##.##.####'"
                           name="recipientDocumentIssueDate" id="recipientDocumentIssueDate"
                           class="form-control" :config="options"></date-picker>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-8">
              <label for="recipientIssuedBy">Кем выдан</label>
              <input type="text" id="recipientIssuedBy" v-model="form.recipient.identDocIssueBy"
                     name="recipientIssuedBy" class="form-control" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>22. Заполнил медицинское свидетельство<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.filledOutMedCertId"
                :items="usersOfCurrentUserOrganisations"
                itemValue="id"
                itemText="fullName"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('filledOutMedCert') }"
                id="filledOutMedCert"
                name="'22. Заполнил медицинское свидетельство'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.filledOutMedCertId = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('filledOutMedCert')" class="invalid-feedback">{{ errors.first('filledOutMedCert') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>Руководитель медицинской организации<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.headOfMedOrgId"
                :items="currentUserDepartmentHead"
                itemValue="id"
                itemText="fullName"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('headOfMedOrg') }"
                id="headOfMedOrg"
                name="'Руководитель медицинской организации'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.headOfMedOrgId = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('headOfMedOrg')" class="invalid-feedback">{{ errors.first('headOfMedOrg') }}</div>
          </div>
        </div>
        <div class="tab-pane fade" id="died" role="tabpanel" aria-labelledby="died-tab">
          <div class="form-row mb-3">
            <div class="col-md-4">
              <label>Номер трупа</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="form.medCertDeath.bodyNumberNum">
                <input type="text" class="form-control" v-model="form.medCertDeath.bodyNumberDept" :disabled="true">
                <cool-select
                  v-model="form.medCertDeath.bodyNumberYear"
                  :items="yearType"
                  itemValue="id"
                  itemText="name"
                  style="width: 80px!important"/>
                <span class="input-group-append">
                <button @click="form.medCertDeath.bodyNumberNum = null, form.medCertDeath.bodyNumberYear = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
              </div>
            </div>
            <div v-if="moSelectorRole" class="col-md-3">
              <label>Код площадки БСМЭ</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="stuff.codeBSME" :disabled="true">
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>1. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="deathLastName">Фамилия<strong v-if="form.medCertDeath.unknownBody === undefined || form.medCertDeath.unknownBody === false" class="text-danger">*</strong></label>
              <span v-if="form.medCertDeath.unknownBody === undefined || form.medCertDeath.unknownBody === false">
                <input type="text" id="deathLastName" v-model="form.medCertDeath.lastName"
                       @keypress="isNumber($event)" v-validate="{ required: true }" name="'1. Фамилия умершего'"
                       class="form-control" :class="{ 'is-invalid': errors.has('deathLastName') }" />
                <div v-if="errors.has('deathLastName')" class="invalid-feedback">{{ errors.first('deathLastName') }}</div>
              </span>
              <input v-else type="text" v-model="form.medCertDeath.lastName"
                     @keypress="isNumber($event)" name="deathLastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="deathFirstName">Имя<strong v-if="form.medCertDeath.unknownBody === undefined || form.medCertDeath.unknownBody === false" class="text-danger">*</strong></label>
              <span v-if="form.medCertDeath.unknownBody === undefined || form.medCertDeath.unknownBody === false">
                <input type="text" id="deathFirstName" v-model="form.medCertDeath.firstName"
                       @keypress="isNumber($event)" v-validate="{ required: true }" name="'1. Имя умершего'"
                       class="form-control" :class="{ 'is-invalid': errors.has('deathFirstName') }" />
                <div v-if="errors.has('deathFirstName')" class="invalid-feedback">{{ errors.first('deathFirstName') }}</div>
              </span>
              <input v-else type="text" v-model="form.medCertDeath.firstName"
                     @keypress="isNumber($event)" name="deathFirstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="deathPatronymicName">Отчество</label>
              <input type="text" id="deathPatronymicName" v-model="form.medCertDeath.patronymicName"
                     @keypress="isNumber($event)" name="deathPatronymicName" class="form-control" />
            </div>
            <div v-if="unknownBodyRole" class="col-md-3 mt-2">
              <label></label>
              <div class="custom-control custom-checkbox" @click="form.medCertDeath.unknownBodyAge = ''">
                <input type="checkbox" v-model="form.medCertDeath.unknownBody" name="unknownBody"
                       class="custom-control-input pointer" id="unknownBody">
                <label class="custom-control-label pointer" for="unknownBody">неизвестно</label>
              </div>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="input-group col-md-3">
              <label for="deathIdentDocType">Тип документа</label>
              <cool-select
                v-model="form.medCertDeath.identDocType"
                :items="docType"
                itemValue="id"
                itemText="name"
                id="deathIdentDocType"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.identDocType = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="col-md-2">
              <label for="deathIdentDocSeries">Серия</label>
              <input type="text" id="deathIdentDocSeries" v-model="form.medCertDeath.identDocSeries"
                     @keypress="isNumberLetter($event)" name="deathIdentDocSeries" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="deathIdentDocNumber">Номер</label>
              <input type="text" id="deathIdentDocNumber" v-model="form.medCertDeath.identDocNumber"
                     @keypress="isNumberLetter($event)" name="deathIdentDocNumber" class="form-control" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>2. Пол<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertDeath.gender"
                :items="gender"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('gender') }"
                id="gender" name="'2. Пол'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.gender = null, form.medCertDeath.deathPregnantState = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
              <div v-if="errors.has('gender')" class="invalid-feedback">{{ errors.first('gender') }}</div>
            </div>
          </div>
          <div class="form-line"></div>
          <div v-if="form.medCertDeath.unknownBody && form.medCertDeath.birthDateUnknow" class="form-row">
            <div class="col-md-6"></div>
            <div class="col-md-5">
              <span class="input-group">
                <label for="unknownBodyAge_field" class="mt-2 mr-3">Предположительный возраст</label>
                <input type="text" id="unknownBodyAge_field"
                       v-model="form.medCertDeath.unknownBodyAge" name="unknownBodyAge_field" class="form-control" />
                <span class="mt-2 ml-3">лет</span>
              </span>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>3. Дата рождения<strong v-if="form.medCertDeath.birthDateUnknow === false" class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-2">
              <date-picker v-if="form.medCertDeath.birthDate_isYear === false && form.medCertDeath.birthDate_isYearMonth === false && form.medCertDeath.birthDateUnknow === false"
                           v-model="form.medCertDeath.birthDate" v-mask="'##.##.####'"
                           name="'3. Дата рождения'" id="birthDate" class="form-control"
                           :class="{ 'is-invalid': errors.has('birthDate') }"
                           v-validate="{ required: true }" :config="options"></date-picker>
              <input v-if="form.medCertDeath.birthDate_isYear === true"
                     type="text" id="birthDate_isYear_field" v-mask="'####'"
                     v-model="form.medCertDeath.birthDate"
                     v-validate="{ required: true }" name="'3. Дата рождения'"
                     class="form-control" :class="{ 'is-invalid': errors.has('birthDate') }" />
              <input v-if="form.medCertDeath.birthDate_isYearMonth === true"
                     type="text" id="birthDate_isYearMonth_field" v-mask="'##.####'"
                     v-model="form.medCertDeath.birthDate"
                     v-validate="{ required: true }" name="'3. Дата рождения'"
                     class="form-control" :class="{ 'is-invalid': errors.has('birthDate') }"/>
              <div v-if="errors.has('birthDate')" class="invalid-feedback">{{ errors.first('birthDate') }}</div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertDeath.birthDate_isYearMonth = false, form.medCertDeath.birthDateUnknow = false, form.medCertDeath.birthDate = null, form.medCertDeath.unknownBodyAge = ''">
                <input type="checkbox" v-model="form.medCertDeath.birthDate_isYear" name="birthDate_isYear"
                       class="custom-control-input pointer" id="birthDate_isYear">
                <label class="custom-control-label pointer" for="birthDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertDeath.birthDate_isYear = false, form.medCertDeath.birthDateUnknow = false, form.medCertDeath.birthDate = null, form.medCertDeath.unknownBodyAge = ''">
                <input type="checkbox" v-model="form.medCertDeath.birthDate_isYearMonth" name="birthDate_isYearMonth"
                       class="custom-control-input pointer" id="birthDate_isYearMonth">
                <label class="custom-control-label pointer" for="birthDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertDeath.birthDate_isYear = false, form.medCertDeath.birthDate_isYearMonth = false, form.medCertDeath.birthDate = null, form.medCertDeath.unknownBodyAge = ''">
                <input type="checkbox" v-model="form.medCertDeath.birthDateUnknow" name="birthDateUnknow"
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
              <date-picker v-if="!form.medCertDeath.deathDate_isYear && !form.medCertDeath.deathDate_isYearMonth && !form.medCertDeath.deathDateUnknow"
                           v-model="form.medCertDeath.deathDate" v-mask="'##.##.####'"
                           name="deathDate" id="deathDate" class="form-control" :config="options"></date-picker>
              <input v-if="form.medCertDeath.deathDate_isYear === true"
                     type="text" id="deathDate_isYear_field" v-mask="'####'"
                     v-model="form.medCertDeath.deathDate" name="deathDate_isYear_field" class="form-control" />
              <input v-if="form.medCertDeath.deathDate_isYearMonth === true"
                     type="text" id="deathDate_isYearMonth_field" v-mask="'##.####'"
                     v-model="form.medCertDeath.deathDate" name="deathDate_isYearMonth_field" class="form-control" />
            </div>
            <div class="col-md-1">
              <input v-if="!form.medCertDeath.deathDate_isYear && !form.medCertDeath.deathDate_isYearMonth && !form.medCertDeath.deathDateUnknow"
                     type="text" id="deathTime" v-mask="'##:##'" placeholder="чч:мм"
                     v-model="form.medCertDeath.deathTime"
                     name="deathTime" class="form-control" />
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox" @click="form.medCertDeath.deathDate_isYearMonth = false, form.medCertDeath.deathDateUnknow = false, form.medCertDeath.deathDate = null, form.medCertDeath.deathTime = null">
                <input type="checkbox" v-model="form.medCertDeath.deathDate_isYear" name="deathDate_isYear"
                       class="custom-control-input pointer" id="deathDate_isYear">
                <label class="custom-control-label pointer" for="deathDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox" @click="form.medCertDeath.deathDate_isYear = false, form.medCertDeath.deathDateUnknow = false, form.medCertDeath.deathDate = null, form.medCertDeath.deathTime = null">
                <input type="checkbox" v-model="form.medCertDeath.deathDate_isYearMonth" name="deathDate_isYearMonth"
                       class="custom-control-input pointer" id="deathDate_isYearMonth">
                <label class="custom-control-label pointer" for="deathDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox" @click="form.medCertDeath.deathDate_isYear = false, form.medCertDeath.deathDate_isYearMonth = false, form.medCertDeath.deathDate = null, form.medCertDeath.deathTime = null">
                <input type="checkbox" v-model="form.medCertDeath.deathDateUnknow" name="deathDateUnknow"
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
                    <input type="text" v-model="form.medCertDeath.lifeMonthsNumber"
                           name="lifeMonthsNumber" class="form-control" />
                  </div>
                  <div class="col-md-3" v-if="diffDays > 0">
                    <label>Дней жизни</label>
                    <input type="text" v-model="form.medCertDeath.lifeDaysNumber"
                           name="lifeDaysNumber" class="form-control" />
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
          <AddressesDeath :address="form.medCertDeath.addresses[0]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>6. Местность</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertDeath.addresses[0].locality"
                :items="localityType"
                itemValue="id"
                itemText="name"
                id="locality"
                name="locality"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertDeath.addresses[0].locality = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12"><h5><strong>7. Место смерти</strong></h5></div>
            <div class="col-md-5 ml-3 mb-2">
              <button class="btn btn-sm btn-outline-primary" @click.prevent="sameAsRegPlace">Совпадает с местом постоянного жительства(регистрации)</button>
            </div>
            <div class="col-md-5 ml-3 mb-2">
              <button class="btn btn-sm btn-outline-primary" @click.prevent="sameAsMedOrg">Совпадает с адресом медицинской организации</button>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesDeath :address="form.medCertDeath.addresses[1]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>8. Местность</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertDeath.addresses[1].locality"
                :items="localityType"
                itemValue="id"
                itemText="name"
                id="locality2"
                name="locality2"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertDeath.addresses[1].locality = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>9. Смерть наступила<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertDeath.deathLocationD"
                :items="deathLocationType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('deathLocationD') }"
                id="deathLocationD"
                name="'9. Смерть наступила'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.deathLocationD = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('deathLocationD')" class="invalid-feedback">{{ errors.first('deathLocationD') }}</div>
          </div>
          <div v-if="lessMonth" class="form-line"></div>
          <div v-if="lessMonth" class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>10. Для детей, умерших в возрасте от 168 часов до 1 месяца</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <label for="fetusType">Доношенность</label>
              <cool-select
                v-model="form.medCertDeath.fetusType"
                :items="fetusType"
                itemValue="id"
                itemText="name"
                id="fetusType"
                name="fetusType"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.fetusType = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div v-if="lessYear" class="form-line"></div>
          <div v-if="lessYear" class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>11. Для детей, умерших в возрасте от 168 часов до 1 года</strong></h5>
            </div>
            <div class="col-md-2 mb-3">
              <label for="weight">Масса тела при рождении (г.)</label>
              <input type="text" id="weight" v-model="form.medCertDeath.weight"
                     name="weight" class="form-control" />
            </div>
            <div class="col-md-4 offset-1 mb-3">
              <label for="deathChildNumber">Каким по счету был ребенок у матери (считая умерших и не считая мертворожденных)</label>
              <input type="text" id="deathChildNumber" v-model="form.medCertDeath.deathChildNumber"
                     name="deathChildNumber" class="form-control" />
            </div>
            <div class="col-md-4 mb-3"></div>
            <div class="col-md-11">
              <h5><strong>Мать</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="motherLastName">Фамилия</label>
              <input type="text" id="motherLastName" v-model="form.medCertDeath.motherLastName"
                     @keypress="isNumber($event)" name="motherLastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="motherFirstName">Имя</label>
              <input type="text" id="motherFirstName" v-model="form.medCertDeath.motherFirstName"
                     @keypress="isNumber($event)" name="motherFirstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="motherPatronymicName">Отчество</label>
              <input type="text" id="motherPatronymicName" v-model="form.medCertDeath.motherPatronymicName"
                     @keypress="isNumber($event)" name="motherPatronymicName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label>Дата рождения</label>
              <date-picker v-model="form.medCertDeath.motherBirthDate" v-mask="'##.##.####'"
                           name="motherBirthDate" id="birthDate" class="form-control"
                           :config="options"></date-picker>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5>
                <strong>12. Семейное положение<strong class="text-danger">*</strong></strong>
                <strong class="text-info" title="В случае смерти детей, возраст которых указан в пунктах 10 - 11, пункты 12 - 14 заполняются в отношении их матерей">(?)</strong>
              </h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertDeath.familyStatus"
                :items="familyStatus"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('familyStatus') }"
                id="familyStatus"
                name="'12. Семейное положение'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.familyStatus = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('familyStatus')" class="invalid-feedback">{{ errors.first('familyStatus') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5>
                <strong>13. Образование</strong>
                <strong class="text-info" title="В случае смерти детей, возраст которых указан в пунктах 10 - 11, пункты 12 - 14 заполняются в отношении их матерей">(?)</strong>
              </h5>
            </div>
            <div class="col-md-6">
              <h5>
                <strong>14. Занятость</strong>
                <strong class="text-info" title="В случае смерти детей, возраст которых указан в пунктах 10 - 11, пункты 12 - 14 заполняются в отношении их матерей">(?)</strong>
              </h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertDeath.eduLevel"
                :items="eduType"
                itemValue="id"
                itemText="name"
                id="eduLevel"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.eduLevel = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="input-group col-md-5 offset-1">
              <cool-select
                v-model="form.medCertDeath.emplState"
                :items="emplState"
                itemValue="id"
                itemText="name"
                id="emplState"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.emplState = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>15. Смерть произошла</strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertDeath.deathAccidentD"
                :items="deathAccidentType"
                @select="clearAddictedFields(form.medCertDeath.deathAccidentD, 'deathAccidentD')"
                itemValue="id"
                itemText="name"
                id="deathAccident"
                name="deathAccident"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.deathAccidentD = null;
                        clearAddictedFields(form.medCertDeath.deathAccidentD, 'deathAccidentD')"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
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
              <date-picker v-model="form.medCertDeath.accidentDate" v-mask="'##.##.####'"
                           name="accidentDate" id="accidentDate" class="form-control"
                           :config="options"></date-picker>
            </div>
            <div class="col-md-1 mb-3">
              <input type="text" id="accidentTime" v-mask="'##:##'" placeholder="чч:мм"
                     v-model="form.medCertDeath.accidentTime"
                     name="accidentTime" class="form-control" />
            </div>
            <div class="col-md-12 mb-3">
              <label for="accidentPlaceAndConditions">Место и обстоятельства</label>
              <input type="text" id="accidentPlaceAndConditions"
                     v-model="form.medCertDeath.accidentPlaceAndConditions"
                     name="accidentPlaceAndConditions" class="form-control" />
            </div>
            <div class="form-line"></div>
            <div class="col-md-12">
              <h5><strong>Место получения травмы</strong></h5>
              <!-- Адрес -->
              <AddressesDeath :address="form.medCertDeath.addresses[2]" />
              <div class="col-md-3">
                <div class="input-group ml-2">
                  <cool-select
                    v-model="form.medCertDeath.addresses[2].locality"
                    :items="localityType"
                    itemValue="id"
                    itemText="name"
                    id="locality3"
                    name="locality3"
                    placeholder="" />
                  <span class="input-group-append">
                <button @click="form.medCertDeath.addresses[2].locality = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
                </div>
              </div>
              <!-- END Адрес -->
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>17. Причины смерти установлены<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertDeath.recordedDeathEmplTypeD"
                :items="recordedDeathEmplType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('recordedDeathEmplType') }"
                id="recordedDeathEmplType"
                name="'17. Причины смерти установлены'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertDeath.recordedDeathEmplTypeD = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('recordedDeathEmplType')" class="invalid-feedback">{{ errors.first('recordedDeathEmplType') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>18. Врач, установивший причины смерти<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertDeath.medicId"
                :items="usersOfCurrentUserOrganisations"
                itemValue="id"
                itemText="fullName"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('medicId') }"
                id="medicId"
                name="'18. Врач, установивший причины смерти'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertDeath.medicId = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('medicId')" class="invalid-feedback">{{ errors.first('medicId') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>Основания установления причин смерти<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-6">
              <h5 v-if="form.medCertDeath.recordedDeathBasedOld && form.medCertDeath.recordedDeathBasedOld.length > 0">
                <strong>Основания установления причин смерти (старые данные)</strong>
              </h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertDeath.recordedDeathBasedD"
                :items="recordedDeathBasedType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('recordedDeathBasedD') }"
                id="recordedDeathBasedD"
                name="'Основания установления причин смерти'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertDeath.recordedDeathBasedD = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border custom-height" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="input-group col-md-5 offset-1" v-if="form.medCertDeath.recordedDeathBasedOld && form.medCertDeath.recordedDeathBasedOld.length > 0">
              <div class="custom-control custom-checkbox mt-2"
                   v-for="(item, index) in form.medCertDeath.recordedDeathBasedOld" :key="index">
                <input type="checkbox" v-model="item.value" name="recordedOld" :disabled="true"
                       class="custom-control-input pointer" :id="'recordedOld' + index">
                <label class="custom-control-label pointer mr-3" :for="'recordedOld' + index"><strong>{{ item.name }} |</strong></label>
              </div>
            </div>
            <div v-if="errors.has('recordedDeathBasedD')" class="invalid-feedback">{{ errors.first('recordedDeathBasedD') }}</div>
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
                <font-awesome-icon class="text-danger pointer" :icon="['fas', 'times']"
                                   title="Очистить поля"
                                   @click="clearDeathReasonDiagns(diagnItem)" />
              </label>
              <div class="col-md-12 mb-3">
                <v-select :options="serverRequest"
                          label="description"
                          class="v-select-md"
                          :clearable="false"
                          v-model="diagnItem.mkb"
                          @input.native="searchOnServer($event)"
                          placeholder="">
                  <span slot="no-options">Начните вводить диагноз.</span>
                  <template slot="option" slot-scope="option">
                    <p @click="selectDiagn(option, diagnItem)" class="select-option">{{ option.description }}</p>
                  </template>
                </v-select>
              </div>
            </div>
            <div class="col-md-12 mt-4">
              <label>Приблизительный период времени между началом патологического процесса и смертью</label>
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-2">
                <label>лет</label>
                <input type="text" v-model="diagnItem.years" :disabled="diagnItem.timeUnknown"
                       v-mask="'##'" name="Лет" class="form-control" />
              </div>
              <div class="col-md-2">
                <label>месяцев</label>
                <input type="text" v-model="diagnItem.months" :disabled="diagnItem.timeUnknown"
                       v-validate="'max_value:11'"
                       v-mask="'##'" name="'Месяцев'" class="form-control" />
              </div>
              <div class="col-md-2">
                <label>дней</label>
                <input type="text" v-model="diagnItem.days" :disabled="diagnItem.timeUnknown"
                       v-validate="'max_value:30'"
                       v-mask="'##'" name="Дней" class="form-control" />
              </div>
              <div class="col-md-2">
                <label>часов</label>
                <input type="text" v-model="diagnItem.hours" :disabled="diagnItem.timeUnknown"
                       v-validate="'max_value:23'"
                       v-mask="'##'" name="Часов" class="form-control" />
              </div>
              <div class="col-md-2">
                <label>минут</label>
                <input type="text" v-model="diagnItem.minutes" :disabled="diagnItem.timeUnknown"
                       v-validate="'max_value:59'"
                       v-mask="'##'" name="Минут" class="form-control" />
              </div>
              <div class="col-md-2 pt-2">
                <div class="custom-control custom-checkbox mt-4" @click="clearTimePeriod(diagnItem)">
                  <input type="checkbox" v-model="diagnItem.timeUnknown" :name="index"
                         class="custom-control-input pointer" :id="index">
                  <label class="custom-control-label pointer" :for="index">неизвестно</label>
                </div>
              </div>
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-2">
                <label>Код МКБ-10</label>
                <input type="text"
                       v-model="diagnItem.mkb.mkbCode"
                       :disabled="true"
                       name="mkbCode" class="form-control" />
              </div>
              <div class="col-md-10">
                <label>Название МКБ-10</label>
                <input type="text"
                       v-model="diagnItem.mkb.name"
                       :disabled="true"
                       name="mkbName" class="form-control" />
              </div>
            </div>
            <div class="col-md-12 text-center" style="position: absolute; margin-top: -3px; width: 95%">
              <font-awesome-icon v-if="index < 2"
                                 class="text-primary pointer" :icon="['fas', 'sync-alt']" size="2x" title="Поменять местами"
                                 @click="changeDeathReasonDiagns(form.medCertDeath.deathReason.deathReasonDiagns, diagnItem)" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>II. Прочие важные состояния, способствовавшие смерти, но не связанные с болезнью или патологическим состоянием,
                приведшим к ней, включая употребление алкоголя, наркотических средств, психотропных и других токсических веществ,
                содержание их в крови, а также операции (название, дата).</strong></h5>
            </div>
            <div class="col-md-12">
              <h5 class="text-primary"><strong>Отметьте важное состояние (галочкой слева), которое будет выводиться на печать.</strong></h5>
            </div>
          </div>
          <div class="mb-3">
            <div v-for="(diagnItem, index) in form.medCertDeath.deathReason.deathReasonDiagns"
                 :key="index" v-if="index >= 4" class="border border-secondary rounded mt-2 p-2">
              <font-awesome-icon v-if="index > 4"
                                 class="text-danger pointer float-right" :icon="['fas', 'times']" title="Удалить"
                                 @click="deleteDiagn(diagnItem)" />
              <div class="alert alert-primary col-md-2 mb-3 custom-alert" role="alert">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" :name="'print_' + index"
                         v-model="diagnItem.isPrint"
                         class="custom-control-input pointer" :id="'print_' + index">
                  <label class="custom-control-label pointer" :for="'print_' + index">На печать</label>
                </div>
              </div>
              <div class="col-md-12">
                <label>{{ setDiangNames(diagnItem.diagnType.name) }}
                  <font-awesome-icon v-if="index <= 4"
                                     class="text-danger pointer" :icon="['fas', 'times']" title="Очистить поля"
                                     @click="clearDeathReasonDiagns5(diagnItem)" />
                </label>
                <div>
                  <div class="input-group">
                    <v-select :options="serverRequest"
                              label="description"
                              class="v-select-md"
                              :clearable="false"
                              v-model="diagnItem.mkb"
                              @input.native="searchOnServer($event)"
                              placeholder="">
                      <span slot="no-options">Начните вводить диагноз.</span>
                      <template slot="option" slot-scope="option">
                        <p @click="selectDiagn(option, diagnItem)" class="select-option">{{ option.description }}</p>
                      </template>
                    </v-select>
                  </div>
                </div>
              </div>
              <div class="col-md-12 mt-4">
                <label>Приблизительный период времени между началом патологического процесса и смертью</label>
              </div>
              <div class="col-md-12 form-row mb-3">
                <div class="col-md-2">
                  <label>лет</label>
                  <input type="text" v-model="diagnItem.years" :disabled="diagnItem.timeUnknown"
                         v-mask="'##'" name="Лет" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label>месяцев</label>
                  <input type="text" v-model="diagnItem.months" :disabled="diagnItem.timeUnknown"
                         v-validate="'max_value:11'"
                         v-mask="'##'" name="'Месяцев'" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label>дней</label>
                  <input type="text" v-model="diagnItem.days" :disabled="diagnItem.timeUnknown"
                         v-validate="'max_value:30'"
                         v-mask="'##'" name="Дней" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label>часов</label>
                  <input type="text" v-model="diagnItem.hours" :disabled="diagnItem.timeUnknown"
                         v-validate="'max_value:23'"
                         v-mask="'##'" name="Часов" class="form-control" />
                </div>
                <div class="col-md-2">
                  <label>минут</label>
                  <input type="text" v-model="diagnItem.minutes" :disabled="diagnItem.timeUnknown"
                         v-validate="'max_value:59'"
                         v-mask="'##'" name="Минут" class="form-control" />
                </div>
                <div class="col-md-2 pt-2">
                  <div class="custom-control custom-checkbox mt-4" @click="clearTimePeriod(diagnItem)">
                    <input type="checkbox" v-model="diagnItem.timeUnknown" :name="index"
                           class="custom-control-input pointer" :id="index">
                    <label class="custom-control-label pointer" :for="index">неизвестно</label>
                  </div>
                </div>
              </div>
              <div class="col-md-12 form-row mb-3">
                <div class="col-md-2">
                  <label>Код МКБ-10</label>
                  <input type="text"
                         v-model="diagnItem.mkb.mkbCode"
                         :disabled="true"
                         name="mkbCode" class="form-control" />
                </div>
                <div class="col-md-10">
                  <label>Название МКБ-10</label>
                  <input type="text"
                         v-model="diagnItem.mkb.name"
                         :disabled="true"
                         name="mkbName" class="form-control" />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-3">
            <button class="btn btn-outline-primary"
                    @click.prevent="moreDiagn">+ Ещё причины смерти</button>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>Операции</strong></h5>
            </div>
          </div>
          <div v-for="(operation, index) in form.medCertDeath.deathReason.surgeries" :key="'oper_'+index"
               class="border border-secondary rounded mb-2 p-2">
            <font-awesome-icon class="text-danger pointer float-right" :icon="['fas', 'times']" title="Удалить"
                               @click="deleteOperation(operation)" />
            <div class="alert alert-primary col-md-2 custom-alert" role="alert">
              <div class="custom-control custom-checkbox">
                <input type="checkbox" :name="'oper_print_' + index"
                       v-model="operation.isPrint"
                       class="custom-control-input pointer" :id="'oper_print_' + index">
                <label class="custom-control-label pointer" :for="'oper_print_' + index">На печать</label>
              </div>
            </div>
            <div class="col-md-12 mb-3">
              <label>Название</label>
              <input type="text" class="form-control" name="operationDescription"
                     v-model="operation.description">
            </div>
            <div class="col-md-12 form-row mb-3">
              <div class="col-md-10">
                <label>Тип операциии</label>
                <div class="input-group">
                  <v-select :options="serverOperationRequest"
                            label="name"
                            class="v-select-md"
                            :clearable="false"
                            v-model="operation.surgeryBE"
                            @input.native="searchOperationOnServer($event)"
                            placeholder="">
                    <span slot="no-options">Начните вводить тип операции.</span>
                    <template slot="option" slot-scope="option">
                      <p class="select-option">{{ option.name }}</p>
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="col-md-2">
                <label>Дата</label>
                <date-picker v-model="operation.date" v-mask="'##.##.####'"
                             name="operationDate" class="form-control"
                             :config="options"></date-picker>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button class="btn btn-outline-primary" @click.prevent="moreOperation">+ Ещё операции</button>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="border border-secondary rounded mb-2 p-2">
              <div class="alert alert-primary col-md-2 custom-alert" role="alert">
                <div class="custom-control custom-checkbox">
                  <input type="checkbox" name="'intoxication_print'"
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
                <input type="text"
                       v-model="form.medCertDeath.deathReason.intoxication.description"
                       name="intoxicationDescription" class="form-control" />
              </div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>20. В случае смерти в результате ДТП</strong></h5>
            </div>
            <div class="input-group col-md-4">
              <cool-select
                v-model="form.medCertDeath.deathRoadAccidentState"
                :items="deathRoadAccidentStateType"
                itemValue="id"
                itemText="name"
                id="deathRoadAccidentState" name="deathRoadAccidentState"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertDeath.deathRoadAccidentState = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertDeath.gender === 2"></div>
          <div class="form-row mb-3" v-if="form.medCertDeath.gender === 2">
            <div class="col-md-12">
              <h5><strong>21. В случае смерти беременной</strong></h5>
            </div>
            <div class="input-group col-md-4">
              <cool-select
                v-model="form.medCertDeath.deathPregnantState"
                :items="deathPregnantStateType"
                itemValue="id"
                itemText="name"
                id="deathPregnantState" name="deathPregnantState"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertDeath.deathPregnantState = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <div class="row">
          <div class="col-md-6">
            <ul class="list-unstyled text-danger" v-if="errors.all().length > 0">
              <li v-for="(error, i) in errors.all()" :key="i">{{ error }}</li>
            </ul>
            <ul class="list-unstyled text-danger" v-if="backendTextMessage.length > 0">
              <li v-for="(message, i) in backendTextMessage" :key="i">{{ message.defaultMessage }}</li>
            </ul>
            <div id="warningTextMessage" v-if="warningTextMessage && warningTextMessage.length > 0" class="text-danger"><strong>{{ warningTextMessage }}</strong></div>
            <div id="draftTextMessage" v-if="draftTextMessage && draftTextMessage.length > 0" class="text-dark"><strong>{{ draftTextMessage }}</strong></div>
            <div id="textMessage" v-if="textMessage && textMessage.length > 0" class="text-dark"><strong>{{ textMessage }}</strong></div>
          </div>
          <div class="col-md-6">
            <back-to-top bottom="35px" right="50px" visibleoffset="500">
              <button type="button" class="btn btn-danger btn-to-top">
                <font-awesome-icon :icon="['fas', 'chevron-up']" />
              </button>
            </back-to-top>
            <button class="btn btn-lg btn-outline-primary mr-3" @click.prevent="onSave">Сохранить</button>
            <button class="btn btn-lg btn-outline-primary mr-3" @click.prevent="onDraft">Сохранить как черновик</button>
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
import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import { mapState, mapGetters } from 'vuex'
import { CoolSelect } from 'vue-cool-select'
import Loader from './elements/Loader'
import SuccessModal from './elements/SuccessModal'
import SuccessCopyModal from './elements/SuccessCopyModal'
import NewSeriesAndNumberModal from './elements/NewSeriesAndNumberModal'
import InsteadOrDuplicateModal from './elements/InsteadOrDuplicateModal'
import InsteadModal from './elements/InsteadModal'
import OutModal from './elements/OutModal'
import AddressesDeath from './elements/AddressesDeath'

Vue.component('v-select', vSelect)

export default {
  name: 'death-form',
  components: {
    CoolSelect,
    Loader,
    SuccessModal,
    SuccessCopyModal,
    NewSeriesAndNumberModal,
    InsteadOrDuplicateModal,
    InsteadModal,
    OutModal,
    AddressesDeath
  },
  beforeMount () {
    /* CREATE|EDIT */
    if (this.$route.params.id) {
      this.certRouteID = this.$route.params.id
      this.$store.dispatch('deathPage/onEditForm', this.certRouteID)
    } else {
      this.$store.dispatch('deathPage/onLoadFrom')
    }
    /* END CREATE|EDIT */
  },
  mounted () {
    this.$store.dispatch('searchPage/onUserCheck')
    this.$store.dispatch('deathPage/onLoadResolutionTypeDirectory')
    this.$store.dispatch('deathPage/onLoadYearTypeDirectory')
    this.$store.dispatch('deathPage/onLoadCertKindTypeDirectory')
    this.$store.dispatch('deathPage/onLoadUsersOfCurrentUserOrganisations')
    this.$store.dispatch('deathPage/onLoadCurrentUserDepartmentHead')
    this.$store.dispatch('deathPage/onLoadDocTypeDirectory')
    this.$store.dispatch('deathPage/onLoadDeathLocationTypeDirectory')
    this.$store.dispatch('deathPage/onLoadRecordedDeathBasedTypeDirectory')
    this.$store.dispatch('deathPage/onLoadEduTypeDirectory')
    this.$store.dispatch('deathPage/onLoadFamilyStatusDirectory')
    this.$store.dispatch('deathPage/onLoadEmplStateDirectory')
    this.$store.dispatch('deathPage/onLoadGenderDirectory')
    this.$store.dispatch('deathPage/onLoadDeathAccidentTypeDirectory')
    this.$store.dispatch('deathPage/onLoadRecordedDeathEmplTypeDirectory')
    this.$store.dispatch('deathPage/onLoadFetusTypeDirectory')
    this.$store.dispatch('deathPage/onLoadDeathRoadAccidentStateTypeDirectory')
    this.$store.dispatch('deathPage/onLoadDeathPregnantStateTypeDirectory')
    this.$store.dispatch('deathPage/onLoadLocalityTypeDirectory')
    this.$store.dispatch('deathPage/onLoadPlaces')
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
      diffHours: '',
      options: {
        format: 'DD.MM.YYYY',
        locale: 'ru',
        maxDate: moment()
      },
      commentsToggle: false,
      comment: null,
      lettersLimit: 4
    }
  },
  computed: {
    ...mapState('searchPage', ['adminRole', 'miacRole', 'printerRole', 'unknownBodyRole', 'signerRole', 'moSelectorRole']),
    ...mapState('deathPage', ['loading', 'loader', 'resolutionType', 'warningTextMessage', 'draftTextMessage', 'textMessage', 'backendTextMessage', 'yearType', 'certKindType', 'placesList',
      'usersOfCurrentUserOrganisations', 'currentUserDepartmentHead', 'formStatus', 'serverRequest', 'serverOperationRequest', 'docType', 'deathLocationType', 'recordedDeathBasedType', 'eduType', 'familyStatus',
      'emplState', 'gender', 'deathAccidentType', 'recordedDeathEmplType', 'fetusType', 'deathRoadAccidentStateType', 'deathPregnantStateType', 'allComments', 'localityType']),
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
    isNumber (evt) {
      let numbers = String.fromCharCode(evt.keyCode)
      /* Все буквы (2 языка), тире, пробел */
      if (/[a-zA-ZА-Яа-я- ]/.test(numbers)) return true
      else evt.preventDefault()
    },
    isNumberLetter (evt) {
      let inp = String.fromCharCode(evt.keyCode)
      /* Все буквы (2 языка), числа, тире, пробел */
      if (/[a-zA-Z0-9А-Яа-я- ]/.test(inp)) return true
      else evt.preventDefault()
    },
    selectPlace (item) {
      this.form.medCertDeath.bodyNumberDept = item.code
      this.form.deptId = item.departmentId
      this.stuff.address = item.orgAddress
      this.stuff.codeBSME = item.codeBSME
    },
    clearAddictedFields (data, type) {
      if (type === 'isPrivatePractitioner' && data === false) {
        this.form.privatePractitionerLicenceNumber = null
        this.form.privatePractitionerAddress = null
      }
      if ((type === 'deathAccidentD' && data === 1) || (type === 'deathAccidentD' && data === null)) {
        this.form.medCertDeath.accidentDate = null
        this.form.medCertDeath.accidentTime = null
        this.form.medCertDeath.accidentPlaceAndConditions = null
        this.form.medCertDeath.addresses[2] = {
          'addressId': null,
          'addressType': 5,
          'locality': null,
          'countryRegion': {'level': 0, 'refId': '', 'name': ''},
          'house': {'level': 100, 'refId': null, 'name': null},
          'flat': null,
          'addressTxt': null,
          'addressTxtRandom': null,
          'addressSearchText': null,
          'addressSearchObj': null,
          'aolevel7': {'level': 7, 'refId': null, 'name': null},
          'aolevel4': {'level': 4, 'refId': null, 'name': null},
          'aolevel6': {'level': 6, 'refId': null, 'name': null},
          'aolevel90': {'level': 90, 'refId': null, 'name': null},
          'aolevel1': {'level': 1, 'refId': null, 'name': null},
          'aolevel65': {'level': 65, 'refId': null, 'name': null},
          'aolevel2': {'level': 2, 'refId': null, 'name': null},
          'aolevel3': {'level': 3, 'refId': null, 'name': null},
          'aolevel5': {'level': 5, 'refId': null, 'name': null},
          'aolevel91': {'level': 91, 'refId': null, 'name': null}
        }
      }
    },
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
    changeDeathReasonDiagns (arr, i) {
      if (i.diagnType.name === 'а') {
        arr.splice(1, 0, arr.splice(0, 1)[0])
        this.form.medCertDeath.deathReason.deathReasonDiagns[0].diagnType = {id: 1, name: 'а'}
        this.form.medCertDeath.deathReason.deathReasonDiagns[1].diagnType = {id: 2, name: 'б'}
        this.form.medCertDeath.deathReason.deathReasonDiagns[0].isPrime = false
        this.form.medCertDeath.deathReason.deathReasonDiagns[1].isPrime = true
        return arr
      } else if (i.diagnType.name === 'б') {
        arr.splice(2, 0, arr.splice(1, 1)[0])
        this.form.medCertDeath.deathReason.deathReasonDiagns[1].diagnType = {id: 1, name: 'б'}
        this.form.medCertDeath.deathReason.deathReasonDiagns[2].diagnType = {id: 2, name: 'в'}
        this.form.medCertDeath.deathReason.deathReasonDiagns[1].isPrime = false
        this.form.medCertDeath.deathReason.deathReasonDiagns[2].isPrime = true
        return arr
      }
    },
    clearDeathReasonDiagns (item) {
      let arr = this.form.medCertDeath.deathReason.deathReasonDiagns
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].diagnType.name === item.diagnType.name) {
          let prevItem = i - 1
          if (i > 0) {
            arr.forEach(function (inner, index) {
              if (arr[index].diagnType.name === arr[prevItem].diagnType.name) {
                arr[index].isPrime = true
                item.mkb.id = -1
                item.mkb.mkbCode = ''
                item.mkb.name = ''
                item.mkb.description = ''
                item.deathReasonDiagnId = null
                item.description = null
                item.years = null
                item.months = null
                item.days = null
                item.hours = null
                item.minutes = null
                item.timeUnknown = false
                item.isPrint = false
                item.isPrime = false
              }
            })
          } else {
            item.mkb.id = -1
            item.mkb.mkbCode = ''
            item.mkb.name = ''
            item.mkb.description = ''
            item.deathReasonDiagnId = null
            item.description = null
            item.years = null
            item.months = null
            item.days = null
            item.hours = null
            item.minutes = null
            item.timeUnknown = false
            item.isPrint = false
            item.isPrime = false
          }
        }
      }
    },
    clearDeathReasonDiagns5 (item) {
      item.mkb.id = -1
      item.mkb.mkbCode = ''
      item.mkb.name = ''
      item.mkb.description = ''
      item.deathReasonDiagnId = null
      item.description = null
      item.years = null
      item.months = null
      item.days = null
      item.hours = null
      item.minutes = null
      item.timeUnknown = false
      item.isPrint = false
      item.isPrime = false
    },
    clearTimePeriod (item) {
      item.years = null
      item.months = null
      item.days = null
      item.hours = null
      item.minutes = null
    },
    searchOnServer ($event) {
      if ($event.target.value.length >= this.lettersLimit) {
        this.$store.dispatch('deathPage/onSearchData', {'searchLine': $event.target.value})
      }
    },
    searchOperationOnServer ($event) {
      if ($event.target.value.length >= this.lettersLimit) {
        this.$store.dispatch('deathPage/onSearchOperationData', {'searchLine': $event.target.value})
      }
    },
    selectDiagn (option, item) {
      item.isPrint = true
      item.isPrime = true
      let arr = this.form.medCertDeath.deathReason.deathReasonDiagns
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].diagnType.name !== item.diagnType.name) {
          arr[i].isPrint = false
          arr[i].isPrime = false
        }
      }
    },
    moreDiagn () {
      this.form.medCertDeath.deathReason.deathReasonDiagns.push({
        days: null,
        deathReasonLineId: null,
        description: '',
        diagnType: {
          id: 5,
          name: 'д'
        },
        hours: null,
        isPrint: false,
        minutes: null,
        mkb: {
          description: '',
          id: -1,
          mkbCode: '',
          name: ''
        },
        months: null,
        timeUnknown: false,
        years: null
      })
    },
    deleteDiagn (item) {
      let arr = this.form.medCertDeath.deathReason.deathReasonDiagns
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].diagnType.name === item.diagnType.name) {
          arr.splice(i, 1)
        }
      }
    },
    moreOperation () {
      this.form.medCertDeath.deathReason.surgeries.push({
        date: null,
        deathReasonLineId: null,
        description: '',
        isPrint: false,
        surgeryBE: null
      })
    },
    deleteOperation (item) {
      let arr = this.form.medCertDeath.deathReason.surgeries
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].description === item.description) {
          arr.splice(i, 1)
        }
      }
    },
    sameAsRegPlace () {
      this.$store.commit('deathPage/SET_SAME_ADDRESSES')
    },
    sameAsMedOrg () {
      this.$store.dispatch('deathPage/onLoadAddressSameAsMedOrg', this.form.medOrgId)
    },
    onExit () {
      this.$modal.show('go-out')
    },
    onDraft () {
      if (this.form.certSeries === null && this.form.certNumber === null) {
        this.$store.dispatch('deathPage/onWarning')
      } else if (this.form.certSeries.length === 4 && this.form.certNumber.length === 8) {
        if (this.$route.params.id && this.form.certStatus === 'оформлено') {
          // EDIT DRAFT
          this.$store.dispatch('deathPage/onDraftEdit', this.form)
        } else {
          // DRAFT
          console.log('Draft saving...')
          this.$store.dispatch('deathPage/onDraft', this.form)
        }
      }
    },
    onSave () {
      this.$validator.validate().then(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.$store.dispatch('deathPage/onSaveEdit', this.form)
          } else {
            console.log('Saving...')
            this.$store.dispatch('deathPage/onSave', this.form)
          }
        }
      })
    },
    onLoadComments () {
      if (this.commentsToggle === true) {
        this.$store.dispatch('deathPage/onLoadAllCertComments', this.form.medCertId)
      }
    },
    onSendComment () {
      this.$store.dispatch('deathPage/onSaveCertComment', {'id': this.form.medCertId, 'data': {'comment': this.comment}})
      this.comment = null
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

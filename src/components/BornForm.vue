<template>
  <div>
    <Loader :loader="this.loader" />
    <SuccessModal :typeCert="'Born'" />
    <SuccessCopyModal :typeCert="'Born'" :certId="this.form.medCertId" />
    <NewSeriesAndNumberModal :typeCert="'Born'" :dto="this.form" />
    <DuplicateModal :typeCert="'Born'" :form="this.form" />
    <OutModal :form="this.form" />
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
              <label for="certSeries">Серия свидетельства<strong class="text-danger">*</strong></label>
              <input type="text" id="certSeries" v-model="form.certSeries" v-mask="'####'"
                     v-validate="{ required: true, min: 4 }" name="'Серия свидетельств'"
                     class="form-control" :class="{ 'is-invalid': errors.has('certSeries') }" />
              <div v-if="errors.has('certSeries')" class="invalid-feedback">{{ errors.first('certSeries') }}</div>
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
                           name="'Дата выдачи'" class="form-control" :config="options"></date-picker>
              <!--<date-picker v-model="form.certIssueDate" v-mask="'##.##.####'"
                           v-validate="{ required: true, date_format: 'DD.MM.YYYY' }" name="'Дата выдачи'"
                           class="form-control" :class="{ 'is-invalid': errors.has('certIssueDate') }"
                           :config="options"></date-picker>
              <div v-if="errors.has('certIssueDate')" class="invalid-feedback">{{ errors.first('certIssueDate') }}</div>-->
            </div>
            <div class="input-group col-md-3">
              <!--<label for="certKind">Тип свидетельства<strong class="text-danger">*</strong></label>
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
              <div v-if="errors.has('certKind')" class="invalid-feedback">{{ errors.first('certKind') }}</div>-->
            </div>
            <div class="col-md-3"></div>
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
                   @click="clearFieldByBool(form.isPrivatePractitioner, 'isPrivatePractitioner')">
            <label class="custom-control-label pointer" for="isPrivatePractitioner">Для врача, занимающегося частной практикой</label>
          </div>
          <div class="form-row mb-3" v-if="form.isPrivatePractitioner === true">
            <div class="col-md-2">
              <label for="privatePractitionerLicenceNumber">№ Лицензии<strong class="text-danger">*</strong></label>
              <input type="text" id="privatePractitionerLicenceNumber" v-model="form.privatePractitionerLicenceNumber"
                     v-validate="{ required: true }" name="'№ Лицензии'"
                     class="form-control"  :class="{ 'is-invalid': errors.has('privatePractitionerLicenceNumber') }" />
            </div>
            <div class="col-md-2">
              <label for="privatePractitionerAddress">Адрес<strong class="text-danger">*</strong></label>
              <input type="text" id="privatePractitionerAddress" v-model="form.privatePractitionerAddress"
                     v-validate="{ required: true }" name="'Адрес'"
                     class="form-control"  :class="{ 'is-invalid': errors.has('privatePractitionerAddress') }" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>8. Врач (фельдшер, акушерка) выдавший медицинское свидетельство</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertBirth.certIssueByEmpl"
                :items="usersOfCurrentUserOrganisations"
                itemValue="id"
                itemText="fullName"
                id="certIssueByEmpl" name="certIssueByEmpl"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.certIssueByEmpl = null"
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
              <h5><strong>9. Получатель</strong></h5>
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
            <div class="input-group col-md-3">
              <label for="recipientRelationshipType">Отношение к ребёнку</label>
              <cool-select
                v-model="form.recipient.relationshipType"
                :items="relationshipType"
                itemValue="id"
                itemText="name"
                id="recipientRelationshipType"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.recipient.relationshipType = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="input-group col-md-3">
              <label for="recipientDocType">Тип документа</label>
              <cool-select
                v-model="form.recipient.identDocType"
                :items="docType"
                itemValue="id"
                itemText="name"
                id="recipientDocType"
                placeholder="" />
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
                           name="recipientDocumentIssueDate" class="form-control"
                           :config="options"></date-picker>
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
              <h5><strong>19. Лицо, принимавшее роды<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertBirth.accoucheurTypeB"
                :items="accoucheurType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('accoucheurTypeB') }"
                id="accoucheurTypeB" name="'19. Лицо, принимавшее роды'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.accoucheurTypeB = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('accoucheurTypeB')" class="invalid-feedback">{{ errors.first('accoucheurTypeB') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>20. Заполнил медицинское свидетельство<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.filledOutMedCertId"
                :items="usersOfCurrentUserOrganisations"
                itemValue="id"
                itemText="fullName"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('filledOutMedCertId') }"
                id="filledOutMedCertId"
                name="'20. Заполнил медицинское свидетельство'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.filledOutMedCertId = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('filledOutMedCertId')" class="invalid-feedback">{{ errors.first('filledOutMedCertId') }}</div>
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
                :class="{ 'is-invalid': errors.has('headOfMedOrgId') }"
                id="headOfMedOrgId"
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
            <div v-if="errors.has('headOfMedOrgId')" class="invalid-feedback">{{ errors.first('headOfMedOrgId') }}</div>
          </div>
        </div>
        <div class="tab-pane fade" id="mother" role="tabpanel" aria-labelledby="mother-tab">
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>1. Ребёнок родился</strong></h5>
            </div>
            <label class="col-md-12">Дата и время рождения</label>
            <div class="col-md-2">
              <date-picker v-model="form.medCertBirth.childBirthDate" v-mask="'##.##.####'"
                           name="childBirthDate" id="childBirthDate" class="form-control"
                           :config="options"></date-picker>
            </div>
            <div class="col-md-1">
              <input type="text" id="childBirthTime" v-mask="'##:##'" placeholder="чч:мм"
                     v-model="form.medCertBirth.childBirthTime"
                     name="childBirthTime" class="form-control" />
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
              <label for="motherLastName">Фамилия</label>
              <input type="text" id="motherLastName" v-model="form.medCertBirth.motherLastName"
                     @keypress="isNumber($event)" name="motherLastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="motherFirstName">Имя</label>
              <input type="text" id="motherFirstName" v-model="form.medCertBirth.motherFirstName"
                     @keypress="isNumber($event)" name="motherFirstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="motherPatronymicName">Отчество</label>
              <input type="text" id="motherPatronymicName" v-model="form.medCertBirth.motherPatronymicName"
                     @keypress="isNumber($event)" name="motherPatronymicName" class="form-control" />
            </div>
            <div class="col-md-2 offset-1">
              <label>Дата рождения</label>
              <date-picker v-if="form.medCertBirth.motherBirthDate_isYear === false"
                           v-model="form.medCertBirth.motherBirthDate" v-mask="'##.##.####'"
                           name="motherBirthDate" class="form-control"
                           :config="options"></date-picker>
              <input v-if="form.medCertBirth.motherBirthDate_isYear === true"
                     type="text" id="motherBirthYear" v-mask="'####'"
                     v-model="form.medCertBirth.motherBirthDate"
                     name="motherBirthYear" class="form-control" />
            </div>
            <div class="col-md-3">
              <label></label>
              <div class="custom-control custom-checkbox mt-2" @click="form.medCertBirth.motherBirthDate = null">
                <input type="checkbox" v-model="form.medCertBirth.motherBirthDate_isYear" name="motherBirthDate_isYear"
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
          <AddressesBorn :address="form.medCertBirth.addresses[0]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>5. Местность</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertBirth.addresses[0].locality"
                :items="localityType"
                itemValue="id"
                itemText="name"
                id="locality"
                name="locality"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.addresses[0].locality = null"
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
              <h5><strong>6. Семейное положение</strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertBirth.motherFamilyStatus"
                :items="familyStatus"
                itemValue="id"
                itemText="name"
                id="motherFamilyStatus"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.motherFamilyStatus = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
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
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertBirth.motherEduLevel"
                :items="eduType"
                itemValue="id"
                itemText="name"
                id="motherEduLevel"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.motherEduLevel = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="input-group col-md-5 offset-1">
              <cool-select
                v-model="form.medCertBirth.motherEmplState"
                :items="emplState"
                itemValue="id"
                itemText="name"
                id="motherEmplState"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.motherEmplState = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
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
              <input type="text" id="firstAppearanceToDoctor" v-mask="'##'"
                     v-validate="'max_value:50'"
                     v-model="form.medCertBirth.firstAppearanceToDoctor"
                     name="'9. Срок первой явки к врачу'" class="form-control" />
            </div>
            <div class="col-md-1 pt-md-2">
              <p>недели</p>
            </div>
            <div class="col-md-1 offset-4">
              <input type="text" id="childNumber" v-mask="'##'"
                     v-validate="'max_value:30'"
                     v-model="form.medCertBirth.childNumber"
                     name="'10. Которым по счёту ребёнок был рождён у матери'" class="form-control" />
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="child" role="tabpanel" aria-labelledby="child-tab">
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>11. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="lastName">Фамилия</label>
              <input type="text" id="lastName" v-model="form.medCertBirth.lastName"
                     @keypress="isNumber($event)" name="lastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="firstName">Имя</label>
              <input type="text" id="firstName" v-model="form.medCertBirth.firstName"
                     @keypress="isNumber($event)" name="firstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="patronymicName">Отчество</label>
              <input type="text" id="patronymicName" v-model="form.medCertBirth.patronymicName"
                     @keypress="isNumber($event)" name="patronymicName" class="form-control" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>12. Место рождения</strong></h5>
            </div>
            <div class="col-md-5 ml-3 mb-2">
              <button class="btn btn-sm btn-outline-primary" @click.prevent="sameAsMedOrg">Совпадает с адресом медицинской организации</button>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesBorn :address="form.medCertBirth.addresses[1]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>13. Местность</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertBirth.addresses[1].locality"
                :items="localityType"
                itemValue="id"
                itemText="name"
                id="locality2"
                name="locality2"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.addresses[1].locality = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>14. Роды произошли<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>15. Пол<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertBirth.birthLocation"
                :items="birthLocationType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('birthLocation') }"
                id="birthLocation" name="'14. Роды произошли'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.birthLocation = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
              <div v-if="errors.has('birthLocation')" class="invalid-feedback">{{ errors.first('birthLocation') }}</div>
            </div>
            <div class="input-group col-md-5 offset-1">
              <cool-select
                v-model="form.medCertBirth.gender"
                :items="genderChild"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('gender') }"
                id="gender" name="'15. Пол'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.gender = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
              <div v-if="errors.has('gender')" class="invalid-feedback">{{ errors.first('gender') }}</div>
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>16. Масса тела ребенка при рождении<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>17. Длина тела ребенка при рождении<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-1">
              <input type="text" id="weight" v-model="form.medCertBirth.weight" v-mask="'####'"
                     v-validate="'required|min_value:200|max_value:9999'" name="'16. Масса тела ребенка при рождении'"
                     class="form-control" :class="{ 'is-invalid': errors.has('weight') }" />
              <div v-if="errors.has('weight')" class="invalid-feedback">{{ errors.first('weight') }}</div>
            </div>
            <div class="col-md-1 pt-md-2">
              <p>Г.</p>
            </div>
            <div class="col-md-1 offset-4">
              <input type="text" id="length" v-model="form.medCertBirth.length" v-mask="'##'"
                     v-validate="'required|min_value:10|max_value:99'" name="'17. Длина тела ребенка при рождении'"
                     class="form-control" :class="{ 'is-invalid': errors.has('length') }" />
              <div v-if="errors.has('length')" class="invalid-feedback">{{ errors.first('length') }}</div>
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
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertBirth.fertility"
                :items="fertilityType"
                itemValue="id"
                itemText="name"
                id="fertility"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertBirth.fertility = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-row mb-3" v-if="showChildBornFields">
            <div class="col-md-2">
              <label for="childBornNumber">Которым по счёту<strong class="text-danger">*</strong></label>
              <input type="text" id="childBornNumber" v-mask="'##'"
                     v-model="form.medCertBirth.childBornNumber"
                     v-validate="'required|max_value:10'" name="'18. Которым по счёту'"
                     class="form-control" :class="{ 'is-invalid': errors.has('childBornNumber') }" />
            </div>
            <div class="col-md-2">
              <label for="totalChildBornNumber">Число родившихся<strong class="text-danger">*</strong></label>
              <input type="text" id="totalChildBornNumber" v-mask="'##'"
                     v-model="form.medCertBirth.totalChildBornNumber"
                     v-validate="'required|max_value:10'" name="'18. Число родившихся'"
                     class="form-control" :class="{ 'is-invalid': errors.has('totalChildBornNumber') }" />
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
              <button type="button" class="btn btn-info btn-to-top">
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

import { mapState, mapGetters } from 'vuex'
import { CoolSelect } from 'vue-cool-select'
import Loader from './elements/Loader'
import SuccessModal from './elements/SuccessModal'
import SuccessCopyModal from './elements/SuccessCopyModal'
import NewSeriesAndNumberModal from './elements/NewSeriesAndNumberModal'
import DuplicateModal from './elements/DuplicateModal'
import OutModal from './elements/OutModal'
import AddressesBorn from './elements/AddressesBorn'

export default {
  name: 'born-form',
  components: {
    CoolSelect,
    Loader,
    SuccessModal,
    SuccessCopyModal,
    NewSeriesAndNumberModal,
    DuplicateModal,
    OutModal,
    AddressesBorn
  },
  beforeMount () {
    /* CREATE|EDIT */
    if (this.$route.params.id) {
      this.certRouteID = this.$route.params.id
      this.$store.dispatch('bornPage/onEditForm', this.certRouteID)
    } else {
      this.$store.dispatch('bornPage/onLoadFrom')
    }
    /* END CREATE|EDIT */
  },
  mounted () {
    this.$store.dispatch('searchPage/onUserCheck')
    this.$store.dispatch('deathPage/onLoadResolutionTypeDirectory')
    // this.$store.dispatch('bornPage/onLoadCertKindTypeDirectory')
    this.$store.dispatch('bornPage/onLoadUsersOfCurrentUserOrganisations')
    this.$store.dispatch('bornPage/onLoadCurrentUserDepartmentHead')
    this.$store.dispatch('bornPage/onLoadAccoucheurType')
    this.$store.dispatch('bornPage/onLoadRelationshipType')
    this.$store.dispatch('bornPage/onLoadDocTypeDirectory')
    this.$store.dispatch('bornPage/onLoadEduTypeDirectory')
    this.$store.dispatch('bornPage/onLoadFamilyStatusDirectory')
    this.$store.dispatch('bornPage/onLoadEmplStateDirectory')
    this.$store.dispatch('bornPage/onLoadbirthLocationTypeDirectory')
    this.$store.dispatch('bornPage/onLoadGenderChildDirectory')
    this.$store.dispatch('bornPage/onLoadFertilityTypeDirectory')
    this.$store.dispatch('deathPage/onLoadLocalityTypeDirectory')
  },
  data () {
    return {
      API_URL: API_URL,
      certRouteID: '',
      options: {
        format: 'DD.MM.YYYY',
        locale: 'ru',
        maxDate: moment()
      },
      commentsToggle: false,
      comment: null
    }
  },
  computed: {
    ...mapState('searchPage', ['adminRole', 'miacRole', 'printerRole', 'signerRole']),
    ...mapState('bornPage', ['loading', 'loader', 'warningTextMessage', 'draftTextMessage', 'textMessage', 'backendTextMessage', 'certKindType',
      'usersOfCurrentUserOrganisations', 'currentUserDepartmentHead', 'accoucheurType', 'relationshipType', 'docType', 'eduType', 'familyStatus',
      'emplState', 'birthLocationType', 'genderChild', 'fertilityType', 'allComments']),
    ...mapState('deathPage', ['resolutionType', 'localityType']),
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
    clearFieldByBool (boolData, type) {
      if (type === 'isPrivatePractitioner' && boolData === false) {
        this.form.privatePractitionerLicenceNumber = null
        this.form.privatePractitionerAddress = null
      }
    },
    sameAsMedOrg () {
      this.$store.dispatch('bornPage/onLoadAddressSameAsMedOrg', this.form.medOrgId)
    },
    onExit () {
      this.$modal.show('go-out')
    },
    onDraft () {
      if (this.form.certSeries === null && this.form.certNumber === null) {
        this.$store.dispatch('bornPage/onWarning')
      } else if (this.form.certSeries.length === 4 && this.form.certNumber.length === 8) {
        if (this.$route.params.id && this.form.certStatus === 'оформлено') {
          // EDIT DRAFT
          this.$store.dispatch('bornPage/onDraftEdit', this.form)
        } else {
          // DRAFT
          console.log('Draft saving...')
          this.$store.dispatch('bornPage/onDraft', this.form)
        }
      }
    },
    onSave () {
      this.$validator.validate().then(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.$store.dispatch('bornPage/onSaveEdit', this.form)
          } else {
            console.log('Saving...')
            this.$store.dispatch('bornPage/onSave', this.form)
          }
        }
      })
    },
    onLoadComments () {
      if (this.commentsToggle === true) {
        this.$store.dispatch('bornPage/onLoadAllCertComments', this.form.medCertId)
      }
    },
    onSendComment () {
      this.$store.dispatch('bornPage/onSaveCertComment', {'id': this.form.medCertId, 'data': {'comment': this.comment}})
      this.comment = null
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

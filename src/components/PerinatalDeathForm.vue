<template>
  <div>
    <Loader :loader="this.loader" />
    <SuccessModal :typeCert="'PerinatalDeath'" />
    <SuccessCopyModal :typeCert="'PerinatalDeath'" :certId="this.form.medCertId" />
    <NewSeriesAndNumberModal :typeCert="'PerinatalDeath'" :dto="this.form" />
    <InsteadOrDuplicateModal :typeCert="'PerinatalDeath'" :form="this.form" />
    <InsteadModal :typeCert="'PerinatalDeath'" :form="this.form" />
    <OutModal :form="this.form" />
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
              <label for="certSeries">Серия свидетельства<strong class="text-danger">*</strong></label>
              <input type="text" id="certSeries" v-model="form.certSeries" v-mask="'####'"
                     v-validate="{ required: true, min: 4 }" name="'Серия свидетельств'"
                     class="form-control" :class="{ 'is-invalid': errors.has('Серия свидетельств') }" />
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
                           name="'Дата выдачи'"
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
              <h5><strong>3. Смерть наступила<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertPerinatalDeath.birthRelatedDeathMoment"
                :items="birthRelatedDeathMomentType"
                @select="clearAddictedFields(form.medCertPerinatalDeath.birthRelatedDeathMoment, 'birthRelatedDeathMoment')"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('birthRelatedDeathMoment') }"
                id="birthRelatedDeathMoment"
                name="'3. Смерть наступила'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.birthRelatedDeathMoment = null;
                        clearAddictedFields(form.medCertPerinatalDeath.birthRelatedDeathMoment, 'birthRelatedDeathMoment')"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('birthRelatedDeathMoment')" class="invalid-feedback">{{ errors.first('birthRelatedDeathMoment') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 1 || form.medCertPerinatalDeath.birthRelatedDeathMoment == 2">
            <div class="col-md-12">
              <h5><strong>1. Роды мёртвым плодом<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-2">
              <date-picker v-if="form.medCertPerinatalDeath.deadFetusDate_isYear === false && form.medCertPerinatalDeath.deadFetusDate_isYearMonth === false"
                           v-model="form.medCertPerinatalDeath.deadFetusDate" v-mask="'##.##.####'"
                           id="deadFetusDate" class="form-control"
                           v-validate="{ required: true }"
                           :class="{ 'is-invalid': errors.has('deadFetusDate') }"
                           name="'1. Роды мёртвым плодом (дата)'" :config="options"></date-picker>
              <input v-if="form.medCertPerinatalDeath.deadFetusDate_isYear === true"
                     type="text" id="deadFetusDate_isYear_field" v-mask="'####'"
                     v-model="form.medCertPerinatalDeath.deadFetusDate"
                     name="deadFetusDate_isYear_field" class="form-control" />
              <input v-if="form.medCertPerinatalDeath.deadFetusDate_isYearMonth === true"
                     type="text" id="deadFetusDate_isYearMonth_field" v-mask="'##.####'"
                     v-model="form.medCertPerinatalDeath.deadFetusDate"
                     name="deadFetusDate_isYearMonth_field" class="form-control" />
            </div>
            <div class="col-md-1">
              <input v-if="form.medCertPerinatalDeath.deadFetusDate_isYear === false && form.medCertPerinatalDeath.deadFetusDate_isYearMonth === false"
                     type="text" id="deadFetusTime" v-mask="'##:##'" placeholder="чч:мм"
                     v-model="form.medCertPerinatalDeath.deadFetusTime"
                     v-validate="{ required: true }"
                     :class="{ 'is-invalid': errors.has('deadFetusTime') }"
                     name="'1. Роды мёртвым плодом (время)'" class="form-control" />
            </div>
            <div class="col-md-1">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.deadFetusDate_isYearMonth = false, form.medCertPerinatalDeath.deadFetusDate = null, form.medCertPerinatalDeath.deadFetusTime = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.deadFetusDate_isYear" name="deadFetusDate_isYear"
                       class="custom-control-input pointer" id="deadFetusDate_isYear">
                <label class="custom-control-label pointer" for="deadFetusDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.deadFetusDate_isYear = false, form.medCertPerinatalDeath.deadFetusDate = null, form.medCertPerinatalDeath.deadFetusTime = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.deadFetusDate_isYearMonth" name="deadFetusDate_isYearMonth"
                       class="custom-control-input pointer" id="deadFetusDate_isYearMonth">
                <label class="custom-control-label pointer" for="deadFetusDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 1 || form.medCertPerinatalDeath.birthRelatedDeathMoment == 2"></div>
          <div class="form-row mb-3" v-if="form.medCertPerinatalDeath.birthRelatedDeathMoment === 3">
            <div class="col-md-6">
              <h5><strong>2. Ребёнок родился живым<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>И умер<strong class="text-danger">*</strong></strong></h5>
            </div>
            <!-- Ребёнок родился живым -->
            <div class="col-md-2">
              <date-picker v-if="form.medCertPerinatalDeath.childBirthDate_isYear === false && form.medCertPerinatalDeath.childBirthDate_isYearMonth === false"
                           v-model="form.medCertPerinatalDeath.childBirthDate" v-mask="'##.##.####'"
                           id="childBirthDate" class="form-control"
                           v-validate="{ required: true }"
                           :class="{ 'is-invalid': errors.has('childBirthDate') }"
                           name="'2. Ребёнок родился живым (дата)'" :config="options"></date-picker>
              <input v-if="form.medCertPerinatalDeath.childBirthDate_isYear === true"
                     type="text" id="childBirthDate_isYear_field" v-mask="'####'"
                     v-model="form.medCertPerinatalDeath.childBirthDate"
                     name="childBirthDate_isYear_field" class="form-control" />
              <input v-if="form.medCertPerinatalDeath.childBirthDate_isYearMonth === true"
                     type="text" id="childBirthDate_isYearMonth_field" v-mask="'##.####'"
                     v-model="form.medCertPerinatalDeath.childBirthDate"
                     name="childBirthDate_isYearMonth_field" class="form-control" />
            </div>
            <div class="col-md-1">
              <input v-if="form.medCertPerinatalDeath.childBirthDate_isYear === false && form.medCertPerinatalDeath.childBirthDate_isYearMonth === false"
                     type="text" id="childBirthTime" v-mask="'##:##'" placeholder="чч:мм"
                     v-model="form.medCertPerinatalDeath.childBirthTime"
                     v-validate="{ required: true }"
                     :class="{ 'is-invalid': errors.has('childBirthTime') }"
                     name="'2. Ребёнок родился живым (время)'" class="form-control" />
            </div>
            <div class="col-md-1">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.childBirthDate_isYearMonth = false, form.medCertPerinatalDeath.childBirthDate = null, form.medCertPerinatalDeath.childBirthTime = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childBirthDate_isYear" name="childBirthDate_isYear"
                       class="custom-control-input pointer" id="childBirthDate_isYear">
                <label class="custom-control-label pointer" for="childBirthDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.childBirthDate_isYear = false, form.medCertPerinatalDeath.childBirthDate = null, form.medCertPerinatalDeath.childBirthTime = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childBirthDate_isYearMonth" name="childBirthDate_isYearMonth"
                       class="custom-control-input pointer" id="childBirthDate_isYearMonth">
                <label class="custom-control-label pointer" for="childBirthDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <!-- И Умер -->
            <div class="col-md-2">
              <date-picker v-if="form.medCertPerinatalDeath.childDeathDate_isYear === false && form.medCertPerinatalDeath.childDeathDate_isYearMonth === false"
                           v-model="form.medCertPerinatalDeath.childDeathDate" v-mask="'##.##.####'"
                           id="childDeathDate" class="form-control"
                           v-validate="{ required: true }"
                           :class="{ 'is-invalid': errors.has('childDeathDate') }"
                           name="'2. И умер (дата)'" :config="options"></date-picker>
              <input v-if="form.medCertPerinatalDeath.childDeathDate_isYear === true"
                     type="text" id="childDeathDate_isYear_field" v-mask="'####'"
                     v-model="form.medCertPerinatalDeath.childDeathDate"
                     name="childDeathDate_isYear_field" class="form-control" />
              <input v-if="form.medCertPerinatalDeath.childDeathDate_isYearMonth === true"
                     type="text" id="childDeathDate_isYearMonth_field" v-mask="'##.####'"
                     v-model="form.medCertPerinatalDeath.childDeathDate"
                     name="childDeathDate_isYearMonth_field" class="form-control" />
            </div>
            <div class="col-md-1">
              <input v-if="form.medCertPerinatalDeath.childDeathDate_isYear === false && form.medCertPerinatalDeath.childDeathDate_isYearMonth === false"
                     type="text" id="childDeathTime" v-mask="'##:##'" placeholder="чч:мм"
                     v-model="form.medCertPerinatalDeath.childDeathTime"
                     v-validate="{ required: true }"
                     :class="{ 'is-invalid': errors.has('childDeathTime') }"
                     name="'2. И умер (время)'" class="form-control" />
            </div>
            <div class="col-md-1">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.childDeathDate_isYearMonth = false, form.medCertPerinatalDeath.childDeathDate = null, form.medCertPerinatalDeath.childDeathTime = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childDeathDate_isYear" name="childDeathDate_isYear"
                       class="custom-control-input pointer" id="childDeathDate_isYear">
                <label class="custom-control-label pointer" for="childDeathDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-2">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.childDeathDate_isYear = false, form.medCertPerinatalDeath.childDeathDate = null, form.medCertPerinatalDeath.childDeathTime = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.childDeathDate_isYearMonth" name="childDeathDate_isYearMonth"
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
              <label for="certSeries">Номер</label>
              <input type="text" id="actRecordNumber" :disabled="true" v-model="form.medCertPerinatalDeath.actRecordNumber"
                     name="actRecordNumber" class="form-control" />
            </div>
            <div class="col-md-2">
              <label>Дата</label>
              <date-picker :disabled="true" v-model="form.medCertPerinatalDeath.actRecordDate" v-mask="'##.##.####'"
                           name="actRecordDate" id="actRecordDate" class="form-control"
                           :config="options"></date-picker>
            </div>
            <div class="col-md-2">
              <label for="certSeries">Орган ЗАГС</label>
              <input type="text" id="registryDepartment" :disabled="true" v-model="form.medCertPerinatalDeath.registryDepartment"
                     name="registryDepartment" class="form-control" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>Работник органа ЗАГС</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="certSeries">Фамилия</label>
              <input type="text" id="actRecordEmployeeLastName" v-model="form.medCertPerinatalDeath.actRecordEmployeeLastName"
                     :disabled="true" name="actRecordEmployeeLastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="certSeries">Имя</label>
              <input type="text" id="actRecordEmployeeFirstName" v-model="form.medCertPerinatalDeath.actRecordEmployeeFirstName"
                     :disabled="true" name="actRecordEmployeeFirstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="certSeries">Отчество</label>
              <input type="text" id="actRecordEmployeePatronymicName" v-model="form.medCertPerinatalDeath.actRecordEmployeePatronymicName"
                     :disabled="true" name="actRecordEmployeePatronymicName" class="form-control" />
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
              <h5><strong>25. Заполнил медицинское свидетельство<strong class="text-danger">*</strong></strong></h5>
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
                name="'25. Заполнил медицинское свидетельство'"
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
        <div class="tab-pane fade" id="mother" role="tabpanel" aria-labelledby="mother-tab">
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>4. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="motherLastName">Фамилия</label>
              <input type="text" id="motherLastName" v-model="form.medCertPerinatalDeath.motherLastName"
                     @keypress="isNumber($event)" name="motherLastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="motherFirstName">Имя</label>
              <input type="text" id="motherFirstName" v-model="form.medCertPerinatalDeath.motherFirstName"
                     @keypress="isNumber($event)" name="motherFirstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="motherPatronymicName">Отчество</label>
              <input type="text" id="motherPatronymicName" v-model="form.medCertPerinatalDeath.motherPatronymicName"
                     @keypress="isNumber($event)" name="motherPatronymicName" class="form-control" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>5. Дата рождения</strong></h5>
            </div>
            <div class="col-md-2">
              <date-picker v-if="form.medCertPerinatalDeath.motherBirthDate_isYear === false && form.medCertPerinatalDeath.motherBirthDate_isYearMonth === false && form.medCertPerinatalDeath.motherBirthDateUnknow === false"
                           v-model="form.medCertPerinatalDeath.motherBirthDate" v-mask="'##.##.####'"
                           name="motherBirthDate" id="motherBirthDate" class="form-control"
                           :config="options"></date-picker>
              <input v-if="form.medCertPerinatalDeath.motherBirthDate_isYear === true"
                     type="text" id="motherBirthDate_isYear_field" v-mask="'####'"
                     v-model="form.medCertPerinatalDeath.motherBirthDate"
                     name="motherBirthDate_isYear_field" class="form-control" />
              <input v-if="form.medCertPerinatalDeath.motherBirthDate_isYearMonth === true"
                     type="text" id="motherBirthDate_isYearMonth_field" v-mask="'##.####'"
                     v-model="form.medCertPerinatalDeath.motherBirthDate"
                     name="motherBirthDate_isYearMonth_field" class="form-control" />
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.motherBirthDate_isYearMonth = false, form.medCertPerinatalDeath.motherBirthDateUnknow = false, form.medCertPerinatalDeath.motherBirthDate = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.motherBirthDate_isYear" name="motherBirthDate_isYear"
                       class="custom-control-input pointer" id="motherBirthDate_isYear">
                <label class="custom-control-label pointer" for="motherBirthDate_isYear">Известен только год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.motherBirthDate_isYear = false, form.medCertPerinatalDeath.motherBirthDateUnknow = false, form.medCertPerinatalDeath.motherBirthDate = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.motherBirthDate_isYearMonth" name="motherBirthDate_isYearMonth"
                       class="custom-control-input pointer" id="motherBirthDate_isYearMonth">
                <label class="custom-control-label pointer" for="motherBirthDate_isYearMonth">Известен только месяц и год</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.motherBirthDate_isYear = false, form.medCertPerinatalDeath.motherBirthDate_isYearMonth = false, form.medCertPerinatalDeath.motherBirthDate = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.motherBirthDateUnknow" name="motherBirthDateUnknow"
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
          <AddressesPerinatalDeath :address="form.medCertPerinatalDeath.addresses[0]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>7. Местность</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertPerinatalDeath.addresses[0].locality"
                :items="localityType"
                itemValue="id"
                itemText="name"
                id="locality"
                name="locality"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.addresses[0].locality = null"
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
              <h5><strong>8. Семейное положение</strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.motherFamilyStatus"
                :items="familyStatus"
                itemValue="id"
                itemText="name"
                id="motherFamilyStatus"
                name="motherFamilyStatus"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.motherFamilyStatus = null"
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
              <h5><strong>9. Образование</strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>10. Занятость</strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.motherEduLevel"
                :items="eduType"
                itemValue="id"
                itemText="name"
                id="motherEduLevel"
                name="motherEduLevel"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.motherEduLevel = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="input-group col-md-5 offset-1">
              <cool-select
                v-model="form.medCertPerinatalDeath.motherEmplState"
                :items="emplState"
                itemValue="id"
                itemText="name"
                id="motherEmplState"
                name="motherEmplState"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.motherEmplState = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>11. Которые по счёту роды</strong></h5>
            </div>
            <div class="col-md-1">
              <input type="text" id="motherBirthCount" v-mask="'##'"
                     v-validate="'max_value:30'"
                     v-model="form.medCertPerinatalDeath.motherBirthCount"
                     name="11. Которые по счёту роды" class="form-control" />
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="died" role="tabpanel" aria-labelledby="died-tab">
          <div class="form-row mb-3">
            <div class="col-md-4">
              <label>Номер трупа</label>
              <div class="input-group">
                <input type="text" class="form-control" v-model="form.medCertPerinatalDeath.bodyNumberNum">
                <input type="text" class="form-control" v-model="form.medCertPerinatalDeath.bodyNumberDept" :disabled="true">
                <cool-select
                  v-model="form.medCertPerinatalDeath.bodyNumberYear"
                  :items="yearType"
                  itemValue="id"
                  itemText="name"
                  style="width: 80px!important"/>
                <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.bodyNumberNum = null, form.medCertPerinatalDeath.bodyNumberYear = null"
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
              <h5><strong>12. ФИО</strong></h5>
            </div>
            <div class="col-md-2">
              <label for="lastName">Фамилия</label>
              <input type="text" id="lastName" v-model="form.medCertPerinatalDeath.lastName"
                     @keypress="isNumber($event)" name="lastName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="firstName">Имя</label>
              <input type="text" id="firstName" v-model="form.medCertPerinatalDeath.firstName"
                     @keypress="isNumber($event)" name="firstName" class="form-control" />
            </div>
            <div class="col-md-2">
              <label for="patronymicName">Отчество</label>
              <input type="text" id="patronymicName" v-model="form.medCertPerinatalDeath.patronymicName"
                     @keypress="isNumber($event)" name="patronymicName" class="form-control" />
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12"><h5><strong>13. Место смерти (мёртворождения)</strong></h5></div>
            <div class="col-md-5 ml-3 mb-2">
              <button class="btn btn-sm btn-outline-primary" @click.prevent="sameAsRegPlace">Совпадает с местом постоянного жительства(регистрации)</button>
            </div>
            <div class="col-md-5 ml-3 mb-2">
              <button class="btn btn-sm btn-outline-primary" @click.prevent="sameAsMedOrg">Совпадает с адресом медицинской организации</button>
            </div>
          </div>
          <!-- Адрес -->
          <AddressesPerinatalDeath :address="form.medCertPerinatalDeath.addresses[1]" />
          <!-- END Адрес -->
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>14. Местность</strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertPerinatalDeath.addresses[1].locality"
                :items="localityType"
                itemValue="id"
                itemText="name"
                id="locality2"
                name="locality2"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.addresses[1].locality = null"
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
              <h5><strong>15. Смерть (мёртворождение) произошла(о)<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.deathLocationP"
                :items="deathLocationType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('deathLocation') }"
                id="deathLocation"
                name="'15. Смерть (мёртворождение) произошла(о)'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.deathLocationP = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('deathLocation')" class="invalid-feedback">{{ errors.first('deathLocation') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>16. Пол<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.gender"
                :items="genderChildType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('gender') }"
                id="gender"
                name="'16. Пол'"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.gender = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('gender')" class="invalid-feedback">{{ errors.first('gender') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>17. Масса тела ребенка (плода) при рождении<strong v-if="!form.medCertPerinatalDeath.weightAndLengthUnknow" class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-6">
              <h5><strong>18. Длина тела ребенка (плода) при рождении<strong v-if="!form.medCertPerinatalDeath.weightAndLengthUnknow" class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-1">
              <input v-if="!form.medCertPerinatalDeath.weightAndLengthUnknow" v-mask="'####'"
                     type="text" id="weight" v-model="form.medCertPerinatalDeath.weight"
                     v-validate="'required|min_value:200|max_value:9999'" name="'17. Масса тела ребенка (плода) при рождении'"
                     class="form-control" :class="{ 'is-invalid': errors.has('weight') }" />
              <div v-if="errors.has('weight')" class="invalid-feedback">{{ errors.first('weight') }}</div>
            </div>
            <div class="col-md-1 pt-md-2">
              <p v-if="!form.medCertPerinatalDeath.weightAndLengthUnknow">Г.</p>
            </div>
            <div class="col-md-1 offset-4">
              <input v-if="!form.medCertPerinatalDeath.weightAndLengthUnknow" v-mask="'##'"
                     type="text" id="length" v-model="form.medCertPerinatalDeath.length"
                     v-validate="'required|min_value:10|max_value:99'" name="'18. Длина тела ребенка (плода) при рождении'"
                     class="form-control" :class="{ 'is-invalid': errors.has('length') }" />
              <div v-if="errors.has('length')" class="invalid-feedback">{{ errors.first('length') }}</div>
            </div>
            <div class="col-md-1 pt-md-2">
              <p v-if="!form.medCertPerinatalDeath.weightAndLengthUnknow">СМ.</p>
            </div>
            <div class="col-md-3 offset-4">
              <div class="custom-control custom-checkbox"
                   @click="form.medCertPerinatalDeath.weight = null, form.medCertPerinatalDeath.length = null">
                <input type="checkbox" v-model="form.medCertPerinatalDeath.weightAndLengthUnknow" name="weightAndLengthUnknow"
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
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.fertility"
                :items="fertilityType"
                @select="clearAddictedFields(form.medCertPerinatalDeath.fertility, 'fertility')"
                itemValue="id"
                itemText="name"
                id="fertility"
                name="fertility"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.fertility = null;
                        clearAddictedFields(form.medCertPerinatalDeath.fertility, 'fertility')"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
          </div>
          <div class="form-line" v-if="form.medCertPerinatalDeath.fertility === 2"></div>
          <div class="form-row mb-3" v-if="form.medCertPerinatalDeath.fertility === 2">
            <div class="col-md-4">
              <label>Число детей родившихся (живыми и мертвыми)<strong class="text-danger">*</strong></label>
              <input type="text" v-mask="'##'"
                     v-model="form.medCertPerinatalDeath.childBornNumber"
                     v-validate="'required|max_value:10'" name="'19. Число детей родившихся (живыми и мертвыми)'"
                     class="form-control" :class="{ 'is-invalid': errors.has('childBornNumber') }" >
            </div>
            <div class="col-md-2">
              <label>Которыми по счету<strong class="text-danger">*</strong></label>
              <input type="text" v-mask="'##'"
                     v-model="form.medCertPerinatalDeath.totalChildBornNumber"
                     v-validate="'required|max_value:10'" name="'19. Которыми по счету'"
                     class="form-control" :class="{ 'is-invalid': errors.has('totalChildBornNumber') }" >
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>20. Которым по счету ребенок был рожден у матери (считая умерших и не считая мертворожденных)</strong></h5>
            </div>
            <div class="col-md-2">
              <input type="text" class="form-control" v-mask="'##'"
                     v-model="form.medCertPerinatalDeath.deathChildNumber">
            </div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>21. Смерть ребенка (плода) произошла</strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.deathAccidentP"
                :items="deathAccidentType"
                itemValue="id"
                itemText="name"
                id="deathAccident"
                name="deathAccident"
                placeholder="">
              </cool-select>
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.deathAccidentP = null"
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
              <h5><strong>22. Лицо, принимавшее роды<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-3">
              <cool-select
                v-model="form.medCertPerinatalDeath.accoucheurTypeP"
                :items="accoucheurType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('accoucheurTypeP') }"
                id="accoucheurTypeP" name="'22. Лицо, принимавшее роды'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.accoucheurTypeP = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('accoucheurTypeP')" class="invalid-feedback">{{ errors.first('accoucheurTypeP') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>23. Причины перинатальной смерти</strong></h5>
            </div>
          </div>
          <div v-for="(diagnItem, index) in form.medCertPerinatalDeath.deathReason.deathReasonDiagns"
               :key="index" class="border border-secondary rounded mt-2 p-2">
            <font-awesome-icon v-if="index > 4" class="text-danger pointer float-right" :icon="['fas', 'times']"
                               title="Удалить" @click="deleteDiagn(diagnItem)"/>
            <div class="row">
              <div class="col-md-2">
                <div v-if="index >= 4" class="alert alert-primary mb-3 custom-alert" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" :name="'print_' + index"
                           v-model="diagnItem.isPrint"
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
                <strong>
                  <span v-if="diagnItem.diagnType.name === 'а'">Основное заболевание или патологическое <kbd>состояние плода или ребенка</kbd></span>
                  <span v-if="diagnItem.diagnType.name === 'б'">Другие заболевания или патологические состояния плода или ребенка</span>
                  <span v-if="diagnItem.diagnType.name === 'в'">Основное заболевание или патологическое <kbd>состояние матери</kbd>, оказавшее неблагоприятное влияние на плод или ребенка</span>
                  <span v-if="diagnItem.diagnType.name === 'г'">Другие заболевания или патологические состояния матери, оказавшее неблагоприятное влияние на плод или ребенка</span>
                  <span v-if="diagnItem.diagnType.name === 'д'">Другие обстоятельства, имевшие отношение к мёртворождению, смерти</span>
                </strong>
                <font-awesome-icon v-if="index <= 4" class="text-danger pointer" :icon="['fas', 'times']"
                                   title="Очистить поля" @click="clearDeathReasonDiagns(diagnItem)"/>
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
          <div class="text-center mt-3">
            <button class="btn btn-outline-primary"
                    @click.prevent="moreDiagn">+ Ещё причины смерти</button>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-12">
              <h5><strong>24. Причины смерти установлены<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.recordedDeathEmplTypeP"
                :items="recordedDeathEmplType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('recordedDeathEmplTypeP') }"
                id="recordedDeathEmplTypeP" name="'24. Причины смерти установлены'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.recordedDeathEmplTypeP = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div v-if="errors.has('recordedDeathEmplTypeP')" class="invalid-feedback">{{ errors.first('recordedDeathEmplTypeP') }}</div>
          </div>
          <div class="form-line"></div>
          <div class="form-row mb-3">
            <div class="col-md-6">
              <h5><strong>На основании<strong class="text-danger">*</strong></strong></h5>
            </div>
            <div class="col-md-6">
              <h5 v-if="form.medCertPerinatalDeath.recordedDeathBasedOld && form.medCertPerinatalDeath.recordedDeathBasedOld.length > 0">
                <strong>На основании (старые данные)</strong>
              </h5>
            </div>
            <div class="input-group col-md-5">
              <cool-select
                v-model="form.medCertPerinatalDeath.recordedDeathBased"
                :items="recordedDeathBasedType"
                itemValue="id"
                itemText="name"
                v-validate="{ required: true }"
                :class="{ 'is-invalid': errors.has('recordedDeathBased') }"
                id="recordedDeathBased" name="'На основании'"
                placeholder="" />
              <span class="input-group-append">
                <button @click="form.medCertPerinatalDeath.recordedDeathBased = null"
                        title="Очистить поле"
                        class="btn btn-outline-dark border-left-0 border custom-height" type="button">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </button>
              </span>
            </div>
            <div class="input-group col-md-5 offset-1" v-if="form.medCertPerinatalDeath.recordedDeathBasedOld && form.medCertPerinatalDeath.recordedDeathBasedOld.length > 0">
              <div class="custom-control custom-checkbox mt-2"
                   v-for="(item, index) in form.medCertPerinatalDeath.recordedDeathBasedOld" :key="index">
                <input type="checkbox" v-model="item.value" name="recordedOld" :disabled="true"
                       class="custom-control-input pointer" :id="'recordedOld' + index">
                <label class="custom-control-label pointer mr-3" :for="'recordedOld' + index"><strong>{{ item.name }} |</strong></label>
              </div>
            </div>
            <div v-if="errors.has('recordedDeathBased')" class="invalid-feedback">{{ errors.first('recordedDeathBased') }}</div>
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
              <button type="button" class="btn btn-warning text-white btn-to-top">
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
import AddressesPerinatalDeath from './elements/AddressesPerinatalDeath'

Vue.component('v-select', vSelect)

export default {
  name: 'perinatal-death-form',
  components: {
    CoolSelect,
    Loader,
    SuccessModal,
    SuccessCopyModal,
    NewSeriesAndNumberModal,
    InsteadOrDuplicateModal,
    InsteadModal,
    OutModal,
    AddressesPerinatalDeath
  },
  beforeMount () {
    /* CREATE|EDIT */
    if (this.$route.params.id) {
      this.certRouteID = this.$route.params.id
      this.$store.dispatch('perinatalDeathPage/onEditForm', this.certRouteID)
    } else {
      this.$store.dispatch('perinatalDeathPage/onLoadFrom')
    }
    /* END CREATE|EDIT */
  },
  mounted () {
    this.$store.dispatch('searchPage/onUserCheck')
    this.$store.dispatch('deathPage/onLoadResolutionTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadCertKindTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadUsersOfCurrentUserOrganisations')
    this.$store.dispatch('perinatalDeathPage/onLoadCurrentUserDepartmentHead')
    this.$store.dispatch('perinatalDeathPage/onLoadBirthRelatedDeathMomentType')
    this.$store.dispatch('perinatalDeathPage/onLoadRelationshipType')
    this.$store.dispatch('perinatalDeathPage/onLoadDocTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadFamilyStatusDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadEduTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadEmplStateDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadYearTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadDeathLocationTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadGenderChildTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadFertilityTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadDeathAccidentTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadAccoucheurTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadRecordedDeathEmplTypeDirectory')
    this.$store.dispatch('perinatalDeathPage/onLoadRecordedDeathBasedTypeDirectory')
    this.$store.dispatch('deathPage/onLoadLocalityTypeDirectory')
    this.$store.dispatch('deathPage/onLoadPlaces')
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
    ...mapState('searchPage', ['adminRole', 'miacRole', 'printerRole', 'signerRole', 'moSelectorRole']),
    ...mapState('perinatalDeathPage', ['loading', 'loader', 'warningTextMessage', 'draftTextMessage', 'textMessage', 'backendTextMessage',
      'birthRelatedDeathMomentType', 'certKindType', 'usersOfCurrentUserOrganisations', 'currentUserDepartmentHead', 'relationshipType', 'docType', 'familyStatus', 'eduType', 'emplState',
      'yearType', 'deathLocationType', 'genderChildType', 'fertilityType', 'deathAccidentType', 'accoucheurType',
      'formStatus', 'serverRequest', 'recordedDeathEmplType', 'recordedDeathBasedType', 'allComments']),
    ...mapState('deathPage', ['resolutionType', 'localityType', 'placesList']),
    ...mapGetters('perinatalDeathPage', ['form', 'stuff'])
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
      this.form.medCertPerinatalDeath.bodyNumberDept = item.code
      this.form.deptId = item.departmentId
      this.stuff.address = item.orgAddress
      this.stuff.codeBSME = item.codeBSME
    },
    clearAddictedFields (data, type) {
      if (type === 'isPrivatePractitioner' && data === false) {
        this.form.privatePractitionerLicenceNumber = null
        this.form.privatePractitionerAddress = null
      }
      if ((type === 'birthRelatedDeathMoment' && data === 4) || (type === 'birthRelatedDeathMoment' && data === null)) {
        this.form.medCertPerinatalDeath.deadFetusDate = null
        this.form.medCertPerinatalDeath.deadFetusTime = null
        this.form.medCertPerinatalDeath.deadFetusDate_isYear = null
        this.form.medCertPerinatalDeath.deadFetusDate_isYearMonth = null
        this.form.medCertPerinatalDeath.childBirthDate = null
        this.form.medCertPerinatalDeath.childBirthTime = null
        this.form.medCertPerinatalDeath.childBirthDate_isYear = null
        this.form.medCertPerinatalDeath.childBirthDate_isYearMonth = null
        this.form.medCertPerinatalDeath.childDeathDate = null
        this.form.medCertPerinatalDeath.childDeathTime = null
        this.form.medCertPerinatalDeath.childDeathDate_isYear = null
        this.form.medCertPerinatalDeath.childDeathDate_isYearMonth = null
      }
      if (type === 'birthRelatedDeathMoment' && data === 3) {
        this.form.medCertPerinatalDeath.deadFetusDate = null
        this.form.medCertPerinatalDeath.deadFetusTime = null
        this.form.medCertPerinatalDeath.deadFetusDate_isYear = null
        this.form.medCertPerinatalDeath.deadFetusDate_isYearMonth = null
      }
      if ((type === 'birthRelatedDeathMoment' && data === 1) || (type === 'birthRelatedDeathMoment' && data === 2)) {
        this.form.medCertPerinatalDeath.childBirthDate = null
        this.form.medCertPerinatalDeath.childBirthTime = null
        this.form.medCertPerinatalDeath.childBirthDate_isYear = null
        this.form.medCertPerinatalDeath.childBirthDate_isYearMonth = null
        this.form.medCertPerinatalDeath.childDeathDate = null
        this.form.medCertPerinatalDeath.childDeathTime = null
        this.form.medCertPerinatalDeath.childDeathDate_isYear = null
        this.form.medCertPerinatalDeath.childDeathDate_isYearMonth = null
      }
      if ((type === 'fertility' && data === 1) || (type === 'fertility' && data === null)) {
        this.form.medCertPerinatalDeath.childBornNumber = null
        this.form.medCertPerinatalDeath.totalChildBornNumber = null
      }
    },
    clearDeathReasonDiagns (item) {
      let arr = this.form.medCertPerinatalDeath.deathReason.deathReasonDiagns
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].diagnType.name === item.diagnType.name) {
          let prevItem = i - 1
          if (i > 0) {
            arr.forEach(function (inner, index) {
              if (arr[index].diagnType.name === arr[prevItem].diagnType.name) {
                // arr[index].isPrime = true
                item.mkb.id = -1
                item.mkb.mkbCode = ''
                item.mkb.name = ''
                item.mkb.description = ''
                item.deathReasonDiagnId = null
                item.description = null
                item.isPrint = false
                // item.isPrime = false
              }
            })
          } else {
            item.mkb.id = -1
            item.mkb.mkbCode = ''
            item.mkb.name = ''
            item.mkb.description = ''
            item.deathReasonDiagnId = null
            item.description = null
            item.isPrint = false
            // item.isPrime = false
          }
        }
      }
    },
    searchOnServer ($event) {
      const lettersLimit = 4
      if ($event.target.value.length >= lettersLimit) {
        this.$store.dispatch('perinatalDeathPage/onSearchData', {'searchLine': $event.target.value})
      }
    },
    selectDiagn (option, item) {
      item.isPrint = true
      // item.isPrime = true
      let arr = this.form.medCertPerinatalDeath.deathReason.deathReasonDiagns
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].diagnType.name !== item.diagnType.name) {
          arr[i].isPrint = false
          // arr[i].isPrime = false
        }
      }
    },
    moreDiagn () {
      this.form.medCertPerinatalDeath.deathReason.deathReasonDiagns.push({
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
      let arr = this.form.medCertPerinatalDeath.deathReason.deathReasonDiagns
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].diagnType.name === item.diagnType.name) {
          arr.splice(i, 1)
        }
      }
    },
    sameAsRegPlace () {
      this.$store.commit('perinatalDeathPage/SET_SAME_ADDRESSES')
    },
    sameAsMedOrg () {
      this.$store.dispatch('perinatalDeathPage/onLoadAddressSameAsMedOrg', this.form.medOrgId)
    },
    onExit () {
      this.$modal.show('go-out')
    },
    onDraft () {
      if (this.form.certSeries === null && this.form.certNumber === null) {
        this.$store.dispatch('perinatalDeathPage/onWarning')
      } else if (this.form.certSeries.length === 4 && this.form.certNumber.length === 8) {
        if (this.$route.params.id && this.form.certStatus === 'оформлено') {
          // EDIT DRAFT
          this.$store.dispatch('perinatalDeathPage/onDraftEdit', this.form)
        } else {
          // DRAFT
          console.log('Draft saving...')
          this.$store.dispatch('perinatalDeathPage/onDraft', this.form)
        }
      }
    },
    onSave () {
      this.$validator.validate().then(valid => {
        if (valid) {
          if (this.$route.params.id) {
            this.$store.dispatch('perinatalDeathPage/onSaveEdit', this.form)
          } else {
            console.log('Saving...')
            this.$store.dispatch('perinatalDeathPage/onSave', this.form)
          }
        }
      })
    },
    onLoadComments () {
      if (this.commentsToggle === true) {
        this.$store.dispatch('perinatalDeathPage/onLoadAllCertComments', this.form.medCertId)
      }
    },
    onSendComment () {
      this.$store.dispatch('perinatalDeathPage/onSaveCertComment', {'id': this.form.medCertId, 'data': {'comment': this.comment}})
      this.comment = null
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

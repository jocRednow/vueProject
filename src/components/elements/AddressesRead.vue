<template>
  <div class="ml-4">
    <div class="form-row mb-3">
      <div class="col-md-6">
        <label>Страна</label>
      </div>
      <div class="col-md-6">
        <!--<label>Местность</label>-->
      </div>
      <div class="col-md-5">
        <p><strong>{{ address.countryRegion.name }}</strong></p>
      </div>
      <div class="col-md-5 offset-1">
        <!--<p><strong>{{ address.locality }}</strong></p>-->
      </div>
    </div>
    <div class="form-row mb-3">
      <div class="col-md-11">
        <p v-if="address.addressSearchObj"><strong>{{ address.addressSearchObj.name }}</strong></p>
      </div>
    </div>
    <div v-if="address.countryRegion && address.countryRegion.refId === 'РФ'">
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Субъект</label>
        </div>
        <div class="col-md-6"></div>
        <div class="col-md-5">
          <p><strong>{{ address.aolevel1.name }}</strong></p>
        </div>
        <div class="col-md-5 offset-1"></div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Город</label>
        </div>
        <div class="col-md-6">
          <label>Населенный пункт</label>
        </div>
        <div class="col-md-5">
          <p><strong>{{ address.aolevel4.name }}</strong></p>
        </div>
        <div class="input-group col-md-5 offset-1">
          <p><strong>{{ address.aolevel6.name }}</strong></p>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Внутригородская территория</label>
        </div>
        <div class="col-md-6">
          <label>Район</label>
        </div>
        <div class="col-md-5">
          <p><strong>{{ address.aolevel5.name }}</strong></p>
        </div>
        <div class="col-md-5 offset-1">
          <p><strong>{{ address.aolevel3.name }}</strong></p>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Элем. планир. структуры</label>
        </div>
        <div class="col-md-6">
          <label>Подчиненные доп. территория объекты</label>
        </div>
        <div class="col-md-5">
          <p><strong>{{ address.aolevel65.name }}</strong></p>
        </div>
        <div class="col-md-5 offset-1">
          <p><strong>{{ address.aolevel91.name }}</strong></p>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Улица</label>
        </div>
        <div class="col-md-3">
          <label>Дом</label>
        </div>
        <div class="col-md-5">
          <p><strong>{{ address.aolevel7.name }}</strong></p>
        </div>
        <div class="col-md-5 offset-1">
          <p><strong>{{ address.house.name }}</strong></p>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6"><label>Квартира</label></div>
        <div class="col-md-6">
          <label v-if="address.aolevel1.name === 'Санкт-Петербург г'">Район г.Санкт-Петербурга</label>
        </div>
        <div class="col-md-5">
          <p><strong>{{ address.flat }}</strong></p>
        </div>
        <div class="input-group col-md-5 offset-1">
          <p v-if="address.aolevel1.name === 'Санкт-Петербург г'"><strong>{{ address.addressAdmObject }}</strong></p>
        </div>
      </div>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Адрес</label>
        </div>
        <div class="col-md-6">
          <label>Уточнение адреса</label>
        </div>
        <div class="col-md-5">
          <p><strong>{{ address.addressTxt }}</strong></p>
        </div>
        <div class="col-md-5 offset-1">
          <p><strong>{{ address.addressTxtRandom }}</strong></p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="form-row mb-3">
        <div class="col-md-6">
          <label>Уточнение адреса</label>
        </div>
        <div class="col-md-6"></div>
        <div class="col-md-5">
          <p><strong>{{ address.addressTxtRandom }}</strong></p>
        </div>
        <div class="input-group col-md-5 offset-1"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'addresses-read',
  props: {
    address: {
      type: Object
    }
  },
  data () {
    return {}
  }
}
</script>

<style scoped></style>

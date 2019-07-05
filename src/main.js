import Vue from 'vue'
import './plugins/axios'
import App from './App'
import router from './router'
import { store } from './store/index'
import VueSelect from 'vue-cool-select'
import VueTheMask from 'vue-the-mask'
import VeeValidate from 'vee-validate'
import VueValidationRu from 'vee-validate/dist/locale/ru'
import BackToTop from 'vue-backtotop'
import datePicker from 'vue-bootstrap-datetimepicker'
import InfiniteLoading from 'vue-infinite-loading'
import VModal from 'vue-js-modal'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faTimes, faSignOutAlt, faPlusCircle, faMinusCircle, faEdit, faEye, faPrint, faChevronUp, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

Vue.config.productionTip = false

Vue.use(VueSelect, {
  theme: 'bootstrap' // or 'material-design'
})
Vue.use(VueTheMask)
Vue.use(BackToTop)
Vue.use(VeeValidate, {
  locale: 'ru',
  dictionary: {
    ru: VueValidationRu
  }
})
Vue.use(datePicker)
Vue.use(InfiniteLoading, { /* options */ })
Vue.use(VModal)
library.add(faUser, faLock, faTimes, faSignOutAlt, faPlusCircle, faMinusCircle, faEdit, faEye, faPrint, faChevronUp, faSyncAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

const API_URL = window.location.origin === 'http://miac:8088' ? 'http://10.1.20.30:8008/java-app' : '/java-app'

const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

export { vm, API_URL }

<template>
  <div>
    <div id="main" class="container-fluid">
      <Header></Header>
      <router-view/>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/searchPage/Header'
import Footer from './components/searchPage/Footer'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>

<style>
  /* cyrillic */
  @font-face {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 400;
    src: local('Exo 2'), local('Exo2-Regular'), url('../static/7cHmv4okm5zmbtYsK-4E4Q.woff2') format('woff2');
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 400;
    src: local('Exo 2'), local('Exo2-Regular'), url('../static/7cHmv4okm5zmbtYoK-4.woff2') format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Exo 2';
    font-style: normal;
    font-weight: 400;
    src: local('Exo 2'), local('Exo2-Regular'), url('../static/7cHmv4okm5zmbtYoK-4.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  html, body {
    margin: 0!important;
    padding: 0!important;
    font-family: 'Exo 2', sans-serif!important;
  }
  #main {
    min-height: calc(100vh - 100px)!important;
  }
  footer {
    margin-top: 40px!important;
    padding: 30px 20px!important;
    background-color: #007bff!important;
  }
  .was-validated .form-control:invalid, .form-control.is-invalid {
    padding-right: 0.75rem!important;
    background-image: none!important;
  }
  .btn-half-danger {
    color: white!important;
    background-color: #FF7F50!important;
  }
  .btn-half-danger:hover,
  .btn-half-danger:active {
    color: white!important;
    background-color: #C7633E!important;
  }
  .text-helf-danger {
    color: #C7633E!important;
  }
  .pointer {
    cursor: pointer!important;
  }
  .dot {
    position: absolute;
    top: 2px!important;
    height: 20px!important;
    width: 20px!important;
    border-radius: 50%!important;
    display: inline-block!important;
  }
  .dot-title {
    margin-left: 30px!important;
  }
  .text-hover-white:hover {
    color: white!important;
  }
  .custom-alert {
    padding: 0 0 0 20px!important;
  }
  .IZ-select {
    width: 88%!important;
  }
  .IZ-select__input input {
    line-height: 24px!important;
  }
  .custom-cool-select .IZ-select__input input {
    line-height: normal!important;
  }
  .custom-height {
    height: 38px!important;
  }
  @media screen and (max-width: 1500px) {
    .custom-cool-select .IZ-select {
      width: 95%!important;
    }
  }
  @media screen and (min-width: 1501px) {
    .custom-cool-select .IZ-select {
      width: 96.5%!important;
    }
  }
  .v-select {
    width: 100%!important;
  }
  .v-select-md .vs__selected-options input {
    height: 28px!important;
  }
  .v-select-lg {
    width: 96%!important
  }
  .v-select-lg .vs__selected-options input {
    height: 40px!important;
  }
  .vs__dropdown-menu {
    z-index: 1000!important;
  }
  .select-option {
    padding: 5px 5px!important;
    margin: 0 0!important;
  }
</style>

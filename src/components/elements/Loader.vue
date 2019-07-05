<template>
  <div v-if="loader">
    <div class="loader-shadow"></div>
    <div class="loader">
      <img src="../../assets/loader.svg" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'loader',
  props: {
    loader: {
      type: Boolean
    }
  }
}
</script>

<style scoped>
  .loader-shadow {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.7;
  }
  .loader {
    position: fixed;
    top: 40%;
    left: 46%;
    z-index: 1060;
  }
</style>

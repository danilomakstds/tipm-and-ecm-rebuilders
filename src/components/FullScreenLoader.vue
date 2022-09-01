<template>
  <div id="loading">
    <div class="d-flex justify-content-center align-items-center h-100"><dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader></div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import DotLoader from 'vue-spinner/src/DotLoader.vue'

export default defineComponent({
  name: 'FullScreenLoader',
  components: {
    DotLoader
  }
});
</script>

<style scoped>
div#loading{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(5, 5, 5, 0.5);
  z-index: 200;
}
</style>

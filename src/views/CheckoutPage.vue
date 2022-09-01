<template>
  <ion-page id="cart">
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <router-link to="/cart">
            <ion-button color="primary">
                <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="d-flex justify-content-center">
        <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
      </div>

      <embed type="text/html" :src="iframeURL+cartKey" class="h-100 w-100"/>

      <!-- <div class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0 ">
        <section class="row w-100">
          <div class="col-6 d-flex align-items-center">
            <h1 class="fw-bold w-100 m-0 text-center" style="line-height: 1">
              $ {{cartTotal}}
            </h1>
          </div>
          <div class="col-6 p-0">
            <ion-button class="w-100"
            style="height: 6vh" @click="checkOutCart()"
            :color="primary">
              <ion-icon :icon="bagCheckOutline" class="me-2"></ion-icon>
              Checkout
            </ion-button>
          </div>
        </section>
      </div> -->

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import {
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent,
    //IonButton,
    IonIcon,
    //IonButtons,
    // IonList,
    // IonItem, IonItemSliding, IonItemOptions,
    // IonItemOption,
    IonRefresher, IonRefresherContent
    //IonLabel
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline, addOutline, removeOutline, 
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
//import axios from 'axios'
//import SettingsConstants from '../constants/settings.constants.js'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import { mapState } from 'vuex';

export default defineComponent({
  name: 'CheckoutPage',
  mixins: [Mixin],
  computed: mapState([
    'cartKey'
  ]),
  components: {
    DotLoader,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage,
    //IonButton,
    IonIcon,
    //IonButtons,
    IonRefresher, IonRefresherContent
    //IonLabel, 
 },
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh,
      arrowBackOutline, cartOutline, bagCheckOutline,
      trashOutline, addOutline, removeOutline
    }
  },
  data() {
    return {
      lastPath: null,
      isLoading: false,
      iframeURL: 'https://dev.ecmrebuilders.com/mobile-cart/?cocart-load-cart='
    }
  },
  methods: {
    
  },

  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style scoped>
.item-inner {
    padding-inline-end: 0 !important;
    padding-inline-start: 0 !important;
}

#cart ion-input input {
  height: 40px !important;
}
</style>

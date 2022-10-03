<template>
  <ion-page>
    <ion-header mode="md">
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <ion-button color="primary" @click="openSideMenu()">
            <ion-icon slot="icon-only" :ios="ellipsisVertical" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        
        <ion-buttons slot="primary">
          <router-link to="/cart">
            <ion-button class="position-relative" style="--overflow: visible">
              <router-link to="/cart" v-if="cartItemCount">
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="z-index: 1">
                {{cartItemCount}}
                </span>
              </router-link>
              <ion-icon slot="icon-only" :icon="cartOutline" color="dark"></ion-icon>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-buttons slot="primary" @click="toggleScannerModal()">
          <ion-button>
            <ion-icon slot="icon-only" :icon="scanOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <router-link to="/profile">
            <ion-button>
              <ion-icon slot="icon-only" :icon="personCircleOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-title><img src="../../resources/icon.png" style="height:35px"></ion-title>
      </ion-toolbar>
      <ion-toolbar v-if="!onlineStatus">
        <div class="p-3 text-white warning-message">
          <img src="../../resources/wifi-no-signal.png" style="height: 30px" class="float-start me-3"/>
          <span>You are currently offline. Please check your internet connection!</span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-events="true" :scroll-y="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      <!-- <div id="interactive" class="viewport"></div> -->


      <section class="m-3 ms-2 mb-0" @click="openSearchModal()">
        <ion-chip class="p-4 bg-white me-2 w-100">
          <ion-icon :icon="search" color="dark"></ion-icon>
          <ion-label color="dark">Search</ion-label>
        </ion-chip>
      </section>

      <!-- show items on sale-->
      <slider-component></slider-component>

      <!-- sliding chips-->
      <div class="position-relative;" style="width: 800px;">
          <sliding-chips></sliding-chips>
      </div>
      

      <!-- show popular items-->
      <popular-products-component></popular-products-component>



    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar,
IonTitle, IonContent, IonIcon,
IonButtons, IonChip, IonLabel,
IonRefresher, IonRefresherContent, IonRippleEffect,
} from '@ionic/vue';
import { 
  ellipsisVertical,
  cartOutline,
  helpCircle, 
  personCircleOutline, 
  search, 
  starOutline,
  star,
  barcodeOutline, apps, add,
  scanOutline
} from 'ionicons/icons';
import SliderComponent from '@/components/SliderComponent.vue';
import PopularProductsComponent from '@/components/PopularProductsComponent.vue';
import SlidingChips from '@/components/SlidingChips.vue';
import Mixin from '../mixins/global.mixin'
import store from '../store';

import { mapState } from 'vuex';

export default  defineComponent({
  name: 'HomePage',
  mixins: [Mixin],
  computed: mapState([
    'cartItemCount',
    'onlineStatus'
  ]),
  components: {
    SliderComponent, PopularProductsComponent, SlidingChips, IonRippleEffect,

    IonChip, IonLabel,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButtons,
    IonIcon, IonRefresher, IonRefresherContent,
  },
  data() {
    return {
      
    }
  },
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      store.commit('SET_POPULAR_PRODUCT_LIST', []);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh,
      ellipsisVertical, 
      helpCircle, 
      personCircleOutline, 
      search, star,
      starOutline, cartOutline, barcodeOutline,
      apps, add, scanOutline
    }
  },
  methods: {
    openSearchModal: function () {
      this.emitter.emit('isShowSearchModal');
    },
    openSideMenu: function () {
      this.emitter.emit('openMenu');
    },
    toggleScannerModal: function () {
      this.emitter.emit('isShowScannerModal');
    }
  },
  mounted() {
    window.screen.orientation.lock('portrait');
  }
});
</script>



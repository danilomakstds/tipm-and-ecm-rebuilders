<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <ion-button color="primary" @click="openSideMenu()">
            <ion-icon slot="icon-only" :ios="ellipsisVertical" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <router-link to="/cart">
            <ion-button>
              <ion-icon slot="icon-only" :icon="cartOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-buttons slot="primary" @click="toggleScannerModal()">
          <ion-button>
            <ion-icon slot="icon-only" :icon="scanOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="personCircleOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title><img src="../../resources/icon.png" style="height:35px"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-events="true" :scroll-y="true">
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <!-- <div class="p-4">
        <div class="row">
          <div class="col-4 p-1">
            <ion-select placeholder="Year">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
            </ion-select>
          </div>
          <div class="col-4 p-1">
            <ion-select placeholder="Make">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
            </ion-select>
          </div>
          <div class="col-4 p-1">
            <ion-select placeholder="Model">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
            </ion-select>
          </div>
          <div class="col-8 p-1">
            <ion-input placeholder="VIN #  /  Part # /  Keyword"></ion-input>
          </div>
          <div class="col-2 p-1">
            <ion-button color="medium" class="w-100">
              <ion-icon :icon="scanOutline"></ion-icon>
            </ion-button>
          </div>
          <div class="col-2 p-1">
            <ion-button color="primary" class="w-100">Go</ion-button>
          </div>
        </div>
      </div> -->


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

      <ion-modal ref="modal"
      :is-open="isScannerModalOpen"
      @didDismiss="toggleScannerModal()">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div>
            <div id="interactive" class="viewport"></div>
            <ion-input ref="input" type="text" placeholder="Order Number" v-model="orderNumber" class="mt-3"></ion-input>
          </div>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar,
IonTitle, IonContent, IonIcon,
IonButtons, IonChip, IonLabel,
IonRefresher, IonRefresherContent,
modalController,
IonModal
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
import Quagga from 'quagga';


export default  defineComponent({
  name: 'HomePage',
  mixins: [Mixin],
  components: {
    SliderComponent, PopularProductsComponent, SlidingChips,

    IonChip, IonLabel,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButtons,
    IonIcon, IonRefresher, IonRefresherContent,
    IonModal
  },
  data() {
    return {
      isScannerModalOpen: false
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
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    cancel() {
      this.$refs.modal.$el.dismiss(null, 'cancel');
    },
    confirm() {
      //const name = this.$refs.input.$el.value;
      //this.$refs.modal.$el.dismiss(name, 'confirm');
    },
    toggleScannerModal: function () {
      //
      this.isScannerModalOpen = !this.isScannerModalOpen;
      this.initQuagga();
      if (this.isScannerModalOpen) {
        Quagga.start();
      } else {
        Quagga.stop();
      }
    },
    // onWillDismiss(ev) {
    //   if (ev.detail.role === 'confirm') {
    //     this.message = `Hello, ${ev.detail.data}!`;
    //   }
    // },
    openSearchModal: function () {
      this.emitter.emit('isShowSearchModal');
    },
    openSideMenu: function () {
      this.emitter.emit('openMenu');
    },
    initQuagga: function () {
      setTimeout(() => {
        Quagga.init({
          inputStream : {
            name : "Live",
            type : "LiveStream",
            target: document.querySelector('#interactive')    // Or '#yourElement' (optional)
          },
          decoder : {
            readers : ["code_128_reader"]
          }
        }, function(err) {
            if (err) {
                console.log(err);
                return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });
        Quagga.start();
      }, 1000);
    }
  },
  mounted() {
    //this.initQuagga();
  }
});
</script>



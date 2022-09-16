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
              <ion-button @click="cancel()">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" class="h-100 position-relative">
          <div id="interactive" class="viewport h-100"></div>

          <div v-if="isCamLoading" class="d-flex justify-content-center align-items-center h-100 position-absolute top-0 center-absolute bg-light">
            <dot-loader :loading="isCamLoading" :color="color" :size="size"></dot-loader>
          </div>
          <div v-if="!isCamLoading" class="d-flex justify-content-center align-items-center h-100 position-absolute top-0 center-absolute">
            <div class="overlay">
              <p style="writing-mode: vertical-rl; font-size: 1.7vh; z-index: 2" class="text-center mt-5 h-100 text-white position-absolute">
                Place VIN barcode inside the viewfinder rectangle to scan it.
              </p>
            </div>
            <div class="here h-75"></div>
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
modalController, IonRippleEffect ,
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
import $ from 'jquery'
import Quagga from 'quagga';
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import { mapState } from 'vuex';

export default  defineComponent({
  name: 'HomePage',
  mixins: [Mixin],
  computed: mapState([
      'cartItemCount',
  ]),
  components: {
    SliderComponent, PopularProductsComponent, SlidingChips,
    DotLoader, IonRippleEffect,

    IonChip, IonLabel,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButtons,
    IonIcon, IonRefresher, IonRefresherContent,
    IonModal, 
  },
  data() {
    return {
      isScannerModalOpen: false,
      lastBarcodeResult: null,
      isCamLoading: false
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
      Quagga.stop();
      this.$refs.modal.$el.dismiss(null, 'cancel');
    },
    scanResultConfirm(code) {
      this.cancel();
      this.emitter.emit('isScannedValueAvailable', code);
    },
    toggleScannerModal: function () {
      this.isScannerModalOpen = !this.isScannerModalOpen;
      this.initQuagga();
      if (!this.isScannerModalOpen) {
        Quagga.stop();
      }
    },
    openSearchModal: function () {
      this.emitter.emit('isShowSearchModal');
    },
    openSideMenu: function () {
      this.emitter.emit('openMenu');
    },
    initQuagga: function () {
      this.isCamLoading = true;
      this.lastBarcodeResult = null;
      setTimeout( function () {
        
        Quagga.init({
          inputStream: {
              type : "LiveStream"
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          numOfWorkers: 4,
          frequency: 10,
          decoder: {
            readers : [{
              format: "code_128_reader",
              config: {}
            },
            {
              format: "code_39_vin_reader",
              config: {}
            }
            ]
          },
          locate: true
        }, function(err) {
            if (err) {
              console.log(err);
              return
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
            this.isCamLoading = false;
            $('.drawingBuffer').addClass('d-none');
            $('video').addClass('h-100');
            Quagga.onDetected(function(result) {
              var code = result.codeResult.code;
              if (this.lastBarcodeResult != code && code.length == 17) {
                var audio = new Audio('./assets/beep-08b.mp3');
                audio.volume = 0.2;
                audio.play();
                this.lastBarcodeResult = code;
                Quagga.stop();
                this.scanResultConfirm(code);
              }
            }.bind(this));
        }.bind(this));
      }.bind(this), 500);
    },
  },
  mounted() {
    this.emitter.on('isShowScannerModal', function () {
      this.toggleScannerModal();
    }.bind(this));
  }
});
</script>

<style scoped>
.overlay {
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
  overflow: hidden;
}

.overlay::before {
  content: "";
  display: block;
  
  /* Scale */
  width: 100%;
  height: 100%;
  
  /* Position */
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  
  /* Border */
  border-width: 105px 60px 60px 60px;
  border-style: solid;
  border-color: rgba(0,0,0,0.3);
}

.here:after {
    content:"";
    position: absolute;
    z-index: 3;
    top: 0;
    bottom: 0;
    left: 50%;
    border-left: 1px solid #ff0000;
    transform: translate(-50%);
}

.here {
  height: 100px;
  position:relative;
}
</style>

<template>
  <ion-page id="cart">
    <ion-header mode="md">
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <router-link to="/">
            <ion-button color="primary">
                <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-title>My Cart</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Cart</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <!--{{cartItems}} -->

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-segment @change="segmentChanged(event)" v-model="selectedSegment">
        <ion-segment-button value="tipm">
          <ion-label>TIPM
            <span class="badge rounded-pill bg-danger" v-if="cartItemsTIPMCount">{{cartItemsTIPMCount}}</span></ion-label>
        </ion-segment-button>
        <ion-segment-button value="ecm">
          <ion-label>ECM / ECU
            <span class="badge rounded-pill bg-danger" v-if="cartItemsECMCount">{{cartItemsECMCount}}</span>
          </ion-label>
        </ion-segment-button>
      </ion-segment>


      <div class="d-flex justify-content-center align-items-center mb-2 mt-2" v-if="isLoading">
          <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
      </div>

      <ion-list lines="none" v-if="cartItems">
        <ion-item-sliding style="border-bottom: 1px solid #eee" v-for="cart in cartItems" :key="cart.id">
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card class="bg-white m-0 p-0" style="border-radius:0px">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                          <img :src="cart.featured_image" class="w-100"/>
                        </div>
                        <div class="col-8 p-3">
                          <ion-card-content class="ion-no-padding">
                            <span :class="'text-white '+cart.source.toLowerCase()+'-badge badge mb-1 rounded-pill'">{{cart.name.split(' ')[0]}}</span><br/>
                            {{cleanString(cart.name_title)}} {{cart.name_subtitle}}
                          </ion-card-content>
                          <hr class="mt-1 mb-1 bg-light"/>
                          <ion-card-header class="ion-no-padding mt-2">
                              <ion-card-title style="font-size: 15px" class="fw-bold">
                                $ {{(cart.totals.subtotal*.01).toFixed(2)}}
                                <span class="fw-normal text-decoration-line-through text-danger d-none" style="font-size: 1.3vh">$ 100.00</span>
                                <span class="float-end fw-bold text-muted2" style="font-size: 1.4vh">Quantity: {{cart.quantity.value}}</span>
                              </ion-card-title>
                          </ion-card-header>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option class="bg-light" style="max-width: 70px">
                <div class="d-flex flex-column w-100">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="removeOutline" color="dark"></ion-icon>
                  </ion-button>
                  <input type="number" class="form-control text-center mt-1 mb-1" disabled style="border-radius: 100px !important" value="1">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="addOutline" color="dark"></ion-icon>
                  </ion-button>
                </div>
              </ion-item-option>
              <ion-item-option class="bg-danger" style="min-width: 60px" @click="showDeleteItemInCartModal(cart.item_key, cart.source)">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
            
        </ion-item-sliding>
        
        
        <br/><br/><br/><br/><br/><br/>
      </ion-list>

      <div v-if="showZeroResult && !isLoading" class="text-center order-page">
        <ion-icon :icon="listOutline" style="font-size: 200px;  opacity: .1"></ion-icon>
        <p class="text-muted fst-italic">No item in the <b>{{selectedSegment.toUpperCase()}}</b> cart</p>
      </div>
      


      

      <div class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0 ">
        <section class="row w-100">
          <div class="col-6 d-flex align-items-center">
            <h1 class="fw-bold w-100 m-0 text-center" style="line-height: 1">
              $ <span v-if="cartTotal">{{cartTotal}}</span><span v-else>0.00</span>
            </h1>
          </div>
          <div class="col-6 p-0">
            <ion-button class="w-100"
            style="height: 6vh" @click="checkOutCart()"
            :color="checkoutBtnColor" :disabled="disableCheckout">
              <ion-icon :icon="bagCheckOutline" class="me-2"></ion-icon>
              Checkout
            </ion-button>
          </div>
        </section>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import {
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent, IonButton,
    IonIcon, IonButtons, IonList,
    IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonRefresher, IonRefresherContent,
    alertController, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline, addOutline, removeOutline, listOutline
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
import axios from 'axios'
import SettingsConstants from '../constants/settings.constants.js'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import { mapState } from 'vuex';
import store from '../store';

export default defineComponent({
  name: 'CartPage',
  mixins: [Mixin],
  computed: mapState([
    'cartKeyECM',
    'cartKeyTIPM',
    'cartItemCount',
    'cartItemList'
  ]),
  components: {
    DotLoader,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButton,
    IonIcon, IonButtons, IonList,
    IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonRefresher, IonRefresherContent,
    IonSegment, IonSegmentButton, IonLabel
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
      trashOutline, addOutline, removeOutline, listOutline
    }
  },
  data() {
    return {
      lastPath: null,
      productList: [],
      page: 1,
      isLoading: false,
      isProcessing: false,
      currentIndex: 0,
      
      cartItemsECM: [],
      cartItemsTIPM: [],
      cartItemsECMCount: 0,
      cartItemsTIPMCount: 0,
      cartTotalECM: 0.00,
      cartTotalTIPM: 0.00,
      showZeroResult: false,
      disableCheckout: true,
      cartBaseURL: null,
      cartKey: null,
      selectedSegment: null,
      cartProcessCounter: 0,
      checkoutBtnColor: 'primary'
    }
  },
  watch: {
    selectedSegment: function (newVal) {
      this.processSegment(newVal);
    }
  },
  methods: {
    async showDeleteItemInCartModal(item_key, source) {
      const alert = await alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Remove!',
              message: 'Are you sure you would like to <strong>Remove</strong> this item!',
              buttons: [{
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  id: 'cancel-button',
                  handler: blah => {
                      console.log('Confirm Cancel:', blah)
                  },
                },
                {
                  text: 'Remove',
                  id: 'confirm-button',
                  handler: () => {
                      this.deleteCartItems(item_key, source);
                  },
                },
              ],
          });
      return alert.present();
    },
    processSegment: function (segment) {
      var listLength = 0;
      segment == 'tipm' ? listLength = this.cartItemsTIPM.length : listLength = this.cartItemsECM.length;
      if (!listLength) {
        this.showZeroResult = true;
        this.disableCheckout = true;
      } else {
        this.showZeroResult = false;
        this.disableCheckout = false;
      }
      switch (segment) {
        case 'tipm': 
          this.cartItems = this.cartItemsTIPM;
          this.cartTotal = this.cartTotalTIPM;
          this.checkoutBtnColor = 'primary';
          break;
        case 'ecm': 
          this.cartItems = this.cartItemsECM;
          this.cartTotal = this.cartTotalECM;
          this.checkoutBtnColor = 'tertiary';
          break;
      }
    },
    getAllCartItems: function (url, cart_key) {
      this.disableCheckout = true;
      this.isLoading = true;
      var source = null;
      if (url == SettingsConstants.ECMURL) {
        this.cartItemsECM = [];
        source = 'ECM';
      } else {
        this.cartItemsTIPM = [];
        source = 'TIPM';
      }
      axios.get( url+'wp-json/cocart/v2/cart?cart_key='+cart_key, { crossdomain: true })
        .then(function (response) {
          this.processCartData(response, source);
          this.cartProcessCounter = this.cartProcessCounter + 1;
          if (this.cartProcessCounter == 2) {
            setTimeout(this.setDefaultSegment(), 500);
          }
          this.isLoading = false;
        }.bind(this));
    },
    setDefaultSegment: function () {
        if (this.cartItemsECMCount) {
        this.selectedSegment = 'ecm'
        }
        if (this.cartItemsTIPMCount) {
          this.selectedSegment = 'tipm'
        }
        if (!this.cartItemsECMCount && !this.cartItemsTIPMCount) {
          this.selectedSegment = 'tipm'
        }
    },
    deleteCartItems: function (item_key, source) {
      this.disableCheckout = true;
      this.isLoading = true;
      var cart_key = null;
      var url = null;
      if (source == 'ECM') {
        this.cartItemsECM = [];
        url = SettingsConstants.ECMURL;
        cart_key = this.cartKeyECM;
      } else {
        this.cartItemsTIPM = [];
        url = SettingsConstants.TIPMURL;
        cart_key = this.cartKeyTIPM;
      }
      axios.delete(url+'wp-json/cocart/v2/cart/item/'+item_key+'?cart_key='+cart_key)
      .then(function (response) {
          if (response.data) {
            this.cartItems = [];
            this.processCartData(response, source);
            this.removeFromCartItemList(item_key);
            this.processSegment(this.selectedSegment);
            //this.cartItems = [];
            this.isLoading = false;
          }
        }.bind(this));
    },
    removeFromCartItemList: function (item_key) {
      var list = [];
      list = this.cartItemList.filter(item => item.item_key != item_key);
      store.commit('SET_CART_ITEM_LIST', list);
      //store.commit('SET_CART_ITEM_COUNTER', list.length);
    },
    processCartData: function (response, source) {
      if (source == 'ECM') {
        this.cartItemsECMCount = response.data.items.length;
        store.commit('SET_CART_ECM_COUNTER', response.data.items.length);
        this.cartTotalECM = (response.data.totals.total*.01).toFixed(2);
      } else {
        this.cartItemsTIPMCount = response.data.items.length;
        store.commit('SET_CART_TIPM_COUNTER', response.data.items.length);
        this.cartTotalTIPM = (response.data.totals.total*.01).toFixed(2);
      }

      store.commit('SET_CART_ITEM_COUNTER', this.cartItemsECMCount + this.cartItemsTIPMCount);

      response.data.items.forEach( function (prod) {
        prod.name = prod.name.replace('LIKE NEW', 'LIKE_NEW');
        prod.name_title = '';
        prod.name_subtitle = '';
        name = null;
        var name = null;

        if (prod.name.includes('OEM TIPM')) {
          prod.source = 'TIPM';
          prod.badge = 'tipm-badge';
          name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
          prod.name_title = name.split('- Part')[0];
          prod.name_subtitle = '- Part' + name.split('- Part')[1];
        }
        else if (prod.name.includes('OEM ECM PCM ECU')) {
          prod.source = 'ECM';
          prod.badge = 'ecm-badge';
          name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
          prod.name_title = name.split('with')[0];
          prod.name_subtitle = 'with' + name.split('with')[1];
        }
        else {
          prod.name_title = prod.name;
          prod.isNonECMTIPM = true;
        }

        if (source == 'TIPM') {
          this.cartItemsTIPM.push(prod);
        } else {
          this.cartItemsECM.push(prod);
        }

        var list = [];
        list.push(prod);
        store.commit('SET_CART_ITEM_LIST', list);
        
      }.bind(this));
    },
    checkOutCart: function () {
      var url = '', cart_key = '';
      if (this.selectedSegment == 'ecm') {
        url = SettingsConstants.ECMURL;
        cart_key = this.cartKeyECM;
      } else {
        url = SettingsConstants.TIPMURL;
        cart_key = this.cartKeyTIPM;
      }
      location.href = url+"mobile-cart/?cocart-load-cart="+cart_key;
    }
  },
  mounted () {
    //this.setDefaultSegment();
    this.getAllCartItems(SettingsConstants.ECMURL, this.cartKeyECM);
    this.getAllCartItems(SettingsConstants.TIPMURL, this.cartKeyTIPM);
  },
  created () {
    this.lastPath = this.$router.options.history.state.back;
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

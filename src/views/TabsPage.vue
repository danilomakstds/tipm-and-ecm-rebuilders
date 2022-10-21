<template>
  <ion-page>

    <ion-modal
      ref="searchmodal"
      :is-open="isSearchModalOpen"
      :breakpoints="[0.0, 0.7, 0.95]"
      :initialBreakpoint="0.7"
      @didDismiss="toggleSearchModal()"
    >
        <ion-content>
          <div class="p-4">
            <div class="row">
              <div class="col-12 pb-3 text-muted d-flex justify-content-start" style="font-size: 1.7vh">
                <span>Search Vehicle</span>
                <dot-loader :loading="isVehicleSearchLoading" :color="color" :size="15" class="ms-4"></dot-loader>
              </div>
              <div class="col-4 p-1">
                <ion-select placeholder="Year"
                @ionChange="$event.detail.value ? getMake($event.detail.value): ''"
                :disabled="isVehicleSearchLoading" v-model="selectedYear">
                  <ion-select-option v-for="y in year" :key="y.name" :value="y">{{y.name}}</ion-select-option>
                </ion-select>
              </div>
              <div class="col-4 p-1">
                <ion-select placeholder="Make" @ionChange="$event.detail.value ? getModel($event.detail.value): ''"
                :disabled="isVehicleSearchLoading || !selectedYear"
                v-model="selectedMake">
                  <ion-select-option v-for="mk in make" :key="mk.name" :value="mk">{{mk.name}}</ion-select-option>
                </ion-select>
              </div>
              <div class="col-4 p-1">
                <ion-select placeholder="Model"
                :disabled="isVehicleSearchLoading || !selectedMake"
                v-model="selectedModel">
                  <ion-select-option v-for="mdl in model" :key="mdl.name" :value="mdl">{{mdl.name.replace('amp;','')}}</ion-select-option>
                </ion-select>
              </div>
              <div class="col-12 pb-3 pt-3 text-muted" style="font-size: 1.7vh">
                Search by VIN
              </div>
              <div class="col-10 p-1">
                <ion-input placeholder="VIN" maxlength="17" v-model="searchVinNumber" class="input-modif text-uppercase"></ion-input>
              </div>
              <div class="col-2 p-1">
                <ion-button color="medium" class="w-100" @click="openScannerModal()">
                  <ion-icon :icon="scanOutline"></ion-icon>
                </ion-button>
              </div>
              <div class="col-12 pb-3 pt-3 text-muted" style="font-size: 1.7vh">
                Search by part # or keyword
              </div>
              <div class="col-12 p-1">
                <ion-input placeholder="Search Part Number / Keyword" v-model="searchKeywordPartNumber" class="input-modif"></ion-input>
              </div>
              <div class="col-12 p-0 mt-3">
                <ion-button color="primary" expand="block" @click="triggerSearch()" style="height:45px"
                :disabled="isSearchDisabled"
                >Go</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
    </ion-modal>

    <ion-tabs mode="md">
      <ion-router-outlet id="main"></ion-router-outlet>
      <ion-tab-bar slot="bottom" style="--border:#fff">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <!-- <ion-label>Tab 1</ion-label> -->
        </ion-tab-button>
          
        <ion-tab-button tab="products" @click="toggleSearchModal()">
          <ion-icon :icon="searchOutline" />
          <!-- <ion-label>Tab 2</ion-label> -->
        </ion-tab-button>
        
        <ion-tab-button tab="orders" href="/tabs/orders">
          <ion-icon :icon="cubeOutline" />
          <!-- <ion-label>Tab 3</ion-label> -->
        </ion-tab-button>

        <ion-tab-button tab="installation" href="/tabs/installation">
          <ion-icon :icon="buildOutline" />
          <!-- <ion-label>Tab 3</ion-label> -->
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>

  </ion-page>


  <ion-menu side="start" menu-id="ionicmenu" content-id="main">
    <ion-header mode="md">
        <ion-toolbar style="--background: #3A3A3A">
        <!-- --background: linear-gradient(to right, #4B7838, #66AF47 )-->
            <ion-title style="font-size: 2vh;" class="text-white"><strong>TIPM & ECM REBUILDERS</strong></ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content>
        <ion-list>
            <ion-item href="/cart">
                <ion-icon :icon="cartOutline" slot="start" />
                <ion-label>Cart</ion-label>
                <ion-badge slot="end" color="danger" mode="ios" v-if="cartItemCount">{{cartItemCount}}</ion-badge>
            </ion-item>
            <ion-item href="tabs/orders">
                <ion-icon :icon="cubeOutline" slot="start" />
                <ion-label>Orders</ion-label>
            </ion-item>
            <ion-item href="tabs/installation">
                <ion-icon :icon="buildOutline" slot="start" />
                <ion-label>Installation</ion-label>
            </ion-item>
            <ion-item href="https://www.youtube.com/c/TIPMRebuilders" target="_blank">
                <ion-icon :icon="logoYoutube" slot="start" />
                <ion-label>TIPM Rebuilders on YT</ion-label>
            </ion-item>
            <ion-item>
                <ion-icon :icon="informationCircleOutline" slot="start" />
                <ion-label>About Us</ion-label>
            </ion-item>
            <ion-item>
                <ion-icon :icon="returnDownBackOutline" slot="start" />
                <ion-label>Returns</ion-label>
            </ion-item>
            <ion-item>
                <ion-icon :icon="briefcaseOutline" slot="start" />
                <ion-label>Resellers</ion-label>
            </ion-item>
            <ion-item>
                <ion-icon :icon="hammerOutline" slot="start" />
                <ion-label>Repair</ion-label>
            </ion-item>
            <ion-item @click="logOutUserModal()">
                <ion-icon :icon="logOutOutline" slot="start" />
                <ion-label>Logout</ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
    <span class="text-center pt-3 text-muted" style="font-size: 9px; background-color: #F6F6F6;">Copyright © 2022<br /><b style="font-size: 11px">Mak's TIPM & ECM Rebuilders</b>
        <p>All Rights Reserved</p>
    </span>
  </ion-menu>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs,
IonIcon, IonPage, IonRouterOutlet,
IonModal, modalController, IonSelect, IonSelectOption,
IonInput, alertController, menuController,
IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
IonBadge
} from '@ionic/vue';
import { ellipse, square, triangle, searchOutline,
heartOutline, homeOutline, scanOutline,
cubeOutline, logOutOutline, cartOutline,
openOutline, informationCircleOutline, returnDownBackOutline,
buildOutline, briefcaseOutline, logoYoutube, constructOutline,
hammerOutline
} from 'ionicons/icons';
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SettingsConstants from '../constants/settings.constants'
import store from '../store'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { mapState } from 'vuex'
import Mixin from '../mixins/global.mixin'


export default defineComponent({
  name: 'TabsPage',
  mixins: [Mixin],
  components: {
    DotLoader,
    IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonPage, IonRouterOutlet,
    IonModal, IonSelect, IonSelectOption,
    IonInput, IonMenu, IonHeader, IonToolbar,
    IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonBadge
  },
  computed: mapState([
    'cartKeyECM',
    'cartKeyTIPM',
    'cartItemCount',
    'sessionData'
  ]),
  setup() {
    return {
      ellipse, 
      square, 
      triangle,
      searchOutline,
      heartOutline,
      homeOutline,
      scanOutline,
      cubeOutline,
      logOutOutline,
      cartOutline,
      openOutline,
      informationCircleOutline,
      returnDownBackOutline, buildOutline,
      briefcaseOutline,
      logoYoutube,
      constructOutline,
      hammerOutline
    }
  },
  watch: {
    selectedYear: function (newVal) {
      if (newVal) {
        this.selectedMake = null;
        this.selectedModel = null;
        store.commit('SET_SELECTED_YEAR', newVal);
        this.searchKeywordPartNumber = null;
        this.searchVinNumber = null;
      }
    },
    selectedMake: function (newVal) {
      if (newVal) {
        this.selectedModel = null;
        store.commit('SET_SELECTED_MAKE', newVal);
        this.searchKeywordPartNumber = null;
        this.searchVinNumber = null;
      }
    },
    selectedModel: function (newVal) {
      if (newVal) {
        store.commit('SET_SELECTED_MODEL', newVal);
        store.commit('SET_SEARCH_KEYWORD', null);
        store.commit('SET_SEARCH_VIN_NUMBER', null);
        this.searchKeywordPartNumber = null;
        this.searchVinNumber = null;
        this.isSearchDisabled = false;
      } else {
        this.isSearchDisabled = true;
      }
    },
    searchKeywordPartNumber: function (newVal) {
      if (newVal) {
        store.commit('SET_SEARCH_KEYWORD', newVal);

          store.commit('SET_SELECTED_MODEL', null);
          store.commit('SET_SELECTED_MAKE', null);
          store.commit('SET_SELECTED_MAKE', null);
          store.commit('SET_SEARCH_VIN_NUMBER', null);
          this.selectedYear = null;
          this.selectedMake = null;
          this.selectedModel = null;
          this.searchVinNumber = null;
        
        if (newVal.length >= 4) {
          this.isSearchDisabled = false;
        } else {
          this.isSearchDisabled = true;
        }
      } else {
        store.commit('SET_SEARCH_KEYWORD', null);
      }
    },
    searchVinNumber: function (newVal) {
      if (newVal) {
          store.commit('SET_SEARCH_VIN_NUMBER', this.cleanVinNumber(newVal));
          store.commit('SET_SEARCH_KEYWORD', null);
          store.commit('SET_SELECTED_MODEL', null);
          store.commit('SET_SELECTED_MAKE', null);
          store.commit('SET_SELECTED_MAKE', null);
          this.selectedYear = null;
          this.selectedMake = null;
          this.selectedModel = null;
          this.searchKeywordPartNumber = null;
        
        if (newVal.length == 17) {
          store.commit('SET_SESSION_DATA_VIN', this.cleanVinNumber(newVal));
          this.isSearchDisabled = false;
        } else {
          this.isSearchDisabled = true;
        }
      } else {
        store.commit('SET_SEARCH_VIN_NUMBER', null);
      }
    },
    '$route': function () {
      if (this.$route.fullPath == '/tabs/products') {
        $('ion-tab-button#tab-button-products').addClass('tab-selected');
      } else {
        $('ion-tab-button#tab-button-products').removeClass('tab-selected');
      }
    }
  },
  data () {
    return {
      isSearchModalOpen: false,
      isVehicleSearchLoading: false,
      selectedYear: null,
      selectedMake: null,
      selectedModel: null,
      searchKeywordPartNumber: null,
      searchVinNumber: null,

      year_ecm: [],
      year_tipm: [],
      year: [],

      make_ecm: [],
      make_tipm: [],
      make: [],

      model_ecm: [],
      model_tip: [],
      model: [],

      isSearchDisabled: true
    }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    async logOutUserModal() {
      const alert = await alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Log Out!',
              message: 'Are you sure you would like to <strong>log out</strong>!',
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
                      text: 'Logout',
                      id: 'confirm-button',
                      handler: () => {
                          console.log('Confirm Okay');
                          this.logOutUser();
                      },
                  },
              ],
          });
      return alert.present();
    },
    logOutUser: function () {
        store.commit('RESET_SESSION_DATA');
        store.commit('RESET_SESSION_DATA_VIN');
        store.commit('RESET_CUSTOMER_ORDER_LIST');
        store.commit('RESET_CUSTOMER_ORDER_WATCHLIST');
        store.commit('RESET_CUSTOMER_ORDERNUMBER_LIST');
        store.commit('RESET_SELECTED_PRODUCT');
        Swal.fire({
          title: 'Logout!',
          text: 'You have been logged out!',
          icon:'success',
          confirmButtonColor: '#4b7838',
        });
    },
    openMenu: function() {
      menuController.enable(true, 'ionicmenu');
      menuController.open('ionicmenu');
    },
    toggleSearchModal: function () {
      this.isSearchModalOpen = !this.isSearchModalOpen;
    },
    
    triggerSearch: function () {
      this.dismiss();
      this.emitter.emit('triggerSearch');
      if (this.searchVinNumber) {
        if (this.sessionData) {
          this.$router.push({path: '/tabs/products', query: {part___or_vin: this.cleanVinNumber(this.searchVinNumber), email: this.sessionData.email} });
        } else {
          this.$router.push({path: '/tabs/products', query: {part___or_vin: this.cleanVinNumber(this.searchVinNumber)} });
        }
      } else {
        if (this.sessionData) {
          this.$router.push({path: '/tabs/products', query: {email: this.sessionData.email} });
        } else {
          this.$router.push('/tabs/products');
        }
        //this.$router.push('/tabs/products');
      }
      
      // if (this.$route.fullPath == '/tabs/products') {
      //   this.emitter.emit('triggerSearch');
      // } else {
      //   this.emitter.emit('triggerSearch');
      //   this.$router.push('/tabs/products');
      // }
    },
    getYear: function (site) {
      this.isVehicleSearchLoading = true;
      this.year = [];
      axios.get(SettingsConstants.BASE_URL +
        'categoryREST.php?op=get_all_category&site='+site+'&page=1&per_page='+100+'&parent='+0 , { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              if (site.includes('ecm')) {
                Array.prototype.push.apply(this.year_ecm, response.data);
              } else {
                Array.prototype.push.apply(this.year_tipm, response.data);
              }
              if (this.year_ecm.length && this.year_tipm.length) {
                this.generateYear();
                this.isVehicleSearchLoading = false;
              }
            }
          }.bind(this));
    },
    getMake: function (year) {
      this.selectedYear = year;
      this.isVehicleSearchLoading = true;
      this.make = [];
      var numcalls = 0;
      year.data.forEach( function (yeardata){
        axios.get(SettingsConstants.BASE_URL +
        'categoryREST.php?op=get_all_category&site='+yeardata.site+'&page=1&per_page='+100+'&parent='+yeardata.categories.id , { crossdomain: true })
          .then(function (response) {
            numcalls = numcalls + 1;
            if (yeardata.site.includes('ecm')) {
              this.make_ecm = response.data;
            } else {
              this.make_tipm = response.data;
            }
            if (year.data.length == numcalls) {
              this.generateMake();
              this.isVehicleSearchLoading = false;
            }
          }.bind(this));
      }.bind(this));
    },
    getModel: function (make) {
      this.selectedMake = make;
      this.isVehicleSearchLoading = true;
      this.model = [];
      var numcalls = 0;
      make.data.forEach( function (makedata){
        axios.get(SettingsConstants.BASE_URL +
        'categoryREST.php?op=get_all_category&site='+makedata.site+'&page=1&per_page='+100+'&parent='+makedata.categories.id , { crossdomain: true })
          .then(function (response) {
            numcalls = numcalls + 1;
            if (makedata.site.includes('ecm')) {
              this.model_ecm = response.data;
            } else {
              this.model_tipm = response.data;
            }
            if (make.data.length == numcalls) {
              this.generateModel();
              this.isVehicleSearchLoading = false;
            }
          }.bind(this));
      }.bind(this));
    },
    generateYear: function () {
      if (this.year_ecm) {
        this.year_ecm.forEach( function (y_ecm) {
          if (!this.year.filter(year => year.name == y_ecm.name).length) {
            this.year.push({'name': y_ecm.name, 'data': [{'site': SettingsConstants.ECMSITE, 'categories': y_ecm}]});
          } else {
            this.year.filter(year => year.name == y_ecm.name)[0].data.push({'site': SettingsConstants.ECMSITE, 'categories': y_ecm});
          }
        }.bind(this));
      }

      if (this.year_tipm) {
        this.year_tipm.forEach( function (y_tipm) {
          if (!this.year.filter(year => year.name == y_tipm.name).length) {
            this.year.push({'name': y_tipm.name, 'data': [{'site': SettingsConstants.TIPMSITE, 'categories': y_tipm}]});
          } else {
            this.year.filter(year => year.name == y_tipm.name)[0].data.push({'site': SettingsConstants.TIPMSITE, 'categories': y_tipm});
          }
        }.bind(this));
      }
    },
    generateMake: function () {
      if (this.make_ecm) {
        this.make_ecm.forEach( function (make_ecm) {
          if (!this.make.filter(make => make.name == make_ecm.name).length) {
            this.make.push({'name': make_ecm.name, 'data': [{'site': SettingsConstants.ECMSITE, 'categories': make_ecm}]});
          } else {
            this.make.filter(make => make.name == make_ecm.name)[0].data.push({'site': SettingsConstants.ECMSITE, 'categories': make_ecm});
          }
        }.bind(this));
      }
      
      if (this.make_tipm) {
        this.make_tipm.forEach( function (make_tipm) {
          if (!this.make.filter(make => make.name == make_tipm.name).length) {
            this.make.push({'name': make_tipm.name, 'data': [{'site': SettingsConstants.TIPMSITE, 'categories': make_tipm}]});
          } else {
            this.make.filter(make => make.name == make_tipm.name)[0].data.push({'site': SettingsConstants.TIPMSITE, 'categories': make_tipm});
          }
        }.bind(this));
      }
    },
    generateModel: function () {
      if (this.model_ecm) {
        this.model_ecm.forEach( function (model_ecm) {
          if (!this.model.filter(model => model.name == model_ecm.name).length) {
            this.model.push({'name': model_ecm.name, 'data': [{'site': SettingsConstants.ECMSITE, 'categories': model_ecm}]});
          } else {
            this.model.filter(model => model.name == model_ecm.name)[0].data.push({'site': SettingsConstants.ECMSITE, 'categories': model_ecm});
          }
        }.bind(this));
      }
      if (this.model_tipm) {
        this.model_tipm.forEach( function (model_tipm) {
          if (!this.model.filter(model => model.name == model_tipm.name).length) {
            this.model.push({'name': model_tipm.name, 'data': [{'site': SettingsConstants.TIPMSITE, 'categories': model_tipm}]});
          } else {
            this.model.filter(model => model.name == model_tipm.name)[0].data.push({'site': SettingsConstants.TIPMSITE, 'categories': model_tipm});
          }
        }.bind(this));
      }
    },
    
    // getCartCount: function () {
    //   //wp-json/cocart/v2/cart/items/count
    //   axios.get(SettingsConstants.ECMURL+'wp-json/cocart/v2/cart/items/count?cart_key='+this.cartKeyECM , { crossdomain: true })
    //     .then(function (response) {
    //       if (response.data) {
    //         store.commit('SET_CART_ITEM_COUNTER', response.data);
    //       }
    //     }.bind(this));
    //   axios.get(SettingsConstants.TIPMURL+'wp-json/cocart/v2/cart/items/count?cart_key='+this.cartKeyTIPM , { crossdomain: true })
    //     .then(function (response) {
    //       if (response.data) {
    //         store.commit('SET_CART_ITEM_COUNTER', response.data);
    //       }
    //     }.bind(this));
    // },
    openScannerModal: function () {
      this.emitter.emit('isShowScannerModal');
    },
  },
  mounted() {
    //this.getCartCount();
    this.getYear(SettingsConstants.TIPMSITE);
    this.getYear(SettingsConstants.ECMSITE);
    this.emitter.on('isShowSearchModal', function () {
      this.toggleSearchModal();
    }.bind(this));
    this.emitter.on('openMenu', function () {
      this.openMenu();
    }.bind(this));
    this.emitter.on('isScannedValueAvailable', function (code) {
      this.searchVinNumber = code;
      if (this.isSearchModalOpen) {
        this.$refs.searchmodal.$el.dismiss(null, 'cancel');
      }
      setTimeout( function () {
        this.triggerSearch();
      }.bind(this), 100);
    }.bind(this));
  }
});
</script>

<style scoped>

ion-item {
  --border-color: #ddd !important;
  padding-bottom: 5px;
  padding-top: 0px;
}
</style>

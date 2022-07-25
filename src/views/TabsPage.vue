<template>
  <ion-page>

    <ion-modal
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
                <ion-input placeholder="VIN" maxlength="17"></ion-input>
              </div>
              <div class="col-2 p-1">
                <ion-button color="medium" class="w-100">
                  <ion-icon :icon="scanOutline"></ion-icon>
                </ion-button>
              </div>
              <div class="col-12 pb-3 pt-3 text-muted" style="font-size: 1.7vh">
                Search by part # or keyword
              </div>
              <div class="col-12 p-1">
                <ion-input placeholder="Search Part Number / Keyword" v-model="searchKeywordPartNumber"></ion-input>
              </div>
              <div class="col-12 p-0 mt-3">
                <ion-button color="primary" expand="block" @click="triggerSearch()" style="height:45px">Go</ion-button>
              </div>
            </div>
          </div>
        </ion-content>
    </ion-modal>


    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
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
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonTabBar, IonTabButton, IonTabs,
IonIcon, IonPage, IonRouterOutlet,
IonModal, modalController, IonSelect, IonSelectOption,
IonInput
} from '@ionic/vue';
import { ellipse, square, triangle, searchOutline,
heartOutline, homeOutline, scanOutline,
cubeOutline
} from 'ionicons/icons';
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SettingsConstants from '../constants/settings.constants'
import store from '../store'
import $ from 'jquery'

export default defineComponent({
  name: 'TabsPage',
  components: {
    DotLoader,
    IonTabs, IonTabBar, IonTabButton,
    IonIcon, IonPage, IonRouterOutlet,
    IonModal, IonSelect, IonSelectOption,
    IonInput
  },
  setup() {
    return {
      ellipse, 
      square, 
      triangle,
      searchOutline,
      heartOutline,
      homeOutline,
      scanOutline,
      cubeOutline
    }
  },
  watch: {
    selectedYear: function (newVal) {
      if (newVal) {
        this.selectedMake = null;
        this.selectedModel = null;
        store.commit('SET_SELECTED_YEAR', newVal);
        this.searchKeywordPartNumber = null;
      }
    },
    selectedMake: function (newVal) {
      if (newVal) {
        this.selectedModel = null;
        store.commit('SET_SELECTED_MAKE', newVal);
        this.searchKeywordPartNumber = null;
      }
    },
    selectedModel: function (newVal) {
      if (newVal) {
        store.commit('SET_SELECTED_MODEL', newVal);
        store.commit('SET_SEARCH_KEYWORD', null);
        this.searchKeywordPartNumber = null;
      }
    },
    searchKeywordPartNumber: function (newVal) {
      if (newVal) {
        store.commit('SET_SEARCH_KEYWORD', newVal);
        store.commit('SET_SELECTED_MODEL', null);
        this.selectedYear = null;
        this.selectedMake = null;
        this.selectedModel = null;
      } else {
        store.commit('SET_SEARCH_KEYWORD', null);
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

      year_ecm: [],
      year_tipm: [],
      year: [],

      make_ecm: [],
      make_tipm: [],
      make: [],

      model_ecm: [],
      model_tip: [],
      model: []
    }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    toggleSearchModal: function () {
      this.isSearchModalOpen = !this.isSearchModalOpen;
    },
    triggerSearch: function () {
      this.dismiss();
      if (this.$route.fullPath == '/tabs/products') {
        this.emitter.emit('triggerSearch');
      } else {
        this.emitter.emit('triggerSearch');
        this.$router.push('/tabs/products');
      }
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
    }
  },
  mounted() {
    this.getYear(SettingsConstants.TIPMSITE);
    this.getYear(SettingsConstants.ECMSITE);
    this.emitter.on('isShowSearchModal', function () {
      this.toggleSearchModal();
    }.bind(this));
  }
});
</script>

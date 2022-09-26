<template>
  <ion-page id="product-page">
    <ion-header mode="md">
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <!-- <ion-button color="primary">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button> -->
          <ion-back-button :icon="arrowBackOutline" color="primary" :default-href="lastPath" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Search Results</ion-title>
      </ion-toolbar>
      <ion-toolbar v-if="!onlineStatus">
        <div class="p-3 text-white warning-message">
          <img src="../../resources/wifi-no-signal.png" style="height: 30px" class="float-start me-3"/>
          <span>You are currently offline. Please check your internet connection!</span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <section class="m-3 ms-2 mb-0" @click="openSearchModal()">
        <ion-chip class="p-4 bg-white me-2 w-100">
          <ion-icon :icon="search" color="dark"></ion-icon>
          <ion-label color="dark">Search</ion-label>
        </ion-chip>
      </section>

      <ion-breadcrumbs class="p-3 pb-0" style="font-size: 1.5vh" v-if="selectedModel">
        <ion-breadcrumb>{{selectedYear.name}}</ion-breadcrumb>
        <ion-breadcrumb>{{selectedMake.name}}</ion-breadcrumb>
        <ion-breadcrumb>{{selectedModel.name.replace('amp;','')}}</ion-breadcrumb>
      </ion-breadcrumbs>

      <ion-breadcrumbs class="p-3 pb-0" style="font-size: 1.5vh" v-if="searchKeyword">
        <ion-breadcrumb>Searching for</ion-breadcrumb>
        <ion-breadcrumb>{{searchKeyword}}</ion-breadcrumb>
      </ion-breadcrumbs>

      <ion-breadcrumbs class="p-3 pb-0" style="font-size: 1.5vh" v-if="searchVinNumber">
        <ion-breadcrumb>Searching VIN </ion-breadcrumb>
        <ion-breadcrumb>{{searchVinNumber.toUpperCase()}}</ion-breadcrumb>
      </ion-breadcrumbs>

      <div class="alert alert-info me-3 ms-3 mt-2 mb-0 text-start" role="alert" v-if="searchVinNumber && vinYear" style="font-size: 1.6vh">
        Your vehicle : <b class="text-uppercase">{{searchedVehicleFullname}}</b>
      </div>


      <div class="d-flex justify-content-center mt-2"><dot-loader :loading="isLoading" :color="color" :size="size" class="mt-5"></dot-loader></div>
      <div class="row p-3 pt-0" v-if="!isLoading">
          <div class="col-6 p-0" v-for="product in productList" :key="product.tags[0].name+product.id">
            <ion-card class="position-relative m-2 ion-activatable ripple-parent">
                <img :src="product.images[0].src" :class="product.imgclass" @click="setSelectedProduct(product)"/>
                <span class="text-center position-absolute out-of-stock-banner" v-if="product.stock_status == 'outofstock'" @click="setSelectedProduct(product)">
                  <img src="../../resources/OutOfStock.png" />
                </span>
                <span v-if="product.on_sale" @click="setSelectedProduct(product)">
                  <img src="../../resources/sale.png" class="position-absolute sale-banner"/>
                </span>
                <ion-card-header class="overflow-hidden">
                  <ion-card-subtitle @click="setSelectedProduct(product)" v-if="!product.isNonECMTIPM">
                      <span :class="'pe-2 ps-2 pb-0 pt-0 text-white '+ product.badge">{{product.name.split(' ')[0].replace('_',' ')}}</span>
                  </ion-card-subtitle>
                  <span @click="setSelectedProduct(product)">
                      <ion-card-title class="prod-title fw-normal" style="font-size:1.8vh">{{cleanString(product.name_title)}}</ion-card-title>
                      <ion-card-subtitle class="prod-sub-title" style="font-size: 1.5vh">{{product.name_subtitle}}</ion-card-subtitle>
                  </span>
                  <div class="overflow-hidden d-flex align-items-center justify-content-between">
                    <span class="price-display">
                      <span class="text-decoration-line-through text-danger regular-price" v-if="product.on_sale">$ {{formatRegularPrice(product.regular_price)}}</span><br/>
                      <span class="text-dark fw-bold">$ {{formatRegularPrice(product.price)}}</span>
                    </span>
                    <ion-button
                    :color="(product.badge == 'ecm-badge') ? 'tertiary': ''"
                    class="float-end add-dimentions"
                    :disabled="product.stock_status == 'outofstock'"
                    @click="showRequiredFieldsModal(product)"
                    >
                        <ion-icon :icon="add"></ion-icon>
                    </ion-button>
                  </div>
                </ion-card-header>
                <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </div>


          <!-- for could not find ecm thumbnail-->
          <div class="col-6 p-0" v-if="!isVinInvalid">
            <ion-card class="position-relative m-2" @click="toggleHubspotFormContactUs()">
                <img src="https://ecmrebuilders.com/wp-content/uploads/2022/07/no_ecm.png" class="bg-white"/>
                <ion-card-header class="overflow-hidden">
                  <span>
                      <ion-card-title class="prod-title fw-bold" style="font-size:2vh">
                      CAN'T FIND YOUR <span style="color: #3A7CA5">ECM?</span></ion-card-title>
                  </span>
                  <div class="overflow-hidden">
                    <p class="mt-3 text-dark" style="font-size:1.8vh">Click here!, We'll find it for you!</p>
                  </div>
                </ion-card-header>
            </ion-card>
          </div>

          <div class="col-6 p-0" v-if="showRepairHubspotThumbnail">
            <ion-card class="position-relative m-2" @click="toggleHubspotRepairForm()">
                <img src="http://ecmrebuilders.com/wp-content/uploads/2022/01/ECM-REPAIR-2-e1641540545289.png"
                class="bg-white" style="filter: grayscale(100%);"/>
                <ion-card-header class="overflow-hidden">
                  <span>
                      <ion-card-title class="prod-title fw-bold" style="font-size:2vh">
                      REPAIR MAY BECOME AVAILABLE</ion-card-title>
                  </span>
                  <div class="overflow-hidden">
                    <p class="mt-3 text-dark" style="font-size:1.8vh">
                      It looks like there is no available repair services for your
                      <span class="text-uppercase fw-bold">{{searchedVehicleFullname}}</span> 
                      at this time. <span style="color: #3A7CA5">Click here for more details!</span>
                    </p>
                  </div>
                </ion-card-header>
            </ion-card>
          </div>
      </div>

      <div v-if="!productList.length && !isLoading && isVinInvalid && !showRepairHubspotThumbnail" class="text-center order-page">
        <ion-icon :icon="listOutline" style="font-size: 200px;  opacity: .1"></ion-icon>
        <p class="text-muted fst-italic mt-0" style="font-size: 2vh">No results found</p>
      </div>

      <ion-modal ref="modal-hubspot-contact-form"
      :is-open="isHubspotContactUsFormOpen"
      :breakpoints="[0.0, 0.7, 0.95]"
      :initialBreakpoint="0.7"
      @didDismiss="toggleHubspotFormContactUs()">
        <ion-content class="p-4">
          <div class="p-3">
            <br/>
            <p style="font-size:20px" class="fw-bold text-center">CAN'T FIND YOUR <span style="color: #3A7CA5">ECM?</span></p>
            <p style="font-size: 14px">We're here to help! We will contact you regarding the availability of your part #.</p>
            <div class="d-flex justify-content-center mt-2">
              <dot-loader :loading="isLoadingHubspotForm" color="#3A7CA5" :size="size" class="mt-5"></dot-loader>
            </div>
            <div id="contact-us-hsf"></div>
          </div>
        </ion-content>
      </ion-modal>

      <ion-modal ref="modal-hubspot-repair-form"
      :is-open="isHubspotRepairFormOpen"
      :breakpoints="[0.0, 0.7, 0.95]"
      :initialBreakpoint="0.7"
      @didDismiss="toggleHubspotRepairForm()">
        <ion-content class="p-4">
          <div class="p-3">
            <br/>
            <p style="font-size:20px" class="fw-bold text-center">REPAIR MAY BECOME <span style="color: #3A7CA5">AVAILABLE!</span></p>
            <p style="font-size: 14px">It looks like there is no available repair services for your <b class="text-uppercase fw-bold">{{searchedVehicleFullname}}</b> at this time.
              However it may become available in the near future. We will contact you once this service becomes available for your part#.</p>
            <div class="d-flex justify-content-center mt-2">
              <dot-loader :loading="isLoadingHubspotForm" color="#3A7CA5" :size="size" class="mt-5"></dot-loader>
            </div>
            <div id="repair-hsf"></div>
          </div>
        </ion-content>
      </ion-modal>
      


    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';

import { IonPage, IonHeader, IonToolbar,
IonTitle, IonContent, IonChip, IonIcon,
IonLabel, IonButtons, IonButton,
IonBreadcrumbs, IonBreadcrumb,
IonRefresher, IonRefresherContent,
actionSheetController, IonRippleEffect,
modalController, IonModal, IonBackButton
} from '@ionic/vue';

import { 
  arrowBackOutline, search, add, listOutline,
  trash, share, heart, caretForwardCircle, close,
  callOutline, sendOutline, chatbubbleEllipsesOutline,
  mailOutline, paperPlaneOutline, logoFacebook
} from 'ionicons/icons'
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SettingsConstants from '../constants/settings.constants'
import { mapState } from 'vuex'
import store from '../store'
import $ from 'jquery'
import Mixin from '../mixins/global.mixin'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'ProductsPage',
  mixins: [Mixin],
  components: { DotLoader, IonHeader, IonToolbar,
    IonTitle, IonContent, IonPage, IonChip,
    IonIcon, IonLabel, IonButtons, IonButton,
    IonBreadcrumbs, IonBreadcrumb,
    IonRefresher, IonRefresherContent,
    IonRippleEffect, IonModal, IonBackButton
  },
  computed: mapState([
    'sessionData',
    'selectedYear',
    'selectedMake',
    'selectedModel',
    'selectedProduct',
    'searchKeyword',
    'searchVinNumber',
    'onlineStatus'
  ]),
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh,
      arrowBackOutline, search, add, listOutline,
      trash, share, heart, caretForwardCircle, close,
      callOutline, sendOutline, chatbubbleEllipsesOutline,
      mailOutline, paperPlaneOutline, logoFacebook
    }
  },
  watch: {
    isHubspotRepairFormOpen: function (newVal) {
      if (newVal) {
        this.isLoadingHubspotForm = true;
        if (window.hbspt) {
          var existCondition = setInterval(function() {
            if ($('#repair-hsf').length) {
              window.hbspt.forms.create({
                region: "na1",
                portalId: "21300550",
                formId: "de4404b5-39b5-49d1-b108-6150f9fd7baf",
                target: "#repair-hsf"
              });
              this.addIframeJquery();
              clearInterval(existCondition);
            }
          }.bind(this), 100);
        }
      }
    },
    isHubspotContactUsFormOpen: function (newVal) {
      if (newVal) {
        this.isLoadingHubspotForm = true;
        if (window.hbspt) {
          var existCondition = setInterval(function() {
            if ($('#contact-us-hsf').length) {
              window.hbspt.forms.create({
                region: "na1",
                portalId: "21300550",
                formId: "a3e1aa90-cb87-4b14-b0ce-09397efe9495",
                target: "#contact-us-hsf"
              });
              this.addIframeJquery();
              clearInterval(existCondition);
            }
          }.bind(this), 100);
          
        }
      }
    }
  },
  data() {
    return {
      productList: [],
      sites: [SettingsConstants.TIPMSITE,SettingsConstants.ECMSITE],
      isLoading: false,
      queryCount: 0,
      lastPath: null,
      vinYear: null,
      vinMake: null,
      vinModel: null,
      vinTrim: null,
      vinEngine: null,
      productSlug: null,
      isVinInvalid: false,
      searchedVehicleFullname: null,
      isHubspotContactUsFormOpen: false,
      isHubspotRepairFormOpen: false,
      isLoadingHubspotForm: false,
      showRepairHubspotThumbnail: false,
    }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    async presentActionSheet() {
      const actionSheet = await actionSheetController
        .create({
          //header: 'WE\'LL FIND IT FOR YOU!',
          //cssClass: 'my-custom-class',
          buttons: [
            {
              text: 'Call Us',
              icon: callOutline,
              id: 'call-button', 
              data: null,
              handler: () => {
                location.href = "tel:+1-818-798-5558";
              },
            },
            {
              text: 'Facebook Messenger',
              icon: logoFacebook,
              data: null,  
              handler: () => {
                location.href = "http://facebook.com/messages/t/104450115104533";
                console.log('Messenger clicked')
              },
            },
            {
              text: 'Email Us',
              icon: mailOutline,
              data: null,
              handler: () => {
                console.log('Email us clicked')
              },
            },
            {
              text: 'Contact Us',
              icon: paperPlaneOutline,
              data: null,
              handler: () => {
                console.log('Contact Us clicked')
              },
            },
            {
              text: 'Cancel',
              icon: close,
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked')
              },
            },
          ],
        });
      await actionSheet.present();

      const { role, data } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role and data', role, data);
    },
    showSearchResultWarning: function () {
      Swal.fire({
        title: 'Keyword search warning!',
        text: "Search returned more than 50 results, would you like to narrow down your search",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4b7838',
        cancelButtonColor: '#92949C',
        cancelButtonText: 'Continue',
        confirmButtonText: 'New Search',
      }).then((result) => {
        if (result.isConfirmed) {
          this.openSearchModal();
        }
      });
    },
    toggleHubspotFormContactUs() {
      this.isHubspotContactUsFormOpen = !this.isHubspotContactUsFormOpen;
    },
    toggleHubspotRepairForm: function () {
      this.isHubspotRepairFormOpen = !this.isHubspotRepairFormOpen;
    },
    addIframeJquery: function () {
      setInterval(() => {
        this.isLoadingHubspotForm = false;
        $("iframe").contents().find('.hs_submit input.hs-button').css('width','100%');
        $("iframe").contents().find('input').css('min-height','45px');
        $("iframe").contents().find('input').css('border-radius','10px');
        $("iframe").contents().find('.hs_submit .actions').css('padding','0px 0px 17px 0px');
        $("iframe").contents().find('html').css('background-color','#F6F6F6');
      }, 500);
    },
    openSearchModal: function () {
      this.emitter.emit('isShowSearchModal');
    },
    getProductsSearchResult: function () {
      this.isVinInvalid = false;
      this.isLoading = true;
      this.productList = [];
      var counter = 0;
      this.queryCount = this.selectedModel.data.length;
      this.selectedModel.data.forEach( function (cat){
        axios.get(SettingsConstants.BASE_URL +
        'productREST.php?op=get_product_under_category&site='+cat.site+'&page=1&categoryId='+cat.categories.id+'&products_perpage='+50 , { crossdomain: true })
          .then(function (response) {
            counter = counter + 1;
            if (response.data.length) {
                this.formatProductData(response.data, counter, cat.site);
            } else {
              if (counter == this.queryCount) {
                this.isLoading = false;
              }
            }
          }.bind(this));
      }.bind(this));
    },
    getProductsSearchKeyword: function () {
      this.showRepairHubspotThumbnail = false;
      this.searchVinNumber = null;
      this.isVinInvalid = false;
      this.isLoading = true;
      this.productList = [];
      var counter = 0;
      this.queryCount = this.sites.length;
      this.sites.forEach( function (site){
        axios.get(SettingsConstants.BASE_URL +
        'productREST.php?op=search_keyword&site='+site+'&page=1&search_keyword='+this.searchKeyword+'&products_perpage='+100 , { crossdomain: true })
          .then(function (response) {
            counter = counter + 1;
            if (response.data.length) {
                this.formatProductData(response.data, counter, site);
            } else {
              if (counter == this.queryCount) {
                this.isLoading = false;
              }
            }
          }.bind(this));
      }.bind(this));
    },
    formatProductData: function (data, counter, site) {
      data.forEach(function (prod, idx, array) {
        var ifStatement;
        if (site.includes('ecm')) {
          prod.source = 'ECM';
        } else {
          prod.source = 'TIPM';
        }
        ifStatement = (prod.status == 'publish');
        if (this.vinEngine) {
          if (!site.includes('ecm')) {
            ifStatement = (prod.status == 'publish');
          } else {
            ifStatement = ((prod.status == 'publish' && prod.name.includes(this.vinEngine)) || prod.name.includes('REPAIR SERVICE'));
          }
        }

        if (ifStatement) {
          prod.name = prod.name.replace('LIKE NEW', 'LIKE_NEW');
          prod.imgclass = (prod.stock_status == 'outofstock'?'opacity ':'') + (prod.name.toLowerCase().includes('repair service')? 'bg-dark': 'bg-white');
          prod.name_title = '';
          prod.name_subtitle = '';
          name = null;
          var name = null;
          if (prod.tags.find(tag => tag.name == 'TIPM')) {
            prod.badge = 'tipm-badge';
            name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
            prod.name_title = name.split('- Part')[0];
            prod.name_subtitle = '- Part' + name.split('- Part')[1];
            if (prod.name.includes('NEW') || prod.name.includes('LIKE_NEW')) {
              prod.isNew = true;
            } else {
              prod.isNew = false;
            }
          }
          if (prod.tags.find(tag => tag.name == 'ECM')) {
            prod.badge = 'ecm-badge';
            name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
            prod.name_title = name.split('with')[0];
            prod.name_subtitle = 'with' + name.split('with')[1];
          }
          if (!prod.tags.find(tag => tag.name == 'TIPM') && !prod.tags.find(tag => tag.name == 'ECM')){
            prod.name_title = prod.name;
            prod.isNonECMTIPM = true;
            if (prod.name_title.toLowerCase().includes('ecm')) {
              prod.badge = 'ecm-badge';
            } else {
              prod.badge = 'tipm-badge';
            }
          }
          this.productList.push(prod);
        }
        if (idx == array.length-1 && counter == this.queryCount) {
          this.isLoading = false;
          this.sortProducts();
          if (this.productList.length > 50) {
            this.showSearchResultWarning();
          }
        }
      }.bind(this));
    },
    getProductsSearchVIN: function (categoryID, site, counter) {
      if (SettingsConstants.VALID_MAKE.includes(this.vinMake.toLowerCase())) {
        var geturl = '';
        if (categoryID) {
          geturl = SettingsConstants.BASE_URL+'productREST.php?op=get_product_under_category&site='+site+'&categoryId='+categoryID;
        } else{
          geturl = SettingsConstants.BASE_URL+'productREST.php?op=get_general_repair_evaluation&site='+site;
        }
        axios.get(geturl, { crossdomain: true })
        .then(function (response) {
          if (response.data) {
            this.formatProductData(response.data, counter, site);
          }
        }.bind(this));
        this.showRepairHubspotThumbnail = false;
      } else {
        this.isVinInvalid = true;
        this.isLoading = false;
        this.productList = [];
        this.showRepairHubspotThumbnail = true;
      }
    },
    decodeVin: function () {
      this.searchKeyword = null;
      this.isVinInvalid = false;
      this.vinYear = null,
      this.vinMake = null,
      this.vinModel = null,
      this.vinTrim = null,
      this.vinEngine = null,

      this.isLoading = true;
      axios.get(SettingsConstants.VIN_DECODE_URL+this.searchVinNumber+'*BA?format=json', { crossdomain: true })
      .then(function (response) {
          response.data.Results.forEach(function (res, idx, array) {
            switch (res.Variable) {
							case "Make":
                if (res.Value) {
                  this.vinMake = res.Value;
                  this.vinMake = this.vinMake.toLowerCase();
                }
                break;
							case "Model":
                if (res.Value) {
                  if (res.Value && res.Value.includes('/')){
                    res.Value = res.Value.split(' ')[0];
                    this.vinModel = res.Value.split('/')[0];
                  } else {
                    this.vinModel = res.Value.replace(/ /g,'-');
                    if (this.vinModel == 'Cargo-Van') {
                      this.vinModel = 'c-v';
                    }
                    if (this.vinModel == 'Ram-Chassis-Cab') {
                      this.vinModel = 'Ram';
                    }
                    if (this.vinModel.toLowerCase() == 'town' || this.vinModel.toLowerCase().includes('town')) {
                      this.vinModel = 'town-country';
                    }
                    if (this.vinModel.toLowerCase() == '500l') {
                      this.vinModel = '500';
                    }
                  }
                  
                  this.vinModel = this.vinModel.toLowerCase();
                }
                break;
							case "Model Year":
                if (res.Value) {
                  this.vinYear = res.Value;
                }
                break;
              case "Trim":
                if (res.Value) {
                  if (res.Value.includes('1500') || res.Value.includes('2500') || res.Value.includes('3500') || res.Value.includes('4500') || res.Value.includes('5500')) {
                    this.vinTrim = res.Value.toLowerCase().replace('-longhorn','');
                  }
                  if (res.Value.includes('Cargo Van')) {
                    this.vinTrim = 'c-v';
                  }
                  if (res.Value.includes('JL (Open Body)')) {
                    this.vinTrim = 'jl';
                  }
                  this.vinTrim = this.vinTrim ? this.vinTrim.toLowerCase() : '';
                }
                break;
              case "Displacement (L)":
                if (res.Value) {
                  if (res.Value.length == 1) {
                    this.vinEngine = res.Value+'.0L';
                  } else {
                    this.vinEngine = res.Value+'L';
                  }
                }
                if (res.Value == '5.9' && this.vinMake.toLowerCase() == 'dodge') {
                  this.vinTrim = '2500';
                }
                break;
						}
            
            if (idx === array.length - 1) {
              if (this.vinYear && this.vinMake && this.vinModel) {
                if (this.vinTrim) {
                  this.vinModel = this.vinModel+'-'+this.vinTrim;
                }
                this.productSlug = this.vinModel+'-'+this.vinMake+'-'+this.vinYear;
                if (this.productSlug) {
                  this.getCategoryIDBySlug();
                }
                this.searchedVehicleFullname = this.vinYear+' '+this.vinMake+' '+this.vinModel+' '+(this.vinModel == 'caravan'? '/ GRAND CARAVAN' : '')+' '+this.vinEngine;
              } else {
                this.productList = [];
                this.isVinInvalid = true;
                this.isLoading = false;
                Swal.fire({
                  title: 'Invalid VIN!',
                  html: `<div style="text-align: left" >
                    <ul style="font-size: 1.9vh">
                      <li>VIN#s are always 17 characters</li>
                      <li>The alphabet characters <b>O, I,</b> and <b>Q</b> are not used.</li>
                      <li>Anything that looks like a <b>"O"</b> is the number 0 (zero).</li>
                      <li>Anything that looks like a <b>"I"</b> is the number 1 (one).</li>
                      <li>If you are still having trouble, consider reading it from your door panel, insurance forms, or vehicle registration.</li>
                    </ul> 
                  </div>
                  `,
                  icon: 'error',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#4b7838',
                });
              }
            }
          }.bind(this));
       }.bind(this)).catch(error => {
          this.isLoading = false;
          console.log(error);
          Swal.fire({
            title: 'VIN Search unavailable!',
            text: 'vPIC API application is currently undergoing Maintenance. You may search by Vehicle or Part Number instead.',
            icon:'info',
            confirmButtonColor: '#4b7838',
          });
        });
    },
    getCategoryIDBySlug: function () {
      this.productList = [];
      var counter = 0;
      this.queryCount = this.sites.length;

      this.sites.forEach(function (site){
        axios.get(SettingsConstants.BASE_URL+'categoryREST.php?op=get_category_byslug&slug='+this.productSlug+'&site='+site, { crossdomain: true })
        .then(function (response) {
            counter = counter + 1;
            if (response.data.length == 0) {
                this.getProductsSearchVIN(null, site, counter);
            }
            if (response.data[0]) {
                this.getProductsSearchVIN(response.data[0].id, site, counter);
            }
        }.bind(this));
      }.bind(this));
      
    },
    setSelectedProduct: function (product) {
      store.commit('SET_SELECTED_PRODUCT', product);
      if (this.selectedProduct) {
        //window.location.href = '/product-details';
        this.$router.push('/product-details');
      }
    },
    sortProducts: function () {
      this.productList.sort((a) => {
        let fa = a.tags[0].name.toLowerCase();

        if (fa == 'ecm' || fa == 'tipm') {
          return -1;
        }
        if (fa != 'ecm' || fa != 'tipm') {
          return 1;
        }
        return 0;
      });
    },
    initLogic: function () {
      if (this.selectedModel) {
        this.getProductsSearchResult();
      }
      if (this.searchKeyword) {
        this.getProductsSearchKeyword();
      }
      if (this.searchVinNumber) {
        this.decodeVin();
      }
    },
    showRequiredFieldsModal: function (product) {
      this.emitter.emit('isShowRequiredFieldsModal', product);
    },
  },
  mounted() {
    this.initLogic();
    this.emitter.on('triggerSearch', function () {
      this.initLogic();
    }.bind(this));
    if (this.$route.fullPath == '/tabs/products') {
      $('ion-tab-button#tab-button-products').addClass('tab-selected');
    }
  },
  created () {
    this.lastPath = this.$router.options.history.state.back;
    if (!this.lastPath) {
      this.lastPath = '/';
    }
  },
});
</script>


<style scoped>
#product-page ion-card{
  margin-inline: 12px !important;
}
#product-page .row > [class*='col-'] {
  display: flex;
  flex-direction: inherit;
}

#product-page .USED {
  background-color: #555;
  border-radius: 30px;
  font-size: smaller;
}

#product-page ion-breadcrumb {
  font-size: 1.5vh
}
</style>
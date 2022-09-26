<template>
  <ion-app>
    <ion-router-outlet :key="$route.fullPath" />

    <ion-progress-bar type="indeterminate" v-if="showProgressBar"></ion-progress-bar>
    <!-- <vueInternetChecker
      @status="status"
      @event="event"
    /> -->

    <full-screen-loader v-if="showFullScreenLoader"></full-screen-loader>

    <ion-modal ref="modalRequiredFieldsAddtocart"
      :is-open="isRequiredFieldsModalOpen"
      @didDismiss="toggleRequiredFieldsModal()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()"
              :style="'--color:' + (productSource == 'ECM' ? '#3A7CA5' : '#487436')">Cancel</ion-button>
            </ion-buttons>
            <ion-title class="text-center">$ {{productPrice}}</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="addProductToCart()"
              :style="'--color:' + (productSource == 'ECM' ? '#3A7CA5' : '#487436')">
              <!-- <ion-icon :icon="cartOutline" class="me-2"></ion-icon> -->
              Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="p-4 text-white" :style="'background-color: '+(productSource == 'ECM' ? '#3A7CA5' : '#487436')+'; font-size: 14px;'" role="alert">
              {{selectedProduct.name.replace('amp;','')}}
          </div>
          <div class="p-4 pt-3 mb-5">

            <div v-if="isVariationsLoading" class="d-flex justify-content-center align-items-center h-100">
              <dot-loader :loading="isVariationsLoading" :color="color" :size="size" class="mt-3 mb-3"></dot-loader>
            </div>

            <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="selectedProduct.variations.length">
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="variation-items">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 :class="'fw-bold mb-2 header-class-'+(selectedProduct.source == 'TIPM' ? 'tipm' : '')">{{productVariationName}} <span class="text-danger" v-if="productVariationName">*</span></h4>
                </ion-label>
                <ion-radio-group class="w-100" v-model="vehiclePlugsNeeded" v-for="vari in productVariations" :key="vari.id">
                  <ion-item v-if="vari.name == 'Plug(s) Needed' && vari.purchasable">
                    <ion-label class="ion-text-wrap">{{vari.title}}</ion-label>
                    <ion-radio slot="start" :color="(selectedProduct.source == 'TIPM' ? 'primary' : 'tertiary')" :value="vari"></ion-radio>
                  </ion-item>
                </ion-radio-group>
                <ion-radio-group class="w-100" v-model="vehicleFCMPartNumber" v-for="vari in productVariations" :key="vari.id">
                  <ion-item v-if="vari.name == 'FCM Part Number' && vari.purchasable">
                    <ion-label class="ion-text-wrap">{{vari.title}}</ion-label>
                    <ion-radio slot="start" :color="(selectedProduct.source == 'TIPM' ? 'primary' : 'tertiary')" :value="vari"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
            </ion-list>

            <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="productSource == 'ECM' && !selectedProduct.isNonECMTIPM">
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="vinNumber">
                <ion-label position="stacked" color="text-dark">
                  <h4 class="fw-bold mb-2 header-class">17-Digit VIN <span class="text-danger">*</span></h4>
                  Your VIN# is needed for us to program the unit.
                </ion-label>
                <ion-input class="mt-2 text-uppercase bg-white vin-input-field" v-model="vinInput" maxlength="17" placeholder="VIN Nunber"></ion-input>
              </ion-item>
              <div>
                <div v-if="isVinMatchingLoading" class="d-flex justify-content-center align-items-center h-100">
                  <dot-loader :loading="isVinMatchingLoading" :color="color" :size="size" class="mt-5"></dot-loader>
                </div>
                <div :class="'alert alert-'+(vinMatchingResult ? 'success' : 'danger')+' mt-2'" role="alert" v-if="showVinMatchingResult">
                  Your Vehicle: <br/>{{vehicleNameVinResult}}<br/>
                  <b>Your vehicle <span v-if="!vinMatchingResult">might not</span> matched this {{selectedProduct.source}}!</b>
                </div>
                <div class="alert alert-danger mt-2" role="alert" v-if="showifVinisInvalid">
                  <b>You entered an invalid VIN number</b>
                  <p v-html="vinErrorMessage"></p>
                </div>
              </div>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class">Current Mileage</h4>
                  Enter mileage and transmission type here or leave blank, and our Customer Service  team will reach out to you if needed for your ECM /PCM.
                  Mileage entered should be accurate to +/- 10 miles of actual when the ECM is installed.
                  If you plan to be driving this vehicle, leave blank and we will contact you before shipment or
                  <b>Call Us</b> with Questions.
                </ion-label>
                <ion-input class="mt-2 bg-white" type="number" placeholder="Current Mileage" v-model="vehicleCurrentMileage"></ion-input>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class">Transmission Type</h4>
                  Please confirm your Transmission Type:
                </ion-label>
                <ion-radio-group class="w-100" v-model="vehicleTransmissionType">
                  <ion-item>
                    <ion-label>Automatic</ion-label>
                    <ion-radio slot="start" color="tertiary" value="Automatic_0" ></ion-radio>
                  </ion-item>

                  <ion-item>
                    <ion-label>Manual</ion-label>
                    <ion-radio slot="start" color="tertiary" value="Manual_1"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class">Rental Program Option</h4>
                  Sometimes after you purchase an ECM, you discover the real problem was not in the ECM and you just needed it for troubleshooting.
                  With MAK'S, you may convert your purchase to a rental at any time during the first 30 days.
                  See our <a href="https://ecmrebuilders.com/warranty-returns-policy/" class="text-decoration-none link-color-ecm"><b>Warranty Information & Returns Policy</b></a> for more information.
                </ion-label>
              </ion-item>
              <br/><br/><br/>
            </ion-list>
            <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="productSource == 'TIPM' && !selectedProduct.isNonECMTIPM">
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark">
                  <h4 class="fw-bold mb-2 header-class-tipm">Verify VIN (Optional)</h4>
                </ion-label>
                <ion-input class="mt-2 text-uppercase bg-white vin-input-field" v-model="vinInput" maxlength="17" placeholder="VIN Nunber"></ion-input>
              </ion-item>
              <div>
                <div v-if="isVinMatchingLoading" class="d-flex justify-content-center align-items-center h-100">
                  <dot-loader :loading="isVinMatchingLoading" :color="color" :size="size" class="mt-5"></dot-loader>
                </div>
                <div :class="'alert alert-'+(vinMatchingResult ? 'success' : 'danger')+' mt-2'" role="alert" v-if="showVinMatchingResult">
                  Your Vehicle: <br/>{{vehicleNameVinResult}}<br/>
                  <b>Your vehicle <span v-if="!vinMatchingResult">might not</span> matched this {{selectedProduct.source}}!</b>
                </div>
                <div class="alert alert-danger mt-2" role="alert" v-if="showifVinisInvalid">
                  <b>You entered an invalid VIN number</b>
                  <p v-html="vinErrorMessage"></p>
                </div>
              </div>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="4x4checker" v-if="is4x4Visible">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">4x4 Check <span class="text-danger">*</span></h4>
                  Please confirm if your vehicle has 4x4 or not:
                </ion-label>
                <ion-radio-group class="w-100" v-model="vehicle4by4Check">
                  <ion-item>
                    <ion-label>With 4x4</ion-label>
                    <ion-radio slot="start" color="primary" value="W/ 4x4_0"></ion-radio>
                  </ion-item>

                  <ion-item>
                    <ion-label>Without 4x4</ion-label>
                    <ion-radio slot="start" color="primary" value="W/O 4x4_1"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" v-if="isLidOptionsVisible">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">Lid Options <span class="text-danger">*</span></h4>
                  TIPM lids are not included in the price. The majority of TIPMs we rebuild come to us with missing or broken lids.
                  Re-using your old lid will help us and the environment. You may request a lid for a ${{addPriceifLidIncluded}}.00 surcharge.<br/><br/>
                  Re-using your old lid will not lower the value of your old TIPM under our Core Buyback Program.
                </ion-label>
                <ion-radio-group class="w-100" v-model="vehicleLidOptions">
                  <ion-item>
                    <ion-label>Include a Lid <b class="ms-2">${{addPriceifLidIncluded}}.00</b></ion-label>
                    <ion-radio slot="start" color="primary" value="Include a Lid_0"></ion-radio>
                  </ion-item>

                  <ion-item>
                    <ion-label>No Lid Needed <b class="ms-2">$0.00</b></ion-label>
                    <ion-radio slot="start" color="primary" value="No Lid Needed_1"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">Rental Program Option</h4>
                  Sometimes after you purchase a TIPM, you discover the real problem was not in the TIPM and you just needed it for troubleshooting.
                  With MAK'S, you may convert your purchase to a rental at any time during the first 30 days.
                  See our <a href="https://tipmrebuilders.com/warranty-returns-policy/" target="_blank" class="text-decoration-none"><b>Warranty Information & Returns Policy</b></a> for more information.
                </ion-label>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" v-if="showCoreRefund">
                <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">Core Refund Program</h4>
                  Use slider to set your own core fee and get double your money back!
                </ion-label>
              </ion-item>
              <span v-if="showCoreRefund">
                <ion-range :min="0" :max="75" v-model="vehicleCoreFee">
                    <ion-label slot="end">Core Fee: $ {{parseInt(vehicleCoreFee)}}.00</ion-label>
                </ion-range>
                <span>You get back <b>${{parseInt(vehicleCoreFee)*2}}.00</b> when you send in your old core under our
                  <a href="https://tipmrebuilders.com/core-return/" class="text-decoration-none" target="_blank"><b class="color-primary">Core Buyback Program</b></a>.
                </span>
              </span>
            </ion-list>

          </div>
        </ion-content>
    </ion-modal>
  </ion-app>

</template>

<script lang="js">
import { IonApp, IonRouterOutlet, IonModal,
IonInput, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonButton, IonButtons,
IonRange, IonRadio, IonRadioGroup, alertController, IonProgressBar, toastController } from '@ionic/vue';
import axios from 'axios'
import SettingsConstants from './constants/settings.constants'
import $ from 'jquery'
import store from './store';
import { 
  cartOutline, alertCircleOutline
} from 'ionicons/icons'
import FullScreenLoader from './components/FullScreenLoader'
import { defineComponent } from 'vue';
import { mapState } from 'vuex'
import Mixin from './mixins/global.mixin'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import { Network } from '@capacitor/network';
// import vueInternetChecker from 'vue-internet-checker';

export default defineComponent({
  name: 'App',
  mixins: [Mixin],
  watch: {
    vehicleLidOptions: function (newVal) {
      var price = this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00';
      if (newVal == 'Include a Lid_0') {
        this.lidOptionsPrice = this.addPriceifLidIncluded;
      } else {
        this.lidOptionsPrice = 0;
      }
      this.productPrice = this.computePriceAddToCart(price);
    },
    vehicleCoreFee: function (newVal) {
      var price = this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00';
      this.coreFeePrice  = parseInt(newVal);
      this.productPrice = this.computePriceAddToCart(price);
    },
    vinInput: function (newVal) {
      if (newVal.length == 17) {
        if (this.validateVin(newVal)) {
          this.showifVinisInvalid = false;
          this.getVinDetails(newVal);
        } else {
          this.showifVinisInvalid = true;
          this.vinErrorMessage = 'Double check your VIN or <a target="_blank" href="https://vpic.nhtsa.dot.gov/decoder/CheckDigit/Index/'+newVal+'" class="text-decoration-none">Click here</a> for more details';
        }
      } else {
        this.showVinMatchingResult = false,
        this.vehicleNameVinResult = null,
        this.vinMatchingResult = false,
        this.isVinMatchingLoading = false;
        this.showifVinisInvalid = false;
      }
    },
    vehiclePlugsNeeded: function () {
      this.isVariationRequired = false;
    },
    vehicleFCMPartNumber: function () {
      this.isVariationRequired = false;
    },
    onLine: function (newVal) {
      store.commit('SET_ONLINE_STATUS', newVal);
    }
  },
  data () {
    return {
      showProgressBar: false,
      isRequiredFieldsModalOpen: false,
      isVariationRequired: true,
      isVariationsLoading: false,
      selectedProduct: null,
      productSource: null,
      showFullScreenLoader: false,
      productVariations: [],
      productVariationName: null,
      vehiclePlugsNeeded: null,

      vinInput: null,
      showVinMatchingResult: false,
      vehicleNameVinResult: null,
      vehicleCurrentMileage: null,
      vehicleTransmissionType: null,
      vinMatchingResult: false,
      isVinMatchingLoading: false,
      vehicleLidOptions: null,
      lidOptionsPrice: 0,
      coreFeePrice: 0,
      productOptionsTotalPrice: 0,
      vehicle4by4Check: null,
      vehicleCoreFee: 0,
      vehicleFCMPartNumber: null,
      addPriceifLidIncluded: 0,
      defaultCoreFee: 0,
      productPrice: null,
      showifVinisInvalid: false,
      vinErrorMessage: null,

      showCoreRefund: false,
      color: null,
      is4x4Visible: true,
      isLidOptionsVisible: true,

      onLine: null,
    }
  },
  computed: mapState([
    'productsWithCoreRefund',
    'productsWithOutLidOptions',
    'productsWith4x4',
    'onlineStatus'
  ]),
  setup() {
    return {
      cartOutline, alertCircleOutline
    }
  },
  components: {
    //vueInternetChecker,
    DotLoader,

    IonApp, FullScreenLoader,
    IonRouterOutlet,
    IonModal, IonProgressBar,
    IonInput, IonLabel, IonItem, IonList,
    IonHeader, IonToolbar, IonButton, IonButtons,
    IonRange, IonRadio, IonRadioGroup,
    
  },
  methods: {
    async presentToast() {
      const toast = await toastController.create({
        message: 'You are currently offline, Please check your internet connection!',
        duration: 1500,
        position: 'top',
        color: 'danger',
        icon: alertCircleOutline
      });

      await toast.present();
    },
    async presentAlert() {
      var message = null;
      if (this.selectedProduct.source == 'TIPM') {
        if (this.selectedProduct.isNonECMTIPM) {
          message = 'Some fields are required!';
        } else {
          if (this.is4x4Visible && this.isLidOptionsVisible) {
            message = '<b>4x4 Check</b> and <b>Lid Options</b> are required!';
          }
          if (this.is4x4Visible && !this.isLidOptionsVisible) {
            message = '<b>4x4 Check</b> is required!';
          }
          if (!this.is4x4Visible && this.isLidOptionsVisible) {
            message = '<b>Lid Options</b> is required!';
          }
        }
      } else {
        if (this.selectedProduct.isNonECMTIPM) {
          message = 'Some fields are required!';
        } else {
          message = 'Your <b>VIN Number</b> is needed for us to program the unit. Make sure your VIN matches this ECM!';
        }
      }
      const alert = await alertController.create({
        header: 'Required Fields!',
        message: message,
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              console.log('Some fields are required!');
            },
          },
        ],
      });

      await alert.present();
    },
    updateOnlineStatus: function (status) {
      store.commit("SET_ONLINE_STATUS", status);
    },
    toggleRequiredFieldsModal: function (product) {
      if (product) {
        (!this.productsWith4x4.includes(product.id.toString())) ? this.is4x4Visible = false: this.is4x4Visible = true;
        (this.productsWithOutLidOptions.includes(product.id.toString())) ? this.isLidOptionsVisible = false : this.isLidOptionsVisible = true;
        if (product.variations.length) {
          this.productVariations = [];
          this.getProductVariations(product.id, product.source);
        }
        if ((product.variations.length == 0) && product.isNonECMTIPM) {
          this.isVariationRequired = false;
        }
        this.resetFields();
        this.selectedProduct = product;
        this.addPriceifLidIncluded = SettingsConstants.ADDED_PRICE_OF_LID;
        this.defaultCoreFee = SettingsConstants.ADDED_PRICE_OF_DEFAULT_COREFEE;
        this.productSource = product.source;
        product.source == 'TIPM' ? this.color = '#568E3E' :  this.color = '#348CA6';
        if (this.productsWithCoreRefund.includes(product.id.toString()) && product.source == 'TIPM') {
          this.showCoreRefund = true;
          this.coreFeePrice = this.defaultCoreFee;
          this.vehicleCoreFee = this.defaultCoreFee;
        } else {
          this.productPrice = this.formatRegularPrice(product.price);
          this.showCoreRefund = false;
        }
        $('.vin-input-field input').attr('maxlength','17');
      }
      this.isRequiredFieldsModalOpen = !this.isRequiredFieldsModalOpen
    },
    resetFields: function () {
      this.vinInput = '';
      this.showVinMatchingResult = false;
      this.vehicleNameVinResult = null;
      this.vehicleCurrentMileage = null;
      this.vehicleTransmissionType = null;
      this.vinMatchingResult = false;
      this.isVinMatchingLoading = false;
      this.vehicleLidOptions = null;
      this.vehicle4by4Check = null;
      this.lidOptionsPrice = 0;
      this.coreFeePrice = 0;
      this.productOptionsTotalPrice = 0;
      this.vehicle4by4Check = null;
      this.vehicleCoreFee = 0;
      this.addPriceifLidIncluded = 0;
      this.defaultCoreFee = 0;
    },
    cancel() {
      this.$refs.modalRequiredFieldsAddtocart.$el.dismiss(null, 'cancel');
    },
    getVinDetails: function (vin) {
      this.isVinMatchingLoading = true;
      this.showVinMatchingResult = false;
      axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/'+vin+'?format=json', { crossdomain: true })
      .then(function (response) {
        if (response.data) {
          var trim = ``;
          var possibleSlugvalues = [];
          var year = response.data.Results.filter(function (vin) { return vin.Variable == 'Model Year'})[0].Value;
          var make = response.data.Results.filter(function (vin) { return vin.Variable == 'Make'})[0].Value.toLowerCase();
          var model = response.data.Results.filter(function (vin) { return vin.Variable == 'Model'})[0].Value.replace(' and ',' ').toLowerCase();
          var engine = response.data.Results.filter(function (vin) { return vin.Variable == 'Displacement (L)'})[0].Value;
          if (engine == '5.9' && make.toLowerCase() == 'dodge') {
            model = model + ' 2500';
          }
          if (!engine.includes('.')) {
            engine = engine+'.0L';
          } else {
            engine = engine+'L';
          }
          if (response.data.Results.filter(function (vin) { return vin.Variable == 'Trim'})[0].Value) {
            trim = response.data.Results.filter(function (vin) { return vin.Variable == 'Trim'})[0].Value.toLowerCase();
            if (model.toLowerCase() == 'ram') {
                switch (trim.toLowerCase()) {
                    case 'cargo van':
                        trim = 'c-v';
                        break;
                    case 'dt':
                        trim = '';
                        break;
                    default:
                        trim = trim.replace(/\D/g, '');
                        break;
                }
            }
            possibleSlugvalues.push(model+'-'+trim+'-'+make+'-'+year);
          }
          possibleSlugvalues.push(model+'-'+make+'-'+year);
          if (model.split(' ').length > 1) {
            model.split(' ').forEach( function (m){
                possibleSlugvalues.push(m+'-'+make+'-'+year);
                if (trim) {
                    possibleSlugvalues.push(m+'-'+trim+'-'+make+'-'+year);
                }
            })
          }
          if (model.split('/').length > 1) {
              possibleSlugvalues.push(model.split('/')[0].replace(/\s/g,'-')+'-'+make+'-'+year);
              possibleSlugvalues.push(model.split('/')[1].replace(/\s/g,'-')+'-'+make+'-'+year);
          }
          var matchCount = 0;
          possibleSlugvalues.forEach( function (slug, idx, array){
            slug = slug.replace(/\s/g,'-');
            this.vehicleNameVinResult = (year+` `+response.data.Results.filter(function (vin) { return vin.Variable == 'Make'})[0].Value+` `+response.data.Results.filter(function (vin) { return vin.Variable == 'Model'})[0].Value+` `+trim+` `+engine).toUpperCase();
            if (this.selectedProduct.source == 'ECM') {
              if (this.selectedProduct.categories.filter((cat) => cat.slug == slug).length && this.selectedProduct.name.includes(engine)) {
                matchCount++;
                this.vinMatchingResult = true;
              }
            } else {
              if (this.selectedProduct.categories.filter((cat) => cat.slug == slug).length) {
                matchCount++;
                this.vinMatchingResult = true;
              }
            }
            if (idx === array.length - 1 && matchCount == 0) {
              this.vinMatchingResult = false;
            }
            if (idx === array.length - 1) {
              this.showVinMatchingResult = true;
            }
            this.isVinMatchingLoading = false;
          }.bind(this));
        }
      }.bind(this));
    },
    addProductToCart: function () {
      var cart_data = new Object();
      var productID = null;
      var requiredLength = 0;
      var logic = null;
      if (this.vehiclePlugsNeeded || this.vehicleFCMPartNumber) {
        (this.vehiclePlugsNeeded ? productID = this.vehiclePlugsNeeded.id : productID = this.vehicleFCMPartNumber.id);
      } else {
        productID = this.selectedProduct.id;
      }
      if (!this.isVariationRequired || (!this.is4x4Visible && !this.isLidOptionsVisible)) {
        this.addToCart(productID, this.selectedProduct.source, cart_data);
        this.$refs.modalRequiredFieldsAddtocart.$el.dismiss(null, 'confirm');
      } else {
        (this.is4x4Visible) ? requiredLength = requiredLength + 1: '';
        (this.isLidOptionsVisible) ? requiredLength = requiredLength + 1: '';
        if (requiredLength == 2) {
          logic = (this.vehicle4by4Check && this.vehicleLidOptions)
        } else {
          logic = (this.vehicle4by4Check || this.vehicleLidOptions)
        }
        switch (this.selectedProduct.source) {
          case 'ECM':
            if (this.vinInput && (this.vinInput.length == 17) && this.vinMatchingResult) {
              cart_data = {
                'Enter_Your_17_digit_VIN': this.vinInput,
                'This_Vehicle' : this.vehicleNameVinResult,
                'Transmission_Type': this.vehicleTransmissionType,
                'Current_Mileage' : this.vehicleCurrentMileage,
              }
            }
            break;
          case 'TIPM':
            if (logic) {
              cart_data = {
                'Enter_Your_17_digit_VIN': this.vinInput,
                'This_Vehicle' : this.vehicleNameVinResult,
                'FxF_Check': this.vehicle4by4Check,
                'Lid_Options': this.vehicleLidOptions,
                'Core_Fee': this.vehicleCoreFee
              }
            }
            break;
        }
        if (!Object.keys(cart_data).length == 0) {
          this.addToCart(productID, this.productOrigin, JSON.stringify(cart_data));
          this.$refs.modalRequiredFieldsAddtocart.$el.dismiss(null, 'confirm');
        } else {
          this.presentAlert();
        }
      }
    },
    getAllProductsWithCoreRefundProgram: function () {
      axios.get(SettingsConstants.BASE_URL_API_MOBILE+'settings.rest.php?type=get_tipm_settings', { crossdomain: true })
      .then(function (response) {
        console.log(response);
        store.commit('SET_PRODUCTS_W_CORE_REFUND', response.data[0].products_with_core_refund.split(','));
        store.commit('SET_PRODUCTS_W_4x4', response.data[0].products_with_4x4.split(','));
        store.commit('SET_PRODUCTS_WOUT_LID_OPTIONS', response.data[0].products_without_lid_options.split(','));
      }.bind(this));
    },
    getProductVariations: function (productId, source) {
      this.isVariationsLoading = true;
      var site = null;
      if (source == 'TIPM') {
        site = SettingsConstants.TIPMSITE;
      } else {
        site = SettingsConstants.ECMSITE;
      }
      axios.get(SettingsConstants.BASE_URL + 'productREST.php?op=get_product_variation_byid&site='+site+'&product_id='+productId, { crossdomain: true })
        .then(function (response) {
          if (response.data) {
            this.isVariationsLoading = false;
            this.productVariations = response.data;
            this.productVariations.forEach(function (variation) {
              if (variation.attributes.length) {
                variation.title = variation.attributes[0].option;
                variation.name = variation.attributes[0].name;
                this.productVariationName = variation.attributes[0].name;
              }
            }.bind(this));
          }
        }.bind(this));
    }
  },
  mounted () {
    this.emitter.on('isShowRequiredFieldsModal', function (product) {
      if ((product.variations.length == 0) && product.isNonECMTIPM) {
        this.addToCart(product.id, product.source, new Object());
      } else {
        this.toggleRequiredFieldsModal(product);
      }
    }.bind(this));
    this.emitter.on('showFullScreenLoader', function (show) {
      this.showFullScreenLoader = show;
    }.bind(this));
    this.getAllProductsWithCoreRefundProgram();
    //check if online or offline
    
  },
  created () {
    // window.addEventListener('online', function (event) {
    //   this.onLine = true;
    //   console.log(event);
    // }.bind(this));
    // window.addEventListener('offline', function (event) {
    //   this.onLine = false;
    //   console.log(event);
    // }.bind(this));

    Network.addListener('networkStatusChange', status => {
      console.log('Network status changed', status);
      this.onLine = status.connected;
    });

    // const logCurrentNetworkStatus = async () => {
    //   const status = await Network.getStatus();

    //   console.log('Network status:', status);
    // };
  }
});
</script>

<style scoped>
.header-class {
  font-size: 17px; color: #3A7CA5;
}

.link-color-ecm {
  color: #3A7CA5;
}

.header-class-tipm {
  font-size: 17px; color: #487436
}
</style>
<template>
  <ion-page>
    <ion-header v-if="!onlineStatus">
      <ion-toolbar>
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

      <section v-if="selectedProduct.id">
        <div class="position-relative">
          <span class="text-center position-absolute out-of-stock-banner" v-if="isOutofStock">
            <img src="../../resources/OutOfStock.png" />
          </span>
          <span v-if="isOnSale">
            <img src="../../resources/sale.png" class="position-absolute top--5 end--5" style="z-index: 1000; height: 100px;"/>
          </span>
          <ion-slides pager="true" class="bg-white position-relative">
              <ion-slide v-for="img in selectedProduct.images" :key="img.id">
                <img :src="img.src" style="height: 230px;" :class="isOutofStock?'opacity mb-5':'mb-5'"/>
              </ion-slide>
          </ion-slides>
        </div>
        <div class="p-4 pb-1" id="product-details">
          <div>
            <ion-chip :class="selectedProduct.badge">
                <ion-label color="light">{{selectedProduct.name.split(' ')[0].replace('_',' ')}}</ion-label>
            </ion-chip>

            <ion-chip class="bg-white float-end" @click="seeAllReviews()">
                <ion-icon :icon="star" color="warning"></ion-icon>
                <ion-label color="dark">{{productRatings}}</ion-label>
            </ion-chip>
          </div>
          <h5 class="mb-0">{{cleanString(selectedProduct.name_title)}}</h5>
          <p class="text-muted" style="font-size: 15px">
            {{cleanPartNumber(selectedProduct.name_subtitle)}}
          </p>

          <div class="alert alert-warning" role="alert" v-if="selectedProduct.stock_quantity && selectedProduct.stock_quantity < 5">
            Availability: <span>Only {{selectedProduct.stock_quantity}} left in stock</span>
          </div>

          <p class="affirm-as-low-as" data-page-type="product"
          :data-amount="productPrice.toString().replace('.','')"
          style="font-size:11px" v-if="!isOutofStock && productPrice"></p>

          <p v-html="selectedProduct.short_description" style="font-size: 15px" class="text-muted fst-italic">
          </p>
        </div>



        <ion-accordion-group :multiple="true" :value="['information','reviews']" ref="accordionGroup">
            <!-- <ion-accordion value="fields" class="bg-default" id="requiredFields" v-if="isRequiredFieldsVisible">
              <ion-item slot="header" color="light">
                <ion-label>Required Fields / Options</ion-label>
              </ion-item>
              <div class="ion-padding bg-white p-4" slot="content">

                <div v-if="isVariationLoading" class="d-flex justify-content-center align-items-center h-100">
                  <dot-loader :loading="isVariationLoading" :color="color" :size="size" class="mt-3 mb-3"></dot-loader>
                </div>
                <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="selectedProduct.variations.length">
                  <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="variation-items">
                    <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                      <h4 :class="'fw-bold mb-2 header-class-'+(selectedProduct.source == 'TIPM' ? 'tipm' : '')">{{productVariationName}} <span class="text-danger">*</span></h4>
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

                <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="selectedProduct.source == 'ECM' && !selectedProduct.isNonECMTIPM">
                  <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="vinNumber">
                    <ion-label position="stacked" color="text-dark">
                      <h4 class="fw-bold mb-2 header-class">17-Digit VIN <span class="text-danger">*</span></h4>
                      Your VIN# is needed for us to program the unit.
                    </ion-label>
                    <ion-input :type="'text'" class="mt-2 text-uppercase bg-light" v-model="vinInput" maxlength="17" placeholder="VIN Nunber" required></ion-input>
                  </ion-item>
                  <div>
                    <div v-if="isVinMatchingLoading" class="d-flex justify-content-center align-items-center h-100">
                      <dot-loader :loading="isVinMatchingLoading" :color="color" :size="size" class="mt-5"></dot-loader>
                    </div>
                    <div :class="'alert alert-'+(vinMatchingResult ? 'success' : 'danger')+' mt-2'" role="alert" v-if="showVinMatchingResult">
                      Your Vehicle: <br/>{{vehicleNameVinResult}}<br/>
                      <b>Your vehicle <span v-if="!vinMatchingResult">might not</span> matched this {{this.selectedProduct.source}}!</b>
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
                      If you plan to be driving this vehicle, leave blank and we will contact you before shipment or Call Us with Questions.
                    </ion-label>
                    <ion-input class="mt-2 bg-light" type="number" placeholder="Current Mileage" v-model="vehicleCurrentMileage"></ion-input>
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
                      See our <b>Warranty Information & Returns Policy</b> for more information.
                    </ion-label>
                  </ion-item>
                </ion-list>

                <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="selectedProduct.source == 'TIPM' && !selectedProduct.isNonECMTIPM">
                  <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                    <ion-label position="stacked" color="text-dark">
                      <h4 class="fw-bold mb-2 header-class-tipm">Verify VIN (Optional)</h4>
                    </ion-label>
                    <ion-input type="text" class="mt-2 text-uppercase bg-light" v-model="vinInput" maxlength="17" placeholder="VIN Nunber"></ion-input>
                  </ion-item>
                  <div>
                    <div v-if="isVinMatchingLoading" class="d-flex justify-content-center align-items-center h-100">
                      <dot-loader :loading="isVinMatchingLoading" :color="color" :size="size" class="mt-5"></dot-loader>
                    </div>
                    <div :class="'alert alert-'+(vinMatchingResult ? 'success' : 'danger')+' mt-2'" role="alert" v-if="showVinMatchingResult">
                      Your Vehicle: <br/>{{vehicleNameVinResult}}<br/>
                      <b>Your vehicle <span v-if="!vinMatchingResult">might not</span> matched this {{this.selectedProduct.source}}!</b>
                    </div>
                    <div class="alert alert-danger mt-2" role="alert" v-if="showifVinisInvalid">
                      <b>You entered an invalid VIN number</b>
                      <p v-html="vinErrorMessage"></p>
                    </div>
                  </div>
                  <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="4x4checker">
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
                  <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" v-if="!selectedProduct.isNew">
                    <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                      <h4 class="fw-bold mb-2 header-class-tipm">Lid Options <span class="text-danger">*</span></h4>
                      TIPM lids are not included in the price. The majority of TIPMs we rebuild come to us with missing or broken lids.
                      Re-using your old lid will help us and the environment. You may request a lid for a $15.00 surcharge.<br/><br/>
                      Re-using your old lid will not lower the value of your old TIPM under our Core Buyback Program.
                    </ion-label>
                    <ion-radio-group class="w-100" v-model="vehicleLidOptions">
                      <ion-item>
                        <ion-label>Include a Lid <b class="ms-2">$15.00</b></ion-label>
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
                      See our <b>Warranty Information & Returns Policy</b> for more information.
                    </ion-label>
                  </ion-item>
                  <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" v-if="productsWithCoreRefund.includes(productID)">
                    <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
                      <h4 class="fw-bold mb-2 header-class-tipm">Core Refund Program</h4>
                      Use slider to set your own core fee and get double your money back!
                    </ion-label>
                  </ion-item>
                  <span v-if="productsWithCoreRefund.includes(productID)">
                    <ion-range :min="0" :max="75" v-model="vehicleCoreFee">
                        <ion-label slot="end">Core Fee: $ {{parseInt(vehicleCoreFee)}}.00</ion-label>
                    </ion-range>
                    <span>You get back <b>${{parseInt(vehicleCoreFee)*2}}.00</b> when you send in your old core under our <b class="color-primary">Core Buyback Program</b>.</span>
                  </span>
                </ion-list>

              </div>
            </ion-accordion> -->
            <ion-accordion value="description" class="bg-default">
              <ion-item slot="header" color="light">
                <ion-label>Description</ion-label>
              </ion-item>
              <div class="ion-padding bg-white" slot="content" v-html="productDescription">
              </div>
            </ion-accordion>
            <ion-accordion value="information">
              <ion-item slot="header" color="light">
                <ion-label>Additional Information</ion-label>
              </ion-item>
              <div class="ion-padding" slot="content">
                <ion-list>
                  <ion-item>
                    <ion-label><b>Stock Status</b>: {{selectedProduct.stock_status}}</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label><b>Weight</b>: {{selectedProduct.weight}} lbs</ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label><b>Dimentions</b>: {{selectedProduct.dimensions.length}} x {{selectedProduct.dimensions.width}} x {{selectedProduct.dimensions.height}} in </ion-label>
                  </ion-item>
                  <ion-item v-if="selectedProduct.source == 'ECM'">
                    <ion-label class="ion-text-wrap"><b>Hardware Code</b>: {{hardwareCodes}} </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label><b>Total Sales</b>: {{selectedProduct.total_sales}}</ion-label>
                  </ion-item>
                </ion-list>
              </div>
            </ion-accordion>
            <ion-accordion value="reviews" style="font-size: 15px;">
              <ion-item slot="header" color="light">
                <ion-label class="position-relative">Reviews</ion-label>
                <ion-badge slot="start" :color="defaultColor" class="me-2" v-if="shopperapprovedDetails.total_reviews">{{shopperapprovedDetails.total_reviews}}</ion-badge>
              </ion-item>
              <div class="ion-padding pb-0" slot="content">
                <span v-if="shopperapprovedDetails.total_reviews == 0 || productRatings == '0 reviews'" class="fst-italic">
                We're currently collecting product reviews for this item.
                In the meantime, here are some reviews from our past customers sharing their overall shopping experience.
                </span>
                <ion-list lines="none">
                  <span v-for="review in productReviews" :key="review.review_id">
                    <section v-if="review.review_id">
                      <ion-item class="ion-no-padding" style="--inner-padding-end:0; --background: #fff">
                        <ion-avatar slot="start">
                          <img src="../../resources/user.png" />
                        </ion-avatar>
                        <ion-label class="ion-text-wrap">
                          <span class="float-end mt-4 text-muted2" style="font-size: 12px"> {{formatDate(review.date ? review.date : review.review_date)}}</span>
                          <h2>{{review.display_name}}</h2>
                          <span>
                            <h3 v-html="getStars(review.rating ? review.rating : review.overall)" class="float-start me-2"></h3>
                            <b style="font-size: 14px">{{review.rating ? review.rating : review.overall}}.0</b>
                          </span>
                        </ion-label>
                      </ion-item>
                      <div>
                        <p style="font-size: 14px">{{review.comments}}</p>
                      </div>
                      <section class="row" v-viewer="options">
                        <div class="col-4 mb-2 p-1" v-for="img in review.images" :key="img.mediaURL+img.mime">
                          <img :src="img.mediaURL+img.mime" />
                        </div>
                      </section>
                      <hr style="background-color: #aaa" />
                    </section>
                  </span>
                </ion-list>
              </div>

            </ion-accordion>
            <p class="ion-text-wrap text-center mb-3" @click="seeAllReviews()" :style="'color: '+this.color">
              All <span v-if="shopperapprovedDetails.total_reviews == 0 || productRatings == '0 reviews'">Site </span>Reviews
              <ion-icon :icon="openOutline" class="ms-1" :color="defaultColor"></ion-icon>
            </p>
        </ion-accordion-group>

        <div class="bg-default" style="height:130px"></div>
      </section>

      <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
        <dot-loader :loading="isLoading" :color="color" :size="size" class="mt-5"></dot-loader>
      </div>

      <ion-fab horizontal="start" vertical="top" slot="fixed" mode="ios" >
        <ion-fab-button color="light" :href="productBackRoute">
          <ion-icon :icon="arrowBackOutline" :style="'color:'+this.color" ></ion-icon>
        </ion-fab-button>
      </ion-fab>


      <ion-modal
        ref="waitlistModal"
        :is-open="isWaitlistModalOpen"
        :breakpoints="[0.0, 0.7, 0.95]"
        :initialBreakpoint="0.7"
        @didDismiss="toggleWaitlistModal()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()" :color="defaultColor">Cancel</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()" :disabled="!waitListEmail || !validateEmail(waitListEmail)" :color="defaultColor">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <img :src="waitListBanner" style="height: 80px"/>
          <div class="pt-3">
            <p class="ms-3 me-3">Join the waitlist to be emailed when this product becomes available</p>
            <ion-item lines="none">
              <ion-label position="stacked">Email Address <span class="text-danger">*</span>
                </ion-label>
              <ion-input ref="input" type="email" placeholder="Email Address" v-model="waitListEmail" class="mt-3 input-modif bg-light"></ion-input>
            </ion-item>
            <div class="alert alert-danger m-3" role="alert" v-if="!validateEmail(waitListEmail) && waitListEmail">
              Invalid Email Address!
            </div>
          </div>
        </ion-content>
      </ion-modal>

    </ion-content>

    <div slot="bottom" class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0;">
      <section class="row w-100">
        <div class="col-6 d-flex align-items-center">
          <h1 :class="isOnSale ? 'fw-bold w-100 m-0': 'fw-bold w-100 m-0 text-center'" style="line-height: 1">
            <span class="original-price text-danger w-100 text-start" v-if="isOnSale">
            $ {{selectedProduct.regular_price}}<br/></span>
            $ {{productPrice}}
          </h1>
        </div>
        <div class="col-6 p-0">

          <ion-button class="w-100"
          style="height: 6vh"
          :color="selectedProduct.badge.includes('ecm') ? 'tertiary' : ''"
          :disabled="isOutofStock" v-if="!isOutofStock"
          @click="showRequiredFieldsModal(selectedProduct)">
            <ion-icon :icon="cartOutline" class="me-2"></ion-icon>
            Add to cart
          </ion-button>

          <ion-button class="w-100"
          style="height: 6vh"
          color="danger"
          v-if="isOutofStock" @click="waitListButtonClicked()">
            <ion-icon :icon="enterOutline" class="me-2"></ion-icon>
            Join Waitlist
            <dot-loader :loading="isAddingToWaitlistLoading" :color="color" :size="30" class="ms-4"></dot-loader>
          </ion-button>
        </div>
      </section>
    </div>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { IonSlide, IonSlides, IonButton, IonAccordion,
    IonAccordionGroup,
    //IonBackButton,
    IonItem, IonRefresher, IonRefresherContent,
    IonLabel, IonList, IonBadge,
    IonFab, IonFabButton,
    IonModal, IonHeader, IonToolbar, IonButtons, 
    IonInput, modalController,
    //alertController
} from '@ionic/vue'
import {
  starOutline, star, chevronBackOutline,
  heartOutline, cartOutline, enterOutline,
  openOutline, arrowBackOutline
} from 'ionicons/icons'
import { mapState } from 'vuex'
import $ from "jquery";
import SettingsConstants from '../constants/settings.constants'
import axios from 'axios'
import { loadScript, unloadScript } from "vue-plugin-load-script"
import Mixin from '../mixins/global.mixin'
import store from '../store'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'ProductDetails',
  mixins: [Mixin],
  components: {
    IonSlide, IonSlides, IonButton,
    IonAccordion,
    IonAccordionGroup,
    IonItem, IonFab, IonFabButton,
    IonLabel, IonList, IonBadge,
    IonRefresher, IonRefresherContent,
    IonModal, IonHeader, IonToolbar, IonButtons, 
    IonInput,
    //IonBackButton,
    DotLoader
  },
  computed: mapState([
    'sessionDataTIPM',
    'sessionDataECM',
    'selectedProduct',
    'shopperApprovedData',
    'productBackRoute',
    'productsWithCoreRefund',
    'onlineStatus'
  ]),
  data() {
    return {
      productID: null,
      site: null,
      sessionData: null,
      productOrigin: null,
      shopperapprovedStoreID: null,
      shopperapprovedToken: null,
      shopperapprovedDetails: [],
      productRatings: null,
      productPrice: null,
      productDescription: null,
      defaultColor: null,
      productReviews: [],
      isOutofStock: false,
      isOnSale: false,
      lastPath: null,
      isLoading: false,
      isWaitlistModalOpen: false,
      waitListEmail: null,
      waitListBanner: null,
      isAddingToWaitlistLoading: false,
      options: {
        button: false,
        navbar: true,
        title: false,
        toolbar: false,
        tooltip: false,
        movable: false,
        zoomable: true,
        rotatable: false,
        scalable: false,
        transition: true,
        fullscreen: false,
        keyboard: false,
      },
      color: null,
      // ninthDigitVinError: false,
      // vinInput: null,
      // showVinMatchingResult: false,
      // vehicleNameVinResult: null,
      // vehicleCurrentMileage: null,
      // vehicleTransmissionType: null,
      // vinMatchingResult: false,
      // isVinMatchingLoading: false,
      // isVariationLoading: false,
      // hardwareCodes: null,
      // vehicleLidOptions: null,
      // lidOptionsPrice: 0,
      // coreFeePrice: 0,
      // productOptionsTotalPrice: 0,
      // vehicle4by4Check: null,
      // vehicleCoreFee: 0,
      // vehiclePlugsNeeded: null,
      // vehicleFCMPartNumber: null,
      // addPriceifLidIncluded: 0,
      // defaultCoreFee: 0,
      // defaultOpen: [],
      // vinErrorMessage: null,
      // showifVinisInvalid: false,
      // isVariationRequired: true,
      // productVariationName: null,
      // isRequiredFieldsVisible: false,
      // productVariations: [],
    }
  },
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    // const accordionGroup = ref(null);
    // const toggleAccordion = function () {
    //   if (!accordionGroup.value) {
    //     return;
    //   }
    //   const nativeEl = accordionGroup.value.$el;
    //   if (!nativeEl.value.includes('fields')) {
    //     nativeEl.value = undefined;
    //     nativeEl.value = ['fields'];
    //   }

    // };
    return {
      doRefresh, arrowBackOutline,
      //accordionGroup, toggleAccordion,
      starOutline, star, chevronBackOutline,
      heartOutline, cartOutline, enterOutline,
      openOutline
    }
  },
  watch: {
    productOrigin: function (newVal) {
      if (newVal.toLowerCase() == 'ecm') {
        this.color = '#348CA6';
      } else {
        this.color = '#568E3E';
      }
    },
    // vinInput: function (newVal) {
    //   if (newVal.length == 17) {
    //     if (this.validateVin(newVal)) {
    //       this.showifVinisInvalid = false;
    //       this.getVinDetails(newVal);
    //     } else {
    //       this.showifVinisInvalid = true;
    //       this.vinErrorMessage = 'Double check your VIN or <a target="_blank" href="https://vpic.nhtsa.dot.gov/decoder/CheckDigit/Index/'+newVal+'" class="text-decoration-none">Click here</a> for more details';
    //     }
    //   } else {
    //     this.showVinMatchingResult = false,
    //     this.vehicleNameVinResult = null,
    //     this.vinMatchingResult = false,
    //     this.isVinMatchingLoading = false;
    //     this.showifVinisInvalid = false;
    //   }
    // },
    // vehicleLidOptions: function (newVal) {
    //   var price = this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00';
    //   if (newVal == 'Include a Lid_0') {
    //     this.lidOptionsPrice = this.addPriceifLidIncluded;
    //   } else {
    //     this.lidOptionsPrice = 0;
    //   }
    //   this.productPrice = this.computePriceAddToCart(price);
    // },
    // vehicleCoreFee: function (newVal) {
    //   var price = this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00';
    //   this.coreFeePrice  = parseInt(newVal);
    //   this.productPrice = this.computePriceAddToCart(price);
    // },
    // vehiclePlugsNeeded: function () {
    //   this.isVariationRequired = false;
    // },
    // vehicleFCMPartNumber: function () {
    //   this.isVariationRequired = false;
    // }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    changePaginationBulletColors: function () {
      if (this.selectedProduct.badge.includes('ecm')) {
        $('.swiper-pagination .swiper-pagination-bullet').css('background', '#3A7CA5');
      }
    },
    getProductRatings: function () {
      axios.get(SettingsConstants.SA_PRODUCT_RATINGS +'/'+this.shopperapprovedStoreID +'/'+this.productID+this.shopperapprovedToken, { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              this.shopperapprovedDetails = response.data.product_totals;
              if (this.shopperapprovedDetails.average_rating == '0') {
                this.productRatings = '0 reviews';
                this.getSiteReviews();
              } else {
                this.productRatings = parseFloat(this.shopperapprovedDetails.average_rating).toFixed(1);
              }
            }
          }.bind(this))
          .catch( function () {
            this.productRatings = '0 reviews';
            this.getSiteReviews();
          }.bind(this));
    },
    getProductReviews: function () {
      axios.get(SettingsConstants.SA_PRODUCT_REVIEWS +'/'+this.shopperapprovedStoreID +'/'+this.productID+this.shopperapprovedToken+'&limit=4', { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              this.productReviews = response.data;
            }
          }.bind(this));
    },
    getSiteReviews: function () {
      axios.get(SettingsConstants.SA_SITE_REVIEWS +'/'+this.shopperapprovedStoreID +'/'+this.shopperapprovedToken+'&limit=4', { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              this.productReviews = response.data;
            }
          }.bind(this));
    },
    updateWarantyImage: function (description) {
      var newdesc = description.replace('2018/10/1YearWarranty-150x150.png"','2022/07/1YearWarranty-150x150-no-bg.png" style="float:right"');
      return newdesc;
    },
    initProduct: function () {
      this.productID = this.selectedProduct.id.toString();
      this.isOnSale = this.selectedProduct.on_sale;
      this.isOutofStock = (this.selectedProduct.stock_status == 'outofstock') ? true: false;
      
      this.productPrice = this.formatRegularPrice(this.selectedProduct.price);
      this.productDescription = this.updateWarantyImage(this.selectedProduct.description);

      if (this.selectedProduct.source == 'ECM') {
        //loadScript("/js/affirm.ecm.js");
        this.productOrigin = 'ECM';
        this.shopperapprovedStoreID = SettingsConstants.SA_ECM_ID;
        this.shopperapprovedToken = SettingsConstants.SA_ECM_TOKEN;
        this.defaultColor = 'tertiary';
      } else {
        //loadScript("/js/affirm.tipm.js");
        this.productOrigin = 'TIPM';
        this.shopperapprovedStoreID = SettingsConstants.SA_TIPM_ID;
        this.shopperapprovedToken = SettingsConstants.SA_TIPM_TOKEN;
        this.defaultColor = 'primary';
      }


      this.getProductRatings();
      this.getProductReviews();
      // if (this.selectedProduct.variations.length) {
      //   this.getProductVariations(this.selectedProduct.id);
      // }
      // if ((this.selectedProduct.variations.length == 0) && this.selectedProduct.isNonECMTIPM) {
      //   this.isVariationRequired = false;
      // }
      // if (this.selectedProduct.variations.length || !this.selectedProduct.isNonECMTIPM) {
      //   this.isRequiredFieldsVisible = true;
      // }
      
      setTimeout(() => {
        this.changePaginationBulletColors();
      }, 400);
    },
    getProductDetails: function (productId, site) {
      this.isLoading = true;
      axios.get(SettingsConstants.BASE_URL + 'productREST.php?op=get_details&site='+site+'&product_id='+productId, { crossdomain: true })
        .then(function (response) {
          var prod = response.data;
          prod.name = prod.name.replace('LIKE NEW', 'LIKE_NEW');
          prod.name_title = '';
          prod.name_subtitle = '';
          name = null;
          var name = null;
          if (prod.tags.find(tag => tag.name == 'TIPM')) {
            prod.badge = 'tipm-badge';
            name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
            prod.name_title = name.split('- Part')[0];
            prod.name_subtitle = '- Part' + name.split('- Part')[1];
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
          this.isLoading = false;
          store.commit('RESET_SELECTED_PRODUCT');
          store.commit('SET_SELECTED_PRODUCT', prod);
          this.initProduct();
        }.bind(this));
    },
    seeAllReviews: function () {
      var data = new Object();
      data.storeID = this.shopperapprovedStoreID;
      data.token = this.shopperapprovedToken;
      data.productID = this.productID;
      data.details = this.shopperapprovedDetails;
      store.commit('SET_SA_DATA', data);
      if (this.shopperApprovedData) {
        this.$router.push('/reviews');
      }
    },
    getHardwareCodes: function () {
      var hardwareCode = this.selectedProduct.attributes.filter((hc) => hc.name == 'Hardware Code');
      if (hardwareCode.length) {
        this.hardwareCodes = hardwareCode[0].options.join();
      }
    },
    showRequiredFieldsModal: function (product) {
      this.emitter.emit('isShowRequiredFieldsModal', product);
    },
    waitListButtonClicked: function () {
      if (this.sessionData) {
        this.checkIfUserIsAlreadyInWaitlist(this.sessionData);
      } else {
        this.toggleWaitlistModal();
      }
    },
    cancel() {
      this.$refs.waitlistModal.$el.dismiss(null, 'cancel');
    },
    confirm() {
      const email = this.$refs.input.$el.value;
      if (email) {
        this.$refs.waitlistModal.$el.dismiss(email, 'confirm');
        this.checkifEmailExist(email);
        //console.log(email);
      }
    },
    checkifEmailExist: function (email) {
      this.isAddingToWaitlistLoading = true;
      axios.get(SettingsConstants.BASE_URL + 'customerREST.php?site='+this.site+'&op=get_customer_by_email&email='+email, { crossdomain: true })
        .then(function (response) {
          if (response.data.length) {
            response.data.forEach(function (cust){
              cust._yoast_wpseo_profile_updated = cust.meta_data.filter((met) => met.key == '_yoast_wpseo_profile_updated')[0].value;
            });
            this.checkIfUserIsAlreadyInWaitlist(response.data[0]);
            // store.commit('SET_SESSION_DATA', response.data[0]);
            if (this.selectedProduct.source == 'ECM') {
              store.commit('SET_SESSION_DATA_ECM', response.data[0]);
            } else {
              store.commit('SET_SESSION_DATA_TIPM', response.data[0]);
            }
            this.sessionData = response.data[0];
          } else {
            this.checkIfUserIsAdmin(email);
          }
        }.bind(this));
    },
    checkIfUserIsAdmin: function (email) {
      var url = null;
      var request_url = 'rest/users.php?type=get_user_by_email&email=';
      if (this.selectedProduct.source == 'ECM') {
        url = SettingsConstants.ECMURL + request_url + email;
      } else {
        url = SettingsConstants.TIPMURL + request_url + email;
      }
      axios.get(url, { crossdomain: true })
        .then(function (response) {
          if (!response.data) {
            this.createCustomerAccount(email, null, this.color, false);
          }
        }.bind(this));
    },
    createCustomerAccount: function (email, password, color, showAlert) {
        var bodyFormData = new FormData();
        bodyFormData.append('email', email);
        if (password) {
            bodyFormData.append('password', password);
        } else {
            bodyFormData.append('password', '');
        }
        axios({
            method: "post",
            url: SettingsConstants.BASE_URL + "customerREST.php?op=create_customer&site="+SettingsConstants.TIPMSITE,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then(function (response) {
        if (response.data) {
            if (showAlert) {
                Swal.fire({
                    title: 'Great!',
                    text: 'Account created!',
                    icon:'success',
                    confirmButtonColor: color,
                });
            }
            response.data._yoast_wpseo_profile_updated = response.data.meta_data.filter((met) => met.key == '_yoast_wpseo_profile_updated')[0].value;
            // store.commit('SET_SESSION_DATA', response.data);
            if (this.selectedProduct.source == 'ECM') {
              store.commit('SET_SESSION_DATA_ECM', response.data);
            } else {
              store.commit('SET_SESSION_DATA_TIPM', response.data);
            }
            this.sessionData = response.data[0];
            this.addUserToWaitlistTEST();
        }
        }.bind(this));
    },
    checkIfUserIsAlreadyInWaitlist: function (user) {
      this.isAddingToWaitlistLoading = true;
      var exist = false;
      this.selectedProduct.meta_data.forEach(function (key){
        if (key.key == "woocommerce_waitlist"){
          //exist = key.value.filter((waitlist) => (waitlist[user.id]) == user._yoast_wpseo_profile_updated);
          exist = key.value[user.id]; 
        }
      }.bind(this));

      if (exist) {
        Swal.fire({
          title: 'Already on waitlist!',
          text: 'Your email is already on the waitlist for this product.',
          icon:'success',
          confirmButtonColor: this.color,
        });
        this.isAddingToWaitlistLoading = false;
      } else {
        this.addUserToWaitlistTEST();
      }
    },
    addUserToWaitlistTEST: function () {
      this.selectedProduct.meta_data.forEach(function (key){
        if (key.key == "woocommerce_waitlist"){
            key.value[this.sessionData.id] = parseInt(this.sessionData._yoast_wpseo_profile_updated);
        }
      }.bind(this));
      var bodyFormData = new FormData();
      bodyFormData.append('new_meta_data', JSON.stringify(this.selectedProduct.meta_data));
      axios({
          method: "post",
          url: SettingsConstants.BASE_URL + 'productREST.php?op=update_product_waitlist&site='+this.site+'&id='+this.productID,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
      })
          .then(function (response) {
            if (response.data) {
              //console.log('Success!');
              //console.log(JSON.stringify(response.data));
              Swal.fire({
                title: 'Great!',
                text: 'Email has been added to waitlist',
                icon:'success',
                confirmButtonColor: this.color,
              });
              this.isAddingToWaitlistLoading = false;
            } else {
              console.log('FAILED');
            }
          }.bind(this));
    },
    toggleWaitlistModal: function () {
      this.isWaitlistModalOpen = !this.isWaitlistModalOpen;
    },
    // getAllProductsWithCoreRefundProgram: function () {
    //   if (this.productsWithCoreRefund.includes(this.productID)) {
    //     this.coreFeePrice = this.defaultCoreFee;
    //     this.vehicleCoreFee = this.defaultCoreFee;
    //   }
    // },
    // addProductToCart: function () {
    //   var cart_data = new Object();
    //   var productID = null;
    //   if (this.vehiclePlugsNeeded || this.vehicleFCMPartNumber) {
    //     (this.vehiclePlugsNeeded ? productID = this.vehiclePlugsNeeded.id : productID = this.vehicleFCMPartNumber.id);
    //   } else {
    //     productID = this.productID;
    //   }
    //   if (!this.isVariationRequired) {
    //     this.addToCart(productID, this.productOrigin, cart_data);
    //   } else {
    //     switch (this.productOrigin) {
    //       case 'ECM':
    //         if (this.vinInput && (this.vinInput.length == 17) && this.vinMatchingResult) {
    //           cart_data = {
    //             'Enter_Your_17_digit_VIN': this.vinInput,
    //             'This_Vehicle' : this.vehicleNameVinResult,
    //             'Transmission_Type': this.vehicleTransmissionType,
    //             'Current_Mileage' : this.vehicleCurrentMileage,
    //             'FxF_Check': this.vehicle4by4Check,
    //             'Lid_Options': this.vehicleLidOptions
    //           }
    //         }
    //         break;
    //       case 'TIPM':
    //         var logic = this.selectedProduct.isNew ? (this.vehicle4by4Check) : (this.vehicle4by4Check && this.vehicleLidOptions); 
    //         if (logic) {
    //           cart_data = {
    //             'Enter_Your_17_digit_VIN': this.vinInput,
    //             'This_Vehicle' : this.vehicleNameVinResult,
    //             'FxF_Check': this.vehicle4by4Check,
    //             'Lid_Options': this.vehicleLidOptions,
    //             'Core_Fee': this.vehicleCoreFee
    //           }
    //         }
    //         break;
    //     }
    //     if (!Object.keys(cart_data).length == 0) {
    //       this.addToCart(productID, this.productOrigin, JSON.stringify(cart_data));
    //     } else {
    //       this.presentAlert();
    //     }
    //   }
    // },
    // getProductVariations: function (productId) {
    //   this.isVariationLoading = true;
    //   //var url = this.selectedProduct.permalink.split('.com/')[0]+'.com/wp-json/wc/v3/products/'+productId+'/variations';
    //   axios.get(SettingsConstants.BASE_URL + 'productREST.php?op=get_product_variation_byid&site='+this.site+'&product_id='+productId, { crossdomain: true })
    //     .then(function (response) {
    //       if (response.data) {
    //         this.isVariationLoading = false;
    //         this.productVariations = response.data;
    //         this.productVariations.forEach(function (variation) {
    //           variation.title = variation.attributes[0].option;
    //           variation.name = variation.attributes[0].name;
    //           this.productVariationName = variation.attributes[0].name;
    //         }.bind(this));
    //       }
    //     }.bind(this));
    // },
    // getVinDetails: function (vin) {
    //   this.isVinMatchingLoading = true;
    //   this.showVinMatchingResult = false;
    //   axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/'+vin+'?format=json', { crossdomain: true })
    //   .then(function (response) {
    //     if (response.data) {
    //       var trim = ``;
    //       var possibleSlugvalues = [];
    //       var year = response.data.Results.filter(function (vin) { return vin.Variable == 'Model Year'})[0].Value;
    //       if (year) {
    //         var make = response.data.Results.filter(function (vin) { return vin.Variable == 'Make'})[0].Value.toLowerCase();
    //         var model = response.data.Results.filter(function (vin) { return vin.Variable == 'Model'})[0].Value.replace(' and ',' ').toLowerCase();
    //         var engine = response.data.Results.filter(function (vin) { return vin.Variable == 'Displacement (L)'})[0].Value;
    //         if (engine == '5.9' && make.toLowerCase() == 'dodge') {
    //           model = model + ' 2500';
    //         }
    //         if (!engine.includes('.')) {
    //           engine = engine+'.0L';
    //         } else {
    //           engine = engine+'L';
    //         }
    //         if (response.data.Results.filter(function (vin) { return vin.Variable == 'Trim'})[0].Value) {
    //           trim = response.data.Results.filter(function (vin) { return vin.Variable == 'Trim'})[0].Value.toLowerCase();
    //           if (model.toLowerCase() == 'ram') {
    //               switch (trim.toLowerCase()) {
    //                   case 'cargo van':
    //                       trim = 'c-v';
    //                       break;
    //                   case 'dt':
    //                       trim = '';
    //                       break;
    //                   default:
    //                       trim = trim.replace(/\D/g, '');
    //                       break;
    //               }
    //           }
    //           possibleSlugvalues.push(model+'-'+trim+'-'+make+'-'+year);
    //         }
    //         possibleSlugvalues.push(model+'-'+make+'-'+year);
    //         if (model.split(' ').length > 1) {
    //           model.split(' ').forEach( function (m){
    //               possibleSlugvalues.push(m+'-'+make+'-'+year);
    //               if (trim) {
    //                   possibleSlugvalues.push(m+'-'+trim+'-'+make+'-'+year);
    //               }
    //           })
    //         }
    //         if (model.split('/').length > 1) {
    //             possibleSlugvalues.push(model.split('/')[0].replace(/\s/g,'-')+'-'+make+'-'+year);
    //             possibleSlugvalues.push(model.split('/')[1].replace(/\s/g,'-')+'-'+make+'-'+year);
    //         }
    //         var matchCount = 0;
    //         possibleSlugvalues.forEach( function (slug, idx, array){
    //           slug = slug.replace(/\s/g,'-');
    //           this.vehicleNameVinResult = (year+` `+response.data.Results.filter(function (vin) { return vin.Variable == 'Make'})[0].Value+` `+response.data.Results.filter(function (vin) { return vin.Variable == 'Model'})[0].Value+` `+trim+` `+engine).toUpperCase();
    //           if (this.selectedProduct.source == 'ECM') {
    //             if (this.selectedProduct.categories.filter((cat) => cat.slug == slug).length && this.selectedProduct.name.includes(engine)) {
    //               matchCount++;
    //               this.vinMatchingResult = true;
    //             }
    //           } else {
    //             if (this.selectedProduct.categories.filter((cat) => cat.slug == slug).length) {
    //               matchCount++;
    //               this.vinMatchingResult = true;
    //             }
    //           }
    //           if (idx === array.length - 1 && matchCount == 0) {
    //             this.vinMatchingResult = false;
    //           }
    //           if (idx === array.length - 1) {
    //             this.showVinMatchingResult = true;
    //           }
    //           this.isVinMatchingLoading = false;
    //         }.bind(this));
    //       } else {
    //         this.isVinMatchingLoading = false;
    //       }
    //     }
    //   }.bind(this));
    // },
    // async presentAlert() {
    //   var message = null;
    //   var elementToScroll = document.getElementById("requiredFields");
    //   if (this.productOrigin == 'TIPM') {
    //     if (this.selectedProduct.isNonECMTIPM) {
    //       message = 'Some fields are required!';
    //     } else if (this.selectedProduct.isNew) {
    //       message = '<b>4x4 Check</b> is required!';
    //     }
    //     else {
    //       message = '<b>4x4 Check</b> and <b>Lid Options</b> are required!';
    //     }
    //   } else {
    //     if (this.selectedProduct.isNonECMTIPM) {
    //       message = 'Some fields are required!';
    //     } else {
    //       message = 'Your <b>VIN Number</b> is needed for us to program the unit.';
    //     }
    //   }
    //   const alert = await alertController.create({
    //     header: 'Required Fields!',
    //     message: message,
    //     buttons: [
    //       {
    //         text: 'OK',
    //         role: 'confirm',
    //         handler: () => {
    //           this.toggleAccordion();
    //           elementToScroll.scrollIntoView();
    //         },
    //       },
    //     ],
    //   });

    //   await alert.present();
    // },
  },
  mounted () {
    // this.addPriceifLidIncluded = SettingsConstants.ADDED_PRICE_OF_LID;
    // this.defaultCoreFee = SettingsConstants.ADDED_PRICE_OF_DEFAULT_COREFEE;
    if (this.selectedProduct && this.selectedProduct.source == 'ECM') {
      this.getHardwareCodes();
      this.color = '#3A7CA5';
      this.site = SettingsConstants.ECMSITE;
      this.sessionData = this.sessionDataECM;
    } else {
      //this.getAllProductsWithCoreRefundProgram();
      this.color = '#487436';
      this.site = SettingsConstants.TIPMSITE;
      this.sessionData = this.sessionDataTIPM;
    }
    if (this.selectedProduct.id) {
      this.initProduct();
    } else {
      if (this.selectedProduct.productId) {
        this.getProductDetails(this.selectedProduct.productId, this.selectedProduct.site);
      }
    }

    if (this.selectedProduct.source == 'ECM') {
      loadScript("/js/affirm.ecm.js");
      this.waitListBanner = 'http://ecmrebuilders.com/wp-content/uploads/2022/01/ecm_email_banner.png';
    } else {
      loadScript("/js/affirm.tipm.js");
      this.waitListBanner = 'https://tipmrebuilders.com/wp-content/uploads/2022/01/email_banner.png';
    }

    
    //this.defaultOpen = ;
    // if (!this.isOutofStock && this.isVariationRequired) {
    //   this.defaultOpen = ['fields', 'reviews'];
    // } else {
    //   this.defaultOpen = ['information','reviews'];
    // }
  },
  created () {
    this.lastPath = this.$router.options.history.state.back;
    if (this.lastPath) {
      store.commit('SET_PRODUCT_BACK_ROUTE', this.lastPath);
    }
  },
  beforeUnmount() {
    if (this.selectedProduct.source == 'ECM') {
      unloadScript("/js/affirm.ecm.js");
    } else {
      unloadScript("/js/affirm.tipm.js");
    }
  }
});
</script>

<style scoped>

#product-details {
  background-color: #f6f6f6;
  border-radius: 30px 30px 0 0;
  margin-top: 2px;
}

ion-accordion.bg-default, .bg-default, ion-item {
  background-color: #f6f6f6;
  font-size: 15px;
}

#product-details ion-chip.tipm-badge, #product-details ion-chip.ecm-badge {
  margin-inline: 0 !important
}

.back-button {
  top: 10px; left: 10px; z-index: 2000; height: 44px; width: 47px; border-radius: 50%;
}

.heart-button {
  top: 10px; right: 10px; z-index: 2000; height: 44px; width: 47px; border-radius: 50%;
}

ion-content {
  --ion-background-color:#fff;
}

.star-icon {
  height: 20px;
}

.out-of-stock-banner {
  z-index: 1000; position: absolute; left: 0; right: 0; top: 0px; bottom: 0; margin: auto;
  height: 100px;
}

.out-of-stock-banner img {
  height: 150px;
}

.original-price {
  font-size: 12px;
  text-decoration: line-through;
}

.header-class {
  font-size: 17px; color: #3A7CA5;
}

.header-class-tipm {
  font-size: 17px; color: #487436
}

.color-primary {
  color: #487436;
}

.color-tertiary {
  color: #3A7CA5;
}
</style>
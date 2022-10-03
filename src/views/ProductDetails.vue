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



        <ion-accordion-group :multiple="true" :value="['information','reviews']" ref="accordionGroup" @ionChange="accordionGroupChange($event)">
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
          :color="defaultColor"
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
    'sessionData',
    'selectedProduct',
    'shopperApprovedData',
    'productBackRoute',
    'productsWithCoreRefund',
    'onlineStatus'
  ]),
  data() {
    return {
      session_Data: null,
      productID: null,
      site: null,
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
    }
  },
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh, arrowBackOutline,
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
      
      setTimeout(() => {
        this.changePaginationBulletColors();
      }, 400);
    },
    getProductDetails: function (productId, site) {
      this.isLoading = true;
      axios.get(SettingsConstants.BASE_URL + 'productREST.php?op=get_details&site='+site+'&product_id='+productId, { crossdomain: true })
        .then(function (response) {
          var prod = response.data;
          if (site.includes('ecm')) {
            prod.source = 'ECM';
          } else {
            prod.source = 'TIPM';
          }
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
        this.waitListEmail = this.sessionData.email;
        //this.checkIfUserIsAlreadyInWaitlist(this.sessionData);
      }
      this.toggleWaitlistModal();
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
            // this.session_Data = response.data[0];
            store.commit('SET_SESSION_DATA', { 'email': email});
            this.checkIfUserIsAlreadyInWaitlist(response.data[0]);
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
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Unable to add an Admin account to waitlist, only customers are allowed to use this feature!',
              icon:'error',
              confirmButtonColor: this.color,
            });
            this.isAddingToWaitlistLoading = false;
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
            url: SettingsConstants.BASE_URL + "customerREST.php?op=create_customer&site="+this.site,
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
            store.commit('SET_SESSION_DATA', { 'email' : email});
            this.addUserToWaitlist(response.data);
        }
        }.bind(this));
    },
    checkIfUserIsAlreadyInWaitlist: function (user) {
      this.isAddingToWaitlistLoading = true;
      var exist = false;
      this.selectedProduct.meta_data.forEach(function (key){
        if (key.key == "woocommerce_waitlist"){
          exist = key.value[user.id]; 
        }
      }.bind(this));

      if (exist) {
        Swal.fire({
          title: 'Already on waitlist!',
          text: user.email+' is already on the waitlist for this product.',
          icon:'success',
          confirmButtonColor: this.color,
        });
        this.isAddingToWaitlistLoading = false;
      } else {
        this.addUserToWaitlist(user);
      }
    },
    addUserToWaitlist: function (user) {
      this.selectedProduct.meta_data.forEach(function (key){
        if (key.key == "woocommerce_waitlist"){
          key.value[user.id] = parseInt(user._yoast_wpseo_profile_updated);
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
    accordionGroupChange: function (event) {
      console.log(event);
      $('h2.accordion-header br').remove();
      $('.accordion-item p').remove();
    }
  },
  mounted () {
    if (this.selectedProduct && this.selectedProduct.source == 'ECM') {
      this.getHardwareCodes();
      this.color = '#3A7CA5';
      this.site = SettingsConstants.ECMSITE;
    } else {
      this.color = '#487436';
      this.site = SettingsConstants.TIPMSITE;
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
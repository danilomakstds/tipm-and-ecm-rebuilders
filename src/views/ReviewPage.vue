<template>
  <ion-page id="reviews">
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <ion-back-button :icon="arrowBackOutline" color="primary" :default-href="lastPath" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Reviews</ion-title>
      </ion-toolbar>
      <ion-toolbar v-if="!onlineStatus">
        <div class="p-3 text-white warning-message">
          <img src="../../resources/wifi-no-signal.png" style="height: 30px" class="float-start me-3"/>
          <span>You are currently offline. Please check your internet connection!</span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Cart</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div v-if="shopperApprovedData">
        <section class="text-center p-3">
          <h1 style="font-size: 35px" class="fw-bold"> {{averageRating}}</h1>
          <div class="d-flex justify-content-center" v-html="getStars(averageRating, 13)">
          </div>
          <p class="text-muted" style="font-size: 13px">
            based on {{totalReviews}} Review<span v-if="totalReviews > 1">s</span>
          </p>
          <div class="d-flex text-start">
            <div style="width: 37%; font-size: 13px;">Excellent</div>
            <div class="w-100">
              <div class="progress mb-2">
                <div class="progress-bar progress-excellent" role="progressbar" :style="'width: '+(productReviewsRated5.length/totalReviews)*100+'%'"  aria-valuemax="100"></div>
              </div>
            </div>
          </div>
          <div class="d-flex text-start">
            <div style="width: 37%; font-size: 13px;">Good</div>
            <div class="w-100">
              <div class="progress mb-2">
                <div class="progress-bar progress-good" role="progressbar" :style="'width: '+(productReviewsRated4.length/totalReviews)*100+'%'" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
          <div class="d-flex text-start">
            <div style="width: 37%; font-size: 13px;">Average</div>
            <div class="w-100">
              <div class="progress mb-2">
                <div class="progress-bar progress-average" role="progressbar" :style="'width: '+(productReviewsRated3.length/totalReviews)*100+'%'" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
          <div class="d-flex text-start">
            <div style="width: 37%; font-size: 13px;">Below Average</div>
            <div class="w-100">
              <div class="progress mb-2">
                <div class="progress-bar progress-belowaverage" role="progressbar" :style="'width: '+(productReviewsRated2.length/totalReviews)*100+'%'" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
          <div class="d-flex text-start">
            <div style="width: 37%; font-size: 13px;">Poor</div>
            <div class="w-100">
              <div class="progress mb-2">
                <div class="progress-bar progress-poor" role="progressbar" :style="'width: '+(productReviewsRated1.length/totalReviews)*100+'%'" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </section>
        <div id="review-list" class="p-3">
          <div v-if="isLoading" class="d-flex justify-content-center align-items-center h-100">
            <dot-loader :loading="isLoading" :color="color" :size="size" class="mt-5"></dot-loader>
          </div>
          <div class="ion-padding" slot="content" v-if="items.length">
            <p class="fst-italic" v-if="showMessage" style="font-size: 13px; line-height: 1.6">
                We're currently collecting product reviews for this item.
                In the meantime, here are some reviews from our past customers sharing their overall shopping experience.
            </p>

            <ion-list class="bg-white" lines="none">
              <span v-for="item in items" :key="item">
                <ion-item class="ion-no-padding" style="--inner-padding-end:0; --background: #fff">
                  <ion-avatar slot="start">
                    <img src="../../resources/user.png" />
                  </ion-avatar>
                  <ion-label class="ion-text-wrap">
                    <span class="float-end mt-4 text-muted" style="font-size: 12px"> {{formatDate(item.date ? item.date : item.review_date)}}</span>
                    <h2 style="font-size: 15px">{{item.display_name}}</h2>
                    <span>
                      <h3 v-html="getStars(item.rating ? item.rating : item.overall)" class="float-start me-2"></h3>
                      <b style="font-size: 14px">{{item.rating ? item.rating : item.overall}}.0</b>
                    </span>
                  </ion-label>
                </ion-item>
                <div>
                  <p style="font-size: 14px">{{item.comments}}</p>
                </div>
                <section class="row" v-viewer="options">
                  <div class="col-4 mb-2 p-1" v-for="img in item.images" :key="img.mediaURL+img.mime">
                    <img :src="img.mediaURL+img.mime" />
                  </div>
                </section>
                <hr style="background-color: #ddd" />
              </span>
            </ion-list>

            <ion-infinite-scroll
              @ionInfinite="loadData($event, totalReviews)" 
              threshold="100px" 
              id="infinite-scroll"
              :disabled="isDisabled"
            >
              <ion-infinite-scroll-content
                loading-spinner="bubbles"
                loading-text="Loading more data...">
              </ion-infinite-scroll-content>
            </ion-infinite-scroll>
          </div>
        </div>
      </div>


    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent, ref } from 'vue';
import {
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent,
    // IonButton,
    //IonIcon,
    IonButtons, IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
    IonBackButton
    //IonLabel
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline, star
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
import { mapState } from 'vuex'
import axios from 'axios'
import store from '../store'
import SettingsConstants from '../constants/settings.constants.js'
import DotLoader from 'vue-spinner/src/DotLoader.vue'


export default defineComponent({
  name: 'ReviewPage',
  mixins: [Mixin],
  components: {
    DotLoader,
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent,
    // IonButton,
    //IonIcon,
    IonButtons, IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll, 
    IonInfiniteScrollContent,
    IonBackButton
    //IonLabel, 
  },
  computed: mapState([
      'shopperApprovedData',
      'selectedProduct',
      'onlineStatus'
  ]),
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }

    const isDisabled = ref(false);
    const toggleInfiniteScroll = () => {
      isDisabled.value = !isDisabled.value;
    }
    
    return {
      isDisabled, toggleInfiniteScroll,
      doRefresh,
      arrowBackOutline,
      cartOutline, bagCheckOutline,
      trashOutline, star,
    }
  },
  data() {
    return {
      page: 1,
      isLoading: false,
      isProcessing: false,
      currentIndex: 0,
      averageRating: 5.0,
      totalReviews: 0,
      storeID: null,
      productID: null,
      token: null,
      productReviews: [],
      productReviewsRated1: [],
      productReviewsRated2: [],
      productReviewsRated3: [],
      productReviewsRated4: [],
      productReviewsRated5: [],
      items: [],
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
      showMessage: false
    }
  },
  methods: {
    getAllReviews: function () {
      axios.get(SettingsConstants.SA_PRODUCT_REVIEWS +'/'+this.storeID +'/'+this.productID+this.token+'&limit=2000&asArray=true', { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              this.initReviews(response.data, 'rating');
            }
          }.bind(this));
    },
    getSiteReviews: function () {
      axios.get(SettingsConstants.SA_SITE_REVIEWS +'/'+this.storeID +'/'+this.token+'&asArray=false&limit=2000', { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              this.totalReviews = response.data.total_count;
              var arr = [];
              var total = 0;
              for (const item in response.data) {
                if (response.data[item]['overall']) {
                  arr.push(response.data[item]);
                  total = total + response.data[item]['overall'];
                  if (response.data[item]['images']) {
                    console.log('with images');
                  }
                }
              }
              this.averageRating = Math.round((total/this.totalReviews) * 10) / 10;
              this.initReviews(arr, 'overall');
            }
          }.bind(this));
    },
    initReviews: function (data, type) {
      this.productReviews = data;
      this.productReviewsRated5 = data.filter(rev => rev[type] == 5);
      this.productReviewsRated4 = data.filter(rev => rev[type] == 4);
      this.productReviewsRated3 = data.filter(rev => rev[type] == 3);
      this.productReviewsRated2 = data.filter(rev => rev[type] == 2);
      this.productReviewsRated1 = data.filter(rev => rev[type] == 1);
      this.pushData();
      this.isLoading = false;
    },
    pushData: function () {
      const max = this.items.length + 20;
      const min = max - 20;
      for (let i = min; i < max; i++) {
        if (this.productReviews[i]) {
          this.items.push(this.productReviews[i]);
        }
      }
    },
    loadData: function (ev, total) {
      setTimeout(function () {
        this.pushData();
        console.log('Loaded data');
        ev.target.complete();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.items.length >= total) {
          ev.target.disabled = true;
        }
      }.bind(this), 500);
    }
  },
  mounted () {
    this.totalReviews = this.shopperApprovedData.details.total_reviews;
    this.storeID = this.shopperApprovedData.storeID;
    this.productID = this.shopperApprovedData.productID;
    this.token = this.shopperApprovedData.token;
    this.isLoading = true;
    if (this.shopperApprovedData.details.average_rating == '0' || !this.shopperApprovedData.details.length) {
      this.averageRating = 0;
      this.showMessage = true;
      this.getSiteReviews();
    } else {
      this.getAllReviews();
      this.showMessage = false;
      this.averageRating = parseFloat(this.shopperApprovedData.details.average_rating).toFixed(1);
    }
    store.commit('SET_SA_DATA', this.shopperApprovedData);
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
.item-inner {
    padding-inline-end: 0 !important;
    padding-inline-start: 0 !important;
}

.progress-excellent {
  background-color: #4BA64B;
}

.progress-good {
  background-color: #A5D431;
}

.progress-average {
  background-color: #F6E535;
}

.progress-belowaverage {
  background-color: #F7A51F;
}

.progress-poor {
  background-color: #EB390F;
}

.progress {
  height: 10px;
}

#review-list {
  border-radius: 30px 30px 0 0;
  background-color: white;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  min-height: 600px;
}


</style>

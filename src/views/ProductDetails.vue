<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-events="true" :scroll-y="true">
      <div class="position-relative">
        <!-- <a href="/">
          <ion-button color="light" class="text-dark position-absolute back-button">
            <ion-icon :icon="chevronBackOutline" color="dark"></ion-icon>
          </ion-button>
        </a> -->
        <!-- <ion-button color="light" class="text-dark position-absolute heart-button">
          <ion-icon :icon="heartOutline" color="dark"></ion-icon>
        </ion-button> -->
        <span class="text-center position-absolute out-of-stock-banner" v-if="isOutofStock">
          <img src="../../resources/OutOfStock.png" />
        </span>
        <span v-if="isOnSale">
          <img src="../../resources/sale.png" class="position-absolute top-0 end-0" style="z-index: 1000; height: 100px;"/>
        </span>
        <ion-slides pager="true" class="bg-white position-relative">
            <ion-slide v-for="img in selectedProduct.images" :key="img.id">
              <img :src="img.src" style="height: 30vh;" :class="isOutofStock?'opacity mb-5':'mb-5'"/>
            </ion-slide>
        </ion-slides>
      </div>
      <div class="p-4 pb-1" id="product-details">
        <div>
          <ion-chip :class="selectedProduct.badge">
              <ion-label color="light">{{selectedProduct.name.split(' ')[0].replace('_',' ')}}</ion-label>
          </ion-chip>

          <ion-chip class="bg-white float-end">
              <ion-icon :icon="star" color="warning"></ion-icon>
              <ion-label color="dark">{{productRatings}}</ion-label>
          </ion-chip>
        </div>
        <h5 class="mb-0">{{cleanString(selectedProduct.name_title)}}</h5>
        <p class="text-muted">
          {{cleanPartNumber(selectedProduct.name_subtitle)}}
        </p>

        <p class="affirm-as-low-as" data-page-type="product"
        :data-amount="selectedProduct.regular_price.replace('.','')"
        style="font-size:11px" v-if="!isOutofStock"></p>

        <p v-html="selectedProduct.short_description" style="font-size: 1.8vh" class="text-muted fst-italic">
        </p>
      </div>

      <ion-accordion-group :multiple="true" :value="['information', 'reviews']">
          <ion-accordion value="description" class="bg-default">
            <ion-item slot="header" color="light">
              <ion-label>Description</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content" v-html="productDescription">
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
                <ion-item>
                  <ion-label><b>Total Sales</b>: {{selectedProduct.total_sales}}</ion-label>
                </ion-item>
              </ion-list>
            </div>
          </ion-accordion>
          <ion-accordion value="reviews" style="font-size: 1.8vh;">
            <ion-item slot="header" color="light">
              <ion-label class="position-relative">Reviews</ion-label>
              <ion-badge slot="start" :color="defaultColor" class="me-2" v-if="shopperapprovedDetails.total_reviews">{{shopperapprovedDetails.total_reviews}}</ion-badge>
            </ion-item>
            <div class="ion-padding" slot="content">
              <span v-if="shopperapprovedDetails.total_reviews == 0 || productRatings == '0 reviews'" class="fst-italic">
              We're currently collecting product reviews for this item.
              In the meantime, here are some reviews from our past customers sharing their overall shopping experience.
              </span>
              <ion-list>
                <span v-for="review in productReviews" :key="review.review_id">
                  <ion-item v-if="review.review_id">
                    <ion-avatar slot="start">
                      <img src="../../resources/user.png" />
                    </ion-avatar>
                    <ion-label class="ion-text-wrap">
                      <h2>{{review.display_name}}</h2>
                      <h3 v-html="getStars(review.rating ? review.rating : review.overall)"></h3>
                      <p>{{review.comments}}</p>
                    </ion-label>
                  </ion-item>
                </span>
              </ion-list>
            </div>
          </ion-accordion>
      </ion-accordion-group>

      <div class="bg-default" style="height:130px"></div>

      <div class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0 ">
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
            :disabled="isOutofStock" v-if="!isOutofStock">
              <ion-icon :icon="cartOutline" class="me-2"></ion-icon>
              Add to cart
            </ion-button>

            <ion-button class="w-100"
            style="height: 6vh"
            color="danger"
            v-if="isOutofStock">
              <ion-icon :icon="enterOutline" class="me-2"></ion-icon>
              Join Waitlist
            </ion-button>
          </div>
        </section>
      </div>


      <ion-fab horizontal="start" vertical="top" slot="fixed">
        <ion-fab-button color="light" :href="$router.options.history.state.back">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue'
import { IonSlide, IonSlides, IonButton, IonAccordion, 
    IonAccordionGroup,
    IonItem, 
    IonLabel, IonList, IonBadge,
    IonFab, IonFabButton, 
} from '@ionic/vue'
import { 
  starOutline, star, chevronBackOutline,
  heartOutline, cartOutline, enterOutline
} from 'ionicons/icons'
import { mapState } from 'vuex'
import $ from "jquery";
import SettingsConstants from '../constants/settings.constants'
import axios from 'axios'
import { loadScript } from "vue-plugin-load-script"

export default defineComponent({
  name: 'ProductDetails',
  components: {
    IonSlide, IonSlides, IonButton,
    IonAccordion, 
    IonAccordionGroup,
    IonItem, IonFab, IonFabButton, 
    IonLabel, IonList, IonBadge,
  },
  computed: mapState([
      'selectedProduct'
  ]),
  data() {
    return {
      productID: null,
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
    }
  },
  setup() {
    return {
      starOutline, star, chevronBackOutline,
      heartOutline, cartOutline, enterOutline
    }
  },
  methods: {
    cleanString: function (string) {
      return string.replace(/&amp;/g,'&');
    },
    cleanPartNumber: function (string) {
      return string.replace(/- Part/g,'Part');
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
    formatRegularPrice: function (price) {
      var finalPrice = null;
      if (!price.includes('.')) {
        finalPrice = price+'.00';
      } else {
        finalPrice = price;
      }
      return finalPrice;
    },
    updateWarantyImage: function (description) {
      var newdesc = description.replace('2018/10/1YearWarranty-150x150.png"','2022/07/1YearWarranty-150x150-no-bg.png" style="float:right"');
      return newdesc;
    },
    getStars: function (rating) {
      // Round to nearest half
      rating = Math.round(rating * 2) / 2;
      let output = [];
      // Append all the filled whole stars
      for (var i = rating; i >= 1; i--)
        output.push('<img src="https://database.tipmrebuilders.com/resources/star-solid-fill.svg" class="star-icon" style="height:10px">&nbsp;');
      // If there is a half a star, append it
      if (i == .5) {
        output.push('<img sr="https://database.tipmrebuilders.com/resources/star-half-solid-fill.svg" class="star-icon" style="height:10px">&nbsp;');
      }
      // Fill the empty stars
      // for (let i = (5 - rating); i >= 1; i--)
      //   output.push('<img src="https://database.tipmrebuilders.com/resources/star-half-solid.svg" class="star-icon" style="height:10px">&nbsp;');
      return output.join('');
    }

  },
  mounted() {
    this.productID = this.selectedProduct.id.toString();
    this.isOnSale = this.selectedProduct.on_sale;
    this.isOutofStock = (this.selectedProduct.stock_status == 'outofstock') ? true: false;
    if (this.selectedProduct.badge.includes('ecm')) {
      loadScript("/js/affirm.ecm.js");
      this.productOrigin = 'ECM';
      this.shopperapprovedStoreID = SettingsConstants.SA_ECM_ID;
      this.shopperapprovedToken = SettingsConstants.SA_ECM_TOKEN;
      this.defaultColor = 'tertiary';
    } else {
      loadScript("/js/affirm.tipm.js");
      this.productOrigin = 'TIPM';
      this.shopperapprovedStoreID = SettingsConstants.SA_TIPM_ID;
      this.shopperapprovedToken = SettingsConstants.SA_TIPM_TOKEN;
      this.defaultColor = 'primary';
    }
    this.productPrice = this.formatRegularPrice(this.selectedProduct.price);
    this.productDescription = this.updateWarantyImage(this.selectedProduct.description);

    this.getProductRatings();
    this.getProductReviews();

    setTimeout(() => {
      this.changePaginationBulletColors();
    }, 200);

    
    
  },
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
  font-size: 1.8vh;
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
</style>
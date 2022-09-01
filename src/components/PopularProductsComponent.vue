<template>
  <div id="popular" class="p-3 pt-0">

    <h5><strong>Popular</strong>
        <!-- <span class="float-end text-muted2" style="font-size:small">View All</span> -->
    </h5>

    <div class="d-flex justify-content-center"><dot-loader :loading="isLoading" :color="color" :size="size" class="mt-2"></dot-loader></div>
    <div class="row p-0" v-if="!isLoading">
        <div class="col-6 p-0">
            <div v-for="(product, index) in productList" :key="product.tags[0].name+product.id">
                <ion-card class="position-relative ion-activatable ripple-parent" v-if="!(index%2)">
                    <img :src="product.images[0].src" :class="product.stock_status == 'outofstock'?'opacity bg-white':'bg-white'" @click="setSelectedProduct(product)"/>
                    <span class="text-center position-absolute out-of-stock-banner" v-if="product.stock_status == 'outofstock'">
                      <img src="../../resources/OutOfStock.png" />
                    </span>
                    <span v-if="product.on_sale">
                      <img src="../../resources/sale.png" class="position-absolute sale-banner"/>
                    </span>
                    <ion-card-header class="overflow-hidden">
                      <ion-card-subtitle @click="setSelectedProduct(product)">
                          <span :class="'badge rounded-pill mb-2 text-white '+ product.badge">{{product.name.split(' ')[0].replace('_',' ')}}</span>
                      </ion-card-subtitle>
                      <span @click="setSelectedProduct(product)">
                          <ion-card-title class="prod-title fw-normal">{{cleanString(product.name_title)}}</ion-card-title>
                          <ion-card-subtitle class="prod-sub-title">{{product.name_subtitle}}</ion-card-subtitle>
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
                        @click="addToCart(product.id, product.source)"
                        >
                            <ion-icon :icon="add"></ion-icon>
                        </ion-button>
                      </div>
                    </ion-card-header>
                    <ion-ripple-effect></ion-ripple-effect>
                </ion-card>
            </div>
        </div>
        <div class="col-6 p-0">
            <div v-for="(product, index) in productList" :key="product.tags[0].name+product.id">
                <ion-card class="position-relative ion-activatable ripple-parent" v-if="(index%2)">
                    <img :src="product.images[0].src" :class="product.stock_status == 'outofstock'?'opacity bg-white':'bg-white'" @click="setSelectedProduct(product)"/>
                    <span class="text-center position-absolute out-of-stock-banner" v-if="product.stock_status == 'outofstock'">
                      <img src="../../resources/OutOfStock.png" />
                    </span>
                    <span v-if="product.on_sale">
                      <img src="../../resources/sale.png" class="position-absolute sale-banner"/>
                    </span>
                    <ion-card-header class="overflow-hidden">
                      <ion-card-subtitle @click="setSelectedProduct(product)">
                          <span :class="'badge rounded-pill mb-2 text-white '+ product.badge">{{product.name.split(' ')[0]}}</span>
                      </ion-card-subtitle>
                      <span @click="setSelectedProduct(product)">
                          <ion-card-title class="prod-title fw-normal">{{cleanString(product.name_title)}}</ion-card-title>
                          <ion-card-subtitle class="prod-sub-title">{{product.name_subtitle}}</ion-card-subtitle>
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
                        @click="addToCart(product.id, product.source)">
                            <ion-icon :icon="add"></ion-icon>
                        </ion-button>
                      </div>
                    </ion-card-header>
                    <ion-ripple-effect></ion-ripple-effect>
                </ion-card>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import {
  alertController,
  IonCard, IonButton, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonRippleEffect
} from '@ionic/vue';
import { 
  add
} from 'ionicons/icons';
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SettingsConstants from '../constants/settings.constants'
import store from '../store';
import { mapState } from 'vuex';
import Mixin from '../mixins/global.mixin'

export default defineComponent({
  name: 'PopularProductsComponent',
  mixins: [Mixin],
  computed: mapState([
      'selectedProduct',
      'popularProducList',
      'cartKeyECM',
      'cartKeyTIPM',
      'cartItemCount',
      'cartTIPMCount',
      'cartECMCount',
      'cartItemList'
  ]),
  components: {
    IonCard, IonButton, IonCardHeader,
    IonCardTitle, IonCardSubtitle,
    DotLoader, IonRippleEffect
  },
  data () {
    return {
        productList: [],
        maxItems: 8,
        isLoading: false,
        cartDetails: null
    }
  },
  setup() {
    return {
      add
    }
  },
  methods: {
    async showConfirmDeleteCartSessionModal(cartSource, newSource, base, cartKey, id) {
      const alert = await alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Confirm!',
              message: 'You have <b>'+cartSource+'</b> items currently in your cart, Adding <b>'+newSource+'</b> products will replace those item(s). You are only allowed to checkout from 1 source at a time.!',
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
                      text: 'Confirm',
                      id: 'confirm-button',
                      handler: () => {
                          this.deleteCartSession(cartSource);
                          this.continueCartProcessing(newSource, base, cartKey, id);
                      },
                  },
              ],
          });
      return alert.present();
    },
    getPopularProducts: function (site) {
        axios.get(SettingsConstants.BASE_URL +
        'productREST.php?op=popular&site='+site+'&page=1&products_perpage='+(this.maxItems/2) , { crossdomain: true })
          .then(function (response) {
            if (response.data.length) {
                Array.prototype.push.apply(this.productList, response.data);
                if (this.productList.length == this.maxItems) {
                    this.isLoading = false;
                    this.sortProducts(this.productList).forEach(function (prod) {
                        prod.badge = prod.name.split(' ')[0];
                        prod.name_title = '';
                        prod.name_subtitle = '';
                        var name = null;
                        if (prod.tags.find(tag => tag.name == 'TIPM')) {
                            prod.source = 'TIPM';
                            prod.badge = 'tipm-badge';
                            name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
                            prod.name_title = name.split('- Part')[0];
                            prod.name_subtitle = '- Part' + name.split('- Part')[1];
                        } else {
                            prod.source = 'ECM';
                            prod.badge = 'ecm-badge';
                            name = prod.name.substr(prod.name.indexOf(' ')+1).replace(/–/g,'-');
                            prod.name_title = name.split('with')[0];
                            prod.name_subtitle = 'with' + name.split('with')[1];
                        }
                    }.bind(this));
                    store.commit('SET_POPULAR_PRODUCT_LIST', this.productList);
                }
            }
          }.bind(this));
    },
    sortProducts: function (items) {
        items.sort(() => Math.random() - 0.5);
        return items;
    },
    setSelectedProduct: function (product) {
      store.commit('SET_SELECTED_PRODUCT', product);
      if (this.selectedProduct) {
        //window.location.href = '/product-details';
        this.$router.push('/product-details');
      }
    }
    // getCartId: function () {
    //   axios.get( 'https://dev.ecmrebuilders.com/wp-json/cocart/v2/cart', { crossdomain: true })
    //       .then(function (response) {
    //         this.cartDetails = response.data.cart_key;
    //       }.bind(this));
    // }
  },
  mounted () {
    //this.getCartId();
    if (!this.popularProducList.length) {
      this.isLoading = true;
      this.getPopularProducts(SettingsConstants.TIPMSITE);
      this.getPopularProducts(SettingsConstants.ECMSITE);
    } else {
      this.productList = this.popularProducList;
    }
  }
});
</script>

<style scoped>
  #popular ion-card{
    margin-inline: 12px !important;
  }
</style>

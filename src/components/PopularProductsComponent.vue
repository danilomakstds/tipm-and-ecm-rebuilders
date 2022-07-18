<template>
  <div id="popular" class="p-3">

    <h5><strong>Popular</strong>
        <!-- <span class="float-end text-muted2" style="font-size:small">View All</span> -->
    </h5>

    <div class="d-flex justify-content-center"><dot-loader :loading="isLoading" :color="color" :size="size" class="mt-2"></dot-loader></div>
    <div class="row p-0" v-if="!isLoading">
        <div class="col-6 p-0">
            <div v-for="(product, index) in productList" :key="product.tags[0].name+product.id">
                <ion-card class="position-relative" v-if="!(index%2)">
                    <img :src="product.images[0].src" :class="product.stock_status == 'outofstock'?'opacity bg-white':'bg-white'" @click="setSelectedProduct(product)"/>
                    <span class="text-center position-absolute out-of-stock-banner" v-if="product.stock_status == 'outofstock'">
                      <img src="../../resources/OutOfStock.png" />
                    </span>
                    <span v-if="product.on_sale">
                      <img src="../../resources/sale.png" class="position-absolute sale-banner"/>
                    </span>
                    <ion-card-header class="overflow-hidden">
                      <ion-card-subtitle @click="setSelectedProduct(product)">
                          <span :class="'pe-2 ps-2 pb-0 pt-0 text-white '+ product.badge">{{product.name.split(' ')[0]}}</span>
                      </ion-card-subtitle>
                      <span @click="setSelectedProduct(product)">
                          <ion-card-title class="prod-title fw-normal">{{cleanString(product.name_title)}}</ion-card-title>
                          <ion-card-subtitle class="prod-sub-title">{{product.name_subtitle}}</ion-card-subtitle>
                      </span>
                      <div class="overflow-hidden d-flex align-items-center justify-content-between">
                        <span class="text-dark fw-bold">$ {{formatRegularPrice(product.regular_price)}}</span>
                        <ion-button
                        :color="(product.badge == 'ecm-badge') ? 'tertiary': ''"
                        class="float-end add-dimentions"
                        :disabled="product.stock_status == 'outofstock'"
                        >
                            <ion-icon :icon="add"></ion-icon>
                        </ion-button>
                      </div>
                    </ion-card-header>
                </ion-card>
            </div>
        </div>
        <div class="col-6 p-0">
            <div v-for="(product, index) in productList" :key="product.tags[0].name+product.id">
                <ion-card class="position-relative" v-if="(index%2)">
                    <img :src="product.images[0].src" :class="product.stock_status == 'outofstock'?'opacity bg-white':'bg-white'" @click="setSelectedProduct(product)"/>
                    <span class="text-center position-absolute out-of-stock-banner" v-if="product.stock_status == 'outofstock'">
                      <img src="../../resources/OutOfStock.png" />
                    </span>
                    <span v-if="product.on_sale">
                      <img src="../../resources/sale.png" class="position-absolute sale-banner"/>
                    </span>
                    <ion-card-header class="overflow-hidden">
                      <ion-card-subtitle @click="setSelectedProduct(product)">
                          <span :class="'pe-2 ps-2 pb-0 pt-0 text-white '+ product.badge">{{product.name.split(' ')[0]}}</span>
                      </ion-card-subtitle>
                      <span @click="setSelectedProduct(product)">
                          <ion-card-title class="prod-title fw-normal">{{cleanString(product.name_title)}}</ion-card-title>
                          <ion-card-subtitle class="prod-sub-title">{{product.name_subtitle}}</ion-card-subtitle>
                      </span>
                      <div class="overflow-hidden d-flex align-items-center justify-content-between">
                        <span class="text-dark fw-bold">$ {{formatRegularPrice(product.regular_price)}}</span>
                        <ion-button
                        :color="(product.badge == 'ecm-badge') ? 'tertiary': ''"
                        class="float-end add-dimentions"
                        :disabled="product.stock_status == 'outofstock'">
                            <ion-icon :icon="add"></ion-icon>
                        </ion-button>
                      </div>
                    </ion-card-header>
                </ion-card>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonCard, IonButton, IonCardHeader, IonCardTitle, IonCardSubtitle} from '@ionic/vue';
import { 
  add
} from 'ionicons/icons';
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
//import Swal from 'sweetalert2'
//import store from '../store'
//import moment from 'moment'
//import AppConstants from '../constants/app.constants'
import SettingsConstants from '../constants/settings.constants'
import store from '../store';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'PopularProductsComponent',
  computed: mapState([
      'selectedProduct'
  ]),
  components: {
    IonCard, IonButton, IonCardHeader, IonCardTitle, IonCardSubtitle,
    DotLoader
  },
  data () {
    return {
        productList: [],
        maxItems: 8,
        isLoading: false
    }
  },
  setup() {
    return {
      add
    }
  },
  methods: {
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
                            prod.badge = 'tipm-badge';
                            name = prod.name.substr(prod.name.indexOf(' ')+1);
                            prod.name_title = name.split('- Part')[0];
                            prod.name_subtitle = '- Part' + name.split('- Part')[1];
                        } else {
                            prod.badge = 'ecm-badge';
                            name = prod.name.substr(prod.name.indexOf(' ')+1);
                            prod.name_title = name.split('with')[0];
                            prod.name_subtitle = 'with' + name.split('with')[1];
                        }
                    }.bind(this));
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
    },
    cleanString: function (string) {
      return string.replace(/&amp;/g,'&');
    },
    formatRegularPrice (price) {
      var finalPrice = null;
      if (!price.includes('.')) {
        finalPrice = price+'.00';
      } else {
        finalPrice = price;
      }
      return finalPrice;
    }
  },
  mounted () {
    this.isLoading = true;
    this.getPopularProducts(SettingsConstants.TIPMSITE);
    this.getPopularProducts(SettingsConstants.ECMSITE);
  }
});
</script>

<style scoped>
.prod-sub-title{
    /*font-size:1.3vh;*/
    font-size: 12px;
}

.prod-title {
    /*font-size:1.6vh;*/
    font-size: 15px;
}

.add-dimentions {
    width: 44px; height: 42px;
}

#popular ion-card{
    margin-inline: 12px !important;
}

#popular .sale-banner {
  z-index: 1000; height: 70px; top: -4px; right: -4px;
}

#popular .out-of-stock-banner {
  z-index: 1000; position: absolute; left: 0; right: 0; top: 10px; bottom: 0;
  height: 100px;
}

#popular .out-of-stock-banner img {
  height: 100px;
}
</style>

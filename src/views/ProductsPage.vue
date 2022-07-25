<template>
  <ion-page id="product-page">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" href="/">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Search Results</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      
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

      <div class="d-flex justify-content-center"><dot-loader :loading="isLoading" :color="color" :size="size" class="mt-5"></dot-loader></div>
      <div class="row p-3 pt-0" v-if="!isLoading">
          <div class="col-6 p-0" v-for="product in productList" :key="product.tags[0].name+product.id">
            <ion-card class="position-relative">
                <img :src="product.images[0].src" :class="product.stock_status == 'outofstock'?'opacity bg-white':'bg-white'" @click="setSelectedProduct(product)"/>
                <span class="text-center position-absolute out-of-stock-banner" v-if="product.stock_status == 'outofstock'">
                  <img src="../../resources/OutOfStock.png" />
                </span>
                <span v-if="product.on_sale">
                  <img src="../../resources/sale.png" class="position-absolute sale-banner"/>
                </span>
                <ion-card-header class="overflow-hidden">
                  <ion-card-subtitle @click="setSelectedProduct(product)" v-if="!product.isNonECMTIPM">
                      <span :class="'pe-2 ps-2 pb-0 pt-0 text-white '+ product.badge">{{product.name.split(' ')[0].replace('_',' ')}}</span>
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
                    >
                        <ion-icon :icon="add"></ion-icon>
                    </ion-button>
                  </div>
                </ion-card-header>
            </ion-card>
          </div>
      </div>

      


    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';

import { IonPage, IonHeader, IonToolbar,
IonTitle, IonContent, IonChip, IonIcon,
IonLabel, IonButtons, IonButton,
IonBreadcrumbs, IonBreadcrumb
} from '@ionic/vue';

import { 
  arrowBackOutline, search, add
} from 'ionicons/icons'
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import SettingsConstants from '../constants/settings.constants'
import { mapState } from 'vuex'
import store from '../store'
import $ from 'jquery'

export default defineComponent({
  name: 'ProductsPage',
  components: { DotLoader, IonHeader, IonToolbar,
  IonTitle, IonContent, IonPage, IonChip,
  IonIcon, IonLabel, IonButtons, IonButton,
  IonBreadcrumbs, IonBreadcrumb
  },
  computed: mapState([
    'selectedYear',
    'selectedMake',
    'selectedModel',
    'selectedProduct',
    'searchKeyword'
  ]),
  setup() {
    return {
      arrowBackOutline, search, add
    }
  },
  data() {
    return {
      productList: [],
      sites: [SettingsConstants.TIPMSITE,SettingsConstants.ECMSITE],
      isLoading: false,
      queryCount: 0
    }
  },
  methods: {
    openSearchModal: function () {
      this.emitter.emit('isShowSearchModal');
    },
    getProductsSearchResult: function () {
      this.isLoading = true;
      this.productList = [];
      var counter = 0;
      this.queryCount = this.selectedModel.data.length;
      this.selectedModel.data.forEach( function (cat){
        axios.get(SettingsConstants.BASE_URL +
        'productREST.php?op=get_product_under_category&site='+cat.site+'&page=1&categoryId='+cat.categories.id+'&products_perpage='+50 , { crossdomain: true })
          .then(function (response) {
            if (response.data.length) {
                counter = counter + 1;
                response.data.forEach(function (prod, idx, array) {
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
                  this.productList.push(prod);
                  this.isLoading = false;
                  if (idx == array.length-1 && counter == this.queryCount) {
                    this.sortProducts();
                  }
                }.bind(this));
            }
          }.bind(this));
      }.bind(this));
    },
    getProductsSearchKeyword: function () {
      this.isLoading = true;
      this.productList = [];
      var counter = 0;
      this.queryCount = this.sites.length;
      this.sites.forEach( function (site){
        axios.get(SettingsConstants.BASE_URL +
        'productREST.php?op=search_keyword&site='+site+'&page=1&search_keyword='+this.searchKeyword+'&products_perpage='+100 , { crossdomain: true })
          .then(function (response) {
            if (response.data.length) {
                counter = counter + 1;
                response.data.forEach(function (prod, idx, array) {
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
                  this.productList.push(prod);
                  this.isLoading = false;
                  if (idx == array.length-1 && counter == this.queryCount) {
                    this.sortProducts();
                  }
                }.bind(this));
            } else {
              this.isLoading = false;
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
    cleanString: function (string) {
      return string.replace('amp;','');
    },
    formatRegularPrice (price) {
      var finalPrice = null;
      if (!price.includes('.')) {
        finalPrice = price+'.00';
      } else {
        finalPrice = price;
      }
      return finalPrice;
    },
    initLogic: function () {
      if (this.selectedModel) {
        this.getProductsSearchResult();
      }
      if (this.searchKeyword) {
        this.getProductsSearchKeyword();
      }
    }
  },
  mounted() {
    this.initLogic();
    this.emitter.on('triggerSearch', function () {
      this.initLogic();
    }.bind(this));
    if (this.$route.fullPath == '/tabs/products') {
      $('ion-tab-button#tab-button-products').addClass('tab-selected');
    }
  }
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
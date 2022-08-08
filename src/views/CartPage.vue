<template>
  <ion-page id="cart">
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
            <ion-button color="primary" href="/">
                <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
            </ion-button>
        </ion-buttons>
        <ion-title>My Cart</ion-title>
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

      <ion-list lines="none">
        <ion-item-sliding>
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card style="border-radius: 30px;" class="bg-white">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                            <img src="../../resources/tipm.png" class="w-100 h-75"/>
                        </div>
                        <div class="col-8 p-3">
                            <ion-card-header class="ion-no-padding">
                                <ion-card-title>$ 123.00</ion-card-title>
                            </ion-card-header>
                            <ion-card-content class="ion-no-padding">
                                REBUILT OEM TIPM for 2010 Dodge RAM 1500 / 2500 / 3500 - Part # 04692194
                            </ion-card-content>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="start">
              <ion-item-option color="primary">Mark Unread</ion-item-option>
            </ion-item-options>

            <ion-item-options side="end">
              <ion-item-option class="bg-danger" style="min-width: 60px">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
      </ion-list>
      
      <div class="d-flex justify-content-center">
        <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
      </div>
<!-- 
      <ion-list>
        <ion-item v-for="prod in productList" :key="prod.id">
          <ion-label>
          {{prod.name}} 
          </ion-label>
          <ion-badge :color="prod.update_status == 'Pending..' ? 'secondary' : 'success'" slot="end">{{prod.update_status}}</ion-badge>
        </ion-item>
      </ion-list> -->


        <br/><br/><br/><br/><br/><br/>
      
      <div class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0 ">
        <section class="row w-100">
          <div class="col-6 d-flex align-items-center">
            <h1 class="fw-bold w-100 m-0 text-center" style="line-height: 1">
              $ 123.00
            </h1>
          </div>
          <div class="col-6 p-0">
            <ion-button class="w-100"
            style="height: 6vh" @click="updateProductName(0)"
            :color="primary">
              <ion-icon :icon="bagCheckOutline" class="me-2"></ion-icon>
              Checkout
            </ion-button>
          </div>
        </section>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import {
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent, IonButton,
    IonIcon, IonButtons, IonList,
    IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonRefresher, IonRefresherContent,
    //IonLabel
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
//import axios from 'axios'
//import SettingsConstants from '../constants/settings.constants.js'
import DotLoader from 'vue-spinner/src/DotLoader.vue'


export default defineComponent({
  name: 'CartPage',
  mixins: [Mixin],
  components: {
    DotLoader,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButton,
    IonIcon, IonButtons, IonList,
    IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonRefresher, IonRefresherContent,
    //IonLabel, 
 },
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh,
      arrowBackOutline, cartOutline, bagCheckOutline,
      trashOutline
    }
  },
  data() {
    return {
      lastPath: null,
      productList: [],
      page: 1,
      isLoading: false,
      isProcessing: false,
      currentIndex: 0,
    }
  },
  methods: {
    // getAllECMProducts: function () {
    //     this.isLoading = true;
    //     axios.get(SettingsConstants.BASE_URL +'productREST.php?op=search_all_ecm&products_perpage=100&site=liveecm&page='+this.page , { crossdomain: true })
    //     .then(function (response) {
    //       response.data.forEach( function (prod, idx, array) {
    //         prod.update_status = 'Pending..';
    //         this.productList.push(prod);
    //         if (idx == array.length -1) {
    //           if (response.data.length == 100) {
    //             this.page = this.page + 1;
    //             this.getAllECMProducts();
    //           } else {
    //             this.isLoading = false;
    //           }
    //         }
    //       }.bind(this));
    //     }.bind(this));
    // },
    // updateProductName: function (idx) {
    //   this.currentIndex = idx;
    //   if (this.productList[idx]) {
    //     var prod = this.productList[idx];
    //     var newname = 'REBUILT OEM ECM PCM ECU for'+prod.name.split('for')[1];
    //     this.doUpdate(prod.id, newname, prod);
    //   }
    // },
    // doUpdate: function (productID, newname, product) {
    //   this.isProcessing = true;
    //   var bodyFormData = new FormData();
    //   bodyFormData.append('new_name', newname);
    //   axios({
    //       method: "post",
    //       url: SettingsConstants.BASE_URL + "productREST.php?op=update_product_name&site=liveecm&id=" + productID,
    //       data: bodyFormData,
    //       headers: { "Content-Type": "multipart/form-data" },
    //   }).then(function (response) {
    //     if (response.data) {
    //       product.update_status = 'Done';
    //       product.name = newname;
    //       this.updateProductName(this.currentIndex+1);
    //     }
    //   }.bind(this));
    // }
  },
  mounted () {
    //this.getAllECMProducts();
  },
  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style scoped>
.item-inner {
    padding-inline-end: 0 !important;
    padding-inline-start: 0 !important;
}
</style>

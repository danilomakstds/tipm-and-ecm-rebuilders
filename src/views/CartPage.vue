<template>
  <ion-page id="cart">
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <router-link to="/">
            <ion-button color="primary">
                <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
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
        <ion-item-sliding style="border-bottom: 1px solid #eee">
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card class="bg-white m-0 p-0" style="border-radius:0px">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                          <img src="../../resources/tipm.png" class="w-100"/>
                        </div>
                        <div class="col-8 p-3">
                          <ion-card-content class="ion-no-padding">
                            <span :class="'text-white tipm-badge badge mb-1 rounded-pill'">REBUILT</span><br/>
                            OEM TIPM for 2010 Dodge RAM 1500 / 2500 / 3500 Part # 04692194
                          </ion-card-content>
                          <hr class="mt-1 mb-1 bg-light"/>
                          <ion-card-header class="ion-no-padding mt-2">
                              <ion-card-title style="font-size: 15px" class="fw-bold">
                                $ 123.00
                                <span class="fw-normal text-decoration-line-through text-danger" style="font-size: 1.3vh">$ 100.00</span>
                                <span class="float-end fw-bold text-muted2" style="font-size: 1.4vh">x1</span>
                              </ion-card-title>
                          </ion-card-header>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option class="bg-light" style="max-width: 70px">
                <div class="d-flex flex-column w-100">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="removeOutline" color="dark"></ion-icon>
                  </ion-button>
                  <input type="number" class="form-control text-center mt-1 mb-1" style="border-radius: 100px !important" value="1">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="addOutline" color="dark"></ion-icon>
                  </ion-button>
                </div>
              </ion-item-option>
              <ion-item-option class="bg-danger" style="min-width: 60px">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
            
        </ion-item-sliding>

        <ion-item-sliding style="border-bottom: 1px solid #eee">
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card class="bg-white m-0 p-0" style="border-radius:0px">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                          <img src="https://ecmrebuilders.com/wp-content/uploads/2019/05/4-back-angle.png" class="w-100"/>
                        </div>
                        <div class="col-8 p-3">
                          <ion-card-content class="ion-no-padding">
                            <span :class="'text-white ecm-badge badge mb-1 rounded-pill me-2'">REBUILT</span>
                            <br/>
                            OEM ECM PCM ECU for 2011 Chrysler Town & Country with 3.6L Engine - 05150562
                          </ion-card-content>
                          <hr class="mt-1 mb-1" style="background-color: #eee"/>
                          <ion-card-header class="ion-no-padding mt-2">
                              <ion-card-title style="font-size: 15px" class="fw-bold">
                                $ 375.00
                                <span class="fw-normal text-decoration-line-through text-danger" style="font-size: 1.3vh"></span>
                              </ion-card-title>
                          </ion-card-header>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option class="bg-light" style="max-width: 70px">
                <div class="d-flex flex-column w-100">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="removeOutline" color="dark"></ion-icon>
                  </ion-button>
                  <input type="number" class="form-control text-center mt-1 mb-1" style="border-radius: 100px !important" value="1">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="addOutline" color="dark"></ion-icon>
                  </ion-button>
                </div>
              </ion-item-option>
              <ion-item-option class="bg-danger" style="min-width: 60px">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
        </ion-item-sliding>

        <ion-item-sliding style="border-bottom: 1px solid #eee">
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card class="bg-white m-0 p-0" style="border-radius:0px">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                          <img src="../../resources/tipm.png" class="w-100"/>
                        </div>
                        <div class="col-8 p-3">
                          <ion-card-content class="ion-no-padding">
                            <span :class="'text-white tipm-badge badge mb-1 rounded-pill'">REBUILT</span><br/>
                            OEM TIPM for 2010 Dodge RAM 1500 / 2500 / 3500 Part # 04692194
                          </ion-card-content>
                          <hr class="mt-1 mb-1" style="background-color: #eee"/>
                          <ion-card-header class="ion-no-padding mt-2">
                              <ion-card-title style="font-size: 15px" class="fw-bold">
                                $ 123.00
                                <span class="fw-normal text-decoration-line-through text-danger" style="font-size: 1.3vh">$ 100.00</span>
                              </ion-card-title>
                          </ion-card-header>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option class="bg-light" style="max-width: 70px">
                <div class="d-flex flex-column w-100">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="removeOutline" color="dark"></ion-icon>
                  </ion-button>
                  <input type="number" class="form-control text-center mt-1 mb-1" style="border-radius: 100px !important" value="1">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="addOutline" color="dark"></ion-icon>
                  </ion-button>
                </div>
              </ion-item-option>
              <ion-item-option class="bg-danger" style="min-width: 60px">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
        </ion-item-sliding>

        <ion-item-sliding style="border-bottom: 1px solid #eee">
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card class="bg-white m-0 p-0" style="border-radius:0px">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                          <img src="https://ecmrebuilders.com/wp-content/uploads/2019/05/4-back-angle.png" class="w-100"/>
                        </div>
                        <div class="col-8 p-3">
                          <ion-card-content class="ion-no-padding">
                            <span :class="'text-white ecm-badge badge mb-1 rounded-pill me-2'">REBUILT</span>
                            <br/>
                            OEM ECM PCM ECU for 2011 Chrysler Town & Country with 3.6L Engine - 05150562
                          </ion-card-content>
                          <hr class="mt-1 mb-1" style="background-color: #eee"/>
                          <ion-card-header class="ion-no-padding mt-2">
                              <ion-card-title style="font-size: 15px" class="fw-bold">
                                $ 375.00
                                <span class="fw-normal text-decoration-line-through text-danger" style="font-size: 1.3vh"></span>
                              </ion-card-title>
                          </ion-card-header>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option class="bg-light" style="max-width: 70px">
                <div class="d-flex flex-column w-100">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="removeOutline" color="dark"></ion-icon>
                  </ion-button>
                  <input type="number" class="form-control text-center mt-1 mb-1" style="border-radius: 100px !important" value="1">
                  <ion-button color="light" mode="ios">
                    <ion-icon :icon="addOutline" color="dark"></ion-icon>
                  </ion-button>
                </div>
              </ion-item-option>
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
    IonItemOption, IonRefresher, IonRefresherContent
    //IonLabel
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline, addOutline, removeOutline, 
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
    IonItemOption, IonRefresher, IonRefresherContent
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
      trashOutline, addOutline, removeOutline
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

#cart ion-input input {
  height: 40px !important;
}
</style>

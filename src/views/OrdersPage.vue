<template>
  <ion-page>
    <ion-header mode="md">
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <router-link to="/">
            <ion-button color="primary">
                <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-title>Track Orders</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" >

      
      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header> -->

    
      <div class="order-page">
        <div class="d-flex justify-content-center">
          <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
        </div>
      </div>

      <explore-container v-if="!sessionData"></explore-container>
      <div v-else class="mb-5">

      <ion-segment @ionChange="segmentChanged($event)" v-model="selectedSegment">
        <ion-segment-button value="myOrders">
          <ion-label>My Orders</ion-label>
        </ion-segment-button>
        <ion-segment-button value="orderWatchlist">
          <ion-label>Order Watchlist</ion-label>
        </ion-segment-button>
      </ion-segment>
        
      <section v-if="!isLoading">
        <ion-list v-if="orderList.length && selectedSegment =='myOrders'" lines="none" class="mb-0 p-0">
          <ion-item-group>
            <ion-item v-for="orderitem in orderList" :key="orderitem.id" class="ion-no-padding" style="--inner-padding-end:0">
              <section class="m-3 mb-1 w-100" style="border-radius: 15px">
                <ion-card-content class="bg-white p-0" style="box-shadow: 0px 3px 5px -3px rgba(0,0,0,0.1); border-radius: 15px" >
                  <div class="row w-100 p-0 me-0 ms-0">
                    <div class="col-9">
                      <div style="font-size:1.4vh" @click="trackOrder(orderitem.number)" class="pt-3 pe-2 ps-2 pb-3">
                        <ol class="breadcrumb mb-0">
                          <li class="breadcrumb-item fw-bold">Order #: {{orderitem.number}}</li>
                          <li class="breadcrumb-item text-muted">{{orderitem.modified_date}}</li>
                        </ol>
                      </div>
                      <div class="row w-100 p-0 me-0 ms-0" v-for="order in orderitem.line_items" :key="order.id">
                        <div class="col-4 p-3 pt-0 pe-0 pb-3">
                          <img :src="order.image.src"/>
                        </div>
                        <div class="col-8 p-3 pt-0 pe-0 pb-3" style="font-size:1.8vh">  
                          <span @click="setSelectedProduct(order.product_id, orderitem.number)">     
                            <section v-if="!order.isNonECMTIPM">
                              <span :class="'badge rounded-pill text-white me-1 '+ order.pr_badge">{{order.badge.replace('_',' ')}}</span>
                              <span class="fw-normal">{{cleanString(order.name_title)}}</span>
                              <span class="text-muted" style="font-size: 1.4vh">{{order.name_subtitle}}</span>
                            </section>
                            <section v-else>
                              <span>{{order.name}}</span>
                            </section>
                          </span> 
                          <section class="d-flex justify-content-between">
                            <span class="float-start fw-bold mt-3" style="font-size: 1.4vh" @click="setSelectedProduct(order.product_id, orderitem.number)">$ {{order.total}}</span>
                            <ion-chip class="bg-light mt-2" style="font-size:1.5vh">
                                <ion-icon :icon="star" color="warning"></ion-icon>
                                <ion-label color="dark">Review</ion-label>
                            </ion-chip>
                          </section>
                        </div>
                      </div>

                    </div>
                    <div class="col-3 price-div">
                      <div class="text-center d-flex flex-column align-items-center justify-content-center h-100">
                        <ion-icon id="more-options" :icon="ellipsisHorizontal" color="medium" style="font-size: 24px;" @click="presentActionSheet"></ion-icon>
                        
                        <section @click="trackOrder(orderitem.number)" class="d-flex flex-column">
                          <span style="font-size: 1.2vh">Total (1 item)</span>
                          <span class="fw-bold" style="font-size: 2vh"  >$ {{orderitem.total}}</span>
                        </section>

                        <ion-icon id="show-tracking" :icon="arrowForwardOutline"
                        color="medium" style="font-size: 20px;"
                         @click="trackOrder(orderitem.number)"></ion-icon>
                      </div>
                    </div>
                  </div>
                </ion-card-content>
              
              </section>
            </ion-item>
          </ion-item-group>
        </ion-list>
        
        <ion-list v-if="watchList.length && selectedSegment =='orderWatchlist'" lines="none" class="mb-0 p-0">
          <ion-item-group>
            <ion-item v-for="orderitem in watchList" :key="orderitem.id" class="ion-no-padding" style="--inner-padding-end:0">
              <section class="m-3 mb-1 w-100" style="border-radius: 15px">
                <ion-card-content class="bg-white p-0" style="box-shadow: 0px 3px 5px -3px rgba(0,0,0,0.1); border-radius: 15px">
                  <div class="row w-100 p-0 me-0 ms-0">
                    <div class="col-9">
                      <div style="font-size:1.4vh" @click="trackOrder(orderitem.number)" class="pt-3 pe-2 ps-2 pb-3">
                        <ol class="breadcrumb mb-0">
                          <li class="breadcrumb-item fw-bold">Order #: {{orderitem.number}}</li>
                          <li class="breadcrumb-item text-muted">{{orderitem.modified_date}}</li>
                        </ol>
                      </div>
                      <div class="row w-100 p-0 me-0 ms-0" v-for="order in orderitem.line_items" :key="order.id">
                        <div class="col-4 p-3 pt-0 pe-0 pb-3">
                          <img :src="order.image.src"/>
                        </div>
                        <div class="col-8 p-3 pt-0 pe-0 pb-3" style="font-size:1.8vh">        
                          <span @click="setSelectedProduct(order.product_id, orderitem.number)">
                            <section v-if="!order.isNonECMTIPM">
                              <span :class="'badge rounded-pill text-white me-1 '+ order.pr_badge">{{order.badge.replace('_',' ')}}</span>
                              <span class="fw-normal">{{cleanString(order.name_title)}}</span>
                              <span class="text-muted" style="font-size: 1.4vh">{{order.name_subtitle}}</span>
                            </section>
                            <section v-else>
                              <span>{{order.name}}</span>
                            </section>
                          </span>
                          <section class="d-flex justify-content-between">
                            <span class="float-start fw-bold mt-3" style="font-size: 1.4vh" @click="setSelectedProduct(order.product_id, orderitem.number)">$ {{order.total}}</span>
                            <ion-chip class="bg-light mt-2" style="font-size:1.5vh" disabled>
                                <ion-icon :icon="star" color="warning"></ion-icon>
                                <ion-label color="dark">Review</ion-label>
                            </ion-chip>
                          </section>
                        </div>
                      </div>

                    </div>
                    <div class="col-3 price-div">
                      <div class="text-center d-flex flex-column align-items-center justify-content-center h-100">
                        <ion-icon id="more-options" :icon="ellipsisHorizontal" color="medium" style="font-size: 24px;" @click="presentActionSheet"></ion-icon>
                        
                        <section @click="trackOrder(orderitem.number)" class="d-flex flex-column">
                          <span style="font-size: 1.2vh">Total (1 item)</span>
                          <span class="fw-bold" style="font-size: 2vh">$ {{orderitem.total}}</span>
                        </section>

                        <ion-icon id="show-tracking" :icon="arrowForwardOutline"
                        color="medium" style="font-size: 20px;"
                         @click="trackOrder(orderitem.number)"></ion-icon>
                      </div>
                    </div>
                  </div>
                </ion-card-content>
              
              </section>
            </ion-item>
          </ion-item-group>
        </ion-list>

        <div v-if="showZeroResult" class="text-center order-page">
          <ion-icon :icon="listOutline" style="font-size: 200px;  opacity: .1"></ion-icon>
          <p class="text-muted fst-italic">No orders to display</p>
        </div>
      </section>

        
      </div>
      <br/>
      

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button id="open-modal">
          <ion-icon :icon="locateOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal ref="modal" trigger="open-modal" @willDismiss="onWillDismiss">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()">Cancel</ion-button>
            </ion-buttons>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()" :disabled="!orderNumber || orderNumber.length < 5">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <img src="https://tipmrebuilders.com/wp-content/uploads/2022/01/email_banner.png" style="height: 80px"/>
          <div class="pt-3">
            <ion-item lines="none">
              <ion-label position="stacked">Order Number <span class="text-danger">*</span></ion-label>
              <ion-input ref="input" type="text" placeholder="Order Number" v-model="orderNumber" class="mt-3 input-modif"></ion-input>
            </ion-item>
          </div>
        </ion-content>
      </ion-modal>
    
      
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, actionSheetController,
  IonTitle, IonContent, IonButton, IonButtons,
  IonIcon, IonModal, IonInput, IonFab, IonFabButton,
  IonItem, IonCardContent, IonLabel, IonChip,
  IonRefresher, IonRefresherContent,
  IonSegment, IonSegmentButton,
  //IonItemDivider,
  IonItemGroup
} from '@ionic/vue';
import { 
  arrowBackOutline, locateOutline, carSportOutline,
  listOutline, starOutline, arrowForwardOutline, star,
  mapOutline, navigateOutline, timeOutline, calendarOutline,
  ellipsisHorizontal, trashOutline, close
} from 'ionicons/icons'
import store from '../store'
import { mapState } from 'vuex'
import ExploreContainer from '../components/ExploreContainer'
import SettingsConstants from '../constants/settings.constants.js'
import axios from 'axios'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import moment from 'moment'
import Mixin from '../mixins/global.mixin'

export default defineComponent({
  name: 'OrdersPage',
  mixins: [Mixin],
  components: {
    ExploreContainer, DotLoader,

    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButton, IonButtons,
    IonIcon, IonModal, IonInput, IonFab, IonFabButton,
    IonItem, IonCardContent, IonLabel, IonChip,
    IonRefresher, IonRefresherContent,
    IonSegment, IonSegmentButton, 
    //IonItemDivider,
    IonItemGroup
  },
  setup() {
    const doRefresh = function (event) {
      store.commit('RESET_CUSTOMER_ORDER_LIST', []);
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh,
      arrowBackOutline, locateOutline, carSportOutline,
      listOutline, starOutline, arrowForwardOutline, star,
      mapOutline, navigateOutline, timeOutline, calendarOutline,
      ellipsisHorizontal, trashOutline, close
    }
  },
  data() {
    return {
      orderNumber: null,
      queryCounter: 0,
      isLoading: false,
      orderList: [],
      watchList: [],
      lastPath: null,
      selectedSegment: 'myOrders',
      showZeroResult: false
    }
  },
  computed: mapState([
      'trackedOrderNumber',
      'sessionData',
      'customerOrderNumberList',
      'customerOrderList',
      'customerOrderWatchList',
      'selectedProduct'
  ]),
  watch: {
    orderNumber: function (newVal) {
      store.commit('SET_TRACKED_ORDER_NUMBER', newVal);
    },
    sessionData: function (newVal) {
      if (newVal) {
        this.orderList = [];
        this.queryCounter = 0;
        this.getAllOrderHistory(SettingsConstants.TIPMSITE);
        this.getAllOrderHistory(SettingsConstants.ECMSITE);
      }
    }
  },
  
  methods: {
    async presentActionSheet() {
        const actionSheet = await actionSheetController
        .create({
          header: 'Options',
          //cssClass: 'my-custom-class',
          buttons: [
            {
              text: 'Remove',
              icon: trashOutline,
              id: 'delete-button',
              role: 'destructive', 
              data: null,
              htmlAttributes: { disabled: 'true' },
              handler: () => {
                console.log('remove');
              },
            },
            {
              text: 'Review',
              icon: starOutline,
              id: 'review-button',
              cssClass: 'text-dark',
              data: null,
              handler: () => {
                console.log('remove');
              },
            },
            {
              text: 'Cancel',
              icon: close,
              cssClass: 'text-dark',
              role: 'cancel',
            },
          ],
        });
      await actionSheet.present();

      const { role, data } = await actionSheet.onDidDismiss();
      console.log('onDidDismiss resolved with role and data', role, data);
    },
    segmentChanged: function (event) {
      var listLength = 0;
      event.detail.value == 'myOrders' ? listLength = this.orderList.length : listLength = this.watchList.length;
      if (!listLength) {
        this.showZeroResult = true;
      } else {
        this.showZeroResult = false;
      }
    },
    cancel() {
      this.$refs.modal.$el.dismiss(null, 'cancel');
    },
    confirm() {
      const name = this.$refs.input.$el.value;
      if (this.trackedOrderNumber && this.orderNumber) {
        this.$router.push('/order-details');
        this.$refs.modal.$el.dismiss(name, 'confirm');
      }
    },
    onWillDismiss(ev) {
      if (ev.detail.role === 'confirm') {
        this.message = `Hello, ${ev.detail.data}!`;
      }
    },
    trackOrder: function (orderNumber) {
      store.commit('SET_TRACKED_ORDER_NUMBER', orderNumber);
      if (this.trackedOrderNumber == orderNumber) {
        this.$router.push('/order-details');
      }
    },
    getAllOrderHistory: function (site) {
      this.isLoading = true;
      axios.get(SettingsConstants.BASE_URL +'orderREST.php?op=get_orders_by_email&user_email='+this.sessionData.email+'&page=1&perpage=100&site='+site , { crossdomain: true })
      .then(function (response) {
        if (response.data) {
          this.queryCounter = this.queryCounter+1;
          console.log(response.data);
          response.data.forEach(function (orderitem) {
            orderitem.line_items.forEach(function (order){
              order.name = order.name.replace('LIKE NEW', 'LIKE_NEW');
              order.badge = order.name.split(' ')[0];
              order.name_title = '';
              order.name_subtitle = '';
              var nonTIPMECM = ['repair', 'custom line', 'expedited', 'eddies'];
              order.isNonECMTIPM = false;
              var name = null;
              if (!nonTIPMECM.find( function (arr) {
                 return order.name.toLowerCase().includes(arr)
                })) {
                if (!orderitem.number.toLowerCase().includes('e-')) {
                  order.pr_badge = 'tipm-badge';
                  name = order.name.substr(order.name.indexOf(' ')+1).replace(/–/g,'-');
                  order.name_title = name.split('- Part')[0];
                  order.name_subtitle = '- Part' + name.split('- Part')[1];
                } else {
                  order.pr_badge = 'ecm-badge';
                  name = order.name.substr(order.name.indexOf(' ')+1).replace(/–/g,'-');
                  order.name_title = name.split('with')[0];
                  order.name_subtitle = 'with' + name.split('with')[1];
                }
              } else {
                order.isNonECMTIPM = true;
              }
            }.bind(orderitem));

            if (orderitem.line_items.length) {
              orderitem.modified_date = moment(orderitem.date_created).format('L LT');
              this.orderList.push(orderitem);
              this.customerOrderList.push(orderitem);
              if (!this.customerOrderNumberList.includes(orderitem.number)) {
                this.customerOrderNumberList.push(orderitem.number);
              }
            }
          }.bind(this));
          //this.orderList = [].concat(this.orderList, response.data);
          if (this.queryCounter == 2) {
            this.isLoading = false;
            var seg = { detail : { value: 'myOrders'}};
            this.segmentChanged(seg);
          }
        }
      }.bind(this));
    },
    formatCustomerWatchList: function () {
      this.customerOrderWatchList.forEach(function (orderitem) {
        orderitem.line_items.forEach(function (order){
            order.name = order.name.replace('LIKE NEW', 'LIKE_NEW');
            order.badge = order.name.split(' ')[0];
            order.name_title = '';
            order.name_subtitle = '';
            var nonTIPMECM = ['repair', 'custom line', 'expedited', 'eddies'];
            order.isNonECMTIPM = false;
            var name = null;
            if (!nonTIPMECM.find( function (arr) {
                return order.name.toLowerCase().includes(arr)
              })) {
              if (!orderitem.number.toLowerCase().includes('e-')) {
                order.pr_badge = 'tipm-badge';
                name = order.name.substr(order.name.indexOf(' ')+1).replace(/–/g,'-');
                order.name_title = name.split('- Part')[0];
                order.name_subtitle = '- Part' + name.split('- Part')[1];
              } else {
                order.pr_badge = 'ecm-badge';
                name = order.name.substr(order.name.indexOf(' ')+1).replace(/–/g,'-');
                order.name_title = name.split('with')[0];
                order.name_subtitle = 'with' + name.split('with')[1];
              }
            } else {
              order.isNonECMTIPM = true;
            }
        }.bind(orderitem));

        if (orderitem.line_items.length) {
          orderitem.modified_date = moment(orderitem.date_created).format('L LT');
        }
        this.watchList.push(orderitem);
          
        }.bind(this));
    },
    setSelectedProduct: function (product, orderNumber) {
      var data = [];
      data.productId = product;
      data.orderNumber = orderNumber;
      if (orderNumber.toLowerCase().includes('e-')) {
        data.site = SettingsConstants.ECMSITE;
      } else {
        data.site = SettingsConstants.TIPMSITE;
      }

      store.commit('SET_SELECTED_PRODUCT', data);
      if (this.selectedProduct.productId) {
        this.$router.push('/product-details');
      }
    }
  },
  mounted () {
    if (this.customerOrderWatchList.length) {
      this.formatCustomerWatchList();
    }
    if (this.sessionData && !this.customerOrderList.length) {
      this.getAllOrderHistory(SettingsConstants.TIPMSITE);
      this.getAllOrderHistory(SettingsConstants.ECMSITE);
    } else {
      this.orderList = this.customerOrderList;
    }
  },
  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style scoped>

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-div {
  background-color: #fbfbfb;
  border-radius: 0px 15px 15px 0;
  position: relative;
}

.price-div ion-icon#more-options {
  position: absolute;
  top: 10px;
}
.price-div ion-icon#show-tracking {
  position: absolute;
  bottom: 10px;
}
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <ion-button color="primary" href="/">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button>
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
        
        
        <ion-list v-if="!isLoading && orderList.length" lines="none" class="mb-0 p-0">
          <ion-item-group>
            <ion-item-divider style="--background: #393939">
              <ion-label class="fw-normal text-white" style="font-size: 1.8vh">
                MY ORDERS
              </ion-label>
            </ion-item-divider>
            <ion-item v-for="orderitem in orderList" :key="orderitem.id" class="ion-no-padding" style="--inner-padding-end:0">
              <section class="mt-3 w-100">
                <ion-card-content class="bg-white p-0" style="box-shadow: 0px 3px 5px -3px rgba(0,0,0,0.1);">
                  <div class="row w-100 p-0 me-0 ms-0">
                    <div class="col-9">
                      <div style="font-size:1.5vh" @click="trackOrder(orderitem.number)" class="pt-3 pe-2 ps-2 pb-3">
                        <ol class="breadcrumb mb-0">
                          <li class="breadcrumb-item fw-bold">Order #: {{orderitem.number}}</li>
                          <li class="breadcrumb-item text-muted">{{orderitem.modified_date}} <ion-icon :icon="arrowForwardOutline" class="ms-1"></ion-icon></li>
                        </ol>
                      </div>
                      <div class="row w-100 p-0 me-0 ms-0" v-for="order in orderitem.line_items" :key="order.id">
                        <div class="col-4 p-3 pt-0 pe-0 pb-3">
                          <img :src="order.image.src"/>
                        </div>
                        <div class="col-8 p-3 pt-0 pe-0 pb-3" style="font-size:1.8vh">  
                          <span @click="setSelectedProduct(order.product_id, orderitem.number)">     
                            <section v-if="!order.isNonECMTIPM">
                              <span :class="'pe-2 ps-2 pb-0 pt-0 text-white me-1 '+ order.pr_badge">{{order.badge.replace('_',' ')}}</span>
                              <span class="fw-normal" >{{cleanString(order.name_title)}}</span>
                              <span class="text-muted">{{order.name_subtitle}}</span>
                            </section>
                            <section v-else>
                              <span>{{order.name}}</span>
                            </section>
                          </span> 
                          <section class="d-flex justify-content-between">
                            <span class="float-start fw-bold mt-3" @click="setSelectedProduct(order.product_id, orderitem.number)">$ {{order.total}}</span>
                            <ion-chip class="bg-light mt-2" style="font-size:1.5vh">
                                <ion-icon :icon="star" color="warning"></ion-icon>
                                <ion-label color="dark">Rating</ion-label>
                            </ion-chip>
                          </section>
                        </div>
                      </div>

                      <!-- <section>
                        <hr style="background: #ccc;" class="p-0 mb-2 m-0"/>
                        <ion-chip color="success" class="float-start mb-3" :id="'status-'+orderitem.id" style="font-size:1.5vh; max-width: 40%;">
                            <ion-icon :icon="locateOutline" color="dark"></ion-icon>
                            <ion-label color="dark"><span class="fw-bold text-overflow" style="">Awaiting Shipment</span></ion-label>
                        </ion-chip>
                        <ion-popover :trigger="'status-'+orderitem.id" trigger-action="click">
                          <ion-content class="ion-padding">
                            <ion-icon :icon="locateOutline" color="dark" class="me-2"></ion-icon> Awaiting Shipment
                          </ion-content>
                        </ion-popover>

                        <ion-chip class="bg-light float-start mb-3" :id="'eta-'+orderitem.id" style="font-size:1.5vh; max-width: 50%;">
                            <ion-icon :icon="calendarOutline" color="dark"></ion-icon>
                            <ion-label color="dark">ETA: 08/02/2022</ion-label>
                        </ion-chip>
                        <ion-popover :trigger="'eta-'+orderitem.id" trigger-action="click">
                          <ion-content class="ion-padding">
                            <ion-icon :icon="calendarOutline" color="dark" class="me-2"></ion-icon>
                            ETA: 08/02/2022
                          </ion-content>
                        </ion-popover>
                      </section> -->

                    </div>
                    <div class="col-3 price-div" @click="trackOrder(orderitem.number)">
                      <div class="text-center d-flex flex-column align-items-center justify-content-center h-100">
                        <span class="fw-bold" style="font-size: 2vh">$ {{orderitem.total}}</span>
                      </div>
                    </div>
                  </div>
                </ion-card-content>
              
              </section>
            </ion-item>
          </ion-item-group>
        </ion-list>
        
        <ion-list v-if="!isLoading && watchList.length" lines="none" class="mt-3 mb-0 p-0">
          <ion-item-group>
            <ion-item-divider style="--background: #393939">
              <ion-label class="fw-normal text-white" style="font-size: 1.8vh">
                ORDER WATCHLIST
              </ion-label>
            </ion-item-divider>
            <ion-item v-for="orderitem in watchList" :key="orderitem.id" class="ion-no-padding" style="--inner-padding-end:0">
              <section class="mt-3 w-100">
                <ion-card-content class="bg-white p-0" style="box-shadow: 0px 3px 5px -3px rgba(0,0,0,0.1);">
                  <div class="row w-100 p-0 me-0 ms-0">
                    <div class="col-9">
                      <div style="font-size:1.5vh" @click="trackOrder(orderitem.number)" class="pt-3 pe-2 ps-2 pb-3">
                        <ol class="breadcrumb mb-0">
                          <li class="breadcrumb-item fw-bold">Order #: {{orderitem.number}}</li>
                          <li class="breadcrumb-item text-muted">{{orderitem.modified_date}} <ion-icon :icon="arrowForwardOutline" class="ms-1"></ion-icon></li>
                        </ol>
                      </div>
                      <div class="row w-100 p-0 me-0 ms-0" v-for="order in orderitem.line_items" :key="order.id">
                        <div class="col-4 p-3 pt-0 pe-0 pb-3">
                          <img :src="order.image.src"/>
                        </div>
                        <div class="col-8 p-3 pt-0 pe-0 pb-3" style="font-size:1.8vh">        
                          <span @click="setSelectedProduct(order.product_id, orderitem.number)">
                            <section v-if="!order.isNonECMTIPM">
                              <span :class="'pe-2 ps-2 pb-0 pt-0 text-white me-1 '+ order.pr_badge">{{order.badge.replace('_',' ')}}</span>
                              <span class="fw-normal">{{cleanString(order.name_title)}}</span>
                              <span class="text-muted">{{order.name_subtitle}}</span>
                            </section>
                            <section v-else>
                              <span>{{order.name}}</span>
                            </section>
                          </span>
                          <section class="d-flex justify-content-between">
                            <span class="float-start fw-bold mt-3" @click="setSelectedProduct(order.product_id, orderitem.number)">$ {{order.total}}</span>
                            <ion-chip class="bg-light mt-2" style="font-size:1.5vh" disabled>
                                <ion-icon :icon="star" color="warning"></ion-icon>
                                <ion-label color="dark">Rating</ion-label>
                            </ion-chip>
                          </section>
                        </div>
                      </div>

                    </div>
                    <div class="col-3 price-div" @click="trackOrder(orderitem.number)">
                      <div class="text-center d-flex flex-column align-items-center justify-content-center h-100">
                        <span class="fw-bold" style="font-size: 2vh">$ {{orderitem.total}}</span>
                      </div>
                    </div>
                  </div>
                </ion-card-content>
              
              </section>
            </ion-item>
          </ion-item-group>
        </ion-list>
        

        <div v-if="!orderList.length && !isLoading" class="text-center order-page">
          <!-- <img src="../../resources/to-do-list.png" attribute="Freepik" style="height: 20vh; border-radius: 30px; opacity: .3;" /> -->
          <ion-icon :icon="listOutline" style="font-size: 200px;  opacity: .1"></ion-icon>
          <p class="text-muted fst-italic">No orders to display</p>
        </div>
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
              <ion-input ref="input" type="text" placeholder="Order Number" v-model="orderNumber" class="mt-3"></ion-input>
            </ion-item>
          </div>
        </ion-content>
      </ion-modal>
    
      
    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar,
  IonTitle, IonContent, IonButton, IonButtons,
  IonIcon, IonModal, IonInput, IonFab, IonFabButton,
  IonItem, IonCardContent, IonLabel, IonChip,
  IonRefresher, IonRefresherContent, IonItemDivider,
  IonItemGroup
} from '@ionic/vue';
import { 
  arrowBackOutline, locateOutline, carSportOutline,
  listOutline, starOutline, arrowForwardOutline, star,
  mapOutline, navigateOutline, timeOutline, calendarOutline
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
    IonRefresher, IonRefresherContent, IonItemDivider,
    IonItemGroup
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
      mapOutline, navigateOutline, timeOutline, calendarOutline
    }
  },
  data() {
    return {
      orderNumber: null,
      queryCounter: 0,
      isLoading: false,
      orderList: [],
      watchList: [],
      lastPath: null
    }
  },
  methods: {
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
.order-page {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.price-div {
  background-color: #fbfbfb
}
</style>

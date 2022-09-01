<template>
  <ion-page>
    <!-- <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" href="/tabs/orders">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Order #: {{trackedOrderNumber.toUpperCase()}}</ion-title>
      </ion-toolbar>
    </ion-header> -->
    <ion-content :fullscreen="true" id="order-details">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>



      <div class="d-flex flex-column bd-highlight mb-5">
        <div class="order-2 bd-highlight">
          <div class="bg-white p-3 order-details">
            <div class="d-flex justify-content-center">
              <dot-loader :loading="isLoadingProduct" :color="color" :size="size" class="mt-5"></dot-loader>
            </div>
            <div v-if="wooOrderDetails" class="mt-3">
              <h2 class="fw-bold" style="font-size: 3vh">
                <ion-icon :icon="cubeOutline" :color="productType == 'tipm' ? 'primary':'tertiary'" class=" me-2"></ion-icon>
                ORDER # : {{trackedOrderNumber.toUpperCase()}}</h2>
              <hr style="background-color: #ccc"/>
              <ion-item lines="none" v-for="order in wooOrderDetails.line_items" :key="order.id">
                <div class="row">
                    <div class="col-8">
                      <p style="font-size: 1.7vh; line-height: 18px;" class="mb-2">
                        <section v-if="!order.isNonECMTIPM">
                          <span :class="'pe-2 ps-2 pb-0 pt-0 text-white me-2 '+ productBadge">{{order.badge.replace('_',' ')}}</span>
                          <span class="fw-normal">{{cleanString(order.name_title)}}</span>
                          <span class="text-muted">{{order.name_subtitle}}</span>
                        </section>
                        <section v-else>
                          <span>{{order.name}}</span>
                        </section>
                        <br/>
                        <span class="fw-bold">$ {{order.total}}</span>
                      </p>
                    </div>
                    <div class="col-4 d-flex align-items-center">
                      <img :src="order.image.src"/>
                    </div>
                    <div class="col-12 text-end">
                      <ion-chip class="bg-light float-end" style="font-size:1.5vh;">
                          <ion-icon :icon="star" color="warning"></ion-icon>
                          <ion-label color="dark">Rating</ion-label>
                      </ion-chip>
                    </div>
                </div>
              </ion-item>
            </div>

            <hr style="background-color: #ccc"/>

            <div class="overflow-hidden mt-2" v-if="trackingCourier != 'none'">
              <img src="../../resources/FedEx_logo_orange-purple-700x196.png" style="height:20px" v-if="trackingCourier == 'fedex'" class="float-start"/>
              <img src="../../resources/DHL-Emblem.png" style="height:20px" v-if="trackingCourier == 'dhl'" class="float-start"/>
            </div>
            <h5 class="overflow-hidden">
                <span v-if="trackingNumber">
                <span class="text-muted me-2" style="font-size: 1.8vh">TRACKING CODE:</span>
                <a :href="trackingURL" target="_blank" class="text-dark text-decoration-none">
                  <b>{{trackingNumber}}</b>
                  <ion-icon :icon="openOutline" class="ms-2" color="primary"></ion-icon>
                </a>
                </span>
            </h5>

            <hr style="background-color: #ccc" v-if="trackingCourier != 'none'"/>

            
            <div class="d-flex justify-content-center">
              <dot-loader :loading="isLoading" :color="color" :size="size" class="mt-5"></dot-loader>
            </div>

            <div class="container" v-if="!isLoading">
              <div class="row">
                <div class="col-12 offset-md-3">
                  <ul class="timeline">
                    <li v-for="(timeline, index) in trackingTimeLine" :key="index" :class="'courier-color-'+trackingCourier">
                      <span class="fw-bold">{{timeline.derivedStatus}}</span><br/>
                      <span>{{timeline.eventDescription}}</span>
                      <p>{{timeline.current_location}}</p>
                      <span class="text-muted2">
                        {{timeline.date}}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="order-1 bd-highlight">
          <div class="mapouter overflow-hidden" style="">
            <div class="gmap_canvas h-100">
              <iframe height="500" id="gmap_canvas"
              src="https://maps.google.com/maps?q=9531%20Cozycroft%20Ave,%20Chatsworth,%20CA%2091311,%20United%20States&t=&z=16&ie=UTF8&iwloc=&output=embed"
              frameborder="0" scrolling="no" marginheight="0" marginwidth="0" ></iframe>
            </div>
          </div>
        </div>

      </div>
      <br/>

      <div class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0; z-index: 1000;" v-if="productType && !customerOrderNumberList.includes(trackedOrderNumber)">
          <ion-button class="w-100"
          style="height: 6vh"
          :color="productType == 'tipm' ? 'primary':'tertiary'" @click="addToOrderWatchlist()" :disabled="disableWatchlistButton">
            <ion-icon :icon="enterOutline" class="me-2"></ion-icon>
            ADD TO WATCHLIST
            <dot-loader :loading="isLoadingButton" :color="color" :size="20" class="ms-3"></dot-loader>
          </ion-button>
      </div>

      <ion-fab horizontal="start" vertical="top" slot="fixed" mode="ios">
        <ion-fab-button color="light" href="/tabs/orders">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- <div id="map"></div> -->
      <!-- <GMapMap
            :center="center"
            :zoom="9"
            map-type-id="terrain"
            style="width: 100%; height: 300px"
        >
          <GMapCluster>
            <GMapMarker
                :key="index"
                v-for="(m, index) in markers"
                :position="m.position"
                :clickable="true"
                :draggable="true"
                @click="center=m.position"
            />
          </GMapCluster>
        </GMapMap> -->


    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonPage,
// IonHeader, IonToolbar,
// IonTitle, IonButtons,
IonButton, IonChip, IonLabel,
IonIcon, IonItem,
IonContent, IonRefresher, IonRefresherContent,
IonFab, IonFabButton
} from '@ionic/vue';
import { 
  arrowBackOutline, locateOutline,
  openOutline, starOutline,
  enterOutline, cubeOutline,
  chevronBackOutline, star
} from 'ionicons/icons'
import axios from 'axios'
import SettingsConstants from '../constants/settings.constants'
import Mixin from '../mixins/global.mixin'
import { mapState } from 'vuex'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import moment from 'moment'
import Swal from 'sweetalert2'
import store from '../store'


export default defineComponent({
  name: 'OrderDetails',
  mixins: [Mixin],
  components: {
    // IonHeader, IonToolbar, IonTitle,
    // IonButtons,
    IonButton, IonChip, IonLabel,
    IonIcon, IonItem,
    IonPage, IonContent, DotLoader,
    IonRefresher, IonRefresherContent,
    IonFab, IonFabButton
  },
  computed: mapState([
      'trackedOrderNumber',
      'customerOrderNumberList',
      'customerOrderWatchList'
  ]),
  setup() {
    const doRefresh = function (event) {
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }, 2000);
    }
    return {
      doRefresh,
      arrowBackOutline, locateOutline,
      openOutline, starOutline,
      enterOutline, cubeOutline,
      chevronBackOutline, star
    }
  },
  data() {
    return {
      center: {lat: 51.093048, lng: 6.842120},
      markers: [
        {
          position: {
            lat: 51.093048, lng: 6.842120
          },
        }
        , // Along list of clusters
      ],
      lastPath: null,
      fedexToken: null,
      trackingResults: null,
      trackingTimeLine: [],
      isLoading: false,
      isLoadingProduct: false,
      isLoadingButton: false,
      disableWatchlistButton: false,
      trackingNumber: null,
      trackingCourier: null,
      trackingURL: null,
      wooOrderId: null,
      wooOrderDetails: null,
      productBadge: null,
      productType: null,
    }
  },
  methods: {
    getFedexAuth: function () {
      this.isLoading = true;
      axios.get(SettingsConstants.FEDEX_BASE_URL +'op=get_fedex_token' , { crossdomain: true })
        .then(function (response) {
          if (response.data) {
            this.fedexToken = response.data;
          }
      }.bind(this));
    },
    getTrackingNumber: function () {
      var shipstation_storeid = null
      if (this.trackedOrderNumber.toLowerCase().includes('e-')){
        shipstation_storeid = SettingsConstants.SHIPSTATION_ECM_ID
      } else {
        shipstation_storeid = SettingsConstants.SHIPSTATION_TIPM_ID;
      }
      
      axios.get(SettingsConstants.SHIPSTATION_BASE_URL +'?op=shipment_details&order_number='+this.trackedOrderNumber+'&store_id='+shipstation_storeid , { crossdomain: true })
        .then(function (response) {
          if (response.data.shipments.length) {
            var fedex = null;
            var dhl = null;
            fedex = response.data.shipments.filter(shipment => shipment.carrierCode.includes('fedex'));
            dhl = response.data.shipments.filter(shipment => shipment.carrierCode.includes('dhl'));
            if (fedex.length) {
              this.trackingCourier = 'fedex';
              this.getFedexTrackingInfo(fedex);
            }
            if (dhl.length) {
              this.trackingCourier = 'dhl';
              this.getDHLTrackingInfo(dhl);
            }
          } else {
            this.isLoading = false;
            this.trackingCourier = 'none';
          }
      }.bind(this));
    },
    getShipstationDetails: function () {
      axios.get(SettingsConstants.SHIPSTATION_BASE_URL +'?op=search_order_by_number&order_number='+this.trackedOrderNumber , { crossdomain: true })
        .then(function (response) {
          if (response.data) {
            this.wooOrderId = response.data.orders[0].orderKey;
            this.getWooOrderDetails(response.data.orders[0].orderKey);
            var timeline = [];
            timeline.current_location = 'Chatsworth CA, US';
            timeline.eventDescription = 'Order Being Processed.';
            timeline.derivedStatus = 'Awaiting Shipment';
            timeline.shipstation_data = response.data;
            timeline.date = moment(response.data.orders[0].orderDate).format('L LT');
            this.trackingTimeLine.push(timeline);
          }
      }.bind(this));
    },
    getDHLTrackingInfo: function (tracking) {
      this.trackingNumber = tracking[0].trackingNumber;
      this.trackingURL = 'https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id='+this.trackingNumber;
      const options = {
        method: 'GET',
        url: 'https://api-eu.dhl.com/track/shipments',
        params: {trackingNumber: tracking[0].trackingNumber},
        headers: {'DHL-API-Key': 'RooA9uLxrTeiTejfCb5bmyMgedWSZnJM'}
      };
      axios.request(options).then(function (response) {
        console.log(response.data);
        this.trackingResults = response.data.shipments[0];
        var tracking = [];
        tracking = this.trackingResults.events;
        tracking.forEach(function (timeline, idx){
          if (idx == 0) {
            timeline.derivedStatus = this.trackingResults.status.remark;
            timeline.eventDescription = this.trackingResults.status.description;
            timeline.date = moment(timeline.timestamp).format('L LT');
            timeline.current_location = timeline.location.address.addressLocality;
          } else {
            timeline.eventDescription = timeline.description;
            timeline.date = moment(timeline.timestamp).format('L LT');
            timeline.current_location = timeline.location.address.addressLocality;    
          }
          this.isLoading = false;
        }.bind(this));
        [].push.apply( tracking, this.trackingTimeLine);
        this.trackingTimeLine = tracking;
      }.bind(this)).catch(function (error) {
        console.error(error);
      }.bind(this));
    },
    getFedexTrackingInfo: function (tracking) {
      this.trackingNumber = tracking[0].trackingNumber;
      this.trackingURL = 'https://www.fedex.com/fedextrack/?trknbr='+this.trackingNumber;
      var body = '{"trackingInfo": [{"trackingNumberInfo": {"trackingNumber": "'+this.trackingNumber+'"}}],"includeDetailedScans": true}';
      var bodyFormData = new FormData();
      bodyFormData.append('token', this.fedexToken.access_token);
      bodyFormData.append('bodyData', body)
      axios({
          method: "post",
          url: SettingsConstants.FEDEX_BASE_URL + "op=get_tracking_details",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
      }).then(function (response) {
          if (response.data) {
            this.trackingResults = response.data.output.completeTrackResults[0].trackResults[0];
            var tracking = [];
            tracking = this.trackingResults.scanEvents;
            tracking = tracking.filter(timeline => !timeline.eventDescription.toLowerCase().includes('shipment arriving'));
            tracking.forEach(function (timeline){
              timeline.date = moment(timeline.date).format('L LT');
              if (timeline.eventDescription == 'Shipment information sent to FedEx') {
                timeline.eventDescription = 'FROM';
                var shipperInformation = this.trackingResults.shipperInformation;
                timeline.current_location = shipperInformation.address.city + ' ' + shipperInformation.address.stateOrProvinceCode + ', ' + shipperInformation.address.countryCode;
              } else {
                timeline.current_location = timeline.scanLocation.city + ', ' + timeline.scanLocation.stateOrProvinceCode;
              }
              if (timeline.eventDescription == 'Picked up') {
                timeline.eventDescription = 'PACKAGE RECEIVED BY FEDEX';
              }
              if (timeline.eventDescription == 'On FedEx vehicle for delivery') {
                timeline.derivedStatus = 'OUT FOR DELIVERY';
              }
              this.isLoading = false;
            }.bind(this));
            [].push.apply( tracking, this.trackingTimeLine);
            this.trackingTimeLine = tracking;
          }
      }.bind(this));
    },
    getWooOrderDetails: function (wooOrderId) {
      this.isLoadingProduct = true;
      var site = null;
      if (this.trackedOrderNumber.toLowerCase().includes('e-')) {
        site = SettingsConstants.ECMSITE;
        this.productBadge = 'ecm-badge';
        this.productType = 'ecm';
      } else {
        site = SettingsConstants.TIPMSITE;
        this.productBadge = 'tipm-badge'
        this.productType = 'tipm';
      }
      axios.get(SettingsConstants.BASE_URL +'orderREST.php?op=get_order_by_number&site='+site+'&ordernumber='+wooOrderId , { crossdomain: true })
        .then(function (response) {
          if (response.data) {
            this.isLoadingProduct = false;
            this.wooOrderDetails = response.data;
            this.wooOrderDetails.line_items.forEach(function (order){
              order.name = order.name.replace('LIKE NEW', 'LIKE_NEW');
              order.badge = order.name.split(' ')[0];
              order.name_title = '';
              order.name_subtitle = '';
              var name = null;
              
              var nonTIPMECM = ['repair', 'custom line', 'expedited', 'eddies'];
              order.isNonECMTIPM = false;
              if (!nonTIPMECM.find( function (arr) {
                 return order.name.toLowerCase().includes(arr)
              })) {
                if (!this.trackedOrderNumber.toLowerCase().includes('e-')) {
                    name = order.name.substr(order.name.indexOf(' ')+1).replace(/–/g,'-');
                    order.name_title = name.split('- Part')[0];
                    order.name_subtitle = '- Part' + name.split('- Part')[1];
                } else {
                    name = order.name.substr(order.name.indexOf(' ')+1).replace(/–/g,'-');
                    order.name_title = name.split('with')[0];
                    order.name_subtitle = 'with' + name.split('with')[1];
                }
              } else {
                order.isNonECMTIPM = true;
              }
            }.bind(this));
          }
        }.bind(this));
    },
    addToOrderWatchlist: function () {
      this.isLoadingButton = true;

      var site = null;
      if (this.productType == 'ecm') {
        site = SettingsConstants.ECMSITE;
      } else {
        site = SettingsConstants.TIPMSITE;
      }

      axios.get(SettingsConstants.SHIPSTATION_BASE_URL +'?op=search_order_by_number&order_number='+this.trackedOrderNumber , { crossdomain: true })
      .then(function (response) {
        if (response.data) {
          axios.get(SettingsConstants.BASE_URL +'orderREST.php?op=get_order_by_number&ordernumber='+response.data.orders[0].orderKey+'&site='+site , { crossdomain: true })
          .then(function (response) {
            if (response.data) {
              this.isLoadingButton = false;
              //this.customerOrderWatchList.push(response.data);
              store.commit('SET_CUSTOMER_ORDER_WATCHLIST', response.data);
              this.checkifExistInWatchlist();
              Swal.fire({
                title: 'Great!',
                text: 'Order added to watchlist!',
                icon:'success',
                confirmButtonColor: '#4b7838',
              });
            }
          }.bind(this)).catch(function () {
            Swal.fire({
              title: 'Error!',
              text: "Order can't be added to watchlist!",
              icon: 'error',
              confirmButtonColor: '#4b7838',
            });
          });
        }
      }.bind(this)).catch(function () {
        Swal.fire({
          title: 'Error!',
          text: "Order can't be added to watchlist!",
          icon: 'error',
          confirmButtonColor: '#4b7838',
        });
      });
    },
    checkifExistInWatchlist: function () {
      // disableWatchlistButton
      // if ()
      if (this.customerOrderWatchList.find(order => order.number == this.trackedOrderNumber.toUpperCase())) {
        this.disableWatchlistButton = true;
      } else {
        this.disableWatchlistButton = false;
      }
    }
  },
  mounted() {
    this.getShipstationDetails();
    this.getFedexAuth();
    this.getTrackingNumber();
    this.checkifExistInWatchlist();
    //this.customerOrderWatchList = [];
  },
  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style>
.mapouter {
  height: 320px; border-radius: 0px 0px 20px 20px; z-index: 1;
}

#gmap_canvas {
  width: 100%; border:0; margin-top: -120px; margin-bottom: 150px; z-index: 1;
}

.order-details {
  margin-top: -50px; min-height: 100px; border-radius: 30px 30px 0 0; overflow: auto;
}

ul.timeline {
    list-style-type: none;
    position: relative;
    font-size: 1.8vh;
}
ul.timeline:before {
    content: ' ';
    background: #eee;
    display: inline-block;
    position: absolute;
    left: 29px;
    width: 2px;
    height: 100%;
    z-index: 400;
}
ul.timeline > li {
    margin: 20px 0;
    padding-left: 20px;
}
ul.timeline > li:before {
    content: ' ';
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    left: 20px;
    width: 20px;
    height: 20px;
    z-index: 400;
}

ul.timeline > li.courier-color-fedex:before {
  background: #4D148C;
  border: 3px solid #4D148C;
}

ul.timeline > li.courier-color-dhl:before {
  background: #FFCB05;
  border: 3px solid #FFCB05;
}

ul.timeline > li.courier-color-none:before {
  background: #487436;
  border: 3px solid #487436;
}

ul.timeline > li:first-child:before {
  transform: scale(1);
  animation: pulse 2s infinite;
}

ul.timeline > li:first-child {
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 0px 20px 20px 0;
}

@keyframes pulse {
  0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}
  70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}
  100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
}

ion-content#order-details{
    --ion-background-color:#fff;
}
</style>
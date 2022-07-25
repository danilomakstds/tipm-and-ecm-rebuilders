<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" href="/tabs/orders">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Order {{trackedOrderNumber}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" id="order-details">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header> -->



      <div class="d-flex flex-column bd-highlight">
        <div class="order-1 bd-highlight">
          <div class="mapouter overflow-hidden" style="">
            <div class="gmap_canvas h-100">
              <iframe height="500" id="gmap_canvas"
              src="https://maps.google.com/maps?q=9531%20Cozycroft%20Ave,%20Chatsworth,%20CA%2091311,%20United%20States&t=&z=13&ie=UTF8&iwloc=&output=embed"
              frameborder="0" scrolling="no" marginheight="0" marginwidth="0" ></iframe>
            </div>
          </div>
        </div>
        <div class="order-2 bd-highlight">

          <div class="bg-white p-3 order-details">

            <div class="overflow-hidden mt-2">
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

            <hr style="background-color: #ccc"/>

            
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
      </div>

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
IonHeader, IonToolbar,
IonTitle, IonButton, IonButtons,
IonIcon,
IonContent,
} from '@ionic/vue';
import { 
  arrowBackOutline, locateOutline, openOutline
} from 'ionicons/icons'
import axios from 'axios'
import SettingsConstants from '../constants/settings.constants'
import { mapState } from 'vuex'
//import $ from 'jquery'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import moment from 'moment'


export default defineComponent({
  name: 'OrderDetails',
  components: {
    IonHeader, IonToolbar, IonTitle,
    IonButton, IonButtons,
    IonIcon,
    IonPage, IonContent, DotLoader
    
  },
  computed: mapState([
      'trackedOrderNumber'
  ]),
  setup() {
    return {
      arrowBackOutline, locateOutline, openOutline
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
      fedexToken: null,
      trackingResults: null,
      trackingTimeLine: [],
      isLoading: false,
      trackingNumber: null,
      trackingCourier: null,
      trackingURL: null
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
          }
      }.bind(this));
    },
    getShipstationDetails: function () {
      axios.get(SettingsConstants.SHIPSTATION_BASE_URL +'?op=search_order_by_number&order_number='+this.trackedOrderNumber , { crossdomain: true })
        .then(function (response) {
          if (response.data) {
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
    }
  },
  mounted() {
    this.getShipstationDetails();
    this.getFedexAuth();
    this.getTrackingNumber();
    
  }
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
  margin-top: -50px; min-height: 100px; border-radius: 25px 25px 0 0;
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
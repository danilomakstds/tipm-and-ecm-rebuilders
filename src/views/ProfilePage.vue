<template>
  <ion-page id="profile">
    <ion-header v-if="!onlineStatus">
      <ion-toolbar>
        <div class="p-3 text-white warning-message">
          <img src="../../resources/wifi-no-signal.png" style="height: 30px" class="float-start me-3"/>
          <span>You are currently offline. Please check your internet connection!</span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      
      <div class="d-flex justify-content-center">
        <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
      </div>

      <div>
        <div class="text-center position-relative d-flex flex-column justify-content-center align-items-center bg-border" style="min-height: 35vh">
          <img src="../../resources/mak.jpg" style="height: 17vh; z-index: 1000;" class="rounded-circle"/>
        </div>
      </div>

      <div class="p-4 pb-1" id="profile-links">
        <!-- <p class="text-center">{{sessionData.email}}</p> -->
        <ion-list mode="ios" lines="none" class="mb-4">
            <ion-item href="/cart">
                <ion-icon :icon="personCircleOutline" slot="start" />
                <ion-label>
                  Account Information
                  <p>Listen, I've had a pretty messed up day...</p>
                </ion-label>
            </ion-item>
            <ion-item href="/cart">
                <ion-icon :icon="locationOutline" slot="start" />
                <ion-label>
                  Address Book
                  <p>Address list and more...</p>
                </ion-label>
            </ion-item>
            <ion-item href="/cart">
                <ion-icon :icon="cardOutline" slot="start" />
                <ion-label>Payment
                   <p>Payments and card details...</p>
                </ion-label>
            </ion-item>
            <ion-item href="/cart">
                <ion-icon :icon="heartOutline" slot="start" />
                <ion-label>Waitlist
                   <p>Products under waitlist...</p>
                </ion-label>
            </ion-item>
            <ion-item href="tabs/orders">
                <ion-icon :icon="cubeOutline" slot="start" />
                <ion-label>Order History
                   <p>List of previous orders and purchases...</p>
                </ion-label>
            </ion-item>
            <!-- <ion-item href="/cart">
                <ion-icon :icon="notificationsOutline" slot="start" />
                <ion-label>Notifications
                   <p>Notification settings...</p>
                </ion-label>
            </ion-item> -->
            <ion-item href="/cart">
                <ion-icon :icon="starOutline" slot="start" />
                <ion-label>Reviews
                   <p>My reviews...</p>
                </ion-label>
            </ion-item>
        </ion-list>
      </div>

      <ion-fab horizontal="start" vertical="top" slot="fixed" mode="ios" >
        <ion-fab-button color="light" :href="lastPath">
          <ion-icon :icon="arrowBackOutline"></ion-icon>
          <!-- <ion-back-button :icon="arrowBackOutline" color="primary" text="" :default-href="lastPath"></ion-back-button> -->
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import {
    IonPage, IonContent,
    IonIcon, IonFab, IonFabButton,
    IonRefresher, IonRefresherContent,
    IonList, IonItem, IonLabel,
    IonHeader, IonToolbar
    //IonBackButton
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline, chevronBackOutline, card, cardOutline,
  heart, heartOutline, cubeOutline, cube, notifications,
  notificationsOutline, personCircleOutline, star,
  starOutline, locationOutline
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
//import axios from 'axios'
//import SettingsConstants from '../constants/settings.constants.js'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'ProfilePage',
  mixins: [Mixin],
  components: {
    DotLoader,
    IonPage, IonContent,
    IonIcon, IonFab, IonFabButton,
    IonRefresher, IonRefresherContent,
    IonList, IonItem, IonLabel,
    IonHeader, IonToolbar
    //IonBackButton
  },
  computed: mapState([
      'sessionData',
      'onlineStatus'
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
      arrowBackOutline, cartOutline, bagCheckOutline,
      trashOutline, chevronBackOutline, card, cardOutline,
      heart, heartOutline, cubeOutline, cube, notifications,
      notificationsOutline, personCircleOutline, star,
      starOutline, locationOutline
    }
  },
  data() {
    return {
      isLoading: false,
    }
  },
  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style scoped>

.bg-border {
  background: url('../../resources/border.png');
  background-position: center;
  background-size: 80%;
  background-repeat: no-repeat;
  background-color: #fff;
}

#profile-links {
  background-color: #f6f6f6;
  border-radius: 30px 30px 0 0;
  margin-top: 0;
}

#profile-links ion-item,
#profile-links ion-list {
  --ion-item-background:#f6f6f6 !important;
}

#profile-links ion-item {
  border-bottom: 1px solid #ededed;
  padding-bottom: 10px;
}

.item-inner {
    padding-inline-end: 0 !important;
    padding-inline-start: 0 !important;
}

ion-content {
  --ion-background-color:#fff;
}
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary" href="/">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Track Orders</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header> -->

    <explore-container></explore-container>

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
IonItem
} from '@ionic/vue';
import { 
  arrowBackOutline, locateOutline
} from 'ionicons/icons'
import store from '../store'
import { mapState } from 'vuex'
//import Swal from 'sweetalert2'
import ExploreContainer from '../components/ExploreContainer'
// import SettingsConstants from '../constants/settings.constants'
// import axios from 'axios'

export default defineComponent({
  name: 'OrdersPage',
  components: {

    ExploreContainer,

    
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButton, IonButtons,
    IonIcon, IonModal, IonInput, IonFab, IonFabButton,
    IonItem
    
  },
  computed: mapState([
      'trackedOrderNumber'
  ]),
  watch: {
    orderNumber: function (newVal) {
      store.commit('SET_TRACKED_ORDER_NUMBER', newVal);
    }
  },
  setup() {
    return {
      arrowBackOutline, locateOutline
    }
  },
  data() {
    return {
      orderNumber: null
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
  }
});
</script>

<template>
  <div id="container">
    <p v-if="!isLoading" @click="toggleLoginModal()">
      <a target="_blank" rel="noopener noreferrer" style="color:#487436">Provide</a>
      the email address<br/>you used on previous orders to access<br/>Order History</p>
    <div class="d-flex justify-content-center">
      <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
    </div>

    <ion-modal ref="loginModal"
    :is-open="isLoginModalOpen"
    :breakpoints="[0.0, 0.6, 0.95]"
    :initialBreakpoint="0.6"
    @didDismiss="toggleLoginModal()">
      <ion-header>
        <ion-toolbar color="white">
          <ion-buttons slot="start">
            <ion-button @click="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="getCustomerDetails()" :disabled="(!validateEmail(userEmail) || !userEmail)">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <img src="../../resources/tipm_email_banner.png" style="height: 80px" class="w-100"/>
        <div class="alert alert-danger" role="alert" v-if="(!validateEmail(userEmail) && userEmail)">
            <span v-if="userEmail && !validateEmail(userEmail)">
              Email address is invalid
            </span>
        </div>

        <p class="m-3 mb-1">Provide the email address you used on previous orders to access Order History</p>

        <div class="pt-2">
          <ion-item lines="none">
            <ion-label position="stacked">Email address <span class="text-danger">*</span></ion-label>
            <ion-input ref="input" type="email" placeholder="Email" v-model="userEmail" class="mt-3"></ion-input>
          </ion-item>
        </div>
        
       </ion-content>
    </ion-modal>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonHeader, IonToolbar,
IonContent, IonButton, IonButtons,
IonModal, IonInput, modalController,
IonItem, IonLabel
} from '@ionic/vue';
import { 
eyeOffOutline, eyeOutline
} from 'ionicons/icons'
//import Swal from 'sweetalert2'
//import $ from 'jquery'
//import axios from 'axios'
//import SettingsConstants from '../constants/settings.constants'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import store from '../store';
import { mapState } from 'vuex';
import Mixin from '../mixins/global.mixin'

export default defineComponent({
  name: 'ExploreContainer',
  mixins: [Mixin],
  computed: mapState([
    'sessionData',
  ]),
  components: {
    DotLoader,

    IonHeader, IonToolbar,
    IonContent, IonButton, IonButtons,
    IonModal, IonInput, IonItem,
    IonLabel
  },
  setup() {
    return {
      eyeOffOutline, eyeOutline
    }
  },
  data() {
    return {
      isLoading: false,
      isLoginModalOpen: false,
      loginSwalModal: null,

      userEmail: null,
      userPassword: null,
      confirmPassword: null,

      showPasswordStatus: false,
      showConfirmPasswordStatus: false
    }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    toggleLoginModal: function () {
      this.isLoginModalOpen = !this.isLoginModalOpen;
    },
    cancel: function () {
      this.$refs.loginModal.$el.dismiss(null, 'cancel');
      this.dismiss();
    },
    getCustomerDetails: function () {
      if (this.userEmail) {
        store.commit('SET_SESSION_DATA', { 'email' : this.userEmail});
        this.$refs.loginModal.$el.dismiss(null, 'confirm');
      }
    },
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
.eye-forpass {
  top: 50%; right: 20px; z-index: 1000
}
</style>

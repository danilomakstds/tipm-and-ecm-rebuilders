<template>
  <div id="container">
    <p v-if="!isLoading"><a target="_blank" rel="noopener noreferrer" @click="openLoginModal()" style="color:#487436">Login</a> to access order<br/>history</p>
    <div class="d-flex justify-content-center">
      <dot-loader :loading="isLoading" :color="color" :size="size"></dot-loader>
    </div>

    <ion-modal ref="modal"
    :is-open="isRegisterModalOpen"
    @willDismiss="onWillDismiss">
      <ion-header>
        <ion-toolbar color="white">
          <ion-buttons slot="start">
            <ion-button @click="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="confirm()" :disabled="(!validateEmail(userEmail) || !userEmail) || !(userPassword == confirmPassword && userPassword)">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <img src="https://tipmrebuilders.com/wp-content/uploads/2022/01/email_banner.png" style="height: 80px" class="w-100"/>
        <div class="alert alert-danger mb-0" role="alert" v-if="(!validateEmail(userEmail) && userEmail) || (userPassword !== confirmPassword && userPassword && confirmPassword) || (confirmPassword && userPassword && userPassword == confirmPassword && !userEmail)">
            <span v-if="userPassword !== confirmPassword && userPassword && confirmPassword">
              Those passwords didn't match.
            </span>
            <span v-if="userPassword && userPassword == confirmPassword && !userEmail">
              Email address is required
            </span>
            <span v-if="userEmail && !validateEmail(userEmail)">
              Email address is invalid
            </span>
        </div>
        <div class="pt-2">
          <ion-item lines="none">
            <ion-label position="stacked">Email address <span class="text-danger">*</span></ion-label>
            <ion-input ref="input" type="email" placeholder="Email" v-model="userEmail" class="mt-3"></ion-input>
          </ion-item>
        </div>
        
        <div class="pt-2">
          <ion-item lines="none">
            <ion-label position="stacked">Password <span class="text-danger">*</span>
            </ion-label>
            <div class="position-relative w-100">
              <ion-icon :icon="eyeOffOutline" color="dark" class="position-absolute eye-forpass" v-if="!showPasswordStatus" @click="showPassword('password-field-reg', true)"></ion-icon>
              <ion-icon :icon="eyeOutline" color="dark" class="position-absolute eye-forpass" v-else @click="showPassword('password-field-reg', false)"></ion-icon>
              <ion-input ref="input" type="password" placeholder="Password" v-model="userPassword" class="mt-3" id="password-field-reg"></ion-input>
            </div>
          </ion-item>
        </div>

        <div class="pt-2">
          <ion-item lines="none">
            <ion-label position="stacked" class="w-100">Confirm password <span class="text-danger">*</span>
            </ion-label>
            <div class="position-relative w-100">
              <ion-icon :icon="eyeOffOutline" color="dark" class="position-absolute eye-forpass" v-if="!showConfirmPasswordStatus" @click="showPassword('confirm-password-field-reg', true)"></ion-icon>
              <ion-icon :icon="eyeOutline" color="dark" class="position-absolute eye-forpass" v-else @click="showPassword('confirm-password-field-reg', false)"></ion-icon>
              <ion-input ref="input" type="password" placeholder="Confirm Password" v-model="confirmPassword" class="mt-3" id="confirm-password-field-reg"></ion-input>
            </div>
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
import Swal from 'sweetalert2'
import $ from 'jquery'
import axios from 'axios'
import SettingsConstants from '../constants/settings.constants'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import store from '../store';
import { mapState } from 'vuex';
import Mixin from '../mixins/global.mixin'

export default defineComponent({
  name: 'ExploreContainer',
  mixins: [Mixin],
  computed: mapState([
      'sessionData'
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
      isRegisterModalOpen: false,
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
    openLoginModal: function () {
      this.loginSwalModal = Swal.mixin({
          customClass: {
            actions: 'mt-0'
          }
      });
      this.loginSwalModal.fire({
        html: `<form class="text-start">
        <div class="mb-3 ms-1 me-1">
          <label for="email" class="form-label">Email address <span class="text-danger">*</span></label>
          <input type="email" class="form-control form-control-lg" id="wp-email" aria-describedby="emailHelp">
        </div>
        <div class="mb-3 ms-1 me-1">
          <label for="exampleInputPassword1" class="form-label w-100">
            Password <span class="text-danger">*</span>
            <span></span>
          </label>
          <div class="w-100 position-relative">
            <input type="password" class="form-control form-control-lg" id="wp-password">
            <img src="./assets/eye-off-outline.svg" class="position-absolute eye-password" style="top: 40%; right: 20px; z-index: 1000; height:15px"/>
            <img src="./assets/eye-outline.svg" class="position-absolute eye-password d-none" style="top: 40%; right: 20px; z-index: 1000; height:15px"/>
        </div>
      </form>`,
        preConfirm: function () {
          return new Promise(function (resolve) {
            resolve([
              $('#wp-email').val(),
              $('#wp-password').val()
            ])
          })
        },
        confirmButtonColor: '#4b7838',
        footer: "<a id='open-register-modal' class='text-decoration-none text-dark'>Don't have an account? <span class='text-success'>Sign-up</span></a>"
      }).then(function (result) {
        if (result.isConfirmed && result.value[0].length && result.value[1].length) {
          //this.loginUser(result.value[0], result.value[1]);
          this.loginUserDEV(result.value[0]);
        } else {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Error!',
              text: 'Missing email or password!',
              icon:'error',
              confirmButtonColor: '#4b7838',
            });
          }
        }
      }.bind(this))
    },
    openRegisterModal: function () {
      this.isRegisterModalOpen = !this.isRegisterModalOpen;
    },
    cancel() {
      this.$refs.modal.$el.dismiss(null, 'cancel');
      this.isRegisterModalOpen = !this.isRegisterModalOpen;
    },
    confirm() {
      //const name = this.$refs.input.$el.value;
      if (this.userEmail && this.userPassword == this.confirmPassword) {
        //this.$refs.modal.$el.dismiss(name, 'confirm');
        this.createAccount(this.userEmail ,this.userPassword, null, true);
      }
    },
    onWillDismiss(ev) {
      if (ev.detail.role === 'confirm') {
        this.message = `Hello, ${ev.detail.data}!`;
      }
    },
    loginUser: function (email, password) {
      this.isLoading = true;
      axios.get(
        SettingsConstants.TIPMURL +'wp-json/wp/v2/posts?mo_rest_api_test_config=basic_auth',
        { headers: {"Authorization": "Basic "+btoa(email+':'+password)}
      })
        .then(function (response) {
          this.isLoading = false;
          if (response.data) {
            console.log(response.data);
            Swal.fire({
              title: 'Great!',
              text: 'you are now logged in!',
              icon:'success',
              confirmButtonColor: '#4b7838',
            });
            this.getUserDetails(email);
          }
        }.bind(this)).catch(function (error){
            this.isLoading = false;
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              Swal.fire({
                title: 'Login error!',
                text: error.response.data.error_description+'!',
                icon:'error',
                confirmButtonColor: '#4b7838',
                confirmButtonText: 'Sign up'
              }).then(function (result) {
                if (result.isConfirmed) {
                  this.createAccount(email, password);
                }
              }.bind(this));
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
        }.bind(this));
    },
    loginUserDEV: function (email) {
      this.isLoading = true;
      this.getUserDetails(email);
      this.isLoading = false;
    },
    getUserDetails: function (username) {
      var url = null;
      if (username.includes('@')) {
        url = 'https://tipmrebuilders.com/rest/users.php?type=get_user_by_email&email=';
      } else {
        url = 'https://tipmrebuilders.com/rest/users.php?type=get_user_by_username&username=';
      }
      axios.get(url+username
      ).then(function (response) {
        if (response.data) {
          store.commit('SET_SESSION_DATA',
          {
            'email': response.data[0].user_email,
            'id': response.data[0].ID
          });
        }
      }.bind(this));
    },
    showPassword: function (elem, show) {
      if ('password-field-reg' == elem) {
        this.showPasswordStatus = !this.showPasswordStatus;
      } else {
        this.showConfirmPasswordStatus = !this.showConfirmPasswordStatus;
      }
      if (show) {
        $('#'+elem+' input').attr('type', 'text');
      } else {
        $('#'+elem+' input').attr('type', 'password');
      }
    },
  },
  mounted() {

    $(document).on('click', '#open-register-modal', function() {
      this.loginSwalModal.close();
      this.openRegisterModal();
    }.bind(this));

    $(document).on('click', '.eye-password', function () {
      $('.eye-password').removeClass('d-none');
      $(this).addClass('d-none');
      if ($(this).attr('src').includes('eye-off-outline.svg')) {
        $('#wp-password').attr('type', 'text');
      } else {
        $('#wp-password').attr('type', 'password');
      }
    });

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

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
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button @click="cancel()">Cancel</ion-button>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button :strong="true" @click="confirm()" :disabled="(!validateEmail(userEmail) || !userEmail) || !(userPassword == confirmPassword && userPassword)">Confirm</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <img src="https://tipmrebuilders.com/wp-content/uploads/2022/01/email_banner.png" style="height: 80px"/>
        <div class="alert alert-danger mt-3 mb-0" role="alert" v-if="(!validateEmail(userEmail) && userEmail) || (userPassword !== confirmPassword) || (userPassword && userPassword == confirmPassword && !userEmail)">
            <span v-if="userPassword !== confirmPassword">
              Passwords don't match!
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
            <ion-label position="stacked">Password <span class="text-danger">*</span></ion-label>
            <ion-input ref="input" type="password" placeholder="Password" v-model="userPassword" class="mt-3"></ion-input>
          </ion-item>
        </div>

        <div class="pt-2">
          <ion-item lines="none">
            <ion-label position="stacked">Confirm password <span class="text-danger">*</span></ion-label>
            <ion-input ref="input" type="password" placeholder="Confirm Password" v-model="confirmPassword" class="mt-3"></ion-input>
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
import Swal from 'sweetalert2'
import $ from 'jquery'
import axios from 'axios'
import SettingsConstants from '../constants/settings.constants'
import DotLoader from 'vue-spinner/src/DotLoader.vue'

export default defineComponent({
  name: 'ExploreContainer',
  props: {
    name: String
  },
  components: {
    DotLoader,

    IonHeader, IonToolbar,
    IonContent, IonButton, IonButtons,
    IonModal, IonInput, IonItem,
    IonLabel
  },
  data() {
    return {
      isLoading: false,
      isRegisterModalOpen: false,
      loginSwalModal: null,

      userEmail: null,
      userPassword: null,
      confirmPassword: null
    }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    validateEmail: function (email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
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
          <label for="exampleInputPassword1" class="form-label">Password <span class="text-danger">*</span></label>
          <input type="password" class="form-control form-control-lg" id="wp-password">
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
          this.loginUser(result.value[0], result.value[1]);
        } else {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'Error!',
              text: 'Missing email or password!',
              icon:'error',
              confirmButtonColor: '#4b7838',
            })
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
        this.createAccount(this.userEmail ,this.userPassword);
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
            Swal.fire({
              title: 'Great!',
              text: 'you are now logged in!',
              icon:'success',
              confirmButtonColor: '#4b7838',
            })
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
    createAccount: function (email, password) {
      var bodyFormData = new FormData();
      bodyFormData.append('email', email);
      bodyFormData.append('password', password);
      axios({
          method: "post",
          url: SettingsConstants.BASE_URL + "customerREST.php?op=create_customer&site="+SettingsConstants.TIPMSITE,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
          if (response.data) {
            console.log(response.data)
          }
        }.bind(this));
    }
  },
  mounted() {
    $(document).on('click', '#open-register-modal', function() {
        //Some code 1
        this.loginSwalModal.close();
        this.openRegisterModal();
    }.bind(this));
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
</style>

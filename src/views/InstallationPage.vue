<template>
  <ion-page id="installation">
    <ion-header mode="md">
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <router-link to="/">
            <ion-button color="primary">
                <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button @click="toggleInfoModal()">
            <ion-icon slot="icon-only" :icon="informationCircleOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Installation</ion-title>
      </ion-toolbar>
      <ion-toolbar v-if="!onlineStatus">
        <div class="p-3 text-white warning-message">
          <img src="../../resources/wifi-no-signal.png" style="height: 30px" class="float-start me-3"/>
          <span>You are currently offline. Please check your internet connection!</span>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="d-flex align-items-center">

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div>
        <ion-searchbar color="white" class="mb-2 mt-2" mode="ios" placeholder="Search" v-model="searchInstallation"></ion-searchbar>
      </div>

      <div class="d-flex justify-content-center mt-2">
        <dot-loader :loading="isLoading" :color="color" :size="size" class="mt-5"></dot-loader>
      </div>

      <div class="row p-3 pt-0" v-if="installationData.length">
        <div class="col-6 p-0 mb-3" v-for="inst in installationData" :key="inst.id">
          <ion-card class="m-2 h-100 ripple-parent ion-activatable" @click="toggleVideoPlayerModal(inst)">
            <div class="position-relative">
              <img :src="inst.thumbnail_url" :class="inst.type == 'video' ? 'opacity' : ''"/>
              <ion-icon :icon="playCircle" color="dark" class="contents " size="large" v-if="inst.type == 'video'"></ion-icon>
              <ion-chip v-if="inst.type == 'pdf'" color="danger" class="pdf-position">
                <ion-label>PDF</ion-label>
                <ion-icon :icon="download" color="danger"></ion-icon>
              </ion-chip>
              
            </div>
            <ion-card-header class="overflow-hidden">
              <ion-card-subtitle class="mb-3">
                <span :class="'pe-2 ps-2 pt-1 pb-1 text-white rounded-pill text-uppercase ' + inst.badgecolor" style="font-size: smaller">{{inst.badgetType}}</span> 
              </ion-card-subtitle>
              <span>
                <ion-card-title class="prod-title fw-normal mt-2 " style="font-size:15px">{{inst.title}}</ion-card-title>
                <ion-card-subtitle class="prod-sub-title mt-2" style="font-size: 13px" v-if="inst.description">{{inst.description}}</ion-card-subtitle>
              </span>
            </ion-card-header>
            <ion-ripple-effect></ion-ripple-effect>
          </ion-card>
        </div>
      </div>

      
      
    </ion-content>

    <ion-modal ref="modal"
    :is-open="isSlidesOpen"
    @didDismiss="toggleInfoModal()">

      <ion-content :fullscreen="true" class="ion-padding d-flex align-items-center" style="--ion-background-color: #212529">
        <div class="text-center contents p-3">
          <div>
            <img src="../../resources/makandabox.png" style="height: 45vh;"/>
          </div>
          <h2 class="fw-bold text-center mb-3 text-white">READY TO INSTALL YOUR
            <ion-text color="primary" class="fst-italic">
            TIPM?
            </ion-text>
          </h2>
          <p class="text-white" style="font-size: 2vh">
            It's easy, it should only take you 20 minutes, and will save you hunderds of dollars over a professional install!
            Here you will find helpfull videos and documents to make this process virtually painless.
          </p>
          
          <div>
            <ion-button color="primary" class="mt-5" @click="dismiss()" style="height: 50px">
                READY <ion-icon slot="end"  :icon="arrowForwardOutline" color="white"></ion-icon>
            </ion-button>
          </div>
          
        </div>
      </ion-content>

    </ion-modal>

    <ion-modal ref="modal-video"
    :is-open="isVideoPlayerOpen"
    @didDismiss="toggleVideoPlayerModal()">

      <ion-content :fullscreen="true" class="ion-padding " style="--ion-background-color: #000000" :scroll-y="false">
        <div class="text-center contents" style="height: 100%;">
          <div id="video-player-container" class="d-flex align-items-center" data-vimeo-responsive="true" data-vimeo-color="487436"></div>
        </div>
        <ion-fab horizontal="end" vertical="top" slot="fixed" mode="ios">
          <ion-fab-button color="primary" @click="dismiss()">
            <ion-icon :icon="closeOutline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>

    </ion-modal>

    

  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import Player from '@vimeo/player';
import SettingsConstants from '../constants/settings.constants'
import {
    IonPage, IonHeader, IonToolbar,
    IonContent, IonButton,
    IonIcon, IonButtons,
    IonRefresher, IonRefresherContent,
    IonSearchbar, IonText,
    IonModal, modalController,
    IonChip, IonRippleEffect,
    IonFab, IonFabButton
} from '@ionic/vue';
import { 
    arrowBackOutline, informationCircleOutline,
    arrowForwardOutline, playCircle,
    download, closeOutline
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
import axios from 'axios'
import store from '../store'
import DotLoader from 'vue-spinner/src/DotLoader.vue'
import { mapState } from 'vuex'
import $ from 'jquery'
//import Swal from 'sweetalert2'

export default defineComponent({
  name: 'InstallationPage',
  mixins: [Mixin],
  components: {
    DotLoader,
    IonPage, IonHeader, IonToolbar,
    IonContent, IonButton,
    IonIcon, IonButtons,
    IonRefresher, IonRefresherContent,
    IonSearchbar, IonText, IonModal,
    IonChip, IonRippleEffect,
    IonFab, IonFabButton
  },
  computed: mapState([
    'isInstallationSlideOpen',
    'onlineStatus'
  ]),
  setup() {
    const doRefresh = function (event) {
      store.commit('SET_YOUTUBE_CHANNELINFO', null);
      store.commit('SET_YOUTUBE_VIDEOLIST', []);
      location.reload(true);
      setTimeout(function () {
        event.target.complete();
      }.bind(this), 2000);
    }
    return {
      doRefresh,
      arrowBackOutline,
      informationCircleOutline,
      arrowForwardOutline,
      playCircle,
      download,
      closeOutline
    }
  },
  data() {
    return {
      isSlidesOpen: true,
      isVideoPlayerOpen: false,
      installationData: [],
      installationDataTemp: [],
      isLoading: true,
      searchInstallation: null,
      selectedVideoId: null,
      vimeoPlayer: null
    }
  },
  watch: {
    isSlidesOpen: function (newVal) {
      store.commit('SET_INSTALLATION_SLIDE_STATUS', newVal);
    },
    searchInstallation: function (newVal) {
      this.installationData = this.installationDataTemp;
      this.applySearch(newVal);
    }
  },
  methods: {
    async dismiss() {
      modalController.dismiss({
        'dismissed': true
      });
    },
    applySearch: function (newVal) {
      if (newVal) {
        this.installationData = this.installationData.filter(inst => inst.title.toLowerCase().includes(newVal.toLowerCase()));
      } else {
        this.installationData = this.installationDataTemp;
      }
    },
    toggleInfoModal: function () {
      this.isSlidesOpen = !this.isSlidesOpen;
    },
    toggleVideoPlayerModal: function (item) {
      if (item) {
        switch (item.type) {
          case 'video':
            this.isVideoPlayerOpen = !this.isVideoPlayerOpen;
            if (this.isVideoPlayerOpen) {
              this.showVimeoPlayer(item.id);
            }
            break;
          case 'pdf':
            location.href = item.media_url;
            break;
        }
      } else {
        if (!item) {
          this.isVideoPlayerOpen = !this.isVideoPlayerOpen;
        } 
      }
    },
    getAllInstallationData: function () {
      this.isLoading = true;
      axios.get(SettingsConstants.TIPMURL + 'rest/installation_rest.php?type=all-sortby-it', { crossdomain: true })
      .then(function (response) {
        this.installationDataTemp = response.data;
        this.installationData = response.data;
        this.installationData.forEach(function (inst) {
          if (inst.i_or_t == '0') {
            inst.badgecolor = 'tipm-badge';
            inst.badgetType = 'Installation';
          } else {
            inst.badgecolor = 'dark-badge';
            inst.badgetType = 'Troubleshooting';
          }
          
        });
        this.isLoading = false;
      }.bind(this));
      
    },
    showVimeoPlayer: function (videoId) {
      if (this.vimeoPlayer) {
        this.vimeoPlayer.destroy();
      }
      
      var existCondition = setInterval(function() {
        if ($('#video-player-container').length) {
          
          const player = new Player('video-player-container', {
            id: videoId
          });

          setTimeout(() => {
            $('#video-player-container div').css('position','inherit');
          }, 1000);
          

          player.play().then(function() {
            console.log('the video was played');
          });

          this.vimeoPlayer = player;
          clearInterval(existCondition);
        }
      }.bind(this), 100); // check every 100ms
      
      
      this.selectedVideoId = videoId;
    },
    // pausePlayer: function () {
    //   if (this.vimeoPlayer) {
    //     const player = new Player('video-player-container', {
    //       id: this.selectedVideoId
    //     });
    //     player.pause();
    //   }
    // },
    // playPlayer: function () {
    //   if (this.vimeoPlayer) {
    //     const player = new Player('video-player-container', {
    //       id: this.selectedVideoId
    //     });
    //     player.play();
    //   }
    // }
  },
  mounted () {
    this.isSlidesOpen = this.isInstallationSlideOpen;
    this.getAllInstallationData();
  },
  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style scoped>
.contents {
  position: absolute;
  left: 0;
  right: 0;
  justify-content: center;
  top: 50%;
  margin: 0 auto;
  transform: translateY(-50%);
}

.pdf-position {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px;
  opacity: 1;
}


</style>

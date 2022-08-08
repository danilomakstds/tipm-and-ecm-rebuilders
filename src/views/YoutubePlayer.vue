<template>
  <ion-page id="cart">
    <ion-header>
      <ion-toolbar color="white">
        <ion-buttons slot="start">
          <ion-button color="primary" href="/">
              <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button @click="showYoutubeInfo()">
            <ion-icon slot="icon-only" :icon="informationCircleOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>TIPM Rebuilders</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Cart</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div style="height:260px" class="yt-banner text-center">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <img :src="youtubeProfilePicture" style="height: 100px" class="rounded-circle"/>
        <h4 class="mb-0">{{youtubeChannelName}}</h4>
        <span class="text-muted" style="font-size: 1.5vh">{{kFormatter(youtubeChannelSubscriberCount)}} subscribers</span>
        
        <!-- <div class="p-5 pt-0">
            <span class="text-muted" style="font-size: 1.7vh">{{youtubeChannelDescription}}</span>
        </div> -->
        
      </div>
      <div class="bg-white" style="height: 150px;"> <!-- border-radius: 0px 0px 35px 35px;-->
      </div>
      

      <ion-list v-if="youtubeVideoList.length">
          <ion-list-header> Videos </ion-list-header>

          <ion-item v-for="videos in youtubeVideoList" :key="videos.id" class="ion-no-padding" style="--inner-padding-end:0" >
            <!-- <img :src="videos.snippet.thumbnails.high.url" style="height: 100"/> -->
            <a :href="'https://youtube.com/watch?v='+videos.id" class="text-decoration-none text-dark">
              <section class="bg-white row p-3">
                <div class="col-5">
                  <img :src="videos.snippet.thumbnails.high.url" class="w-100" style="border-radius: 15px"/>
                </div>
                <div class="col-7 ps-2 pe-3 d-flex align-items-center">
                  <span>
                    <p class="fw-bold mb-1" style="font-size: 1.7vh; line-height: 1.2">{{videos.snippet.title}}</p>
                    <p style="font-size: 1.5vh" class="text-muted" v-if="videos.statistics">{{kFormatter(videos.statistics.viewCount)}} views - {{videos.publishDate}}</p>
                  </span>
                </div>
              </section>
            </a>
          </ion-item>
      </ion-list>


      <!-- <div>
        <youtube-vue3 width="100%" ref="player" videoid="NsdNUC9Z70k"  :autoplay="1" loop="0" listType="search" 
      list="" @ended="onEnded" @paused="onPaused" @played="onPlayed" controls="1"/>
      </div> -->
      

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
//import { YoutubeVue3 } from 'youtube-vue3'
import SettingsConstants from '../constants/settings.constants'
import {
    IonPage, IonHeader, IonToolbar,
    IonContent, IonButton,
    IonIcon, IonButtons,
    IonRefresher, IonRefresherContent,
    IonList, IonListHeader, IonItem, 
    //IonItemSliding, IonItemOptions,
    // IonItemOption, 
} from '@ionic/vue';
import { 
    arrowBackOutline, informationCircleOutline
} from 'ionicons/icons'
import Mixin from '../mixins/global.mixin'
import axios from 'axios'
import store from '../store'
import moment from 'moment'
import { mapState } from 'vuex'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'YoutubePlayer',
  mixins: [Mixin],
  components: {
    IonPage, IonHeader, IonToolbar,
    IonContent, IonButton,
    IonIcon, IonButtons,
    IonRefresher, IonRefresherContent,
    //YoutubeVue3
    IonList, IonListHeader, IonItem, 
  },
  computed: mapState([
      'youtubeVideoList',
      'youtubeChannelInfo'
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
      informationCircleOutline
    }
  },
  data() {
    return {
      lastPath: null,
      isLoading: false,
      banner: 'https://tipmrebuilders.com/wp-content/uploads/2021/03/Shop-Tipms.jpg',
      youtubeBanner: 'https://yt3.ggpht.com/rgppHnFWWKjv5I1ghep1i1iepmAKbRtIWdNmtUXWbqVTBqM1E1IJgWp0ndFssBmEXngfnJbM=w2120-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj',
      youtubeProfilePicture: null,
      youtubeChannelName: null,
      youtubeChannelDescription: null,
      youtubeVideoIdList: []
    }
  },
  methods: {
    getYoutubeChannelVideos: function () {
        axios.get(SettingsConstants.GOOGLE_BASE_URL+'search?key='+SettingsConstants.GOOGLE_API+'&channelId='+SettingsConstants.YT_CHANNEL_ID+'&part=snippet,id&order=date&maxResults=20' , { crossdomain: true })
        .then(function (response) {
            if (response.data) {
              var videos = response.data.items.filter(video => video.id.kind == 'youtube#video')
              videos.forEach(function (vid, idx, array) {
                this.youtubeVideoIdList.push(vid.id.videoId);
                if (idx == array.length-1) {
                  this.getMoreVideoDetails(this.youtubeVideoIdList);
                }
              }.bind(this));
            }
        }.bind(this));
    },
    getYoutubeChannelInfo: function () {
        var parts = 'snippet%2C%20brandingSettings%2C%20id%2C%20statistics';
        axios.get(SettingsConstants.GOOGLE_BASE_URL+'channels?part='+parts+'&id='+SettingsConstants.YT_CHANNEL_ID+'&key='+SettingsConstants.GOOGLE_API , { crossdomain: true })
        .then(function (response) {
            if (response.data) {
                store.commit('SET_YOUTUBE_CHANNELINFO', response.data);
                this.setYoutubeInfo(response.data);
            }
        }.bind(this));
    },
    getMoreVideoDetails: function (videoList) {
      var parts = 'snippet%2CcontentDetails%2Cstatistics%2Cid';
      axios.get(SettingsConstants.GOOGLE_BASE_URL+'videos?part='+parts+'&id='+videoList.toString()+'&key='+SettingsConstants.GOOGLE_API , { crossdomain: true })
        .then(function (response) {
            if (response.data) {
              response.data.items.forEach(function (vid) {
                vid.publishDate = moment(vid.snippet.publishedAt, "YYYYMMDD").fromNow();
              });
              store.commit('SET_YOUTUBE_VIDEOLIST', response.data.items);
            }
        }.bind(this));
    },
    showYoutubeInfo: function () {
      Swal.fire({
        html: `<div class="text-start">`+this.youtubeChannelDescription+`</div>`,
        showConfirmButton: false
      })
    },
    setYoutubeInfo: function (ytinfo) {
      this.youtubeProfilePicture = ytinfo.items[0].snippet.thumbnails.high.url;
      this.youtubeChannelName = ytinfo.items[0].snippet.title;
      //this.youtubeChannelDescription = ytinfo.items[0].brandingSettings.channel.description;
      this.youtubeChannelSubscriberCount = ytinfo.items[0].statistics.subscriberCount;
      this.youtubeChannelDescription = SettingsConstants.APP_DESCRIPTION;
    }
  },
  mounted () {
    console.log(this.youtubeVideoList);
    if (!this.youtubeVideoList.length) {
      this.getYoutubeChannelVideos();
    } else {
      this.youtubeVideoList.forEach(function (vid) {
        this.youtubeVideoIdList.push(vid.id.videoId);
      }.bind(this));
    }

    if (!this.youtubeChannelInfo) {
      this.getYoutubeChannelInfo();
    } else {
      this.setYoutubeInfo(this.youtubeChannelInfo);
    }
  },
  created () {
    this.lastPath = this.$router.options.history.state.back
  },
});
</script>

<style scoped>
.yt-banner {
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    background-image: url('https://tipmrebuilders.com/wp-content/uploads/2021/03/Shop-Tipms.jpg');
}
</style>

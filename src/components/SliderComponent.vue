<template>
  <div id="slider">
    <ion-slides pager="true" :options="slideOpts" >
        <!-- <ion-slide>
          <ion-card class="w-100 bg-dark" style="height:255px">
            <youtube-vue3 width="100%" height="100%" videoid="YPU4yfTp3nI?theme=light" style="background:none"  autoplay="1" loop="0" listType="search" theme="dark" 
            controls="1"/>
          </ion-card>
        </ion-slide> -->
        <ion-slide>
          <ion-card class="w-100">
            <div class="w-100 bg-ecm">
              <div class="row w-100 h-100 p-3">
                <div class="col-5 h-100">
                  <div class="position-relative h-100 text-center p-1">
                    <div class="bg-light h-100 w-100 sale-overlay">
                    </div>
                    <span class="mt-5 sale-text">Add to cart now</span>
                    <h1 class="mt-2 sale-title">
                      <span><strong>50% OFF</strong></span>
                    </h1>
                  </div>
                </div>
                <div class="col-7 position-relative">
                  <span class="position-absolute end-0">
                    <ion-icon :icon="starOutline" color="warning"></ion-icon>
                  </span>
                  <img src="../../resources/ecm.png" style="height:90%" class="w-100"/>
                </div>
              </div>
            </div>
            <ion-card-header class="text-start">
                <ion-card-title style="font-size:2vh">
                OEM ECM for 1999 Jeep Grand Cherokee</ion-card-title>
                <ion-card-subtitle style="font-size:1.5vh">
                <span class="pe-2 ps-2 pb-1 pt-1 text-white ecm-badge me-2">REBUILT</span>
                with 4.0L Engine - 56041424
                </ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-slide>
        <ion-slide>
          <ion-card class="w-100">
            <div class="w-100 bg-tipm" style="">
              <div class="row w-100 h-100 p-3">
                <div class="col-5 h-100">
                  <div class="position-relative h-100 text-center">
                    <div class="bg-light h-100 w-100 sale-overlay">
                    </div>
                    <span class="mt-5 sale-text">Add to cart now</span>
                    <h1 class="mt-2 sale-title">
                      <span><strong>50% OFF</strong></span>
                    </h1>
                  </div>
                </div>
                <div class="col-7 position-relative">
                  <span class="position-absolute end-0">
                    <ion-icon :icon="starOutline" color="warning"></ion-icon>
                  </span>
                  <img src="../../resources/tipm.png" style="height:90%" class="w-100 mt-2"/>
                </div>
              </div>
            </div>
            <ion-card-header class="text-start">
                <ion-card-title style="font-size:2vh">
                OEM TIPM for 2010 Dodge RAM</ion-card-title>
                <ion-card-subtitle style="font-size:1.5vh">
                <span class="pe-2 ps-2 pb-1 pt-1 text-white tipm-badge me-2">USED</span>
                1500 / 2500 / 3500 - Part # 04692194
                </ion-card-subtitle>
            </ion-card-header>
          </ion-card>
        </ion-slide>
    </ion-slides>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import { IonSlide, IonSlides} from '@ionic/vue';
// import { YoutubeVue3 } from 'youtube-vue3'
//import $ from 'jquery'
import { 
  starOutline
} from 'ionicons/icons';
import Mixin from '../mixins/global.mixin'

export default defineComponent({
  name: 'SliderComponent',
  mixins: [Mixin],
  components: {
    IonSlide, IonSlides,
    //YoutubeVue3
  },
  setup() {
    const slideOpts = {
      initialSlide: 0,
      speed: 500,
      autoplay: {
        delay: 5000
      },
    };
    return {
      starOutline, slideOpts
    }
  },
  //mounted() {
    // if (this.isMobile()) {
    //   var checkExist = setInterval(function() {
    //       if ($('.ytp-gradient-bottom').length) {
    //           $('.ytp-gradient-bottom').remove();
    //           $('.ytp-gradient-top').remove();
    //           clearInterval(checkExist);
    //       }
    //   }, 100);
    // }
  //}
});
</script>

<style scoped>
ion-card {
    margin-bottom: 35px
}
.bg-tipm {
    min-height:160px; background: linear-gradient(to right, #4b7838 , #67b048);
}

.bg-ecm {
    min-height:160px; background: linear-gradient(to left, #29aaa9 , #397ea5);
}

.sale-overlay {
    border-radius:20px; opacity: 0.4; position: absolute; top: 0;
}

.sale-text {
    font-size: 3vw; color: #fff;
}

.sale-title {
    font-size:10vw; color: #fff
}

#slider .slides-md {
    --bullet-background-active: #3A7CA5 !important;
    --bullet-background: #bbb !important;
}


</style>

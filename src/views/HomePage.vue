<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="primary">
            <ion-icon slot="icon-only" :ios="ellipsisVertical" :md="ellipsisVertical"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="cartOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="personCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title><img src="../../resources/icon.png" style="height:35px"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="p-4">


        <div class="row">
          <div class="col-4 p-1">
            <ion-select placeholder="Year">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
            </ion-select>
          </div>
          <div class="col-4 p-1">
            <ion-select placeholder="Make">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
            </ion-select>
          </div>
          <div class="col-4 p-1">
            <ion-select placeholder="Model">
              <ion-select-option value="apples">Apples</ion-select-option>
              <ion-select-option value="oranges">Oranges</ion-select-option>
              <ion-select-option value="bananas">Bananas</ion-select-option>
            </ion-select>
          </div>
          <div class="col-8 p-1">
            <ion-input placeholder="Search VIN"></ion-input>
          </div>
          <div class="col-2 p-1">
            <ion-button color="medium" class="w-100">
              <ion-icon :icon="barcodeOutline"></ion-icon>
            </ion-button>
          </div>
          <div class="col-2 p-1">
            <ion-button color="primary" class="w-100">Go</ion-button>
          </div>
        </div>
      </div>

      <!-- show items on sale-->
      <ion-slides pager="true" >
        <ion-slide>
          <ion-card style="margin-bottom: 35px" class="w-100">
            <div class="w-100" style="height:160px; background: linear-gradient(to left, #29aaa9 , #397ea5);">
              <div class="row w-100 h-100 p-3">
                <div class="col-5 h-100">
                  <div class="position-relative h-100 text-center">
                    <div style="border-radius:20px; opacity: 0.4; position: absolute; top: 0;" class="bg-light h-100 w-100">
                    </div>
                    <span style="font-size: 11px; color: #fff" class="mt-5">Add to cart now</span>
                    <h1 class="mt-2">
                      <span style="font-size: 45px; color: #fff; line-height: 40px;"><strong>50% OFF</strong></span>
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
          </ion-card>
        </ion-slide>
        <ion-slide>
          <ion-card style="margin-bottom: 35px" class="bg-white">
            <div class="w-100" style="height:160px; background: linear-gradient(to right, #4b7838 , #67b048);">
              <div class="row w-100 h-100 p-3">
                <div class="col-5 h-100">
                  <div class="position-relative h-100 text-center">
                    <div style="border-radius:20px; opacity: 0.4; position: absolute; top: 0;" class="bg-light h-100 w-100">
                    </div>
                    <span style="font-size: 11px; color: #fff" class="mt-5">Add to cart now</span>
                    <h1 class="mt-2">
                      <span style="font-size: 45px; color: #fff; line-height: 40px;"><strong>50% OFF</strong></span>
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
          </ion-card>
        </ion-slide>
      </ion-slides>

      <!-- sliding category-->
      <div class="pt-3 pe-4 ps-4">
        <span class="bg-white p-3 me-3" style="border-radius: 15px">
              <ion-icon :icon="apps" color="primary" class="me-2"></ion-icon> <span class="text-success fw-bold">All</span>
        </span>
        <span class="bg-white p-3 me-3" style="border-radius: 15px">
              <img src="../../resources/tipm.png" style="height:20px" class="me-2" />
              <span class="text-muted2">TIPM</span>
        </span>
        <span class="bg-white p-3 me-3" style="border-radius: 15px">
              <img src="../../resources/ecm.png" style="height:20px" class="me-2" />
              <span class="text-muted2">ECM</span>
        </span>
      </div>

      <div class="popular p-4">
        <h5><strong>Popular</strong> <span class="float-end text-muted2" style="font-size:small">View All</span></h5>
        <div class="row p-0">
          <div class="col-6 p-0">

            <ion-card class="position-relative">
              <img src="https://ecmrebuilders.com/wp-content/uploads/2021/11/002chrysler_pcm_ecm_3_plug_jtec_4.jpg.mst-copy.jpg" class="bg-white"/>
              <ion-card-header class="overflow-hidden">
                <ion-card-subtitle>
                  <span style="background: linear-gradient(to left, #29aaa9 , #397ea5);
                  border-radius: 20px; font-size:smaller"
                  class="pe-2 ps-2 pb-0 pt-0 text-white">REBUILT</span>
                </ion-card-subtitle>
                <ion-card-title style="font-size:13px">OEM ECM for 1999 Jeep Grand Cherokee</ion-card-title>
                <ion-card-subtitle style="font-size:11px">with 4.0L Engine - 56041424</ion-card-subtitle>
                <ion-button color="tertiary" style="width: 45px" class="float-end">
                  <ion-icon :icon="add"></ion-icon>
                </ion-button>
              </ion-card-header>
            </ion-card>

            <ion-card class="position-relative">
              <img src="../../resources/tipm.png" class="bg-white"/>
              <ion-card-header class="overflow-hidden">
                <ion-card-subtitle>
                  <span style="background: linear-gradient(to right, #4b7838 , #67b048);
                  border-radius: 20px; font-size:smaller"
                  class="pe-2 ps-2 pb-0 pt-0 text-white">USED</span>
                </ion-card-subtitle>
                <ion-card-title style="font-size:13px">OEM TIPM for 2010 Dodge RAM</ion-card-title>
                <ion-card-subtitle style="font-size:11px">1500 / 2500 / 3500 - Part # 04692194</ion-card-subtitle>
                <ion-button style="width: 45px" class="float-end">
                  <ion-icon :icon="add"></ion-icon>
                </ion-button>
              </ion-card-header>
            </ion-card>
            
          </div>
          <div class="col-6 p-0">

            <ion-card class="position-relative">
              <img src="https://tipmrebuilders.com/wp-content/uploads/2021/03/TYPE-C-Fuse.jpg" class="bg-white"/>
              <ion-card-header class="overflow-hidden">
                <ion-card-subtitle>
                  <span style="background: linear-gradient(to right, #4b7838 , #67b048);
                  border-radius: 20px; font-size:smaller"
                  class="pe-2 ps-2 pb-0 pt-0 text-white">USED</span>
                </ion-card-subtitle>
                <ion-card-title style="font-size:13px">OEM TIPM for 2010 Dodge RAM</ion-card-title>
                <ion-card-subtitle style="font-size:11px">1500 / 2500 / 3500 - Part # 04692194</ion-card-subtitle>
                <ion-button style="width: 45px" class="float-end">
                  <ion-icon :icon="add"></ion-icon>
                </ion-button>
              </ion-card-header>
            </ion-card>


            <ion-card class="position-relative">
              <img src="../../resources/ecm.png" class="bg-white"/>
              <ion-card-header class="overflow-hidden">
                <ion-card-subtitle>
                  <span style="background: linear-gradient(to left, #29aaa9 , #397ea5);
                  border-radius: 20px; font-size:smaller"
                  class="pe-2 ps-2 pb-0 pt-0 text-white">REBUILT</span>
                </ion-card-subtitle>
                <ion-card-title style="font-size:13px">OEM ECM for 1999 Jeep Grand Cherokee</ion-card-title>
                <ion-card-subtitle style="font-size:11px">with 4.0L Engine - 56041424</ion-card-subtitle>
                <ion-button color="tertiary" style="width: 45px" class="float-end">
                  <ion-icon :icon="add"></ion-icon>
                </ion-button>
              </ion-card-header>
            </ion-card>

          </div>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar,
IonTitle, IonContent, IonIcon,
IonButtons, IonSelect, IonSelectOption,
IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle,
IonCardSubtitle, IonSlide, IonSlides} from '@ionic/vue';
import { 
  ellipsisVertical,
  cartOutline,
  helpCircle, 
  personCircleOutline, 
  search, 
  starOutline,
  star,
  barcodeOutline, apps, add
} from 'ionicons/icons';
//import ExploreContainer from '@/components/ExploreContainer.vue';

export default  defineComponent({
  name: 'HomePage',
  components: {
    //ExploreContainer,
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButtons,
    IonIcon, IonSelect, IonSelectOption,
    IonButton, IonInput, IonCard,
    IonSlide, IonSlides, IonCardHeader,
    IonCardTitle, IonCardSubtitle
  },
  setup() {
    return {
      ellipsisVertical, 
      helpCircle, 
      personCircleOutline, 
      search, star,
      starOutline, cartOutline, barcodeOutline,
      apps, add
    }
  }
});
</script>



<template>
  <ion-page id="cart">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <a href="/">
                <ion-button color="primary">
                    <ion-icon slot="icon-only" :ios="arrowBackOutline" :md="arrowBackOutline" color="dark"></ion-icon>
                </ion-button>
            </a>
        </ion-buttons>
        <ion-title>My Cart</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <!-- <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">My Cart</ion-title>
        </ion-toolbar>
      </ion-header> -->

      <ion-list>
        <ion-item-sliding>
            <ion-item class="ion-no-padding" style="--inner-padding-end:0">
                <ion-card style="border-radius: 30px;" class="bg-white">
                    <div class="row m-0">
                        <div class="col-4 d-flex align-items-center">
                            <img src="../../resources/tipm.png" class="w-100 h-75"/>
                        </div>
                        <div class="col-8 p-3">
                            <ion-card-header class="ion-no-padding">
                                <ion-card-title>$ 123.00</ion-card-title>
                            </ion-card-header>
                            <ion-card-content class="ion-no-padding">
                                REBUILT OEM TIPM for 2010 Dodge RAM 1500 / 2500 / 3500 - Part # 04692194
                            </ion-card-content>
                        </div>
                    </div>
                </ion-card>
            </ion-item>

            <ion-item-options side="start">
              <ion-item-option color="primary">Mark Unread</ion-item-option>
            </ion-item-options>

            <ion-item-options side="end">
              <ion-item-option class="bg-danger" style="min-width: 60px">
                <ion-icon :icon="trashOutline"></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
      </ion-list>

      
      <div class="position-fixed bottom-0 w-100 p-3 bg-white" style="border-radius:30px 30px 0 0 ">
        <section class="row w-100">
          <div class="col-6 d-flex align-items-center">
            <h1 class="fw-bold w-100 m-0 text-center" style="line-height: 1">
              $ 123.00
            </h1>
          </div>
          <div class="col-6 p-0">
            <ion-button class="w-100"
            style="height: 6vh"
            :color="primary">
              <ion-icon :icon="bagCheckOutline" class="me-2"></ion-icon>
              Checkout
            </ion-button>
          </div>
        </section>
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="js">
import { defineComponent } from 'vue';
import {
    IonPage, IonHeader, IonToolbar,
    IonTitle, IonContent, IonButton,
    IonIcon, IonButtons, IonList,
    IonItem, IonItemSliding, IonItemOptions,
    IonItemOption
} from '@ionic/vue';
import { 
  arrowBackOutline, cartOutline, bagCheckOutline,
  trashOutline
} from 'ionicons/icons'
export default defineComponent({
  name: 'CartPage',
  components: {
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButton,
    IonIcon, IonButtons, IonList,
    IonItem, IonItemSliding, IonItemOptions,
    IonItemOption
 },
  setup() {
    return {
      arrowBackOutline, cartOutline, bagCheckOutline,
      trashOutline
    }
  },
  data() {
    return {

    }
  }
});
</script>

<style scoped>
.item-inner {
    padding-inline-end: 0 !important;
    padding-inline-start: 0 !important;
}
</style>

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
          <router-link to="/cart">
            <ion-button>
              <ion-icon slot="icon-only" :icon="cartOutline" color="dark"></ion-icon>
            </ion-button>
          </router-link>
        </ion-buttons>
        <ion-buttons slot="primary">
          <ion-button>
            <ion-icon slot="icon-only" :icon="personCircleOutline" color="dark"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title><img src="../../resources/icon.png" style="height:35px"></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" :scroll-events="true" :scroll-y="true">
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
            <ion-input placeholder="Search VIN" maxlength="17"></ion-input>
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
      <slider-component></slider-component>

      <!-- sliding chips-->
      <div class="position-relative;" style="width: 800px;">
          <sliding-chips></sliding-chips>
      </div>
      

      <!-- show popular items-->
      <popular-products-component></popular-products-component>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar,
IonTitle, IonContent, IonIcon,
IonButtons, IonSelect, IonSelectOption,
IonButton, IonInput} from '@ionic/vue';
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
import SliderComponent from '@/components/SliderComponent.vue';
import PopularProductsComponent from '@/components/PopularProductsComponent.vue';
import SlidingChips from '@/components/SlidingChips.vue';


export default  defineComponent({
  name: 'HomePage',
  components: {
    SliderComponent, PopularProductsComponent, SlidingChips,

    IonHeader, IonToolbar, IonTitle,
    IonContent, IonPage, IonButtons,
    IonIcon, IonSelect, IonSelectOption,
    IonButton, IonInput
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



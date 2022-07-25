<template>
  <div id="sliding-chips" class="p-3 pb-0 pt-0">
    <ion-chip class="p-4 bg-white me-2">
        <img src="../../resources/tipm.png" style="height:20px" class="me-2" />
        <ion-label color="dark">TIPM</ion-label>
    </ion-chip>
    <ion-chip class="p-4 bg-white me-2">
        <img src="../../resources/ecm.png" style="height:20px" class="me-2" />
        <ion-label color="dark">ECM</ion-label>
    </ion-chip>
    <ion-chip class="p-4 bg-white me-2">
        <ion-icon :icon="apps" color="dark"></ion-icon>
        <ion-label color="dark">Others</ion-label>
    </ion-chip>
    <!-- <ion-chip class="p-4 bg-white">
        <ion-icon :icon="build" color="dark"></ion-icon>
        <ion-label color="dark">Repairs</ion-label>
    </ion-chip>
    <ion-chip class="p-4 bg-white">
        <ion-icon :icon="carSport" color="dark"></ion-icon>
        <ion-label color="dark">Others</ion-label>
    </ion-chip> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {  apps, pin, closeCircle, build, carSport } from 'ionicons/icons';
import { IonIcon, IonLabel, IonChip  } from '@ionic/vue';

export default defineComponent({
  name: 'SlidingChips',
  props: {
    name: String
  },
  components: {
    IonIcon, IonLabel, IonChip 
  },
  setup() {
    return {
      apps, closeCircle, pin, build, carSport
    }
  }
});
</script>

<style scoped>
</style>

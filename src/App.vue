<template>
  <ion-app>
    <ion-router-outlet />

    <ion-modal ref="modalRequiredFieldsAddtocart"
      :is-open="isRequiredFieldsModalOpen"
      @didDismiss="toggleRequiredFieldsModal()"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button @click="cancel()"
              :style="'--color:' + (productSource == 'ECM' ? '#3A7CA5' : '#487436')">Cancel</ion-button>
            </ion-buttons>
            <ion-title class="text-center"><ion-icon :icon="cartOutline" class="me-2"></ion-icon> Add to Cart</ion-title>
            <ion-buttons slot="end">
              <ion-button :strong="true" @click="confirm()"
              :style="'--color:' + (productSource == 'ECM' ? '#3A7CA5' : '#487436')" disabled>Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <div class="p-4 pt-3 mb-5">
            <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="productSource == 'ECM'">
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark">
                  <h4 class="fw-bold mb-2 header-class">17-Digit VIN <span class="text-danger">*</span></h4>
                  Your VIN# is needed for us to program the unit.
                </ion-label>
                <ion-input class="mt-2 text-uppercase" ref="vinInput"></ion-input>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class">Current Mileage</h4>
                  Enter mileage and transmission type here or leave blank, and our Customer Service  team will reach out to you if needed for your ECM /PCM.
                  Mileage entered should be accurate to +/- 10 miles of actual when the ECM is installed.
                  If you plan to be driving this vehicle, leave blank and we will contact you before shipment or Call Us with Questions.
                </ion-label>
                <ion-input class="mt-2" type="number"></ion-input>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class">Transmission Type</h4>
                  Please confirm your Transmission Type:
                </ion-label>
                <ion-radio-group class="w-100">
                  <ion-item>
                    <ion-label>Automatic</ion-label>
                    <ion-radio slot="start" color="tertiary" value="apple"></ion-radio>
                  </ion-item>

                  <ion-item>
                    <ion-label>Manual</ion-label>
                    <ion-radio slot="start" color="tertiary" value="grape"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class">Rental Program Option</h4>
                  Sometimes after you purchase an ECM, you discover the real problem was not in the ECM and you just needed it for troubleshooting.
                  With MAK'S, you may convert your purchase to a rental at any time during the first 30 days.
                  See our <b>Warranty Information & Returns Policy</b> for more information.
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="productSource == 'TIPM'">
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark">
                  <h4 class="fw-bold mb-2 header-class-tipm">Verify VIN (Optional)</h4>
                </ion-label>
                <ion-input class="mt-2 text-uppercase" ref="vinInput"></ion-input>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">4x4 Check <span class="text-danger">*</span></h4>
                  Please confirm if your vehicle has 4x4 or not:
                </ion-label>
                <ion-radio-group class="w-100">
                  <ion-item>
                    <ion-label>With 4x4</ion-label>
                    <ion-radio slot="start" color="primary" value="with4x4"></ion-radio>
                  </ion-item>

                  <ion-item>
                    <ion-label>Without 4x4</ion-label>
                    <ion-radio slot="start" color="primary" value="without4x4"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">Lid Options <span class="text-danger">*</span></h4>
                  TIPM lids are not included in the price. The majority of TIPMs we rebuild come to us with missing or broken lids.
                  Re-using your old lid will help us and the environment. You may request a lid for a $15.00 surcharge.<br/><br/>
                  Re-using your old lid will not lower the value of your old TIPM under our Core Buyback Program.
                </ion-label>
                <ion-radio-group class="w-100">
                  <ion-item>
                    <ion-label>Include a Lid <b class="ms-2">$15.00</b></ion-label>
                    <ion-radio slot="start" color="primary" value="include-a-lid"></ion-radio>
                  </ion-item>

                  <ion-item>
                    <ion-label>No Lid Needed <b class="ms-2">$0.00</b></ion-label>
                    <ion-radio slot="start" color="primary" value="no-lid-needed"></ion-radio>
                  </ion-item>
                </ion-radio-group>
              </ion-item>
              <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
                <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
                  <h4 class="fw-bold mb-2 header-class-tipm">Rental Program Option</h4>
                  Sometimes after you purchase a TIPM, you discover the real problem was not in the TIPM and you just needed it for troubleshooting.
                  With MAK'S, you may convert your purchase to a rental at any time during the first 30 days.
                  See our <b>Warranty Information & Returns Policy</b> for more information.
                </ion-label>
              </ion-item>
            </ion-list>
          </div>
        </ion-content>
    </ion-modal>
  </ion-app>
</template>

<script lang="js">
import { IonApp, IonRouterOutlet, IonModal,
IonInput, IonLabel, IonItem, IonList, IonHeader, IonToolbar, IonButton, IonButtons } from '@ionic/vue';
import { 
  cartOutline
} from 'ionicons/icons'
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'App',
  data () {
    return {
      isRequiredFieldsModalOpen: false,
      selectedProduct: null,
      productSource: null,
    }
  },
  setup() {
    return {
      cartOutline
    }
  },
  components: {
    IonApp,
    IonRouterOutlet,
    IonModal,
    IonInput, IonLabel, IonItem, IonList,
    IonHeader, IonToolbar, IonButton, IonButtons
  },
  methods: {
    toggleRequiredFieldsModal: function (product) {
      if (product) {
        this.selectedProduct = product;
        this.productSource = product.source;
      }
      this.isRequiredFieldsModalOpen = !this.isRequiredFieldsModalOpen
    },
    cancel() {
      this.$refs.modalRequiredFieldsAddtocart.$el.dismiss(null, 'cancel');
    },
    confirm() {
      const vinNumber = this.$refs.vinInput.$el.value;
      if (vinNumber) {
        this.$refs.modalRequiredFieldsAddtocart.$el.dismiss(vinNumber, 'confirm');
      }
    },
  },
  mounted () {
    this.emitter.on('isShowRequiredFieldsModal', function (product) {
      this.toggleRequiredFieldsModal(product);
    }.bind(this));
  }
});
</script>

<style scoped>
.header-class {
  font-size: 20px; color: #3A7CA5;
}

.header-class-tipm {
  font-size: 20px; color: #487436
}
</style>
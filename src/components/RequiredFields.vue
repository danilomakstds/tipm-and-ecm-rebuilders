<template>
    <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="selectedProduct.source == 'ECM'">
        <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="vinNumber">
        <ion-label position="stacked" color="text-dark">
            <h4 class="fw-bold mb-2 header-class">17-Digit VIN <span class="text-danger">*</span></h4>
            Your VIN# is needed for us to program the unit.
        </ion-label>
        <ion-input type="text" class="mt-2 text-uppercase bg-light" v-model="vinInput" maxlength="17" placeholder="VIN Nunber" required></ion-input>
        </ion-item>
        <div>
        <div v-if="isVinMatchingLoading" class="d-flex justify-content-center align-items-center h-100">
            <dot-loader :loading="isVinMatchingLoading" :color="color" :size="size" class="mt-5"></dot-loader>
        </div>
        <div :class="'alert alert-'+(vinMatchingResult ? 'success' : 'danger')+' mt-2'" role="alert" v-if="showVinMatchingResult">
            Your Vehicle: <br/>{{vehicleNameVinResult}}<br/>
            <b>Your vehicle <span v-if="!vinMatchingResult">might not</span> matched this {{this.selectedProduct.source}}!</b>
        </div>
        <div class="alert alert-danger mt-2" role="alert" v-if="showifVinisInvalid">
            <b>You entered an invalid VIN number</b>
            <p v-html="vinErrorMessage"></p>
        </div>
        </div>
        <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
        <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
            <h4 class="fw-bold mb-2 header-class">Current Mileage</h4>
            Enter mileage and transmission type here or leave blank, and our Customer Service  team will reach out to you if needed for your ECM /PCM.
            Mileage entered should be accurate to +/- 10 miles of actual when the ECM is installed.
            If you plan to be driving this vehicle, leave blank and we will contact you before shipment or Call Us with Questions.
        </ion-label>
        <ion-input class="mt-2 bg-light" type="number" placeholder="Current Mileage" v-model="vehicleCurrentMileage"></ion-input>
        </ion-item>
        <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
        <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
            <h4 class="fw-bold mb-2 header-class">Transmission Type</h4>
            Please confirm your Transmission Type:
        </ion-label>
        <ion-radio-group class="w-100" v-model="vehicleTransmissionType">
            <ion-item>
            <ion-label>Automatic</ion-label>
            <ion-radio slot="start" color="tertiary" value="Automatic_0" ></ion-radio>
            </ion-item>

            <ion-item>
            <ion-label>Manual</ion-label>
            <ion-radio slot="start" color="tertiary" value="Manual_1"></ion-radio>
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

    <ion-list lines="full" class="ion-no-margin" mode="ios" v-if="selectedProduct.source == 'TIPM'">
        <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0">
        <ion-label position="stacked" color="text-dark">
            <h4 class="fw-bold mb-2 header-class-tipm">Verify VIN (Optional)</h4>
        </ion-label>
        <ion-input type="text" class="mt-2 text-uppercase bg-light" v-model="vinInput" maxlength="17" placeholder="VIN Nunber"></ion-input>
        </ion-item>
        <div>
        <div v-if="isVinMatchingLoading" class="d-flex justify-content-center align-items-center h-100">
            <dot-loader :loading="isVinMatchingLoading" :color="color" :size="size" class="mt-5"></dot-loader>
        </div>
        <div :class="'alert alert-'+(vinMatchingResult ? 'success' : 'danger')+' mt-2'" role="alert" v-if="showVinMatchingResult">
            Your Vehicle: <br/>{{vehicleNameVinResult}}<br/>
            <b>Your vehicle <span v-if="!vinMatchingResult">might not</span> matched this {{this.selectedProduct.source}}!</b>
        </div>
        <div class="alert alert-danger mt-2" role="alert" v-if="showifVinisInvalid">
            <b>You entered an invalid VIN number</b>
            <p v-html="vinErrorMessage"></p>
        </div>
        </div>
        <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" id="4x4checker">
        <ion-label position="stacked" color="text-dark" class="ion-text-wrap">
            <h4 class="fw-bold mb-2 header-class-tipm">4x4 Check <span class="text-danger">*</span></h4>
            Please confirm if your vehicle has 4x4 or not:
        </ion-label>
        <ion-radio-group class="w-100" v-model="vehicle4by4Check">
            <ion-item>
            <ion-label>With 4x4</ion-label>
            <ion-radio slot="start" color="primary" value="W/ 4x4_0"></ion-radio>
            </ion-item>

            <ion-item>
            <ion-label>Without 4x4</ion-label>
            <ion-radio slot="start" color="primary" value="W/O 4x4_1"></ion-radio>
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
        <ion-radio-group class="w-100" v-model="vehicleLidOptions">
            <ion-item>
            <ion-label>Include a Lid <b class="ms-2">$15.00</b></ion-label>
            <ion-radio slot="start" color="primary" value="Include a Lid_0"></ion-radio>
            </ion-item>

            <ion-item>
            <ion-label>No Lid Needed <b class="ms-2">$0.00</b></ion-label>
            <ion-radio slot="start" color="primary" value="No Lid Needed_1"></ion-radio>
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
        <ion-item lines="none" class="ion-no-padding mb-2" style="--inner-padding-end:0" v-if="productsWithCoreRefund.includes(selectedProduct.id.toString())">
        <ion-label position="stacked" color="text-dark"  class="ion-text-wrap">
            <h4 class="fw-bold mb-2 header-class-tipm">Core Refund Program</h4>
            Use slider to set your own core fee and get double your money back!
        </ion-label>
        </ion-item>
        <span v-if="productsWithCoreRefund.includes(selectedProduct.id.toString())">
            <ion-range :min="0" :max="75" v-model="vehicleCoreFee" >
                <ion-label slot="end">Core Fee: $ {{parseInt(vehicleCoreFee)}}.00</ion-label>
            </ion-range>
            <span>You get back <b>${{parseInt(vehicleCoreFee)*2}}.00</b> when you send in your old core under our <b class="color-primary">Core Buyback Program</b>.</span>
        </span>
    </ion-list>
</template>
  
<script lang="js">
  import { defineComponent } from 'vue';
  import SettingsConstants from '../constants/settings.constants'
  import Mixin from '../mixins/global.mixin'
  import axios from 'axios'
  import {
    IonInput, IonRadio, IonRadioGroup, IonRange,
    IonList, IonItem, IonLabel,
  } from '@ionic/vue';
  import DotLoader from 'vue-spinner/src/DotLoader.vue'
  
  export default defineComponent({
    name: 'RequiredFields',
    mixins: [Mixin],
    props: {
        selectedProduct: null,
        productsWithCoreRefund: []
    },
    watch: {
        vinInput: function (newVal) {
            if (newVal.length == 17) {
                if (this.validateVin(newVal)) {
                this.showifVinisInvalid = false;
                this.getVinDetails(newVal);
                } else {
                this.showifVinisInvalid = true;
                this.vinErrorMessage = 'Double check your VIN or <a target="_blank" href="https://vpic.nhtsa.dot.gov/decoder/CheckDigit/Index/'+newVal+'" class="text-decoration-none">Click here</a> for more details';
                }
            } else {
                this.showVinMatchingResult = false,
                this.vehicleNameVinResult = null,
                this.vinMatchingResult = false,
                this.isVinMatchingLoading = false;
                this.showifVinisInvalid = false;
            }
        },
        vehicleLidOptions: function (newVal) {
            var price = this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00';
            if (newVal == 'Include a Lid_0') {
                this.lidOptionsPrice = this.addPriceifLidIncluded;
            } else {
                this.lidOptionsPrice = 0;
            }
            this.computePrice(price);
        },
        vehicleCoreFee: function (newVal) {
            var price = this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00';
            this.coreFeePrice  = parseInt(newVal);
            this.computePrice(price);
        },
    },
    data () {
        return {
            vinInput: null,
            showVinMatchingResult: false,
            vehicleNameVinResult: null,
            vehicleCurrentMileage: null,
            vehicleTransmissionType: null,
            vinMatchingResult: false,
            isVinMatchingLoading: false,
            vehicleLidOptions: null,
            lidOptionsPrice: 0,
            coreFeePrice: 0,
            productOptionsTotalPrice: 0,
            vehicle4by4Check: null,
            vehicleCoreFee: SettingsConstants.ADDED_PRICE_OF_DEFAULT_COREFEE,
            addPriceifLidIncluded: 0,
            defaultCoreFee: SettingsConstants.ADDED_PRICE_OF_DEFAULT_COREFEE,
            vinErrorMessage: null,
            showifVinisInvalid: false,

            productPrice: null
        }
    },
    components: {
      DotLoader,

      IonInput, IonRadio, IonRadioGroup, IonRange,
      IonList, IonItem, IonLabel
    },
    methods: {
        computePrice: function (price) {
            var addedPrice = this.coreFeePrice + this.lidOptionsPrice;
            this.productPrice = parseFloat(price) + parseFloat(addedPrice);
            this.productPrice = this.formatRegularPrice(this.productPrice.toString());
        },
        getVinDetails: function (vin) {
        this.isVinMatchingLoading = true;
        this.showVinMatchingResult = false;
        axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/'+vin+'?format=json', { crossdomain: true })
            .then(function (response) {
                if (response.data) {
                var trim = ``;
                var possibleSlugvalues = [];
                var year = response.data.Results.filter(function (vin) { return vin.Variable == 'Model Year'})[0].Value;
                if (year) {
                    var make = response.data.Results.filter(function (vin) { return vin.Variable == 'Make'})[0].Value.toLowerCase();
                    var model = response.data.Results.filter(function (vin) { return vin.Variable == 'Model'})[0].Value.replace(' and ',' ').toLowerCase();
                    var engine = response.data.Results.filter(function (vin) { return vin.Variable == 'Displacement (L)'})[0].Value;
                    if (engine == '5.9' && make.toLowerCase() == 'dodge') {
                    model = model + ' 2500';
                    }
                    if (!engine.includes('.')) {
                    engine = engine+'.0L';
                    } else {
                    engine = engine+'L';
                    }
                    if (response.data.Results.filter(function (vin) { return vin.Variable == 'Trim'})[0].Value) {
                    trim = response.data.Results.filter(function (vin) { return vin.Variable == 'Trim'})[0].Value.toLowerCase();
                    if (model.toLowerCase() == 'ram') {
                        switch (trim.toLowerCase()) {
                            case 'cargo van':
                                trim = 'c-v';
                                break;
                            case 'dt':
                                trim = '';
                                break;
                            default:
                                trim = trim.replace(/\D/g, '');
                                break;
                        }
                    }
                    possibleSlugvalues.push(model+'-'+trim+'-'+make+'-'+year);
                    }
                    possibleSlugvalues.push(model+'-'+make+'-'+year);
                    if (model.split(' ').length > 1) {
                    model.split(' ').forEach( function (m){
                        possibleSlugvalues.push(m+'-'+make+'-'+year);
                        if (trim) {
                            possibleSlugvalues.push(m+'-'+trim+'-'+make+'-'+year);
                        }
                    })
                    }
                    if (model.split('/').length > 1) {
                        possibleSlugvalues.push(model.split('/')[0].replace(/\s/g,'-')+'-'+make+'-'+year);
                        possibleSlugvalues.push(model.split('/')[1].replace(/\s/g,'-')+'-'+make+'-'+year);
                    }
                    var matchCount = 0;
                    possibleSlugvalues.forEach( function (slug, idx, array){
                    slug = slug.replace(/\s/g,'-');
                    this.vehicleNameVinResult = (year+` `+response.data.Results.filter(function (vin) { return vin.Variable == 'Make'})[0].Value+` `+response.data.Results.filter(function (vin) { return vin.Variable == 'Model'})[0].Value+` `+trim+` `+engine).toUpperCase();
                    if (this.selectedProduct.source == 'ECM') {
                        if (this.selectedProduct.categories.filter((cat) => cat.slug == slug).length && this.selectedProduct.name.includes(engine)) {
                        matchCount++;
                        this.vinMatchingResult = true;
                        }
                    } else {
                        if (this.selectedProduct.categories.filter((cat) => cat.slug == slug).length) {
                        matchCount++;
                        this.vinMatchingResult = true;
                        }
                    }
                    if (idx === array.length - 1 && matchCount == 0) {
                        this.vinMatchingResult = false;
                    }
                    if (idx === array.length - 1) {
                        this.showVinMatchingResult = true;
                    }
                    this.isVinMatchingLoading = false;
                    }.bind(this));
                } else {
                    this.isVinMatchingLoading = false;
                }
                }
            }.bind(this));
        },
    },
    mounted () {
        this.addPriceifLidIncluded = SettingsConstants.ADDED_PRICE_OF_LID;
        this.defaultCoreFee = SettingsConstants.ADDED_PRICE_OF_DEFAULT_COREFEE;
        if (this.productsWithCoreRefund.includes(this.selectedProduct.id.toString())) {
            this.coreFeePrice = this.defaultCoreFee;
            this.vehicleCoreFee = this.defaultCoreFee;
            this.computePrice(this.selectedProduct.price.includes('.') ? this.selectedProduct.price : this.selectedProduct.price+'.00');
        }
    }
  });
</script>
  

  
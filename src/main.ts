import { createApp } from 'vue'
//import VueGoogleMaps from '@fawmi/vue-google-maps'
import App from './App.vue'
import router from './router';
import store from './store'

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';


import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

// Above the createApp() line
import { defineCustomElements } from '@ionic/pwa-elements/loader';


import mitt from 'mitt';
const emitter = mitt();

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(VueViewer);
  // .use(VueGoogleMaps, {
  //   load: {
  //         key: 'AIzaSyDX_bIjjI3y6-CzvDu-p1XAJMeuXyXLxfY',
  //     },
  // });

app.config.globalProperties.emitter = emitter;
  
router.isReady().then(() => {
  app.mount('#app');
});

defineCustomElements(window);
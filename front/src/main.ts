import './assets/main.css'
import 'balm-ui/dist/balm-ui.css';

import { createApp } from 'vue'
import App from './App.vue'
import BalmUI from 'balm-ui'; // Official Google Material Components

const app = createApp(App)
    .use(BalmUI)
    .mount('#app');

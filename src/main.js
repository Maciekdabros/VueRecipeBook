import { createApp } from "vue";
import { createPinia } from 'pinia';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');
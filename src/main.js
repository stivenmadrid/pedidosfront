import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import VueSweetalert2 from 'vue-sweetalert2';
import 'bootstrap/dist/js/bootstrap';

// Configurar Laravel Echo
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'f58064020a5f1a695b6d',
  cluster: 'us2',
  encrypted: true,
});

const app = createApp(App)

// Uso del plugin
app.use(VueSweetalert2);
app.use(createPinia())
app.use(router)

app.mount('#app')


import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueSweetalert2 from 'vue-sweetalert2';
window.$ = window.jQuery = require('jquery');
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import 'select2/dist/css/select2.min.css';
import 'select2-bootstrap-theme/dist/select2-bootstrap.min.css';

// Configurar Laravel Echo
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'f58064020a5f1a695b6d',
  cluster: 'us2',
  encrypted: true,
});

const app = createApp(App);

// Uso del plugin
app.use(VueSweetalert2);

app.use(store).use(router).mount('#app');

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap';
import Chart from 'chart.js';

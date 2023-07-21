import Echo from 'laravel-echo';

window.Pusher = require('pusher-js');

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'f58064020a5f1a695b6d', // Reemplaza 'your-pusher-key' con tu clave de Pusher
  cluster: 'us2', // Reemplaza 'your-pusher-cluster' con tu clúster de Pusher
  encrypted: true,
});

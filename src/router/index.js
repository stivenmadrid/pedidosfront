import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import MesaCreate from '../views/Mesas/MesaCreate.vue';
import PedidoLiberados from '../views/Pedidos/PedidoLiberados.vue';
import RegistrarPedido from '../views/Pedidos/RegistrarPedido.vue';
import PedidosCocina from '../views/Pedidos/PedidosCocina.vue';
import loginautenticate from '../views/Login/loginautenticate.vue';
import categoriaList from '../views/Categorias/categoriaList.vue';
import ProductosList from '../views/Productos/ProductosList.vue';
import pagos from '../views/PagosGenerados/pagos.vue';
import pagosVue from '../views/PagosGenerados/pagos.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'loginautenticate',
      component: loginautenticate,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true, // Establece la propiedad requiresAuth como true para requerir autenticación en la ruta
      },
    },
    {
      path: '/Mesas',
      name: 'CrearMesa',
      component: MesaCreate,
      meta: {
        requiresAuth: true, // Requiere autenticación en esta ruta
      },
    },
    {
      path: '/Categorias',
      name: 'ListarCategorias',
      component: categoriaList,
      meta: {
        requiresAuth: true, // Establece la propiedad requiresAuth como true para requerir autenticación en la ruta
      },
    },
    {
      path: '/pagos-generados',
      name: 'pagos',
      component: pagos,
      meta: {
        requiresAuth: true, // Establece la propiedad requiresAuth como true para requerir autenticación en la ruta
      },
    },
    {
      path: '/Productos',
      name: 'ListarProductos',
      component: ProductosList,
      meta: {
        requiresAuth: true,  // Establece la propiedad requiresAuth como true para requerir autenticación en la ruta
      },
    },
    {
      path: '/pedidos-liberados',
      name: 'ListaPedido',
      component: PedidoLiberados,
      meta: {
        requiresAuth: true, // Requiere autenticación en esta ruta
      },
    },
    {
      path: '/pedidos-cocina',
      name: 'pedidoscocina',
      component: PedidosCocina,
      meta: {
        requiresAuth: true, // Requiere autenticación en esta ruta
      },
    },
    {
      path: '/Registrar-Pedidos',
      name: 'Registrar-pedidos',
      component: RegistrarPedido,
      meta: {
        requiresAuth: true, // Requiere autenticación en esta ruta
      },
    },
  ]
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token'); // Verifica si hay un token de acceso en localStorage

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login'); // Redirige al inicio de sesión si la ruta requiere autenticación y el usuario no está autenticado
  } else if (to.name === 'loginautenticate' && isLoggedIn) {
    next('/'); // Si el usuario ya ha iniciado sesión y está intentando acceder a la página de inicio de sesión, redirige a la vista "home"
  } else {
    next(); // Continúa navegando a la siguiente ruta
  }
});

export default router

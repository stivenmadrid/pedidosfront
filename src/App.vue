<template>
  <div>
    <nav v-if="$route.path !== '/Login'" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">SISTEMA DE PEDIDOS</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact>Home</router-link>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Pedidos
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="Registrar-Pedidos"
                    >Generar Pedido</router-link
                  >
                </li>

                <router-link class="dropdown-item" to="/pedidos-liberados"
                  >Pedidos liberados</router-link
                >

                <li>
                  <router-link class="dropdown-item" to="/pedidos-cocina"
                    >Pedidos Cocina</router-link
                  >
                </li>
              </ul>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tienda
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/Mesas">Registrar mesas</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/Categorias"
                    >Registrar categorias</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item" to="/Productos"
                    >Registrar productos</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Finanzas
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/pagos-generados"
                    >Pagos generados</router-link
                  >
                </li>
                <li>
                  <router-link class="dropdown-item" to="/">Indicadores</router-link>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!hiddenRoutes.includes($route.name)">
              <router-link to="/Login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item">
              <a @click="logout" class="nav-link">Salir</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div v-if="$route.path === '/Login'">
      <!-- Contenido de la página de inicio de sesión -->
    </div>

    <router-view />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    hiddenRoutes() {
      return [
        'home',
        'Registrar-pedidos',
        'ListaPedido',
        'pedidoscocina',
        'CrearMesa',
        'ListarCategorias',
        'ListarProductos'
      ]
    }
  },
  methods: {
    logout() {
      // Obtiene el token de acceso almacenado en localStorage
      const token = localStorage.getItem('token')

      // Verifica si se ha almacenado un token en localStorage
      if (token) {
        // Configura el encabezado de autorización con el token de acceso
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

        // Realiza una solicitud al backend para cerrar la sesión del usuario
        axios
          .post('https://pedidos.test/api/logout', {}, config)
          .then(() => {
            // Elimina el token de acceso almacenado en localStorage
            localStorage.removeItem('token')
            // Redirige al usuario a la página de inicio o a la página de login
            this.$router.push('/Login')
          })
          .catch((error) => {
            // Maneja el error de logout
            console.error(error)
          })
      }
    }
  }
}
</script>

<style scoped>
/* Estilos para la barra de navegación */
.navbar {
  padding: 10px; /* Reduce el padding para pantallas pequeñas */
}

.navbar-brand {
  font-size: 24px;
}

.navbar-nav .nav-link {
  font-size: 16px; /* Reduce el tamaño de fuente para pantallas pequeñas */
}

/* Estilos para el contenido */
.container {
  max-width: 1200px; /* Ajusta el ancho del contenido para pantallas grandes */
  margin: 0 auto; /* Centra el contenido */
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 767px) {
  .navbar-brand {
    font-size: 20px;
  }

  .navbar-nav .nav-link {
    font-size: 14px;
  }
}
</style>

<template>
  <div class="container-fluid vh-100" style="overflow-y: auto; max-height: 100vh">
    <h1 class="title">PEDIDOS EN LA COCINA</h1>

    <div v-if="cargando" class="loading-message">Cargando...</div>

    <div v-else-if="pedidos.length === 0" class="empty-message">No hay pedidos disponibles</div>

    <div v-else class="scrollable-container">
      <div class="row">
        <div
          class="col-lg-4 col-md-6"
          v-for="(pedido, index) in pedidos.slice().reverse()"
          :key="pedido.id"
        >
          <div class="card">
            <h2 class="card-title">Pedido #{{ pedido.id }}</h2>

            <p>Mesa: {{ pedido.mesa ? pedido.mesa.nombre : 'Pedido para llevar' }}</p>

            <p v-if="!pedido.mesa">Cliente: {{ pedido.cliente }}</p>

            <p :class="{ 'status-new': pedido.estado === 'Nuevo pedido' }">
              Estado: {{ pedido.estado }}
            </p>

            <p>Total: {{ formatCurrency(pedido.total) }}</p>

            <p>Fecha: {{ pedido.created_at }}</p>

            <div v-if="pedido.productos">
              <h3>Productos:</h3>
              <ul>
                <li v-for="producto in pedido.productos" :key="producto.id">
                  {{ producto.nombre }} (Cantidad: {{ producto.pivot.cantidad }})
                  <br />
                  <template v-if="producto.pivot.observacion">
                    Observaciones: {{ producto.pivot.observacion }}
                  </template>
                </li>
              </ul>
            </div>

            <button class="btn btn-primary" @click="liberarPedido(pedido.id)">
              <i class="fa-solid fa-edit"></i> Procesar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import sonidoNuevoPedido from '@/assets/notipedidos.mp3'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      cargando: true,
      pedidos: [],
      reproduciendoSonido: false
    }
  },
  mounted() {
    this.cargarPedidos()
    this.escucharEventos()
  },
  methods: {
    cargarPedidos() {
      console.log('Iniciando la carga de pedidos...')

      axios
        .get('http://127.0.0.1:8000/api/v1/pedidos-cocina', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          console.log('Pedidos cargados:', response.data)
          this.pedidos = response.data
          this.cargando = false
        })
        .catch((error) => {
          console.error('Error cargando los pedidos:', error)
          this.cargando = false
        })
    },
    escucharEventos() {
      console.log('Iniciando escucha de eventos...')

      window.Echo.channel('pedidos').listen('NuevoPedidoEvent', (data) => {
        console.log('Evento NuevoPedidoEvent recibido:', data)
        this.pedidos.push(data.pedido)

        if (!this.reproduciendoSonido) {
          this.reproducirSonidoNuevoPedido()
        }
      })
    },
    reproducirSonidoNuevoPedido() {
      console.log('Intentando reproducir el sonido...')

      this.reproduciendoSonido = true

      const audio = new Audio(sonidoNuevoPedido)
      audio
        .play()
        .then(() => {
          console.log('Sonido reproducido exitosamente.')
          this.reproduciendoSonido = false
        })
        .catch((error) => {
          console.error('Error al reproducir el sonido:', error)
          this.reproduciendoSonido = false
        })
    },
    liberarPedido(pedidoId) {
      axios
        .put(
          `http://127.0.0.1:8000/api/v1/liberar-pedido/${pedidoId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        .then((response) => {
          const pedidoIndex = this.pedidos.findIndex((pedido) => pedido.id === pedidoId)
          if (pedidoIndex !== -1) {
            this.pedidos[pedidoIndex].estado = 'Liberado'
            const message = response.data.message
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: message,
              timer: 800,
              timerProgressBar: true,
              didClose: () => {
                location.reload()
              }
            })
          }
        })
        .catch((error) => {
          console.error('Error al liberar el pedido:', error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo liberar el pedido. Por favor, intenta nuevamente.'
          })
        })
    },
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('es-CO')
      return formatter.format(value)
    }
  }
}
</script>

<style scoped>
.container-fluid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('https://www.wallpapertip.com/wmimgs/12-124086_817988-title-food-burger-french-fries-wallpaper-burger.jpg');
  background-repeat: repeat;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding-bottom: 20px;
}

.title {
  font-size: 56px;
  font-weight: bold;
  color: white;
  border-radius: 30px;
  margin-bottom: 20px;
  animation: slideInUp 1s ease;
  -webkit-text-stroke: 2px orangered;
  color: white;
}

.loading-message,
.empty-message {
  color: #fff;
  font-size: 24px;
  margin-top: 50px;
}

.scrollable-container {
  overflow-y: auto;
  max-height: calc(100vh - 100px); /* Ajusta según sea necesario */
}

.row {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch; /* Añade este estilo */
}

.col-lg-4 {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Añade este estilo */
}

.card {
  background: linear-gradient(135deg, #f0f4f8, #d9dde8);
  border-radius: 30px;
  padding: 20px;
  margin: 1em;
  box-shadow: 0px 10px 20px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in;
  cursor: pointer;
  text-align: center;
  flex-grow: 1;
  min-height: 0;
}

.card:hover {
  box-shadow: 0px 20px 30px -5px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.card-title {
  color: #09203f;
  font-size: 1.4em;
  margin-bottom: 0.5em;
}

.status-new {
  color: white;
  background-color: #537895;
  display: inline-block;
  font-size: 0.8em;
  padding: 2px 6px;
  border-radius: 15px;
}

.scrollable-container {
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.scrollable-container::-webkit-scrollbar {
  width: 6px;
}

.scrollable-container::-webkit-scrollbar-track {
  background-color: transparent;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.btn-primary {
  background-color: #ff6f00;
}
</style>

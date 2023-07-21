<template>
  <div class="containers">
    <h1 class="title">REGISTRAR PEDIDOS</h1>
    <div class="flex-container">
      <div class="card text-center">
        <div class="card-body">
          <h5 class="card-title">Crear Pedido sin Mesa</h5>
          <p class="card-text">
            Haz clic en el siguiente botón para crear un pedido sin asignar a una mesa.
          </p>
          <button class="btn btn-primary" @click="abrirModalSinMesa">Crear Pedido</button>
        </div>
      </div>

      <div class="card text-center">
        <div class="card-body">
          <h5 class="card-title">Crear Pedido con Mesa</h5>
          <p class="card-text">
            Haz clic en el siguiente botón para crear un pedido asignado a una mesa.
          </p>
          <button class="btn btn-primary" @click="abrirModalConMesa">Crear Pedido</button>
        </div>
      </div>
    </div>
    <!-- Modal para pedidos con mesa -->
    <div v-if="showModalConMesa" class="modal-background" @click="cerrarModalConMesa">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Agregar Pedido con Mesa</h3>
        <form @submit.prevent="crearPedidoConMesa">
          <div class="field">
            <label class="label">Mesa:</label>
            <div class="control">
              <select v-model="nuevoPedidoConMesa.mesa_id" required class="form-control">
                <option value="" disabled selected>Seleccione una mesa</option>
                <option v-for="mesa in mesas" :value="mesa.id">{{ mesa.nombre }}</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label class="label">Productos:</label>
            <div class="control">
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Observaciones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(producto, index) in nuevoPedidoConMesa.productos" :key="index">
                      <td>
                        <select
                          v-model="producto.id"
                          @change="actualizarTotalConMesa"
                          required
                          class="form-control"
                        >
                          <option value="" disabled selected>Seleccione un producto</option>
                          <option v-for="producto in productos" :value="producto.id">
                            {{ producto.nombre }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <input
                          v-model="producto.cantidad"
                          class="form-control"
                          type="number"
                          placeholder="Cantidad"
                          @input="actualizarTotalConMesa"
                          required
                        />
                      </td>
                      <td>
                        <input
                          v-model="producto.observaciones"
                          class="form-control"
                          type="text"
                          placeholder="Observaciones"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="eliminarProductoConMesa(index)"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button type="button" class="btn btn-primary" @click="agregarProductoConMesa">
                Agregar Producto
              </button>
            </div>
          </div>
          <div class="field">
            <label class="label">Total a pagar:</label>
            <div class="control">
              <input
                v-model="nuevoPedidoConMesa.total"
                class="form-control"
                type="number"
                disabled
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button type="submit" class="btn btn-secondary">Crear Pedido</button>
              <button type="button" class="btn btn-secondary" @click="cerrarModalConMesa">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para pedidos sin mesa -->
    <div v-if="showModalSinMesa" class="modal-background" @click="cerrarModalSinMesa">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">Agregar Pedido sin Mesa</h3>
        <form @submit.prevent="crearPedidoSinMesa">
          <div class="field">
            <label class="label">Cliente:</label>
            <div class="control">
              <input
                v-model="nuevoPedidoSinMesa.cliente"
                class="form-control"
                type="text"
                placeholder="Nombre del cliente"
                required
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Productos:</label>
            <div class="control">
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Observaciones</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(producto, index) in nuevoPedidoSinMesa.productos" :key="index">
                      <td>
                        <select
                          v-model="producto.id"
                          @change="actualizarTotalSinMesa"
                          required
                          class="form-control"
                        >
                          <option value="" disabled selected>Seleccione un producto</option>
                          <option v-for="producto in productos" :value="producto.id">
                            {{ producto.nombre }}
                          </option>
                        </select>
                      </td>
                      <td>
                        <input
                          v-model="producto.cantidad"
                          class="form-control"
                          type="number"
                          placeholder="Cantidad"
                          @input="actualizarTotalSinMesa"
                          required
                        />
                      </td>
                      <td>
                        <input
                          v-model="producto.observaciones"
                          class="form-control"
                          type="text"
                          placeholder="Observaciones"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="eliminarProductoSinMesa(index)"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="control">
              <button type="button" class="btn btn-primary" @click="agregarProductoSinMesa">
                Agregar Producto
              </button>
            </div>
          </div>
          <div class="field">
            <label class="label">Total a pagar:</label>
            <div class="control">
              <input
                v-model="nuevoPedidoSinMesa.total"
                class="form-control"
                type="number"
                disabled
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button type="submit" class="btn btn-secondary">Crear Pedido</button>
              <button type="button" class="btn btn-secondary" @click="cerrarModalSinMesa">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      mesas: [],
      productos: [],
      imagenUrl:
        'https://img.freepik.com/fotos-premium/mesa-madera-vacia-fondo-interior-borroso-cafeteria-o-restaurante-puede-utilizar-exhibicion-producto_7188-1500.jpg',
      showModalSinMesa: false,
      showModalConMesa: false,
      nuevoPedidoSinMesa: {
        cliente: '',
        estado: 'Nuevo pedido sin mesa',
        total: 0,
        productos: []
      },
      nuevoPedidoConMesa: {
        mesa_id: null,
        estado: 'Nuevo pedido',
        total: 0,
        productos: []
      }
    }
  },
  mounted() {
    this.getMesas()
    this.getProductos()
  },
  methods: {
    getMesas() {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      axios
        .get('http://127.0.0.1:8000/api/v1/Mesas')
        .then((response) => {
          this.mesas = response.data.map((mesa) => ({
            id: mesa.id,
            nombre: mesa.nombre,
            capacidad: mesa.capacidad,
            Estado: mesa.Estado,
            Descripcion: mesa.Descripcion,
            imagenUrl: this.imagenUrl
          }))
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getProductos() {
      axios
        .get('http://127.0.0.1:8000/api/v1/productos')
        .then((response) => {
          this.productos = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    abrirModalSinMesa() {
      this.resetNuevoPedidoSinMesa()
      this.showModalSinMesa = true
    },
    cerrarModalSinMesa() {
      this.showModalSinMesa = false
      this.resetNuevoPedidoSinMesa()
    },
    resetNuevoPedidoSinMesa() {
      this.nuevoPedidoSinMesa.cliente = ''
      this.nuevoPedidoSinMesa.total = 0
      this.nuevoPedidoSinMesa.productos = []
    },
    agregarProductoSinMesa() {
      this.nuevoPedidoSinMesa.productos.push({ id: null, cantidad: null, observaciones: '' })
    },
    eliminarProductoSinMesa(index) {
      this.nuevoPedidoSinMesa.productos.splice(index, 1)
      this.actualizarTotalSinMesa()
    },
    actualizarTotalSinMesa() {
      let total = 0
      for (const producto of this.nuevoPedidoSinMesa.productos) {
        const productoSeleccionado = this.productos.find((p) => p.id === producto.id)
        if (productoSeleccionado) {
          total += productoSeleccionado.precio * producto.cantidad
        }
      }
      this.nuevoPedidoSinMesa.total = total
    },
    crearPedidoSinMesa() {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      axios
        .post('http://127.0.0.1:8000/api/v1/pedidos-cocina/store', this.nuevoPedidoSinMesa)
        .then((response) => {
          Swal.fire({
            title: 'Éxito!',
            text: 'Pedido sin mesa creado exitosamente',
            icon: 'success'
          })
          this.cerrarModalSinMesa()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al crear el pedido sin mesa'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al crear el pedido sin mesa:', error)
        })
    },
    abrirModalConMesa() {
      this.resetNuevoPedidoConMesa()
      this.showModalConMesa = true
    },
    cerrarModalConMesa() {
      this.showModalConMesa = false
      this.resetNuevoPedidoConMesa()
    },
    resetNuevoPedidoConMesa() {
      this.nuevoPedidoConMesa.mesa_id = null
      this.nuevoPedidoConMesa.total = 0
      this.nuevoPedidoConMesa.productos = []
    },
    agregarProductoConMesa() {
      this.nuevoPedidoConMesa.productos.push({ id: null, cantidad: null, observaciones: '' })
    },
    eliminarProductoConMesa(index) {
      this.nuevoPedidoConMesa.productos.splice(index, 1)
      this.actualizarTotalConMesa()
    },
    actualizarTotalConMesa() {
      let total = 0
      for (const producto of this.nuevoPedidoConMesa.productos) {
        const productoSeleccionado = this.productos.find((p) => p.id === producto.id)
        if (productoSeleccionado) {
          total += productoSeleccionado.precio * producto.cantidad
        }
      }
      this.nuevoPedidoConMesa.total = total
    },
    crearPedidoConMesa() {
      const token = localStorage.getItem('token')
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      axios
        .post('http://127.0.0.1:8000/api/v1/pedidos-cocina/store', this.nuevoPedidoConMesa)
        .then((response) => {
          Swal.fire({
            title: 'Éxito!',
            text: 'Pedido con mesa creado exitosamente',
            icon: 'success'
          })
          this.cerrarModalConMesa()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al crear el pedido con mesa'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al crear el pedido con mesa:', error)
        })
    }
  }
}
</script>

<style scoped>
.containers {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('https://www.wallpapertip.com/wmimgs/12-124086_817988-title-food-burger-french-fries-wallpaper-burger.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
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

.flex-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2em;
}

.card {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 2em;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1em;
  max-width: 300px;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
}

.card-title {
  font-size: 1.6em;
  font-weight: bold;
  color: #333;
  margin-bottom: 1em;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 1em 2em;
  font-size: 1.2em;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #fff;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
  outline: none;
  border: none;
}

.btn-primary {
  background-color: #ff6f00;
}

.btn-secondary {
  background-color: #537895;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-background {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: background-color 0.3s ease-in-out;
  animation: fadeIn 0.3s ease-in-out forwards;
}

.modal-content {
  background-color: #f0f4f8;
  padding: 2em;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  animation: scaleIn 0.3s ease-in-out forwards;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 2em;
  color: #537895;
  margin-bottom: 1em;
  text-align: center;
  font-weight: 600;
}

.form {
  margin-top: 2em;
}

.form .field {
  margin-bottom: 1.5em;
}

.form .field label {
  font-weight: bold;
  color: #333;
}

.form .field .table {
  width: 100%;
  margin-bottom: 1em;
  border-collapse: collapse;
}

.form .field .table th,
.form .field .table td {
  padding: 0.5em;
  text-align: center;
  border-bottom: 1px solid #ccc;
}

.form .field .table th {
  font-weight: bold;
}

.form .field .table td select,
.form .field .table td input {
  width: 100%;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;
}

.form .field .table td select:focus,
.form .field .table td input:focus {
  outline: none;
  border-color: #537895;
}

.form .field .btn-primary,
.form .field .btn-secondary {
  margin-top: 1em;
}

@keyframes fadeIn {
  from {
    background-color: rgba(0, 0, 0, 0);
  }
  to {
    background-color: rgba(0, 0, 0, 0.8);
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

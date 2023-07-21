<template>
  <div class="container-fluid vh-100" style="overflow-y: auto; max-height: 100vh">
    <br />
    <button @click="abrirModal" class="btn btn-primary">Agregar producto</button>

    <h1 class="title">Listado de productos</h1>

    <div class="table-responsive">
      <table class="table table-striped" ref="dataTable">
        <thead class="table-dark">
          <tr>
            <th scope="col">id#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripción</th>
            <th scope="col">Precio</th>
            <th scope="col">Categoría</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody class="table-group-divider">
          <tr v-for="producto in productos" :key="producto.id">
            <td>{{ producto.id }}</td>
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.descripcion }}</td>
            <td>{{ formatNumber(producto.precio) }}</td>
            <td>{{ producto.categoria.Nombre_Categoria }}</td>
            <td>
              <button class="btn btn-primary" @click="abrirModalEdicionConProducto(producto)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger" @click="eliminarProducto(producto.id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal para agregar producto -->
  <div class="modal" :class="{ 'is-active': mostrarModal }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title">Agregar producto</h3>
        <form @submit.prevent="crearProducto">
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input v-model="nuevoProducto.nombre" class="form-control" type="text" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Descripción</label>
            <div class="control">
              <input
                v-model="nuevoProducto.descripcion"
                class="form-control"
                type="text"
                required
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Precio</label>
            <div class="control">
              <input v-model="nuevoProducto.precio" class="form-control" type="number" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Categoría</label>
            <div class="control">
              <select v-model="nuevoProducto.categoria_id" class="form-control" required>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.Nombre_Categoria }}
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <br />
              <button type="submit" class="btn btn-primary">Crear</button>
              <button type="button" class="btn btn-secondary" @click="cancelarCreacion">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal para editar producto -->
  <div class="modal" :class="{ 'is-active': mostrarModalEdicion }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="title">Editar Producto</h3>
        <form @submit.prevent="editarProducto">
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input
                v-model="productoSeleccionado.nombre"
                class="form-control"
                type="text"
                required
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Descripción</label>
            <div class="control">
              <input
                v-model="productoSeleccionado.descripcion"
                class="form-control"
                type="text"
                required
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Precio</label>
            <div class="control">
              <input
                v-model="productoSeleccionado.precio"
                class="form-control"
                type="number"
                required
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Categoría</label>
            <div class="control">
              <select v-model="productoSeleccionado.categoria_id" class="form-control" required>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                  {{ categoria.Nombre_Categoria }}
                </option>
              </select>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <br />
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-secondary" @click="cancelarEdicion">
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
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-responsive-dt/css/responsive.dataTables.css'
export default {
  data() {
    return {
      productos: [],
      categorias: [],
      mostrarModal: false,
      mostrarModalEdicion: false,
      nuevoProducto: {
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: ''
      },
      productoSeleccionado: {
        id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: ''
      }
    }
  },
  mounted() {
    this.getProductos()
    this.getCategorias()
  },
  updated() {
    this.$nextTick(function () {
      if (!$.fn.dataTable.isDataTable(this.$refs.dataTable)) {
        $(this.$refs.dataTable).DataTable()
      }
    })
  },
  methods: {
    getProductos() {
      const token = localStorage.getItem('token')

      axios
        .get('http://127.0.0.1:8000/api/v1/productos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.productos = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    getCategorias() {
      const token = localStorage.getItem('token')

      axios
        .get('http://127.0.0.1:8000/api/v1/categorias', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.categorias = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    abrirModal() {
      this.mostrarModal = true
    },
    cancelarCreacion() {
      this.cerrarModal()
    },
    cerrarModal() {
      this.mostrarModal = false
      this.resetForm()
    },
    resetForm() {
      this.nuevoProducto = {
        nombre: '',
        descripcion: '',
        precio: '',
        categoria_id: ''
      }
    },
    crearProducto() {
      const token = localStorage.getItem('token')

      axios
        .post('http://127.0.0.1:8000/api/v1/productos/store', this.nuevoProducto, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.$swal({
            title: 'Éxito!',
            text: response.data.message,
            icon: 'success'
          })
          this.getProductos()
          this.cerrarModal()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al crear el producto'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al crear el producto:', error)
        })
    },
    eliminarProducto(id) {
      const token = localStorage.getItem('token')

      axios
        .delete(`http://127.0.0.1:8000/api/v1/productos/destroy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.$swal({
            title: 'Éxito!',
            text: response.data.message,
            icon: 'success'
          })
          this.getProductos()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al eliminar el producto'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al eliminar el producto:', error)
        })
    },
    abrirModalEdicionConProducto(producto) {
      this.productoSeleccionado = { ...producto }
      this.mostrarModalEdicion = true
    },
    cancelarEdicion() {
      this.mostrarModalEdicion = false
      this.resetForm()
    },
    editarProducto() {
      const token = localStorage.getItem('token')
      const url = `http://127.0.0.1:8000/api/v1/productos/update/${this.productoSeleccionado.id}`

      axios
        .put(url, this.productoSeleccionado, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.$swal({
            title: 'Éxito!',
            text: response.data.message,
            icon: 'success'
          })
          this.getProductos()
          this.mostrarModalEdicion = false
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al editar el producto'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al editar el producto:', error)
        })
    },
    formatNumber(number) {
      return new Intl.NumberFormat().format(number)
    }
  }
}
</script>

<style scoped>
.container-fluid {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('https://img.freepik.com/fotos-premium/patron-marmol-natural-fondo_1258-22162.jpg');
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
  text-align: center;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  background-color: #343a40;
  color: white;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody td table {
  width: 100%;
}

.table tbody td table td {
  border: none;
}

.btn:hover {
  background-color: #0056b3;
}
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.modal.is-active {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.modal-content:hover {
  transform: scale(1.02);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
}
.title {
  font-size: 3em;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Arial', sans-serif;
  padding-bottom: 10px;
  margin-bottom: 30px;
  text-align: center;
  color: #537895;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.title::before,
.title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  height: 4px;
  background: linear-gradient(to right, #ffd700, #537895);
  animation: lineAnimation 2s linear infinite;
}

.title::before {
  left: 0;
  width: 30%;
}

.title::after {
  right: 0;
  width: 40%;
}

@keyframes lineAnimation {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>

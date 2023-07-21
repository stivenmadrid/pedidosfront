<template>
  <div class="container-fluid vh-100" style="overflow-y: auto; max-height: 100vh">
    <h2 class="title">LISTADO DE MESAS</h2>

    <br />
    <div class="centered">
      <button @click="abrirModal" class="btn btn-success">Agregar Mesa</button>
    </div>

    <div class="table-responsive">
      <table class="table" ref="dataTable">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre de la mesa</th>
            <th scope="col">Capacidad</th>
            <th scope="col">Estado</th>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody id="contenidomesas">
          <!-- <tr v-for="mesa in mesas" :key="mesa.id">
              <td>{{ mesa.id }}</td>
              <td>{{ mesa.nombre }}</td>
              <td>{{ mesa.capacidad }}</td>
              <td>{{ mesa.Estado }}</td>
              <td>{{ mesa.Descripcion }}</td>
              <td>
                <button class="btn btn-primary" @click="abrirModalEdicion(mesa.id)">Editar</button>
                <button class="btn btn-danger" @click="eliminarMesa(mesa.id)">Eliminar</button>
              </td>
            </tr> -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal para agregar mesa -->
  <div class="modal" :class="{ 'is-active': mostrarModal }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="">Agregar Mesa</h3>
        <form @submit.prevent="crearMesa">
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input v-model="nuevaMesa.nombre" class="form-control" type="text" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Capacidad</label>
            <div class="control">
              <input v-model="nuevaMesa.capacidad" class="form-control" type="number" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Estado</label>
            <div class="control">
              <select v-model="nuevaMesa.Estado" class="form-control" required>
                <option value="Libre">Libre</option>
                <option value="Ocupada">Ocupada</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">Descripción</label>
            <div class="control">
              <textarea v-model="nuevaMesa.Descripcion" class="form-control" required></textarea>
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

  <!-- Modal para editar mesa -->
  <div class="modal" :class="{ 'is-active': mostrarModalEdicion }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="">Editar Mesa</h3>
        <form @submit.prevent="editarMesa">
          <div class="field">
            <label class="label">Nombre</label>
            <div class="control">
              <input v-model="mesaSeleccionada.nombre" class="form-control" type="text" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Capacidad</label>
            <div class="control">
              <input
                v-model="mesaSeleccionada.capacidad"
                class="form-control"
                type="number"
                required
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Estado</label>
            <div class="control">
              <select v-model="mesaSeleccionada.Estado" class="form-control" required>
                <option value="Libre">Libre</option>
                <option value="Ocupada">Ocupada</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">Descripción</label>
            <div class="control">
              <textarea
                v-model="mesaSeleccionada.Descripcion"
                class="form-control"
                required
              ></textarea>
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

export default {
  data() {
    return {
      mesas: [],
      mostrarModal: false,
      mostrarModalEdicion: false,
      nuevaMesa: {
        nombre: '',
        capacidad: '',
        Estado: '',
        Descripcion: ''
      },
      mesaSeleccionada: {
        id: '',
        nombre: '',
        capacidad: '',
        Estado: '',
        Descripcion: ''
      },
      dataTable: null
    }
  },
  mounted() {
    this.getMesas()
  },
  methods: {
    getMesas() {
      const token = localStorage.getItem('token')

      axios
        .get('http://127.0.0.1:8000/api/v1/Mesas', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.mesas = response.data
          this.initializeDataTable()
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
      this.nuevaMesa = {
        nombre: '',
        capacidad: '',
        Estado: '',
        Descripcion: ''
      }
    },
    crearMesa() {
      const token = localStorage.getItem('token')

      axios
        .post('http://127.0.0.1:8000/api/v1/Mesas', this.nuevaMesa, {
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
          this.getMesas()
          this.cerrarModal()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al crear la mesa'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al crear la mesa:', error)
        })
    },
    eliminarMesa(id) {
      const token = localStorage.getItem('token')

      axios
        .delete(`http://127.0.0.1:8000/api/v1/Mesas/destroy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          const message = response.data.message
          this.$swal({
            title: 'Éxito!',
            text: message,
            icon: 'success'
          })
          console.log('Respuesta del backend:', response.data)
          this.getMesas()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al eliminar la mesa'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al eliminar la mesa:', error)
        })
    },
    abrirModalEdicion(id) {
      const mesa = this.mesas.find((m) => m.id === id)

      if (mesa) {
        this.mesaSeleccionada = { ...mesa }
        this.mostrarModalEdicion = true
      }
    },
    cancelarEdicion() {
      this.mostrarModalEdicion = false
      this.resetForm()
    },
    editarMesa() {
      const token = localStorage.getItem('token')

      axios
        .put(
          `http://127.0.0.1:8000/api/v1/Mesas/update/${this.mesaSeleccionada.id}`,
          this.mesaSeleccionada,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          const message = response.data.message
          this.$swal({
            title: 'Éxito!',
            text: message,
            icon: 'success'
          })
          console.log('Respuesta del backend:', response.data)
          this.getMesas()
          this.mostrarModalEdicion = false
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al editar la mesa'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al editar la mesa:', error)
        })
    },
    initializeDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy()
      }

      this.dataTable = $(this.$refs.dataTable).DataTable({
        data: this.mesas,
        columns: [
          { data: 'id' },
          { data: 'nombre' },
          { data: 'capacidad' },
          { data: 'Estado' },
          { data: 'Descripcion' },
          { data: null, orderable: false, searchable: false }
        ],
        columnDefs: [
          {
            targets: 5,
            createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
              const editarButton = $('<button class="btn btn-primary">Editar</button>')
              editarButton.on('click', () => {
                this.abrirModalEdicion(rowData.id)
              })
              $(cell).empty().append(editarButton)

              const eliminarButton = $('<button class="btn btn-danger">Eliminar</button>')
              eliminarButton.on('click', () => {
                this.eliminarMesa(rowData.id)
              })
              $(cell).append(eliminarButton)
            }
          }
        ],
        language: {
          search: 'Buscar:',
          lengthMenu: 'Mostrar _MENU_ registros por página',
          zeroRecords: 'No se encontraron registros',
          info: 'Mostrando página _PAGE_ de _PAGES_',
          infoEmpty: 'No hay registros disponibles',
          infoFiltered: '(filtrados de _MAX_ registros totales)',
          paginate: {
            first: 'Primero',
            last: 'Último',
            next: 'Siguiente',
            previous: 'Anterior'
          }
        }
      })
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
  background-image: url('https://img.freepik.com/fotos-premium/patron-marmol-natural-fondo_1258-22162.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-color: rgba(
    0,
    0,
    0,
    0.5
  ); /* Hacer el fondo ligeramente más oscuro para realzar los elementos más claros */
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
  text-align: center;
}

.scrollable-container {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent; /* Hacer la barra de desplazamiento un poco visible */
}

.scrollable-container::-webkit-scrollbar {
  width: 6px;
}

.scrollable-container::-webkit-scrollbar-track {
  background-color: transparent;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: rgba(
    255,
    255,
    255,
    0.1
  ); /* Hacer la barra de desplazamiento un poco visible para navegadores webkit */
}

.title {
  font-size: 56px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
  animation: slideInUp 1s ease;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.6);
}

.table thead th {
  color: #fff;
  background-color: rgba(63, 81, 181, 0.91);
  padding: 15px;
  border-bottom: none;
  text-transform: uppercase;
  font-weight: 600;
}

.centered {
  margin: 0 auto;
}

.table tbody tr {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
</style>
